/* global require, createjs, ss, st */
(function () {
    "use strict";

    Dreamer.prototype = new createjs.Container();
    Dreamer.prototype.constructor = Dreamer;

    /**
     * Displays a noisy sine wave oscillating at the given frequency
     * @param {Object} waveData
     *        frequency: Number
     *        centerY: createjs.Stage,  
     */
    function Dreamer(){
        "use strict";

        var _this = this;
        var _spriteSheet;
        var _currentSprite;
        var _jump, _jumpleap, _jumpland, _jump1, _jump2, _jump3, _jump4, _beginSlide, _slideConcave, _slideConvex;

        function _construct(){
            _buildSpritesheet();
            _this.play("slide_convex");
            return _this;
        }

        function _buildSpritesheet(){
            var data = {
                images: ["img\\dreamer_slide-concave.png","img\\dreamer_slide-convex.png","img\\dreamer_walk1.png","img\\dreamer_walk2.png","img\\dreamer_walk3.png","img\\dreamer_walk4.png","img\\dreamer_walk-slide-transition.png"],
                frames: {regX:32, regY:32, width:64, height:64},
                animations: {
                    slide_concave: 0,
                    slide_convex: 1,
                    jump1: 2,
                    jump2: 3,
                    jump3: 4,
                    jump4: 5,
                    jump: {
                        frames: [5,2,3],
                        next: "jump3",
                        speed: 1
                    },
                    beginslide:{
                        frames: [6],
                        next: "slide_concave",
                        speed: 1
                    }
                }
            };
            _spriteSheet = new createjs.SpriteSheet(data);
            _jump = new createjs.Sprite(_spriteSheet, "jump");
            _jump1 = new createjs.Sprite(_spriteSheet, "jump1");
            _jump2 = new createjs.Sprite(_spriteSheet, "jump2");
            _jump3 = new createjs.Sprite(_spriteSheet, "jump3");
            _jump4 = new createjs.Sprite(_spriteSheet, "jump4");
            _slideConcave = new createjs.Sprite(_spriteSheet, "slide_concave");
            _slideConvex = new createjs.Sprite(_spriteSheet, "slide_convex");
            _beginSlide = new createjs.Sprite(_spriteSheet, "beginslide");
        }

        _this.setSpeed = function(speed){
            _currentSprite.spriteSheet.getAnimation(_currentSprite.currentAnimation).speed = speed;
        }

        _this.play = function(animName){
            if(_currentSprite != null){
                _this.removeChild(_currentSprite);
            }
            if (animName=="jump"){
               _currentSprite = _jump;
               _jump.gotoAndPlay("jump");
            } else if (animName=="jump1"){
               _currentSprite = _jump1;
            } else if (animName=="jump2"){
               _currentSprite = _jump2;
            } else if (animName=="jump3"){
               _currentSprite = _jump3;
            } else if (animName=="jump4"){
               _currentSprite = _jump4;
            } else if (animName=="beginSlide"){
                _currentSprite = _beginSlide;
                _beginSlide.gotoAndPlay("beginslide");
            } else if (animName=="slideConcave"){
                _currentSprite = _slideConcave;
            } else if (animName=="slideConvex"){
                _currentSprite = _slideConvex;
            } 

             _this.addChild(_currentSprite);
        }

        _this.playJumpFrameFor = function(centerY,topY,py,slope){
            var waveHeight = centerY-topY;
            if(isNaN(slope)){
                return;
            }
            //console.log(centerY+", "+topY+", "+py+", "+slope);
            if (py < centerY-waveHeight*0.8 && slope<0){
                _this.play("jump");
            }
        };

        return _construct();

    }


    st.Dreamer = Dreamer;

}());
