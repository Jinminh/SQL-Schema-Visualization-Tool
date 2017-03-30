function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


$( document ).ready(function() {	
	$("#dpbtn").click(function(){
		var ourdata=[];
		$.get( "get_connections", function(data) {
			ourdata = JSON.parse(data);
			$(".dropdown-content").html('<li id="'+ourdata[0].conn_name + '">'+ourdata[0].conn_name+'</li>');
			for(var i=1; i<ourdata.length; i++){
				//console.log('type>>>'+typeof(ourdata[i]));
				if(isEmpty(ourdata[i]))
					break;
				console.log('i>>>'+i);
				console.log(ourdata[i].conn_name);
				$(".dropdown-content").append('<li id="'+ourdata[i].conn_name + '">'+ourdata[i].conn_name+'</li>');	

			}	
			$(".dropdown-content").show();	
			$(".dropdown-content li").click(function(){
				for(var item in ourdata){
					if(this.id == ourdata[item].conn_name){
						$("#host").val(ourdata[item].host);
						$("#port").val(ourdata[item].port);
						$("#database").val(ourdata[item].db);
						$("#user").val(ourdata[item].user);
						$("#password").val(ourdata[item].pwd);
					}			
				}
			});			
		});
	});
	
	$(window).click(function(event){
		var target = $(event.target);
		if(!target.is("#dpbtn"))
			$(".dropdown-content").hide();	
	});
	
  $("#save-button").click(function(){
    if($("#host").val() && $("#port").val() && $("#database").val() && $("#user").val() && $("#password").val()){
      var save = prompt("Please enter a connection name"); 
      if (save != null) {		
          var data = {
            conn_name:save,
            host:$("#host").val(),
            port:$("#port").val(),
            db:$("#database").val(),
            user:$("#user").val(),
            pwd:$("#password").val(),
          };  
		  $.ajax({
		  	type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/save_connection',
			success:function(text){
				alert(text);
			}
          });
      }
    }else
      alert("Information Incomplete");
  });
});

