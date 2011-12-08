
function SpecialSkin( options ){
  var src_options = daum.extend({}, SpecialSkin.__options);
  this.__options = daum.extend( src_options, options );
  this.init();
}

SpecialSkin.__options = {
  view_id : "view",
  properties_id : "properties",
  on_highlight : true,
  except_tags : []
};

SpecialSkin.prototype = {
  init : function(){
    this.viewController = SpecialSkin.ViewController.getInstance(this);
    this.propertyController = SpecialSkin.PropertyController.getInstance(this);
  },
  getOptions : function(){
    return this.__options;
  }
};






SpecialSkin.ViewController = function( id, specialSkin ){
  this.__element = $(id);
  this.specialSkin = specialSkin;
};

SpecialSkin.ViewController.getInstance = function(specialSkin){
  var ss_view = SpecialSkin.ViewController;
  if( typeof ss_view.__instance === "undefined" ){
    ss_view.__instance = new ss_view( specialSkin.getOptions().view_id, specialSkin );
  }
  return ss_view.__instance;
};

SpecialSkin.ViewController.prototype = {
  bindEvent : function(){
    var self = this;
    daum.Event.addEvent( this.__element, "click", function(e){
			   self.specialSkin.propertyController.clearPanel();
			   var srcElement = daum.Event.getElement(e);
			   daum.Event.preventDefault(e);
			   self.extractParent( srcElement );
			 });
  },
  extractParent : function( element ){
    while( element != this.__element ){
      this.specialSkin.propertyController.addProperty( element );
      element = daum.Element.getParent( element );
    }
  }
};
















SpecialSkin.PropertyController = function( id, specialSkin ){
  this.__element = $(id);
  this.specialSkin = specialSkin;
};

SpecialSkin.PropertyController.getInstance = function(specialSkin){
  var ss_property = SpecialSkin.PropertyController;
  if( typeof ss_property.__instance === "undefined" ){
    ss_property.__instance = new ss_property( specialSkin.getOptions().properties_id, specialSkin );
  }
  return ss_property.__instance;
};

SpecialSkin.PropertyController.prototype = {
  clearPanel : function(){
    this.__element.innerHTML = "";
  },
  addProperty : function( element ){
    var nodeName = element.nodeName;
    var tag = SpecialSkin.Tags.factory( element );

    if( tag !== null ){
      this.insert( tag.getPropertyElement() );
    }
  },
  insert : function( el ){
    this.__element.appendChild( el );
  }
};


SpecialSkin.Properties = {
  "TEXT_FIELD" : "INPUT||TEXT",
  "BUTTON" : "BUTTON"
};


SpecialSkin.Properties.createElement = function( element_type ){
  var element_attr = element_type.split("||");
  var element = document.createElement( element_attr[0] );

  if( element_attr[0] === "INPUT" ){
    element.setAttribute("type", element_attr[1]);
  }else if( element_attr[0] == "BUTTON" ){
    element.appendChild( document.createTextNode(arguments[1]) );
  }
  return element;
};

SpecialSkin.Properties.linkProperty = [
  {
    text : "href",
    element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.TEXT_FIELD )
  },
  {
    text : "alt",
    element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.TEXT_FIELD )
  }
];

SpecialSkin.Properties.imageProperty = [
  {
    text : "src",
    element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.TEXT_FIELD )
  },
  {
    text : "alt",
    element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.TEXT_FIELD )
  }
];
SpecialSkin.Properties.textProperty = [
  {
    text : "text",
    element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.TEXT_FIELD )
  }
];
SpecialSkin.Properties.listProperty = [
  {
    element : SpecialSkin.Properties.createElement(SpecialSkin.Properties.BUTTON, "Node 추가")
  },
  {
    element : SpecialSkin.Properties.createElement(SpecialSkin.Properties.BUTTON, "Node 삭제")
  }
];
SpecialSkin.Properties.boxProperty = [];


SpecialSkin.Properties.getCreatedElement = function( element, property ){

  var property_element = property.element;
  var attribute = property.text;


  if( typeof attribute !== "undefined" ){
    if( attribute === "text" ){
      property_element.value = element.innerHTML;
    }else{
      property_element.value = element.getAttribute( attribute );
    }
  }


  return property_element;
};










SpecialSkin.Tags = function( element ){
  this.element = element;
  this.properties = [];
};

SpecialSkin.Tags.prototype = {
  "addProperty" : function( property ){
    this.properties.push( property );
  },
  "wrapping_fieldset" : function( property_elements ){
    var fieldset = document.createElement("fieldset");
    var legend = document.createElement("legend");
    legend.innerHTML = this.element.nodeName + " property";
    fieldset.appendChild( legend );
    for( var i = 0, length = property_elements.length; i < length; i++ ){
      fieldset.appendChild( property_elements[i] );
    }
    return fieldset;
  },
  "generatePropertyElement" : function(){
    var property_elements = [];
    var property_item;
    var created_property_element;
    var _this = this;
    for( var i = 0, length = this.properties.length; i < length; i++ ){
      for( var j = 0, j_length = this.properties[i].length; j < j_length ;j++ ){
	property_item = this.properties[i][j];

	if( typeof property_item.text !== "undefined" ){
	  property_elements.push( document.createTextNode( property_item.text + " : ") );
	}
	created_property_element = SpecialSkin.Properties.getCreatedElement( this.element, property_item );
	property_elements.push( created_property_element );

	if( created_property_element.nodeName.toUpperCase() !== "BUTTON" ){
	  property_elements.push( document.createElement("br") );
	}
      }
    }
    return property_elements;
  },
  "getPropertyElement" : function(){
    var property_elements = this.generatePropertyElement();
    return this.wrapping_fieldset( property_elements );
  }
};

SpecialSkin.Tags.factory = function( element ){
  var Tags = SpecialSkin.Tags;
  var availableTags = {
    "P" : Tags.plainTextTag,
//    "DIV" : Tags.divisionTag,
    "IMG" : Tags.imageTag,
    "A" : Tags.anchorTag,
    "STRONG" : Tags.plainTextTag,
    "LI" : Tags.listTag,
    "H1" : Tags.plainTextTag,
    "H2" : Tags.plainTextTag,
    "H3" : Tags.plainTextTag,
    "H4" : Tags.plainTextTag,
    "H5" : Tags.plainTextTag,
    "H6" : Tags.plainTextTag
  };
  var nodeName = element.nodeName.toUpperCase();
  var tagObject = null;

  if( availableTags.hasOwnProperty( nodeName ) ){
    console.log( "available tag : " + nodeName );
    tagObject = availableTags[nodeName](element);
  }

  return tagObject;
};



SpecialSkin.Tags.anchorTag = function( element ){
  var tag = new SpecialSkin.Tags( element );
  tag.addProperty( SpecialSkin.Properties.textProperty );
  tag.addProperty( SpecialSkin.Properties.linkProperty );
  return tag;
};
SpecialSkin.Tags.imageTag = function( element ){
  var tag = new SpecialSkin.Tags( element );
  tag.addProperty( SpecialSkin.Properties.imageProperty );
  return tag;
};
SpecialSkin.Tags.listTag = function( element ){
  var tag = new SpecialSkin.Tags( element );
  tag.addProperty( SpecialSkin.Properties.listProperty );
  return tag;
};
SpecialSkin.Tags.divisionTag = function( element ){
  var tag = new SpecialSkin.Tags( element );
  tag.addProperty( SpecialSkin.Properties.boxProperty );
  return tag;
};
SpecialSkin.Tags.plainTextTag = function( element ){
  var tag = new SpecialSkin.Tags( element );
  tag.addProperty( SpecialSkin.Properties.textProperty );
  return tag;
};












/*
SpecialSkin.PropertyController = function( id, specialSkin ){
  this.__element = $(id);
  this.specialSkin = specialSkin;
};

SpecialSkin.PropertyController.getInstance = function(specialSkin){
  var ss_property = SpecialSkin.PropertyController;
  if( typeof ss_property.__instance === "undefined" ){
    ss_property.__instance = new ss_property( specialSkin.getOptions().properties_id, specialSkin );
  }
  return ss_property.__instance;
};

SpecialSkin.PropertyController.prototype = {
  clearPanel : function(){
    this.__element.innerHTML = "";
  },
  addProperty : function( element ){
    var nodeName = element.nodeName;
    var tag = SpecialSkin.Tag.factory( element );

    if( tag !== null ){
      this.insertHtmlToSidebar( tag.toHTML() );
    }
  },
  insertHtmlToSidebar : function( html ){
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    this.__element.appendChild( wrap.firstChild );
  }
};


SpecialSkin.Property = function(){

};

SpecialSkin.Property.prototype = {

};

SpecialSkin.Property.LinkProperty = function(){

};

SpecialSkin.Property.ImageProperty = function(){

};

SpecialSkin.Property.TextProperty = function(){

};

SpecialSkin.Property.ListProperty = function(){

};


SpecialSkin.Tag = function( element ){
  this.element = element;
};
SpecialSkin.Tag.factory = function( element ){
  var Tag = SpecialSkin.Tag;
  var availableTags = {
    "P" : Tag.ParagraphTag,
    "DIV" : Tag.DivisionTag,
    "IMG" : Tag.ImageTag,
    "A" : Tag.AnchorTag,
    "LI" : Tag.ListTag,
    "H1" : Tag.HeadTag,
    "H2" : Tag.HeadTag,
    "H3" : Tag.HeadTag,
    "H4" : Tag.HeadTag,
    "H5" : Tag.HeadTag,
    "H6" : Tag.HeadTag
  };
  var nodeName = element.nodeName.toUpperCase();
  var tagObject = null;

  if( availableTags.hasOwnProperty( nodeName ) ){
    console.log( "available tag : " + nodeName );
    tagObject = new availableTags[nodeName]( element );
  }

  return tagObject;
};

SpecialSkin.Tag.prototype = {
  toHTML : function(){
    return "<fieldset><legend>ygmaster</legend></fieldset>";
  }
};

SpecialSkin.Tag.ParagraphTag = SpecialSkin.Tag;
SpecialSkin.Tag.DivisionTag = SpecialSkin.Tag;
SpecialSkin.Tag.AnchorTag = SpecialSkin.Tag;
SpecialSkin.Tag.ImageTag = SpecialSkin.Tag;
SpecialSkin.Tag.ListTag = SpecialSkin.Tag;
SpecialSkin.Tag.HeadTag = SpecialSkin.Tag;

SpecialSkin.Tag.ParagraphTag.prototype = {

};






var Link = function(){
	var p = document.createElement("p");
	var text_input = document.createElement("input");
	p.appendChild(document.createTextNode("text : "));
	p.appendChild(text_input);
	p.appendChild(document.createElement("br"));

	return p;
};



*/