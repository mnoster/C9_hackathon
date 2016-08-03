var searchVideoId = "";
$(document).ready(function(){
    searchButtonClick ();
});//end of dom load
function searchButtonClick (){
    //button click handler
    $('.embedTrack').click(function(){
        var artist = $('.artistName').val();
        // $('#player').text('');
        // $('.html5-video-player').html('');
        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            //data: {q:'adele',maxResults:3,type:'channel',detailLevel:'verbose'},
            data: {q:artist,maxResults:3,detailLevel:'verbose'},
            success: function(result) {
                searchVideoId = result.video[0].id;
                console.log('AJAX Success video function called, with the following result:', result);
                // 2. This code loads the IFrame Player API code asynchronously.
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                console.log('End of click function****************');
            }
        });

        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: {q:artist,maxResults:1,type:'channel',detailLevel:'verbose'},
            success: function(result) {
                //console.log("channel id data ",result.data);
                var channelLink = "";
                //searchChannelId = result.data[0].id;
                console.log('AJAX Success channel function called, with the following result:', result);
                var channelId=Object.keys(result.data);
                console.log("channelId ", channelId);
                var channelURL = "https://www.youtube.com/channel/"+channelId;
                console.log("channelURL ",channelURL);
                channelLink = $('<a>').attr('href',channelURL).attr('target','_blank').text("Channel link");
                console.log("channelLink ",channelLink);
                $('#channelLink').html(channelLink);
                console.log('End of channel click function');
            }

        });

    }); // end of button click handler
}

/*
 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 */

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640', //height and width can be modified
        videoId: searchVideoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}