/**
 * Created by njporter10 on 8/2/16.
 */
/**
 * Created by njporter10 on 7/19/16.
 */
$(document).ready(function() {
    getSoundCloudSong();

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
