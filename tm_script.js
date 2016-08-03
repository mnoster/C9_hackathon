/**
 * Created by DanLF on 8/2/2016.
 */
/**
 * Created by DanLF on 8/2/2016.
 */
$(document).ready(function () {
    // assign add/cancel button click handlers
    $('#search_button').click(function () {
        var search_term = $('#artistName').val();
        var postal_code = $('#postalCode').val();
        // searchTicketMaster(search_term, postal_code);
        if (postal_code == '') {
            console.log('postal code is blank');
            searchTicketMaster(search_term,'');
        } else {
            getLatLong(postal_code);
        }
    });

function getLatLong(postal_code) {
    $.ajax({
        type: "GET",
        url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + postal_code,
        async: true,
        dataType: "json",
        success: function (result) {
            console.log('json response next line:');
            console.log(result);
            console.log('lat: ' + result.results[0].geometry.location.lat);
            console.log('long: ' + result.results[0].geometry.location.lng);
            var lat = result.results[0].geometry.location.lat;
            var long = result.results[0].geometry.location.lng;
            console.log('var lat: ' + lat);
            console.log('var long: '  + long);
            var search_term = $('#artistName').val();
            // searchTicketMaster(search_term,lat,long);
            var latLong = lat + ',' + long;
            searchTicketMaster(search_term,latLong);
        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

function searchTicketMaster(search_term,latLong) {

    // window.location.href = 'http://app.ticketmaster.com/discovery/v1/events.json?keyword=' + search_term + '&apikey=VI4yeQLZs2AGX6JYIyeO4FvTpgAZAcHa';

    $.ajax({
        type: "GET",
        url: 'http://app.ticketmaster.com/discovery/v1/events.json?keyword=' + search_term + '&latlong=' + latLong + '&radius=100&apikey=VI4yeQLZs2AGX6JYIyeO4FvTpgAZAcHa',
        async: true,
        dataType: "json",
        success: function (json) {
            console.log('json response next line:');
            console.log(json);
            console.log('latLong: ' + latLong);

            if (json.hasOwnProperty('_embedded') == false) {
                console.log('cant find json._embedded');
                $('.tmRow').remove();
                $('<tr>').addClass('tmRow').html('No results from TicketMaster').appendTo('#results');
                return;
            }

            $('.tmRow').remove();

            console.log('json all events next line:');
            console.log(json._embedded.events);
            console.log('******************');
            var previous_groupId = null;
            eval_results(0);
            function eval_results(i) {
                for (; i < json._embedded.events.length; i++) {
                    var event_object = json._embedded.events[i];

                    // console.log('eventURL hasownproperty: ' +event_object.hasOwnProperty('eventURL'));
                    console.log(i + ' array position has groupId of: ' + event_object.groupId);
                    if (i > 0 && i < json._embedded.events.length && event_object.groupId == previous_groupId) {
                        previous_groupId = event_object.groupId;
                        i++;
                        if (i < json._embedded.events.length) {
                            eval_results(i);
                        } return;
                    }

                    previous_groupId = event_object.groupId;
                    console.log('event object next line:');
                    console.log(event_object);
                    console.log('json events 1 name: ' + event_object.name);
                    if (event_object.eventUrl === undefined) {
                        console.log('http://www.ticketmaster.com/event/' + event_object.id);
                        var buyLink = 'http://www.ticketmaster.com/event/' + event_object.id;
                    } else {
                        var buyLink = event_object.eventUrl;
                    }
                    console.log('json events 1 event url: ' + event_object.eventUrl);
                    console.log('json events 1 event start date: ' + event_object.dates.start.localDate);
                    console.log('json events 1 event end date: ' + event_object.dates.end.localDate);
                    console.log('json events 1 event start time: ' + event_object.dates.start.localTime);
                    console.log('json events 1 event end time: ' + event_object.dates.end.localTime);
                    console.log('json events 1 event time zone: ' + event_object.dates.timezone);
                    console.log('-----');
                    var event_object_emb = json._embedded.events[i]._embedded;
                    console.log('embedded name: ' + event_object_emb.attractions[0].name);
                    for (a = 0; a < event_object_emb.categories.length; a++) {
                        console.log('embedded category: ' + event_object_emb.categories[a].name);
                    }
                    console.log('embedded venue name: ' + event_object_emb.venue[0].name);
                    console.log('embedded venue address line1: ' + event_object_emb.venue[0].address.line1);
                    console.log('embedded venue address line2: ' + event_object_emb.venue[0].address.line2); // line2 always city/state?
                    console.log('embedded venue address ZIP: ' + event_object_emb.venue[0].postalCode);
                    console.log('embedded venue address country: ' + event_object_emb.venue[0].country.countryCode);
                    console.log('embedded venue address latitude: ' + event_object_emb.venue[0].location.latitude);
                    console.log('embedded venue address longitude: ' + event_object_emb.venue[0].location.longitude);


                    var tr = $('<tr>').addClass('tmRow');

                    var name = event_object_emb.attractions[0].name;
                    var date = event_object.dates.start.localDate;
                    var time = event_object.dates.start.localTime;
                    var timeZone = event_object.dates.timezone;
                    var cityState = event_object_emb.venue[0].address.line2;
                    var postalCode = event_object_emb.venue[0].postalCode;
                    var nameTD = $('<tr>').html(name);
                    var dateTimeTD = $('<td>').html(date + ' @ ' + time + ' ' + timeZone);
                    var locationTD = $('<td>').html(cityState + ' ' + postalCode);
                    var buyLinkTD = $('<td>').html('<a target="_blank" href="' + buyLink + '">Buy Tickets</a>');

                    tr.append(nameTD, dateTimeTD, locationTD, buyLinkTD);
                    $('#results').append(tr);

                    console.log('/////////////////////////////////////////////////////////////////////////////////////');
                }
            }
        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}