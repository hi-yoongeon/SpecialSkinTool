
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
      this.insertHtmlToSidebar( tag.toHTML() );
    }
  },
  insertHtmlToSidebar : function( html ){
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    this.__element.appendChild( wrap.firstChild );
  }
};




SpecialSkin.Properties = {};
SpecialSkin.Properties.linkProperty = [
	{
		text : "link",
		element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.createElementConst.TEXT_FIELD ),
		event : function( element ){ element.href = this.value; }
	},
	{
		text : "alt",
		element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.createElementConst.TEXT_FIELD ),
		event : function( element ){ element.setAttribute("alt", this.value); }
	}
];

SpecialSkin.Properties.imageProperty = [
	{
		text : "url",
		element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.createElementConst.TEXT_FIELD ),
		event : function( element ){ element.src = this.value; }
	},
	{
		text : "alt",
		element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.createElementConst.TEXT_FIELD ),
		event : function( element ){ element.setAttribute("alt", this.value); }
	}	
];
SpecialSkin.Properties.textProperty = [
		{ 
			text : "text", 
			element : SpecialSkin.Properties.createElement( SpecialSkin.Properties.createElementConst.TEXT_FIELD ),
			event : function( element ){ element.innerHTML = this.value; }
		}
];
SpecialSkin.Properties.listProperty = [
	{
		element : SpecialSkin.Properties.createElement(SpecialSkin.Properties.createElementConst.BUTTON, "Node 추가"),
		event : function( element ){}
	},
	{
		element : SpecialSkin.Properties.createElement(SpecialSkin.Properties.createElementConst.BUTTON, "Node 삭제"),
		event : function( element ){}
	}	
];




SpecialSkin.Tags = {};

SpecialSkin.Tags.factory = function(){
  var Tags = SpecialSkin.Tags;
  var availableTags = {
    "P" : Tags.paragraphTag,
    "DIV" : Tags.divisionTag,
    "IMG" : Tags.imageTag,
    "A" : Tags.anchorTag,
    "LI" : Tags.listTag,
    "H1" : Tags.headTag,
    "H2" : Tags.headTag,
    "H3" : Tags.headTag,
    "H4" : Tags.headTag,
    "H5" : Tags.headTag,
    "H6" : Tags.headTag
  };
  var nodeName = element.nodeName.toUpperCase();
  var tagObject = null;

  if( availableTags.hasOwnProperty( nodeName ) ){
    console.log( "available tag : " + nodeName );
    tagObject = new availableTags[nodeName]( element );
  }

  return tagObject;	
};



SpecialSkin.Tags.paragraphTag = {
	
};
SpecialSkin.Tags.divisionTag = {};
SpecialSkin.Tags.anchorTag = {};
SpecialSkin.Tags.imageTag = {};
SpecialSkin.Tags.listTag = {};
SpecialSkin.Tags.headTag = {};












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