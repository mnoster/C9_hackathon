/**
 * Created by njporter10 on 8/2/16.
 */
/**
 * Created by njporter10 on 7/19/16.
 */
$(document).ready(function() {
    getSoundCloudSong();
    getTwitterInfo();

});
// initialization
function getSoundCloudSong(){
    SC.initialize({
        client_id: "15c5a12b5d640af73b16bd240753ffbb"
    });

    // Play audio
    $("#embedTrack").click(function() {
        var player = $("#player");
        var artist = $('.artistName').val();
        artist = artist.replace(/\s/g, "_");
        SC.oEmbed('https://soundcloud.com/' + artist, {
            maxheight: 150,
            maxwidth: 800
        }, function(res) {
            $("#player").html(res.html);
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
                    $('<tr>').addClass('col-lg-4 col-md-5 col-xs-6').text(tweet_array[i]).appendTo('tbody');
                    // $("#twitter-feed").append(tweet_array[i]);
                }
                console.log('tweet array :' , tweet_array);

            },
            error: function (response) {
                console.log('error!');
            }

        })
    });
}
