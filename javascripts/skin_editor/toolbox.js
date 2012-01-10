console.log("toolbox.js");

(function($s){

    /**
     * 툴 박스 클래스
     * @class Toolbox
     * @member special
     */
    $s.Toolbox = function( skinEditor ){
	this.skinEditor = skinEditor;
	this.createToolboxWrapper();
	this.propertiesWrapper = null;
	//this.hide();
    };


    $s.Toolbox.prototype = {
	/**
	 * 툴 박스 래퍼 생성
	 * @function
	 */
	createToolboxWrapper : function(){
	    var self = this;
	    this.skinEditor.loadHtml( "toolbox.html", function( html ){
		var div = document.createElement("DIV");
		div.innerHTML = html;

		self.wrapper = $E(div).getFirstChild();
		document.body.appendChild( self.wrapper );
		
		self.propertiesWrapper = self.wrapper.getElementsByTagName("ul")[0];
		self.init();
	    } );
	},
	init : function(){
	    var self = this;
	    (function onMovable(){
		var movableBar = self.wrapper.getElementsByClassName("movable_bar")[0];
		var mousedown = false;
		var originPos = {};

		daum.Event.addEvent( movableBar, "mousedown", function( e ){
		    mousedown = true;
		    originPos["x"] = e.offsetX;
		    originPos["y"] = e.offsetY;
		} );
		daum.Event.addEvent( movableBar, "mouseup", function(){ mousedown = false; } );
		daum.Event.addEvent( movableBar, "mouseout", function(){ mousedown = false; } );
		daum.Event.addEvent( movableBar, "mousemove", function( e ){
		    var left, top;	   
		    if( mousedown ){
			left = e.offsetX - originPos["x"];
			top = e.offsetY - originPos["y"];
			self.moveTo( left, top );
		    }
		} );
		
	    })();


	    (function closeEvent(){
		var closeBtn = self.wrapper.getElementsByClassName("close")[0];
		daum.Event.addEvent( closeBtn, "click", function(){ self.hide(); } );
	    })();
	},
	turnOn : function( el, left, top ){
	    this.show();
	},
	hide : function(){
	    $E(this.wrapper).hide();
	},
	show : function(){
	    $E(this.wrapper).show();
	},
	moveTo : function( left, top ){
	    var coords = $E(this.wrapper).getCoords();
	    this.wrapper.style.top = (coords["top"] + top) + "px";
	    this.wrapper.style.left = (coords["left"] + left) + "px";
	},
	addHandler : function( li ){
	    this.propertiesWrapper.appendChild( li );
	}
    };
})( special.SkinEditor );