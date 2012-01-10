var property = {

  conditions : {
    tagName : ["IMG"]
  },
  handler : function(){
    var li = document.createElement("LI");
    var text_field = document.createElement("INPUT");

    text_field.setAttribute("type", "text");
    li.appendChild(text_field);
    
    return li;
  }
};