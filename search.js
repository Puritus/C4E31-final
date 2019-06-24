var gapikey = 'AIzaSyAioE7RLUz7hxUNjUz5L18jY59P8Vz5X94';

$(function () {

    // call fancybox pluggin
    $(".fancyboxIframe").fancybox({
        maxWidth: 900,
        maxHeight: 600,
        fitToView: false,
        width: '90%',
        height: '90%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        iframe: {
            scrolling: 'auto',
            preload: true
        }
    });

    $(".downloadIframe").fancybox({
        maxWidth: 900,
        maxHeight: 600,
        fitToView: false,
        width: '90%',
        height: '90%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        iframe: {
            scrolling: 'auto',
            preload: true
        }
    });

    $('#search-form').submit(function (e) {
        e.preventDefault();
    });
});

function searchYoutube() {
    $('#results').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
    $('#buttons').html('');

    // get form input
    q = $('#search').val();
    // run get request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            type: 'video',
            key: gapikey
        }, function (data) {
            // 1. Get data from api
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            // 2. Hide loading
            $('#results').html('');
            $.each(data.items, function (i, item) {

                // 3.Get Output
                var output = getOutput(item);

                // 4.Display results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            // 5.Display buttons
            $('#buttons').append(buttons);

            // 6. Get data from api youtube and convert to mp3

        });
}

// Next page function
function nextPage() {
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');


    // clear 
    $('#results').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
    $('#buttons').html('');

    // get form input
    q = $('#search').val();

    // run get request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function (data) {

            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log data
            console.log(data);
            $('#results').html('');
            $.each(data.items, function (i, item) {

                // Get Output
                var output = getOutput(item);

                // display results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display buttons
            $('#buttons').append(buttons);
        });
}

// Previous page function
function prevPage() {
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');


    // clear 
    $('#results').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
    $('#buttons').html('');

    // get form input
    q = $('#search').val();  // this probably shouldn't be created as a global

    // run get request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function (data) {

            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log data
            console.log(data);
            $('#results').html('');
            $.each(data.items, function (i, item) {

                // Get Output
                var output = getOutput(item);

                // display results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display buttons
            $('#buttons').append(buttons);
        });
}

// Build output
function getOutput(item) {
    var videoID = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;




    // Build output string
    var output = '<div class="col-md-6">' +
        '<img src="' + thumb + '" class="img-responsive thumbnail">' +
        '</div>' +
        '<div class="input-group col-md-6">' +
        '<h4><a data-fancybox-type="iframe" class="fancyboxIframe" href="http://youtube.com/embed/' + videoID + '?rel=0">' + title + '</a></h4>' +
        '<h5><a data-fancybox-type="iframe" class="downloadIframe" href="https://recordmp3.co/#/watch?v=' + videoID + '">Download MP3</a></h5>' +
        '<small>By <span class="channel">' + channelTitle + '</span> on ' + videoDate + '</small>' +
        '<p>' + description + '</p>' +
        '</div>' +
        '<div class="clearfix"></div>';
    return output;
}

function getButtons(prevPageToken, nextPageToken) {
    if (!prevPageToken) {
        var btnoutput = '<ul class="pagination">' +
            '<li><a href="javascript:;"  id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            'onclick = "nextPage();">Next &raquo;</a></li>' +
            '</ul>';
    } else {
        var btnoutput = '<ul class="pagination">' +
            '<li><a href="javascript:;" id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
            'onclick = "prevPage();">&laquo; Previous</a></li>' +
            '<li><a href="javascript:;" id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            'onclick = "nextPage();">Next &raquo;</a></li>' +
            '</ul>';
    }

    return btnoutput;
}



// let listenId = document.getElementById("listenId");
// listenId.addEventListener("click", getUrlmp3);

// function getUrlmp3() {
//     const data =  {
//         v: "DtGP2CSEeZk",
//         ref: '',
//         zz: "p",
//         apikey: "recordmp3.co",
//         t: "1561375261",
//         h: "a7c6d4d8f3167bcfba0465928c09c06fbc6bb56b",
//     }
//     try {
//         $.ajax({
//             url: `https://api.recordmp3.co/fetch?v=${data.v}&ref=${data.ref}&zz=${data.zz}&apikey=${data.apikey}&t=${data.t}&h=${data.h}`,
//             type: "GET",
//             beforeSend: function (xhr) { 
//                 xhr.setRequestHeader('Referer', 'https://recordmp3.co/'); 
//                 console.log(xhr);
                
//             },
//             success: function (result) { 
//                 console.log("check")
//                 console.log(result) }
//         });
//     } catch (error) {
//         console.log(error);
//     }

// }   