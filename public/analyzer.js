function handle(){
    
}

$( document).ready(function() {
   var t_list = {}; 
   var wait_call_back = 0; 
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
            t_list = JSON.parse(text);
            console.log(t_list)
          }
      });
    }else{
      alert("Information Incomplete");
    }
   
  });
    
});