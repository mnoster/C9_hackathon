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
            maxheight: 200
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
                for(var i = 0; i <list_of_tweets.length; i++){
                    $("#twitter-feed").append(list_of_tweets[i].text);
                }

            },
            error: function (response) {
                console.log('error!');
            }

        })
    });
}
