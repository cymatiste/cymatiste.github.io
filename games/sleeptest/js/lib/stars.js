// Display feedback on the level with 10 coloured stars
(function (lib, img, cjs) {

	// stage content, positioned with its upper left corner at _x, _y:
	(lib.star_system = function(_x,_y) {
	
		require.include("js/games/buttons.js");
	
		//console.log("building STARS");
		var _this = this;
		var STAR_DISTANCE = 45;
		var ADJ = 15;
		this.initialize();

		this._x = _x;
		this._y = _y;
		
		this.stars = [];
		this.starScale = 0.8;
		this.flashingStar = -1;
		this.starFlashInterval = -1;
		
		this.bgTray = new createjs.Shape();
		this.bgTray.graphics.beginFill("rgba(255,255,255,0.9)").setStrokeStyle(3).beginStroke("#004496").drawRoundRect(_x-15,_y-8,330,50,20);
		
		// stars
		this.star1 = new lib.reward_star();
		this.star1.setTransform(_x+ADJ,_y+ADJ,0.385,0.385,0,0,0,33.4,31.7);

		this.star2 = new lib.reward_star();
		this.star2.setTransform(_x+ADJ+STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.4,31.7);

		this.star3 = new lib.reward_star();
		this.star3.setTransform(_x+ADJ+2*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.1,31.7);

		this.star4 = new lib.reward_star();
		this.star4.setTransform(_x+ADJ+3*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.1,31.7);

		this.star5 = new lib.reward_star();
		this.star5.setTransform(_x+ADJ+4*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.3,31.7);

		this.star6 = new lib.reward_star();
		this.star6.setTransform(_x+ADJ+5*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.4,31.7);

		this.star7 = new lib.reward_star();
		this.star7.setTransform(_x+ADJ+6*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.1,31.7);

		this.star8 = new lib.reward_star();
		this.star8.setTransform(_x+ADJ+7*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.3,31.7);

		this.star9 = new lib.reward_star();
		this.star9.setTransform(_x+ADJ+8*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.3,31.7);

		this.star10 = new lib.reward_star();
		this.star10.setTransform(_x+ADJ+9*STAR_DISTANCE,_y+ADJ,0.385,0.385,0,0,0,33.1,31.7);
		
		this.stars.push(this.star1);
		this.stars.push(this.star2);
		this.stars.push(this.star3);
		this.stars.push(this.star4);
		this.stars.push(this.star5);
		this.stars.push(this.star6);
		this.stars.push(this.star7);
		this.stars.push(this.star8);
		this.stars.push(this.star9);
		this.stars.push(this.star10);
	
		//this.starScale = this.star1.scaleX;
		
		this.addChild(this.star10,this.star9,this.star8,this.star7,this.star6,this.star5,this.star4,this.star3,this.star2,this.star1);
		
		this.updateStars = (function(acc){
			var targetFrame = "yellow";
			//var targetFrame = acc*this.stars.length > 7 ? "green" : acc*this.stars.length > 4 ? "yellow" : acc*this.stars.length > 2 ? "orange" : "red";
			//console.log("updating stars with "+acc+" accuracy, i.e."+targetFrame);
			for(var i=0; i<this.stars.length;  i++){
				if(acc*this.stars.length > i){
					this.stars[i].star.gotoAndStop(targetFrame);
				} else {
					this.stars[i].star.gotoAndStop("gray");
				}
			}
		});
		
		
		this.resetStars = (function(){
			if(this.starFlashInterval != null){
				clearInterval(this.starFlashInterval);
			}
			for(var i=0; i<this.stars.length;  i++){
				this.stars[i].gotoAndStop(0);
				this.stars[i].scaleX = this.stars[i].scaleY = this.starScale;
			}
			createjs.Tween.get(this).to({x:0,y:100},500);
		});

		this.flashStars = (function(){
			//console.log("flashing over "+_this.stars.length+" stars.");
			_this.flashingStar++;
			if(_this.flashingStar > _this.stars.length){
				_this.flashingStar = 0;
				clearInterval(_this.starFlashInterval);
				return;
			}
			for(var i=0; i< _this.stars.length; i++){
				if(i==_this.flashingStar){
					_this.stars[i].play();
				}
				//_this.stars[i].scaleX = _this.stars[i].scaleY = (i==_this.flashingStar) ? _this.starScale*1.5 : _this.starScale;
			}
		});
		
		this.animate = (function(){
			createjs.Tween.get(this).to({x:0,y:0},500);
			//console.log("animating stars...");
			this.starFlashInterval = setInterval(this.flashStars,100);
			//console.log("just created interval "+this.starFlashInterval);
		});
		
		
	}).prototype = p = new cjs.Container();

	
	(lib.star = function(mode,startPosition,loop) {
		this.initialize(mode,startPosition,loop,{off:0,red:1,orange:3,yellow:5,green:7});

		// timeline functions:
		this.frame_0 = function() {
			this.name = "star";
			this.stop();
		}
		this.frame_2 = function() {
			this.stop();
		}
		this.frame_4 = function() {
			this.stop();
		}
		this.frame_6 = function() {
			this.stop();
		}
		this.frame_8 = function() {
			this.stop();
		}

		// actions tween:
		this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2).call(this.frame_2).wait(2).call(this.frame_4).wait(2).call(this.frame_6).wait(2).call(this.frame_8).wait(1));

		// Layer 1
		this.shape = new cjs.Shape();
		this.shape.graphics.f().s("#000000").ss(1,1,1).p("AAAk7IB0C9IDYA1IiQCnIARDeIjNhVIjMBVIARjeIiQinIDYg1g");
		this.shape.setTransform(33.2,31.6);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f("#454545").s().p("AAADnIjMBUIARjdIiQinIDYg1IBzi9IB0C9IDYA1IiQCnIARDdg");
		this.shape_1.setTransform(33.2,31.6);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.f("#FF0000").s().p("AAADnIjMBUIARjdIiQinIDYg1IBzi9IB0C9IDYA1IiQCnIARDdg");
		this.shape_2.setTransform(33.2,31.6);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.f("#FF6600").s().p("AAADnIjMBUIARjdIiQinIDYg1IBzi9IB0C9IDYA1IiQCnIARDdg");
		this.shape_3.setTransform(33.2,31.6);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.f("#FFFF00").s().p("AAADnIjMBUIARjdIiQinIDYg1IBzi9IB0C9IDYA1IiQCnIARDdg");
		this.shape_4.setTransform(33.2,31.6);

		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.f("#33FF00").s().p("AAADnIjMBUIARjdIiQinIDYg1IBzi9IB0C9IDYA1IiQCnIARDdg");
		this.shape_5.setTransform(33.2,31.6);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape}]},2).to({state:[{t:this.shape_4},{t:this.shape}]},2).to({state:[{t:this.shape_5},{t:this.shape}]},2).wait(2));

	}).prototype = p = new cjs.MovieClip();
	p.nominalBounds = rect = new cjs.Rectangle(-1,-1,68.5,65.2);
	p.frameBounds = [rect, rect, rect, rect, rect, rect, rect, rect, rect];

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
