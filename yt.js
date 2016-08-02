$(document).ready(function(){
    $('button').click(function(){
        console.log('click initiated');
        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: {q:'mr. carmack',maxResults:1},
            success: function(result) {
                console.log('AJAX Success function called, with the following result:', result);

            }
        });
        console.log('End of click function');
    });
});