/**
 * Created by njporter10 on 8/2/16.
 */
/**
 * Created by njporter10 on 7/19/16.
 */
$(document).ready(function() {
    apply_all_click_handlers();

});
function apply_all_click_handlers() {
    $(".embedTrack").click(function () {
        $(".artist_base").fadeOut();
        $('.instructions').fadeOut();
        getSoundCloudSong(); //when the document loads the api functions will be ready
        getTwitterInfo();
        sp_find_artist_info();

    });
}
// initialization
function getSoundCloudSong(){ //this is the function that holds the SOundcloud song player api
    SC.initialize({ // this will initialize the client id needed for access to the SC api
        client_id: "15c5a12b5d640af73b16bd240753ffbb"
    });

    // Play audio
 //on the click of the submit button in the html
        var player = $("#SCplayer"); //the variable of SC player will be set to the id of the song media player
        var artist = $('.artistName').val();  // the artist name will be deifined as a string of text in the
        artist = artist.replace(/\s/g, "_");
        artist = artist.replace(".", "_");
        SC.oEmbed('https://soundcloud.com/' + artist, {
            maxheight: 150,
            // maxwidth: 800
        }, function(res) {
            $("#SCplayer").html(res.html);
            $('<div><h3>Latest Tracks</h3></div>').addClass('artist_base').prependTo($('#SCplayer'));
            $('.contain-tweets').css("visibility","visible");
        });
}

function getTwitterInfo(){
        var tweet_array = [];
        var feed = $("#twitter-feed");
        var artist = $('.artistName').val();
        $.ajax({
            url: "http://s-apis.learningfuze.com/hackathon/twitter/index.php",
            dataType: 'json',
            method: 'POST',
            data:{
                search_term: artist
            },
            success: function (response) {
                $('.twitter-table-body').html('');
                console.log('success!', response);
                var list_of_tweets = response.tweets.statuses;

                for(var i = 0; i <list_of_tweets.length; i++){
                    tweet_array.push(list_of_tweets[i].text);
                    $('<td>').addClass('twitter_border_lines').text(tweet_array[i]).appendTo($('.twitter-table-body'));
                }

                $('#twitter-feed').css("visibility","visible");


            },
            error: function (response) {
                console.log('error!');
                $('.contain-tweets').css("visibility","visible");
                $('.twitter-table-body').text("Oh no! There was an error with Twitter's server.").css({'color': 'red'});
            }

        })

}

//-------spotify-----
function sp_find_artist_info(){
    var artist = $(".artistName").val();
    console.log('Artist', artist);
    $.ajax({
        url: "https://api.spotify.com/v1/search",
        method: "GET",
        dataType: "json",
        data: {
            q: artist,
            type: 'album'
        },
        success: function(response){
            $(".sp_album_area").html('');
            $(".spotify_albums_list").html('');
            console.log(response);
            for(var k = 0; k < 4; k++) {
                var albums = response.albums;
                var album_images = albums.items[k].images[1].url;
                var album_title = albums.items[k].name;
                var images = $("<img>").attr("src", album_images);
                var title = $("<div>").addClass("sp_album_title").text(album_title);
                var sp_container = $("<li>").addClass("sp_container").append(images, title);
                $(".spotify_albums_list").append(sp_container);

            }
        }
    });
}
