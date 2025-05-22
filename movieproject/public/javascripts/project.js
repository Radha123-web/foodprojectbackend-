function showPicture() {
    const file = poster.files[0]
    mp.width = 60
    mp.src = URL.createObjectURL(file)
}

function companypicture(){
    const file=picture.files[0]
    fp.width=60
    fp.src= URL. createObjectURL(file)
}





$(document).ready(function () {
    $.get('/movie/fillstate', function (response) {
        response.data.map((item) => {
            $('#stateid').append($('<option>').text(item.statename).val(item.stateid))
        })
    })
    $('#stateid').change(function () {
        $.get('/movie/fillcity', { stateid: $('#stateid').val() }, function (response) {
            $('#cityid').empty()
            $('#cityid').append($('<option>').text('Select city'))
            response.data.map((item) => {
                $('#cityid').append($('<option>').text(item.cityname).val(item.cityid))
            })
        })

    })


    $('#cityid').change(function () {
        $.get('/movie/fillcinema', { cityid: $('#cityid').val() }, function (response) {
            $('#cinemaid').empty()
            $('#cinemaid').append($('<option>').text('Select cinema'))
            response.data.map((item) => {
                $('#cinemaid').append($('<option>').text(item.cinemaname).val(item.cinemaid))
            })
        })
    })




    $('#cinemaid').change(function () {
        $.get('/movie/fillscreen', { cinemaid: $('#cinemaid').val() }, function (response) {
            $('#screenid').empty()
            $('#screenid').append($('<option>').text('Select screen'))
            response.data.map((item) => {
                $('#screenid').append($('<option>').text(item.screenname).val(item.screenid))
            })
        })

    })



})
