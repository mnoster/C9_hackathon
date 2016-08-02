/**
 * Created by njporter10 on 8/2/16.
 */
/**
 * Created by njporter10 on 7/19/16.
 */
$(document).ready(function() {
    getSoundCloudSong(); //when the document loads the api functions will be ready
    getTwitterInfo();

});
// initialization
function getSoundCloudSong(){ //this is the function that holds the SOundcloud song player api
    SC.initialize({ // this will initialize the client id needed for access to the SC api
        client_id: "15c5a12b5d640af73b16bd240753ffbb"
    });

    // Play audio
    $("#embedTrack").click(function() { //on the click of the submit button in the html
        var player = $("#SCplayer"); //the variable of SC player will be set to the id of the song media player
        var artist = $('.artistName').val();  // the artist name will be deifined as a string of text in the
        artist = artist.replace(/\s/g, "_");
        artist = artist.replace(".", "_");
        SC.oEmbed('https://soundcloud.com/' + artist, {
            maxheight: 150,
            maxwidth: 800
        }, function(res) {
            $("#SCplayer").html(res.html);
        });
    });
}

function getTwitterInfo(){
    $("#embedTrack").click(function() {
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
                console.log('success!', response);
                var list_of_tweets = response.tweets.statuses;
                var tweet_array = [];
                for(var i = 0; i <list_of_tweets.length; i++){
                    tweet_array.push(list_of_tweets[i].text);
                    $('<tr>').addClass('twitter_border_lines').text(tweet_array[i]).appendTo('tbody');
                }
                $('.contain-tweets').css("visibility","visible");


            },
            error: function (response) {
                console.log('error!');
                $('.contain-tweets').css("visibility","visible");
                $('tbody').text("Oh no! There was an error with Twitter's server.").css({'color': 'red'});
            }

        })
    });
}
