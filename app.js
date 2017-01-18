// var conn = new ActiveXObject("ADODB.Connection");
// var rs = new ActiveXObject("ADODB.Connection");

var hostname = $('#host').val();
var portnumber = $('#port').val();
var db = $('#database').val();
var username = $('#user').val();
var password = $('#password').val();

// var ConnectionString = "Drive = {MySQL ODBC 5.2w Driver}; Server = ";

function connection(){
  
}

// alert($('#host').val());

window.onload = function(){
  document.getElementById('connect').addEventListener('click', function(event){
    alert('test');
    return true;
  });

}
