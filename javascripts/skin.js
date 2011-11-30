
function SpecialSkin( options ){
  var src_options = daum.extend({}, SpecialSkin.__options);
  this.__options = daum.extend( src_options, options );
  this.init();
}

SpecialSkin.__options = {
  view_id : "view",
  properties_id : "properties",
  on_highlight : true,
  except_tasg : []
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

/*
SpecialSkin.Property.LinkProperty.prototype = SpecialSkin.Property.prototype;
SpecialSkin.Property.ImageProperty.prototype = SpecialSkin.Property.prototype;
SpecialSkin.Property.TextProperty.prototype = SpecialSkin.Property.prototype;
SpecialSkin.Property.ListProperty.prototype = SpecialSkin.Property.prototype;
*/

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

