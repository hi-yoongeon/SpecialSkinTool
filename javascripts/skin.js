const CONST = {
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
 */
function SpecialSkin( options ){
  var src_options = daum.extend({}, SpecialSkin.__options);
  this.__options = daum.extend( src_options, options );
  this.init();
}

SpecialSkin.CONST = CONST;

/**
 * @description 스페셜 기본 옵션
 */
SpecialSkin.__options = {
  view_id : "view",
  properties_id : "properties",
  on_highlight : true,
  except_tags : []
};

SpecialSkin.prototype = {
  /**
   * 스페셜 스킨 초기화 (스페셜 객체 생성시 자동 호출)
   * @function
   */
  init : function(){
    this.viewController = SpecialSkin.ViewController.getInstance(this);
    this.propertyController = SpecialSkin.Property.getInstance ( this.__options.properties_id );
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
 * @param specialSkin SpecialSkin 객체
 */
SpecialSkin.ViewController = function( id, specialSkin ){
  this.__element = $(id);
  this.specialSkin = specialSkin;
};

/**
 * View 컨트롤러의 instance
 * @function
 * @member SpecialSkin.ViewController
 */
SpecialSkin.ViewController.getInstance = function(specialSkin){
  var ss_view = SpecialSkin.ViewController;
  if( typeof ss_view.__instance === "undefined" ){
    ss_view.__instance = new ss_view( specialSkin.getOptions().view_id, specialSkin );
  }
  return ss_view.__instance;
};

SpecialSkin.ViewController.prototype = {
  /**
   * View 에 이벤트 bind
   * @function
   */
  bindEvent : function(){
    var self = this;
    var highlighter = SpecialSkin.highlighter;
    daum.Event.addEvent( this.__element, "click", function(e){
			   var srcElement = daum.Event.getElement(e);
			   daum.Event.preventDefault(e);
			   self.extractParent( srcElement );
			   highlighter.overwrap( srcElement );
			   self.specialSkin.propertyController.drawToPanel();
			 });

  },
  /**
   * element의 부모 추출
   * @function
   */
  extractParent : function( element ){
    this.specialSkin.propertyController.items = [];
    while( element != this.__element ){
      this.specialSkin.propertyController.addItemByElement( element );
      element = daum.Element.getParent( element );
    }
  }
};












/**
 * 선택된 View에 하이라이팅 해주는 객체
 * @class
 */
SpecialSkin.highlighter = function(){
  var highlighter = SpecialSkin.highlighter;
  var element = highlighter.__element;
  if( typeof element === "undefined" ){
    element = highlighter.__element = document.createElement("div");
    highlighter.__elementInitStyle( element );
    document.body.appendChild( element );
    daum.Event.addEvent( element, "click", function(){ $E(element).hide(); SpecialSkin.Property.getInstance().offAllFieldsetHighlighting();  } );
  }

  $E(element).show();
  return element;
};

/**
 * 하이라이트 엘리먼트의 초기 스타일
 * @function
 */
SpecialSkin.highlighter.__elementInitStyle = function( element ){
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
SpecialSkin.highlighter.overwrap = function( element ){
  var highlighter = SpecialSkin.highlighter();
  var nodeName = element.nodeName.toUpperCase();
  var coords = daum.Element.getCoords( element );

  highlighter.style.height = ( element.offsetHeight - 2 ) + "px";
  highlighter.style.width = ( element.offsetWidth - 2 ) + "px";
  highlighter.style.left = coords.left + "px";
  highlighter.style.top = coords.top + "px";
};



/**
 * @namespace
 */
SpecialSkin.Property = function( id ){
  this.panel = $(id);
  this.items = [];
};


SpecialSkin.Property.getInstance = function( id ){
  if( typeof SpecialSkin.Property.__instance === "undefined" ){
    SpecialSkin.Property.__instance = new SpecialSkin.Property( id );
  }
  return SpecialSkin.Property.__instance;
};


SpecialSkin.Property.prototype = {
  addItemByElement : function( target_element ){
    var item = SpecialSkin.Property.Item.factory( target_element );

    if( typeof item !== "undefined" ){
      this.items.push( item );
    }
  },
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
  clearPanel : function(){
    this.panel.innerHTML = "";
  },
  removeAllEvent : function(){
    var event;
    for( var i = 0, length = this.events.length; i<length; i++ ){
      event = this.events[i];
      daum.Event.stopObserving( event );
    }
  },
  offAllFieldsetHighlighting : function(){
    for( var i = 0, length = this.items.length; i < length; i++ ){
      this.items[i].offHighlightingMyFieldset();
    }
  }
};


SpecialSkin.Property.Item = function( target_element ){
  this.target_element = target_element;
  this.tagName = target_element.nodeName;
  this.attributes = [];
  this.fieldset = null;
};


SpecialSkin.Property.Item.factory = function( target_element ){
  var propertyList, item, propertyType, property;
  var Item = SpecialSkin.Property.Item;
  var type = SpecialSkin.Property.type;
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
  var nodeName = target_element.nodeName.toUpperCase();


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

SpecialSkin.Property.Item.prototype = {
  addAttribute : function( attribute ){
    this.attributes.push( attribute );
  },
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
			   SpecialSkin.highlighter.overwrap( _this.target_element );
			   _this.highlightingMyFieldset();
			 } );

    return fieldset;
  },
  highlightingMyFieldset : function(){
    SpecialSkin.Property.getInstance().offAllFieldsetHighlighting();
    this.fieldset.style.backgroundColor = "#ccc";
  },
  offHighlightingMyFieldset : function(){
    this.fieldset.style.backgroundColor = "";
  }
};




SpecialSkin.Property.Item.Attribute = function(element, text, item){
  this.text = text;
  this.element = element;
  this.item = item;
};

SpecialSkin.Property.Item.Attribute.factory = function( property_type, item ){
  var Attribute = SpecialSkin.Property.Item.Attribute;
  var element = SpecialSkin.Property.Item.Attribute.createPropertyElement( property_type, item.target_element );
  var text = property_type.text;
  return new Attribute( element, text, item );
};


SpecialSkin.Property.Item.Attribute.createPropertyElement = function( property, target_element ){
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

SpecialSkin.Property.Item.Attribute.prototype = {
  getDom : function(){
    var p = document.createElement("p");
    if( this.element.nodeName === "INPUT" ){
      p.appendChild( document.createTextNode( this.text + " : " ) );
    }
    p.appendChild( this.element );
    return p;
  }
};





/**
 * @namespace
 */
SpecialSkin.Property.type = {};
SpecialSkin.Property.type.linkProperty = [
  {
    text : "href",
    element : SpecialSkin.CONST.ELEMENT.TEXT_FIELD
  },
  {
    text : "alt",
    element : SpecialSkin.CONST.ELEMENT.TEXT_FIELD
  }
];

SpecialSkin.Property.type.imageProperty = [
  {
    text : "src",
    element : SpecialSkin.CONST.ELEMENT.TEXT_FIELD,
    event : function( target_element ){
	var value = this.value;
	target_element.setAttribute("src", value);
    }
  },
  {
    text : "alt",
    element : SpecialSkin.CONST.ELEMENT.TEXT_FIELD
  }
];
SpecialSkin.Property.type.textProperty = [
  {
    text : "text",
    element : SpecialSkin.CONST.ELEMENT.TEXT_FIELD,
    event : function( target_element ){
	var value = this.value;
	target_element.innerHTML = value;
      }
    }
];
SpecialSkin.Property.type.listProperty = [
  {
    text : "Node 추가",
    element : SpecialSkin.CONST.ELEMENT.BUTTON,
    event : function( target_element ){
	var parent_element = target_element.parentNode;
	var new_element = target_element.cloneNode(true);
	parent_element.appendChild( new_element );
    }
  },
  {
    text : "Node 삭제",
    element : SpecialSkin.CONST.ELEMENT.BUTTON,
    event : function( target_element ){
	var parent_element = target_element.parentNode;
	parent_element.removeChild( target_element );
	delete target_element;
    }
  }
];
SpecialSkin.Property.type.boxProperty = [];
