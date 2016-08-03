$(document).ready(function(){
    $('#embedTrack').click(function(){
        sp_find_artist_info();
    });
});

function sp_find_artist_info(){
    var artist = $("#artistName").val();
    $.ajax({
        url: "https://api.spotify.com/v1/search",
        method: "GET",
        dataType: "json",
        data: {
            q: artist,
            type: 'album'
        },
        success: function(response){
            console.log(response);
            for(var k = 0; k < 4; k++) {
                var albums = response.albums;
                var album_images = albums.items[k].images[1].url;
                var album_title = albums.items[k].name;

                var images = $("<img>").attr("src", album_images);
                var title = $("<div>").addClass("sp_album_title").text(album_title);
                // var sp_row = $("<div>").addClass("row").append(images, title);;
                var sp_container = $("<div>").addClass("sp_container col-sm-3").append(images, title);
                $(".sp_album_area").append(sp_container);

            }
        },
        error: function(response){
            console.log('there is error');
        }
    });
}