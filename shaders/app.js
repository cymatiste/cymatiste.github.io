// Main application class
class TrailSimulation {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.controls = {
            agentsCount: 10000,
            trailDecayFactor: 0.9,
            nrange: 3,
            thresh: 0.1,
            randomness: 0,
            brushSize: 10,
            rez: 512,
            stepsPerFrame: 1,
            stepMod: 1
        };
        
        this.stepn = 0;
        this.hitXY = [0, 0];
        this.mouseDown = false;
        
        this.init();
    }
    
    async init() {
        // Initialize WebGPU
        if (!navigator.gpu) {
            alert('WebGPU not supported in this browser');
            return;
        }
        
        const adapter = await navigator.gpu.requestAdapter();
        this.device = await adapter.requestDevice();
        
        // Setup canvas
        this.context = this.canvas.getContext('webgpu');
        const format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: format,
            alphaMode: 'opaque'
        });
        
        // Setup controls
        this.setupControls();
        
        // Initialize simulation
        await this.initSimulation();
        
        // Start rendering
        this.lastTime = performance.now();
        requestAnimationFrame(this.render.bind(this));
    }
    
    setupControls() {
        // Connect all control elements to update this.controls
        document.getElementById('agentsCount').addEventListener('input', (e) => {
            this.controls.agentsCount = parseInt(e.target.value);
            document.getElementById('agentsCountValue').textContent = e.target.value;
            this.resetAgents();
        });
        
        // Add similar event listeners for other controls
        
        // Mouse interaction
        this.canvas.addEventListener('mousedown', () => this.mouseDown = true);
        this.canvas.addEventListener('mouseup', () => this.mouseDown = false);
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.mouseDown) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.hitXY = [
                (x / this.canvas.width) * this.controls.rez,
                (y / this.canvas.height) * this.controls.rez
            ];
        });
    }
    
    async initSimulation() {
        // Create textures
        this.rez = this.controls.rez;
        this.textures = {
            readTex: this.createTexture(),
            writeTex: this.createTexture(),
            outTex: this.createTexture(),
            debugTex: this.createTexture()
        };
        
        // Create agent buffer
        this.agentsBuffer = this.device.createBuffer({
            size: this.controls.agentsCount * 4 * 4, // 4 floats per agent (position + direction)
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        
        // Load shaders
        this.shaderModules = {
            reset: await this.loadShaderModule('reset.wgsl'),
            moveAgents: await this.loadShaderModule('moveAgents.wgsl'),
            writeTrails: await this.loadShaderModule('writeTrails.wgsl'),
            diffuse: await this.loadShaderModule('diffuse.wgsl'),
            render: await this.loadShaderModule('render.wgsl')
        };
        
        // Create pipelines
        this.pipelines = {
            reset: this.createResetPipeline(),
            moveAgents: this.createMoveAgentsPipeline(),
            writeTrails: this.createWriteTrailsPipeline(),
            diffuse: this.createDiffusePipeline(),
            render: this.createRenderPipeline()
        };
        
        // Reset simulation
        this.reset();
    }
    
    async loadShaderModule(url) {
        // In a real app, you'd load these from separate files
        // For this example, we'll define them inline
        if (url === 'reset.wgsl') {
            return this.device.createShaderModule({
                code: resetWGSL
            });
        }
        // Similarly for other shaders...
    }
    
    createTexture() {
        return this.device.createTexture({
            size: [this.rez, this.rez],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | 
                   GPUTextureUsage.STORAGE_BINDING | 
                   GPUTextureUsage.RENDER_ATTACHMENT
        });
    }
    
    reset() {
        // Execute reset pipelines
        const commandEncoder = this.device.createCommandEncoder();
        
        // Reset textures
        const resetPass = commandEncoder.beginComputePass();
        resetPass.setPipeline(this.pipelines.reset);
        resetPass.setBindGroup(0, this.createResetBindGroup());
        resetPass.dispatchWorkgroups(Math.ceil(this.rez / 8), Math.ceil(this.rez / 8));
        resetPass.end();
        
        // Reset agents
        const resetAgentsPass = commandEncoder.beginComputePass();
        resetAgentsPass.setPipeline(this.pipelines.resetAgents);
        resetAgentsPass.setBindGroup(0, this.createResetAgentsBindGroup());
        resetAgentsPass.dispatchWorkgroups(Math.ceil(this.controls.agentsCount / 64));
        resetAgentsPass.end();
        
        this.device.queue.submit([commandEncoder.finish()]);
    }
    
    step() {
        this.stepn++;
        
        const commandEncoder = this.device.createCommandEncoder();
        
        // Move agents
        const movePass = commandEncoder.beginComputePass();
        movePass.setPipeline(this.pipelines.moveAgents);
        movePass.setBindGroup(0, this.createMoveAgentsBindGroup());
        movePass.dispatchWorkgroups(Math.ceil(this.controls.agentsCount / 64));
        movePass.end();
        
        if (this.stepn % 2 === 1) {
            // Diffuse texture
            const diffusePass = commandEncoder.beginComputePass();
            diffusePass.setPipeline(this.pipelines.diffuse);
            diffusePass.setBindGroup(0, this.createDiffuseBindGroup());
            diffusePass.dispatchWorkgroups(Math.ceil(this.rez / 8), Math.ceil(this.rez / 8));
            diffusePass.end();
            
            // Write trails
            const trailsPass = commandEncoder.beginComputePass();
            trailsPass.setPipeline(this.pipelines.writeTrails);
            trailsPass.setBindGroup(0, this.createWriteTrailsBindGroup());
            trailsPass.dispatchWorkgroups(Math.ceil(this.controls.agentsCount / 64));
            trailsPass.end();
            
            // Swap textures
            [this.textures.readTex, this.textures.writeTex] = [this.textures.writeTex, this.textures.readTex];
        }
        
        // Render
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                loadOp: 'clear',
                clearValue: [0, 0, 0, 1],
                storeOp: 'store'
            }]
        });
        
        renderPass.setPipeline(this.pipelines.render);
        renderPass.setBindGroup(0, this.createRenderBindGroup());
        renderPass.draw(6); // Fullscreen quad
        renderPass.end();
        
        this.device.queue.submit([commandEncoder.finish()]);
    }
    
    render(time) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        // Handle resizing
        this.handleResize();
        
        // Step simulation
        if (this.frameCount % this.controls.stepMod === 0) {
            for (let i = 0; i < this.controls.stepsPerFrame; i++) {
                this.step();
            }
        }
        
        this.frameCount++;
        requestAnimationFrame(this.render.bind(this));
    }
    
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.context.configure({
                device: this.device,
                format: navigator.gpu.getPreferredCanvasFormat(),
                width: width,
                height: height,
                alphaMode: 'opaque'
            });
        }
    }
}

// WGSL Shaders (similar to your compute shaders but in WGSL syntax)
const resetWGSL = `
@group(0) @binding(0) var<storage, read_write> agentsBuffer: array<vec4f>;

@group(0) @binding(1) var<storage, read_write> writeTex: texture_storage_2d<rgba8unorm, write>;

@group(0) @binding(2) var<uniform> params: Params;

struct Params {
    rez: f32,
    time: u32,
    nrange: u32,
    thresh: f32,
    randomness: f32
};

@compute @workgroup_size(64)
fn resetAgents(@builtin(global_invocation_id) id: vec3u) {
    // Similar logic to your ResetAgentsKernel
    // Initialize agent positions and directions
}

@compute @workgroup_size(8, 8)
fn resetTexture(@builtin(global_invocation_id) id: vec3u) {
    textureStore(writeTex, id.xy, vec4f(0));
}
`;

// Similar WGSL shaders for moveAgents, writeTrails, diffuse, and render

// Start the application
window.addEventListener('load', () => {
    new TrailSimulation();
});