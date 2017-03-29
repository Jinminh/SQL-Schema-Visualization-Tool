$( document ).ready(function() {	
  $("#analyzer").click(function(){
    var dir = prompt("Please enter a diretory name");
    if(dir != null){
      var data = {
        location:dir
      }; 
      $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/analyzer',
          success:function(text){
            alert(text);
          }
      });
    }else{
      alert("Information Incomplete");
    }
  });
});