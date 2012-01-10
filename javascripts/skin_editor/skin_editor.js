console.log("스킨 편집기 - Ver.2");

/**
 * @namespace
 */
var special = special || {};

/**
 * 스페셜 스킨 에디터 메인 클래스
 * @class SkinEditor
 * @member special
 */
special.SkinEditor = function( options ){
    this.options = daum.extend( special.SkinEditor.__options, options );
    this.viewElement = $( this.options["view_id"] );
    this.toolbox = new special.SkinEditor.Toolbox( this );
    this.propertyController = new special.SkinEditor.PropertyController( this );
    this.init();
};


/**
 * @description 스킨 에디터 기본 옵션
 */
special.SkinEditor.__options = {
    view_id : "skin_editor_view",
    javascript_path : "./javascripts",
    project_path : "/skin_editor"
};

special.SkinEditor.prototype = {
    /**
     * 스킨 에디터 초기화
     * view 클릭 이벤트 preventDefault
     * @function
     */
    init : function(){
	var view = this.viewElement;
	var self = this;
	(function clickEventView(){
	    daum.Event.addEvent( view, "click", function(e){
		var srcElement = daum.Event.getElement(e);
		daum.Event.preventDefault(e);
		self.setupProperty( srcElement );
	    } );
	})();
    },
    baseUrl : function(){
	return this.options["javascript_path"] + this.options["project_path"];
    },
    /**
     * 엘리먼트를 toolbox에 보냄
     * @function
     * @param HTML_ELEMENT
     */
    setupProperty : function( el ){
	var targetElement = el;
	for( ;; ){
	    if( targetElement === this.viewElement ){
		break;
	    }
	    
	    this.propertyController.exec( targetElement );
	    targetElement = targetElement.parentElement;
	    
	}
    },
    /**
     * return a toolbox
     * @function
     */
    getToolbox : function(){
	return this.toolbox;
    },
    loadHtml : function( url, callback ){
	new daum.Ajax({
	    url : this.baseUrl() + "/" + url,
	    method : "GET",
	    onsuccess : function( res ){
		callback( res.responseText );
	    }
	}).request();
    }
};

(function(){
    var libs = [
	"toolbox",
	"property",
	"property_controller"
    ];

    var importScript = function( filename ){
	if( filename ){
	    document.write("<script type=\"text/javascript\" src=\"" + special.SkinEditor.__options["javascript_path"] + special.SkinEditor.__options["project_path"]  + "/" + filename + ".js\"></scr" + "ipt>");
	}
    };

    for( var i = 0, libs_length = libs.length; i < libs_length; i++ ){
	importScript( libs[i] );
    }
})();