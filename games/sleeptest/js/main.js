(function () {

    var _canvas = document.getElementById("kalCanvas");
    var _canvasWidth = 1920;
    var _canvasHeight = 1080;
    var _stage;

    var _waves = [];
        
    function init (){
        
        // Get the canvas to draw the game to
            
        _canvas = document.getElementById("kalCanvas");
        _stage = new createjs.Stage(_canvas);
        createjs.Touch.enable(_stage);
        _stage.mouseChildren = true;
        _stage.enableMouseOver(10);

        //_stage.on("stagemousedown", _pauseOnClick);
     
        $ ( window ).resize();
        
        _startLoop();       

        var wave = new st.Brainwave({frequency:1, centerY:_canvasHeight/2, width:_canvasWidth},_stage);
        _waves.push(wave);
        _stage.addChild(wave);
        wave.x = -20;
        wave.scaleX = 1.1;
        wave.scaleY = 1.03;
        
        //setTimeout(function(){window.close();},2000);

        console.log("added "+wave+" to "+_stage+" on "+_stage.canvas);
    }


    $ ( window ).resize ( function () {
        //Calculate ratio of window width and height to game width and height
        var widthRatio = window.innerWidth / _canvasWidth;
        var heightRatio = window.innerHeight / _canvasHeight;

        var $canvas = $("canvas#kalCanvas");

        //Fit the canvas to whatever dimension has the smallest ratio compared to the game size
        if(heightRatio < widthRatio){
            $canvas.css("height", window.innerHeight);
            $canvas.css("width", 'auto');
        }else{
            $canvas.css("width", window.innerWidth);
            $canvas.css("height", 'auto');
        }

    });

    function _startLoop() {
        //createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setInterval(120);
        createjs.Ticker.addEventListener("tick", _handleTick);
    }

    function _pauseOnClick(evt, data) {
        createjs.Ticker.paused = !createjs.Ticker.paused;
    }

    function _update(){
        for(var i=0; i<_waves.length; i++){
            _waves[i].update();
        }
    }

    function _handleTick(tickEvent) {
        if(!createjs.Ticker.paused){
            var deltaSeconds = tickEvent.delta / 1000.0;
            _update();
            _stage.update(tickEvent);
        }    
    }

    setTimeout(init, 1000);



}());
