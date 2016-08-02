/** jsdoc example
 * Define all global variables here

 * student_array - global array to hold student objects
 * @type {Array}

 * inputIds - id's of the elements that are used to add students
 * @type {string[]}

 * addClicked - Event Handler when user clicks the add button

 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form

 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
  * @return undefined

 * clearAddStudentForm - clears out the form values based on inputIds variable

 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}

 * updateData - centralized function to update the average and call student list update
  * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body

 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state

 * Listen for the document to load and reset the data to the initial state
 */

var searchVideoId = "";
$(document).ready(function(){
    searchButtonClick ();

});//end of dom load
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

function searchButtonClick (){
    //button click handler
    $('button').click(function(){
        var artist = $('.artistName').val();

        console.log('click initiated, artist ',artist);

        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            //data: {q:'adele',maxResults:3,type:'channel',detailLevel:'verbose'},
            data: {q:artist,maxResults:3,detailLevel:'verbose'},

            success: function(result) {
                //console.log('result ',result.video[0].id);
                searchVideoId = result.video[0].id;
                console.log('AJAX Success function called, with the following result:', result);

                // 2. This code loads the IFrame Player API code asynchronously.
                var tag = document.createElement('script');

                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                console.log('End of click function');

            }
        });

        console.log('channel search initiated, artist ',artist);
        //function getYoutubeChannel (){

            $.ajax({
                method: 'post',
                dataType: 'json',
                url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
                data: {q:artist,maxResults:1,type:'channel',detailLevel:'verbose'},
                success: function(result) {
                    //console.log("channel id data ",result.data);
                    //searchChannelId = result.data[0].id;
                    console.log('AJAX Success channel function called, with the following result:', result);
                    var channelId=Object.keys(result.data);
                    console.log("channelId ", channelId);

                        console.log('End of channel click function');

                }
            });
        //}
    });// end of button click handler
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