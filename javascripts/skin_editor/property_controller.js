console.log("Property Controller");

(function( $s ){

  $s.PropertyController = function( skinEditor ){
    this.skinEditor = skinEditor;
    this.properties = [];
  }

  $s.PropertyController.prototype = {

    exec : function( el ){

      this.searchProperty( el );

    },

    add : function( moduleName ){
      var property = new $s.PropertyController.Property( this, moduleName );
      this.properties.push( property );
    },

    remove : function(){

    },


    searchProperty : function( el ){
      /*
      var appropriate = [];
      for( var i = 0 ; i < this.properties.length; i++ ){
	if(this.properties[i].isMatch( tagName, className, id ) ){
	  appropriate.push( properties[i] );
	}
      }*/
      
    }
    
  }

  
  $s.PropertyController.Property = function( controller, moduleName ){
    this.skinEditor = controller.skinEditor;
    this.controller = controller;
    this.moduleName = moduleName;
    this.conditions = null;
    this.handler = null;
    this.load();
  };

  $s.PropertyController.Property.prototype = {
    getPropertyPath : function(){
      var base_path = this.skinEditor.options["javascript_path"] + this.skinEditor.options["project_path"];
      base_path = base_path + "/properties";
      return base_path;
    },
    load : function(){
      var self = this;
      var script_path =  "./properties/" + this.moduleName + ".js";

      this.skinEditor.loadHtml( script_path, function( text ){
	eval( text );
	self.completeLoad( property );
      } );
    },
    completeLoad : function( property ){
      this.conditions = property["conditions"];
      this.handler = property["handler"];


      this.skinEditor.toolbox.addHandler( this.handler() );
      
      console.log("모듈 로드완료");
    }
  }
  
})( special.SkinEditor );

