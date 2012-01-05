console.log("스킨 편집기 - Ver.2");



var special = special || {};
special.SkinEditor = function( options ){
  this.options = daum.extend( special.SkinEditor.__options, options );
  this.viewElement = $( this.options["view_id"] );
  this.toolbox = new special.SkinEditor.ToolBox();
};









(function($s){

   $s.__options = {
     view_id : "skin_editor_view",
     toolbox_id : "skin_editor_toolbox"
   };

   $s.ToolBox = function(){

   };

   



 })( special.SkinEditor );
















(function($s){



 })(special.SkinEditor);