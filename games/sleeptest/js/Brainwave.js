/* global require, createjs, ss, st */
(function () {
    "use strict";

    Brainwave.prototype = new createjs.Container();
    Brainwave.prototype.constructor = Brainwave;

    /**
     * Displays a noisy sine wave oscillating at the given frequency
     * @param {Object} waveData
     *        frequency: Number
     *        centerY: createjs.Stage,  
     */
    function Brainwave(waveData,stage){
        "use strict";

        var _this = this;

        // put this in a separate config
        var _canvasWidth = 1920;
        var _canvasHeight = 1080;

        var _shape, _testshape;
              //
        var startAngle = 0;
        var angleY = startAngle;
        var centerY = waveData.centerY;
        var range = 250;
        var DREAMER_X = 300;
        var STARTING_SPEED = 3;
        var _speed = {x:STARTING_SPEED,y:1.8};
        var px = 0;
        var py = 0;
        var m = 0;
        var lastPx = 0, lastPy = 0, lastM = 0;
        var topY;
        var freq; 
        var width;
        var jumpSize = 0.1;
        var _waveData;
        var _drawColor = "#44aaff";
        var _gliding = false;
        var NUM_THOUGHTS = 15;

        var _interlude = 1;
        var _volume = 1;
        var _updateIndex = 0;
        var _bells = [];

        var _stage;
        //var _speedSteps = [1.9,1.85,1.8,1.7,1.6,1.5,1.4,1.3,1.2,1.1,1,0.95,0.9,0.85,0.8,0.75,0.7,0.65,0.6,0.55,0.5,0.45,0.4,0.35,0.3,0.25,0.2,0.15,0.12,0.1];
        var _speedSteps = [1.6,1.5,1.4,1.3,1.2,
                            1.1,1.0,0.9,0.8,
                            0.7,0.55,0.4,
                            0.3,0.2,
                            0.11];
        var _thoughts = [];
        var _thoughtIndex = 1;
        var _thoughtWaves = [5,4,3,2,1];
        var _dreamer;

        var _r, _c;

        function _construct (waveData, stage){

            _stage = stage;
            _waveData = waveData;

            freq = waveData.frequency;
            width = waveData.width;
            
            _shape = new createjs.Shape();
            _this.addChild(_shape);


            _r = new Randoms();
            _c = new Colors();

            _dreamer = new st.Dreamer();
            //_dreamer = new createjs.Shape();
            //_dreamer.graphics.beginFill("#FFFFFF").drawCircle(0,0,10);
            _dreamer.scaleX = _dreamer.scaleY = 1.5;
            _this.addChild(_dreamer);

            _createSounds();

            _createBrainwave(_waveData);

            _createThoughts();

            

            //console.log(_drawColor);
            _drawColor = _c.variationsOn(_drawColor,5);

            return _this;
        }

        function _createSounds(){
            for(var j=0; j<3; j++){
               for(var i=1; i<=24; i++){
                    var bellAudio = new Audio('audio/bell'+i+'.mp3');
                    _bells.push(bellAudio);
                } 
            }
            
        }
        

        function _createBrainwave(waveData){  

            //console.log(waveData);

            _drawWave();

            _this.addChild(_shape);
        }

        function _drawWave(){
            angleY = startAngle;
            
            var centerY = _canvasHeight/2;
            var waveHeight = centerY-topY;

            _shape.graphics.setStrokeStyle(2,1).beginStroke(_drawColor).moveTo(0, waveData.centerY);
            //console.log(waveData.centerY+", "+range);
            for(px=0; px < waveData.width; px++){
                _drawWaveStep();
            }
        }

        function _playChime(){
            var numNotes = Math.round(3/_speed.y);
            var octaveStart = _r.randomInt(0,3)*24;
            var startHere = _speed.y < 0.2 ? 24-numNotes: _r.randomInt(_bells.length-numNotes);

            for(var i=0; i<numNotes; i++){
                var bell = (_bells[startHere+i]);
                bell.volume = _volume;//Math.min(1,_speed.y);
                setTimeout(_playSound.bind(null, bell), (80*i)/_speed.y);
            }
        }

        function _playSound(s){
            var playPromise = s.play();

            if (playPromise !== undefined) {
              playPromise.then(function() {
              }).catch(function(error) {
              });
            }
        }

        function _playBell(){
            if(_gliding){
                return;
            }
            var bellSound = _r.randomFrom(_bells);
            bellSound.volume = _volume;
            _playSound(bellSound);
        }

        function _drawWaveStep(){
            var STEP_SPEED = 0.1;
            var FOOT_HEIGHT = 24;
            lastPx = px;
            lastPy = py;
            lastM = m;

            px += _speed.x;
            py = centerY + _speed.y*(Math.sin(angleY) * range);
            angleY -= _speed.y;

            m = (py - lastPy)/(px - lastPx);
            if(m>0 && lastM<0){
                topY = lastPy;
                if(!_gliding && _drawingNearDreamer() && (_speed.y < 0.15)){
                    _gliding = true;
                    _dreamer.play("beginSlide");
                    _endGame();
                }
            }

            // Move the dreamer
            _dreamer.x = DREAMER_X;


            if(_drawingNearDreamer()){
                if(_gliding){
                    _dreamer.y = py - FOOT_HEIGHT/2;
                    _dreamer.rotation = _radToDeg(Math.atan(m));
                    //console.log(_dreamer.rotation);
                    if(py < _canvasHeight/2 - topY*0.9){
                        _dreamer.play("slideConvex");
                    } else {
                        _dreamer.play("slideConcave");
                    }
                } else {
                    // hopping
                    _dreamer.y = (_speed.y > 0.6 ? topY - FOOT_HEIGHT : topY + (topY-py)*jumpSize - FOOT_HEIGHT);
                    _dreamer.playJumpFrameFor(_canvasHeight/2,topY,py,m);
                    //_dreamer.setSpeed(_speed.y);
                }
                
            }

            _speed.y = _speed.y*0.999999;
            //_speed.y = Math.max(0, (_gliding) ? _speed.y*0.99998 : _speed.y*0.99999);
            range *= (_gliding) ? 1.00005 : 1.00000005;
            _speed.x *= (_gliding) ? 1.00005 : 1;

            _drawColor = _c.variationsOn(_drawColor,_speed.y);
            _shape.graphics.beginStroke(_drawColor).moveTo(lastPx,lastPy).lineTo(px, py);
        }

        function _drawingNearDreamer(){
            return Math.abs(px-DREAMER_X) < _speed.x;           
        }

        function _radToDeg(radians) {
            return radians * 180 / Math.PI;
        }

        function _createThoughts(){
            for(var i=0; i<NUM_THOUGHTS; i++){
                var img = new Image()
                img.onload = _newThought;
                img.src = "img/thought_"+(i<10?"0"+i:i)+".png";
            }
            setInterval(function(){ _thoughtIndex++ }, 2000);
        }

        function _newThought(event){
            var newThought = new createjs.Container();
            var image = event.target;
            var bmp = new createjs.Bitmap(image);
            var s = new createjs.Shape();
            s.graphics.beginFill("#FF0000").rect(0,0,image.width,image.height).endFill();
            bmp.hitArea = s;
            bmp.regX = image.width/2;
            bmp.regY = image.height/2;
            //bmp.alpha = 0.5;
            newThought.addChild(bmp);

            newThought.scaleX = newThought.scaleY = 0.7;

            _resetThought(newThought,_thoughts.length,true);
            
            _thoughts.push({img:newThought, toRemove:false, i:_thoughts.length});

            _this.addChild(newThought);
            newThought.addEventListener("click",_expandThought);

            _thoughts = _r.shuffle(_thoughts);
        }

        function _removeThought(evt){
            for(var i=0; i<_thoughts.length; i++){
                if(_thoughts[i].img == evt.currentTarget){
                    _thoughts[i].toRemove = true;
                }
            }
            
            createjs.Tween.removeTweens(_speed);
            createjs.Tween.get(_speed).to({y:_speedSteps[0]}, 3000);
            _speedSteps.shift();
            //_thoughtIndex++
            _interlude+=2;
            _volume*=0.9;
            
        }

        function _resetThought(newThought,i,withDelay){
            newThought.x = _canvasWidth + 256;
            var waveHeight = (_canvasHeight/2 - topY);
            newThought.y = _canvasHeight/2 + _r.random(-waveHeight/2,waveHeight/2);
            createjs.Tween.get(newThought).wait(_waveDelay(i,withDelay)).to({x:-512}, 8000*_r.random(1,3)).call(function(){_resetThought(newThought,i,false)});
        }

        function _waveDelay(thoughtIndex,withDelay){
            //_thoughtWaves = [5,4,3,2,1];
            if (thoughtIndex < 5){
                return thoughtIndex*2800;
            } else if (thoughtIndex < 9){
                return (withDelay ? 10000 : 0) + (thoughtIndex-5)*1800;
            } else if (thoughtIndex < 12){
                return (withDelay ? 20000 : 0) + (thoughtIndex-9)*2400;
            } else if (thoughtIndex<14){
                return (withDelay ? 35000 : 0) + (thoughtIndex-12)*3600;
            } else {
                return (withDelay ? 50000 : 0);
            }
        }

        function _expandThought(evt){
            _playChime();
            createjs.Tween.removeTweens(evt.currentTarget);
            createjs.Tween.get(evt.currentTarget).to({alpha:0, scaleX: 2, scaleY: 2}, 500).call(function(){_removeThought(evt)});
        }

        function _moveThoughts(){
            var i;
            var WOBBLE = 15;
            var BOB = 15;
            var THOUGHTSPEED = 25.1111111;
            for(i=0; i<_thoughts.length; i++){
                if(_thoughts[i].toRemove){
                    _this.removeChild(_thoughts[i].img);
                    _thoughts.splice(i, 1);
                    i-=1;
                    _thoughtIndex -= 1;
                }
            }

            for(i=0; i<Math.min(_thoughtIndex,_thoughts.length); i++){
                //_thoughts[i].img.x -= THOUGHTSPEED;
                //_thoughts[i].img.x -= 10;
                var noise1 = PerlinNoise.noise(_thoughts[i].img.x,_thoughts[i].img.x,0);
                var noise2 = PerlinNoise.noise(_thoughts[i].img.x*0.0005,_thoughts[i].img.x+105.97,0);
                _thoughts[i].img.rotation -= (WOBBLE*noise1 - WOBBLE/2);
                _thoughts[i].img.y += BOB*noise2 - BOB/2;

            }
        }

        function _endGame() {
            createjs.Tween.get(_this).wait(15000).to({alpha:0},5000).call(_stopGame).call(function(){console.log("that's all folks"); window.close();});
        }

        function _stopGame(){       
            createjs.Ticker.paused = true;
        }

        _this.update = function(){
            _shape.graphics.clear();
            startAngle -= _speed.y*3;

            _drawWave();

            _moveThoughts();

            _updateIndex++;
            if(_updateIndex%_interlude == 0){
                _playBell();
            }

        };
        /* pretty update accidents:

            with var _speed.y = 0.05:

            _shape.graphics.clear();
            startAngle += _speed.x/10;
            var noise = PerlinNoise.noise(px,py,0);
            range += 3*(noise - 0.5);
            _speed.y += 0.01;
            _drawWave();


            with var _speed.y = 0.5:

            _shape.graphics.clear();
            startAngle += _speed.x/10;
            var noise1 = PerlinNoise.noise(px,py,0);
            var noise2 = PerlinNoise.noise(px+900,py-900,0);
            range += 0.1 + 3*(noise1 - 0.5);
            //_speed.x += 0.1*(noise2 - 0.5);
            _speed.y = Math.max(0.01,_speed.y - 0.0001);
            _drawWave();



        */



        return _construct(waveData, stage);

    }


    st.Brainwave = Brainwave;

}());
