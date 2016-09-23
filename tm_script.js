var no_results = false; //sets to true when no results are returned from ticketmaster
var search_term = null; //artist search field
var postal_code = null; //search field appears when ticketmaster results are visible

$(document).ready(function () {
    $('.ticketmaster-container').css("visibility", "hidden");
    $('.embedTrack').click(function () {
        $('.ticketmaster-container').css("visibility", "visible");
        search_term = $('.artistName').val();
        postal_code = $('#postalCode').val();
        if (search_term == '') return;
        if (postal_code == '') {
            searchTicketMaster(search_term, ''); //call function to query ticketmaster with no zip code
        } else {
            getLatLong(postal_code); //call function to query google maps with zip code to get lat and long coordinates
        }
    });

    $('#narrowResults').click(function () {
        $('.ticketmaster-container').css("visibility", "visible");
        if (no_results == true || postal_code == '') {
            return;
        } else {
            getLatLong(postal_code);
        }
    })
});

function getLatLong(postal_code) {
    $.ajax({
        type: "GET",
        url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + postal_code,
        async: true,
        dataType: "json",
        success: function (result) {
            // console.log('getLatLong: ');
            // console.log(result); //ajax result for debugging
            var lat = result.results[0].geometry.location.lat;
            var long = result.results[0].geometry.location.lng;
            if ($('.artistName').val() != '') search_term = $('.artistName').val();
            var latLong = lat + ',' + long;
            searchTicketMaster(search_term, latLong);
        },
        error: function (xhr, status, err) { //unfinished error function
            console.log(result);
        }
    })
}

function searchTicketMaster(search_term, latLong) {
    $.ajax({
        type: "GET",
        url: 'http://app.ticketmaster.com/discovery/v1/events.json?keyword=' + search_term + '&latlong=' + latLong + '&radius=100&apikey=VI4yeQLZs2AGX6JYIyeO4FvTpgAZAcHa',
        async: true,
        dataType: "json",
        success: function (json) {
            // console.log('searchTicketMaster: ');
            // console.log(json); //ajax result for debugging
            if (json.hasOwnProperty('_embedded') == false) { //indicates there are no upcoming events for artist on file with ticketmaster
                no_results = true;
                if ($('#postalCode').val() == '') {
                    $('#zipSearch, #narrowResults').css("visibility", "hidden");
                }
                $('.tmRow').remove(); //remove any existing rows
                $('<tr>').addClass('tmRow').html('TicketMaster does not have any upcoming events for ' + search_term).appendTo('#results');
                return;
            }
            $('.tmRow').remove();
            var previous_groupId = null;
            eval_results(0);
            function eval_results(i) {
                for (; i < json._embedded.events.length; i++) {
                    var event_object = json._embedded.events[i];
                    // console.log(i + ' array position has groupId of: ' + event_object.groupId); //logging of each event array # for debugging
                    if (i > 0 && i < json._embedded.events.length && event_object.groupId == previous_groupId) {
                        previous_groupId = event_object.groupId; //store previous group id (artist id in ticketmaster database) to avoid repeated results in table
                        i++;
                        if (i < json._embedded.events.length) {
                            eval_results(i); //recursive function call to get next result in array
                        }
                        return;
                    }
                    previous_groupId = event_object.groupId;
                    if (event_object.eventUrl === undefined) { //use alternate URL if ticketmaster does not have main purchase URL stored as object property
                        var buyLink = 'http://www.ticketmaster.com/event/' + event_object.id;
                    } else {
                        var buyLink = event_object.eventUrl;
                    }
                    var event_object_emb = json._embedded.events[i]._embedded;
                    for (a = 0; a < event_object_emb.categories.length; a++) {
                    }
                    var tr = $('<tr>').addClass('tmRow');
                    var name = event_object_emb.attractions[0].name;
                    var date = event_object.dates.start.localDate;
                    var time = event_object.dates.start.localTime;
                    var timeZone = event_object.dates.timezone;
                    var cityState = event_object_emb.venue[0].address.line2;
                    var postalCode = event_object_emb.venue[0].postalCode;
                    var nameTD = $('<td>').html(name);
                    var dateTimeTD = $('<td>').html(date + ' @ ' + time + ' ' + timeZone);
                    var locationTD = $('<td>').html(cityState + ' ' + postalCode);
                    var buyLinkTD = $('<td>').html('<a target="_blank" href="' + buyLink + '">Buy Tickets</a>');
                    tr.append(nameTD, dateTimeTD, locationTD, buyLinkTD);
                    $('#results').append(tr);
                    $('#zipSearch, #narrowResults').css("visibility", "visible");
                }
            }
        },
        error: function (xhr, status, err) { //unfinished error processing
            console.log(json);
        }
    })
}