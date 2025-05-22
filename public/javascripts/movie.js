$(document).ready(function()
{ 
  $.get('/movie/get_all_movie', function(response){
    
     var htm=''
     response.data.map((item)=>{
        htm+='<div style=margin:10px>'
        htm+=`<img src='/images/${item.movieposter}' width='300',height='400'>`
        htm+='</div>'
    })

    $('#result').html(htm)
  }) 

  $('#txt').change(function)(){

  }

  
  
})