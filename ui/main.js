window.onload=function(){
//Making a console log.
console.log('Loaded!');

var nbutton=document.getElementById('namebutton');
nbutton.onclick=function()
{
  var request=new XMLHttpRequest();
  request.onreadystatechange=function(){
      if (request.readyState=== XMLHttpRequest.DONE){
        if(request.status===200){
            var text=request.responseText;
            alert(text);}
      }
  }
  var varname=document.getElementById('name').value;
  request.open('POST','http://localhost:8080/inputlog',true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({'name': varname}));
}
}
