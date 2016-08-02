/**
 * Created by DanLF on 8/2/2016.
 */
/**
 * Created by DanLF on 8/2/2016.
 */
$(document).ready(function () {
    // assign add/cancel button click handlers
    $('#search_button').click(function () {
        var search_term = $('#artistName').val()
        searchTicketMaster(search_term);
    });
    // $('#artistName').on('keypress', enter_keypress);
    // searchTicketMaster();
});

// function enter_keypress(e) {
//     if (e.which == '13') {
//         searchTicketMaster();
//     }
// }

function searchTicketMaster(search_term) {
    // window.location.href = 'http://app.ticketmaster.com/discovery/v1/events.json?keyword=' + search_term + '&apikey=VI4yeQLZs2AGX6JYIyeO4FvTpgAZAcHa';

    $.ajax({
        type:"GET",
        url:'http://app.ticketmaster.com/discovery/v1/events.json?keyword=' + search_term + '&apikey=VI4yeQLZs2AGX6JYIyeO4FvTpgAZAcHa',
        async:true,
        dataType: "json",
        success: function(json) {
            console.log('json response next line:');
            console.log(json);
            console.log('json all events next line:');
            console.log(json._embedded.events);
            console.log('******************');
            for (i=0; i<json._embedded.events.length; i++) {
                var event_object = json._embedded.events[i];
                console.log('event object next line:');
                console.log(event_object);
                console.log('json events 1 name: ' + event_object.name);
                console.log('json events 1 event url: ' + event_object.eventUrl);
                console.log('json events 1 event start date: ' + event_object.dates.start.localDate);
                console.log('json events 1 event end date: ' + event_object.dates.end.localDate);
                console.log('json events 1 event start time: ' + event_object.dates.start.localTime);
                console.log('json events 1 event end time: ' + event_object.dates.end.localTime);
                console.log('json events 1 event time zone: ' + event_object.dates.timezone);
                console.log('-------------------');
                var event_object_emb = json._embedded.events[i]._embedded;
                console.log('embedded name: ' + event_object_emb.attractions[0].name);
                console.log(event_object_emb.categories.length);
                // for (i = 0; i < event_object_emb.categories.length; i++) {
                //     console.log('embedded category: ' + event_object_emb.categories[i].name);
                // }
                // console.log('embedded venue name: ' + event_object_emb.venue[0].name);
                // console.log('embedded venue address line1: ' + event_object_emb.venue[0].address.line1);
                // console.log('embedded venue address line2: ' + event_object_emb.venue[0].address.line2); // line2 always city/state?
                // console.log('embedded venue address ZIP: ' + event_object_emb.venue[0].postalCode);
                // console.log('embedded venue address country: ' + event_object_emb.venue[0].country.countryCode);
                // console.log('embedded venue address latitude: ' + event_object_emb.venue[0].location.latitude);
                // console.log('embedded venue address longitude: ' + event_object_emb.venue[0].location.longitude);
                console.log('******************');
            }


            // Parse the response.
            // Do other things.
        },
        error: function(xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}