/**
 * Created by njporter10 on 8/2/16.
 */
/**
 * Created by njporter10 on 7/19/16.
 */
$(document).ready(function() {
    apply_all_click_handlers();
    $('.wiki-div').css("visibility","hidden");
    $('.main-content').css("visibility","hidden");
    $('.main-container1').css("visibility","hidden");

});
function apply_all_click_handlers() {
    $(".embedTrack").click(function () {
        $(".artist_base").fadeOut();
        $('.instructions').fadeOut();
        getSoundCloudSong(); //when the document loads the api functions will be ready
        getTwitterInfo();
        sp_find_artist_info();
        getWiki();
    });
}
// initialization
function getSoundCloudSong(){ //this is the function that holds the SOundcloud song player api
    SC.initialize({ // this will initialize the client id needed for access to the SC api
        client_id: "15c5a12b5d640af73b16bd240753ffbb"
    });

    // Play audio
    //---the soundcloud api call does not use ajax---it uses only javscript and there is an external script attatched in the index that adds more functionality
        var player = $("#SCplayer"); //the variable of SC player will be set to the id of the song media player
        var artist = $('.artistName').val();  // the artist name will be deifined as a string of text in the
        artist = artist.replace(/\s/g, "_");
        artist = artist.replace(".", "_");
        SC.oEmbed('https://soundcloud.com/' + artist, {
            maxheight: 150,
            // maxwidth: 800
        }, function(res) {
            $("#SCplayer").html(res.html); //this will get the data that the call sends back to and append it to the dom
            $('<div><h3>Latest Tracks</h3></div>').addClass('artist_base').prependTo($('#SCplayer'));//this is the div that will be appended to the dom above the player
            $('.contain-player').css("visibility","visible");// this will make the tweet box visible if the function is success
        });
}

function getTwitterInfo(){ // this is the fn that ancapsulates teh twitter ajax call 
        var tweet_array = [];//this is an array that will be used to contain all each tweet
        var feed = $("#twitter-feed");
        var artist = $('.artistName').val(); //get artist name from inpu on click
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
                    tweet_array.push(list_of_tweets[i].text);//in the for loop each item will be pushed into the array
                    $('<td>').addClass('twitter_border_lines').text(tweet_array[i]).appendTo($('.twitter-table-body'));//and here those items will be put into a BS table
                }
                $('#twitter-feed').css("visibility","visible"); //makes the twitter feed visible if successful call
            },
            error: function (response) {
                console.log('error!');
                $('.contain-player').css("visibility","visible");
                $('.twitter-table-body').text("Oh no! There was an error with Twitter's server.").css({'color': 'red'});
            }

        })

}

//-------spotify-----
function sp_find_artist_info(){ 
    var artist = $(".artistName").val();
    artist = toTitleCase(artist);
    $.ajax({
        url: "https://api.spotify.com/v1/search",
        method: "GET",
        dataType: "json",
        data: {
            q: artist,
            type: 'album'
        },
        success: function(response){
            $(".sp_album_area").html(''); // this is to clear the album area for the next search item
            $(".spotify_albums_list").html(''); 
            console.log(response);
            for(var k = 0; k < 4; k++) { //for only four items variables will be assigned
                var albums = response.albums;
                var album_images = albums.items[k].images[1].url;
                var album_title = albums.items[k].name;
                var images = $("<img>").attr("src", album_images);
                var title = $("<div>").addClass("sp_album_title").text(album_title);
                var sp_container = $("<li>").addClass("sp_container").append(images, title);
                $(".spotify_albums_list").append(sp_container);//append content to the dom

            }
            $('.spotify_albums_list').prepend($('<h1>').text(artist).addClass("artist_base"));
        }
    });
}
function toTitleCase(str)// this will return the first letter of each word as a string with capitalize, the wiki url requires the words to be capitalized
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function getWiki(){
    var artist = $('.artistName').val();
    artist = toTitleCase(artist);
    artist = artist.replace(/\s/g, "_");
    artist = artist.replace(".", "_");
    console.log('artist wiki:' , artist);
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+artist+"&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data) {
            console.log('wiki data: ', data);
            var markup = data.parse.text["*"];
            var blurb = $('.wiki-div').html(markup);
            $('.wiki-div').css("visibility","visible");
        },
        error: function (errorMessage) {
        }
    });

}