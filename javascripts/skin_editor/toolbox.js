console.log("toolbox.js");

(function($s){
   $s.Toolbox = function( skinEditor ){
     this.skinEditor = skinEditor;
     this.createToolboxWrapper();
     //this.hide();
   };


   $s.Toolbox.prototype = {
     createToolboxWrapper : function(){

       this.skinEditor.loadHtml( "toolbox.html", function( html ){



				   console.log( html );

				 } );

     },
     turnOn : function( el ){
       this.show();

     },
     hide : function(){
       $E(this.wrapper).hide();
     },
     show : function(){
       $E(this.wrapper).show();
     }
   };
 })( special.SkinEditor );