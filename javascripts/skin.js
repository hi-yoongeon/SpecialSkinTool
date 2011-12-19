/**
 * @namespace
 */

var special = {};

(function($ss){

   /**
    * @description 스페셜 상수
    * @member special
    */
   $ss.CONST = {
     ELEMENT : {
       "TEXT_FIELD" : "INPUT||TEXT",
       "PASSWORD_FIELD" : "INPUT||PASSWORD",
       "TEXTAREA" : "TEXTAREA",
       "BUTTON" : "BUTTON",
       "CHECKBOX" : "INPUT||CHECKBOX"
     }
   };

   /**
    * 스페셜 스킨 메인 클래스
    * @class 메인 클래스
    * @member special
    */
   $ss.Skin = function( options ){
     var src_options = daum.extend({}, $ss.Skin.__options);
     this.__options = daum.extend( src_options, options );
     this.init();
   };

   /**
    * @description 스페셜 기본 옵션
    */
   $ss.Skin.__options = {
     view_id : "view",
     properties_id : "properties",
     on_highlight : true,
     except_tags : []
   };

   $ss.Skin.prototype = {
     /**
      * 스페셜 스킨 초기화 (스페셜 객체 생성시 자동 호출)
      * @function
      * @member speical.Skin
      */
     init : function(){
       this.viewController = special.View.getInstance(this);
       this.propertyController = special.Property.getInstance ( this.__options.properties_id );
     },
     /**
      * getOptions
      * @function
      * @returns {Object} 스페셜 글로벌 옵션
      */
     getOptions : function(){
       return this.__options;
     }
   };
   /**
    * View 컨트롤러 (Singleton)
    * @class controller
    * @param id 뷰 엘리먼트의 ID
    * @param special.Skin SpecialSkin 객체
    * @member special
    */
   $ss.View = function( id, skin ){
     this.__element = $(id);
     this.skin = skin;
   };
   /**
    * View 컨트롤러의 instance
    * @function
    */
   $ss.View.getInstance = function( skin ){
     var sv = $ss.View;
     if( typeof sv.__instance === "undefined" ){
       sv.__instance = new sv( skin.getOptions().view_id, skin );
     }
     return sv.__instance;
   };


   $ss.View.prototype = {
     /**
      * View 에 이벤트 bind
      * @function
      */
     bindEvent : function(){
       var self = this;
       var highlighter = special.View.highlighter;

       daum.Event.addEvent( this.__element, "click", function(e){
			      var srcElement = daum.Event.getElement(e);
			      daum.Event.preventDefault(e);
			      self.extractParent( srcElement );
			      highlighter.overwrap( srcElement );
			      self.skin.propertyController.drawToPanel();
			    });

     },
     /**
      * element의 부모 추출
      * @function
      */
     extractParent : function( element ){
       this.skin.propertyController.items = [];
       while( element != this.__element ){
	 this.skin.propertyController.addItemByElement( element );
	 element = daum.Element.getParent( element );
       }
     }
   };


   /**
    * 선택된 View에 하이라이팅 해주는 객체
    * @class
    */
   $ss.View.highlighter = function(){
     var highlighter = $ss.View.highlighter;
     var element = highlighter.__element;
     if( typeof element === "undefined" ){
       element = highlighter.__element = document.createElement("div");
       highlighter.__elementInitStyle( element );
       document.body.appendChild( element );
       daum.Event.addEvent( element, "click", function(){ $E(element).hide(); special.Property.getInstance().offAllFieldsetHighlighting();  } );
     }

     $E(element).show();
     return element;
   };

   /**
    * 하이라이트 엘리먼트의 초기 스타일
    * @function
    */
   $ss.View.highlighter.__elementInitStyle = function( element ){
     element.style.background = "rgba(255,0,0,0.3)";
     element.style.border = "1px solid #ff0000";
     element.style.zIndex = "99999";
     element.style.position = "absolute";
     element.style.left = "0px";
     element.style.top = "0px";
     element.style.width = "150px";
     element.style.height = "150px";

     return element;
   };

   /**
    * @function
    */
   $ss.View.highlighter.overwrap = function( element ){
     var highlighter = special.View.highlighter();
     var nodeName = element.nodeName.toUpperCase();
     var coords = daum.Element.getCoords( element );

     highlighter.style.height = ( element.offsetHeight - 2 ) + "px";
     highlighter.style.width = ( element.offsetWidth - 2 ) + "px";
     highlighter.style.left = coords.left + "px";
     highlighter.style.top = coords.top + "px";
   };



   /**
    * @class
    */
   $ss.Property = function( id ){
     this.panel = $(id);
     this.items = [];
   };

   /**
    * @function
    */
   $ss.Property.getInstance = function( id ){
     var $ssp = $ss.Property;
     if( typeof $ssp.__instance === "undefined" ){
       $ssp.__instance = new $ssp( id );
     }
     return $ssp.__instance;
   };


   $ss.Property.prototype = {
     /**
      * target Element로 Item 을 추가
      * @function
      */
     addItemByElement : function( target_element ){
       var item = $ss.Property.Item.factory( target_element );

       if( typeof item !== "undefined" ){
	 this.items.push( item );
       }
     },
     /**
      * Panel에 HTML 을 그린다.
      * @function
      */
     drawToPanel : function(){
       var item;
       this.clearPanel();
       for( var i = 0, length = this.items.length; i < length; i++ ){
	 item = this.items[i];
	 this.panel.appendChild( item.draw() );
       }

       if( this.items.length > 0 ){
	 this.items[0].highlightingMyFieldset();
       }
     },
     /**
      * Panel 을 청소한다.
      */
     clearPanel : function(){
       this.panel.innerHTML = "";
     },
     /*
     removeAllEvent : function(){
       var event;
       for( var i = 0, length = this.events.length; i<length; i++ ){
	 event = this.events[i];
	 daum.Event.stopObserving( event );
       }
     },*/
     /**
      * 모든 필드셋의 highlighing 을 off 한다.
      * @function
      */
     offAllFieldsetHighlighting : function(){
       for( var i = 0, length = this.items.length; i < length; i++ ){
	 this.items[i].offHighlightingMyFieldset();
       }
     }
   };

   /**
    * @class
    */
   $ss.Property.Item = function( target_element ){
     this.target_element = target_element;
     this.tagName = target_element.nodeName;
     this.attributes = [];
     this.fieldset = null;
   };

   /**
    * @function
    */
   $ss.Property.Item.factory = function( target_element ){
     var propertyList, item, propertyType, property;
     var Item = $ss.Property.Item;
     var type = $ss.Property.type;
     var nodeName = target_element.nodeName.toUpperCase();
     var availableTags = {
       "P" : [ type.boxProperty, type.textProperty ],
       "IMG" : [ type.imageProperty ],
       "A" : [ type.linkProperty, type.textProperty ],
       "STRONG" : [ type.textProperty ],
       "LI" : [ type.listProperty ],
       "H1" : [ type.textProperty ],
       "H2" : [ type.textProperty ],
       "H3" : [ type.textProperty ],
       "H4" : [ type.textProperty ],
       "H5" : [ type.textProperty ],
       "H6" : [ type.textProperty ],
       "DT" : [ type.textProperty ],
       "DD" : [ type.textProperty ],
       "SPAN" : [ type.textProperty ]
     };

     if( availableTags.hasOwnProperty( nodeName ) ){
       propertyList = availableTags[nodeName];
       item = new Item( target_element );

       for( var i = 0, length = propertyList.length; i < length; i++ ){
	 propertyType =  propertyList[i];
	 for( var j = 0, j_length = propertyType.length; j < j_length; j++ ){
	   property = propertyType[j];
	   item.addAttribute( Item.Attribute.factory( property, item ) );
	 }
       }
     }

     return item;
   };


   $ss.Property.Item.prototype = {
     /**
      * Item에 attribute를 추가
      * @function
      */
     addAttribute : function( attribute ){
       this.attributes.push( attribute );
     },
     /**
      * Item 을 html (fieldset) 으로 return
      */
     draw : function(){
       var attribute;
       var fieldset = this.fieldset = document.createElement("fieldset");
       var legend = document.createElement("legend");
       var _this = this;

       legend.innerHTML = this.tagName + " Property";
       fieldset.appendChild( legend );
       for(var i=0, length = this.attributes.length; i<length; i++){
	 attribute = this.attributes[i];
	 fieldset.appendChild( attribute.getDom() );
       }

       daum.Event.addEvent( fieldset, "mouseover", function(){
			      $ss.View.highlighter.overwrap( _this.target_element );
			      _this.highlightingMyFieldset();
			    } );

       return fieldset;
     },
     /**
      * 선택된 fieldset에 highlighting을 한다.
      * @function
      */
     highlightingMyFieldset : function(){
       $ss.Property.getInstance().offAllFieldsetHighlighting();
       this.fieldset.style.backgroundColor = "#ccc";
     },
     /**
      * 선택된 fieldset의 highlighting 을 off 한다.
      * @function
      */
     offHighlightingMyFieldset : function(){
       this.fieldset.style.backgroundColor = "";
     }
   };

   /**
    * @class
    */
   $ss.Property.Item.Attribute = function(element, text, item){
     this.text = text;
     this.element = element;
     this.item = item;
   };

   /**
    * @function
    */
   $ss.Property.Item.Attribute.factory = function( property_type, item ){
     var Attribute = $ss.Property.Item.Attribute;
     var element = $ss.Property.Item.Attribute.createPropertyElement( property_type, item.target_element );
     var text = property_type.text;
     return new Attribute( element, text, item );
   };


   /**
    * @function
    */
   $ss.Property.Item.Attribute.createPropertyElement = function( property, target_element ){
     var element_value;
     var element_type = property.element.split("||");
     var element = document.createElement( element_type[0] );
     var nodeName = element.nodeName.toUpperCase();
     var defaultEvent = "click";
     if( nodeName === "BUTTON" ){
       element.innerHTML = property.text;
     }else if( nodeName === "INPUT"){
       element.setAttribute("type", element_type[1]);
       element_value = ( property.text === "text" ) ? target_element.innerHTML : target_element.getAttribute( property.text );
       element.value = ( element_value === null ) ? "" : element_value.trim();
       defaultEvent = "blur";
     }

     daum.Event.addEvent( element, defaultEvent, function(){
			    property.event.call( element, target_element );
			  } );

     return element;
   };


   $ss.Property.Item.Attribute.prototype = {
     /**
      * @function
      */
     getDom : function(){
       var p = document.createElement("p");
       if( this.element.nodeName === "INPUT" ){
	 p.appendChild( document.createTextNode( this.text + " : " ) );
       }
       p.appendChild( this.element );
       return p;
     }
   };

 })( special );



/**
 * @namespace
 */
special.Property.type = {};
(function( $spt ){

   $spt.linkProperty = [
     {
       text : "href",
       element : special.CONST.ELEMENT.TEXT_FIELD
     },
     {
       text : "alt",
       element : special.CONST.ELEMENT.TEXT_FIELD
     }
   ];

   $spt.imageProperty = [
     {
       text : "src",
       element : special.CONST.ELEMENT.TEXT_FIELD,
       event : function( target_element ){
	 var value = this.value;
	 target_element.setAttribute("src", value);
       }
     },
     {
       text : "alt",
       element : special.CONST.ELEMENT.TEXT_FIELD
     }
   ];

   $spt.textProperty = [
     {
       text : "text",
       element : special.CONST.ELEMENT.TEXT_FIELD,
       event : function( target_element ){
	 var value = this.value;
	 target_element.innerHTML = value;
       }
     }
   ];

   $spt.listProperty = [
     {
       text : "Node 추가",
       element : special.CONST.ELEMENT.BUTTON,
       event : function( target_element ){
	 var parent_element = target_element.parentNode;
	 var new_element = target_element.cloneNode(true);
	 parent_element.appendChild( new_element );
       }
     },
     {
       text : "Node 삭제",
       element : special.CONST.ELEMENT.BUTTON,
       event : function( target_element ){
	 var parent_element = target_element.parentNode;
	 parent_element.removeChild( target_element );
	 delete target_element;
       }
     }
   ];

   $spt.boxProperty = [];

 })( special.Property.type );