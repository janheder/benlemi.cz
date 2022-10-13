$(document).ready(function() {

    if ($("#footer #ratingSection").length){

        const loadRating = (html) => {
            const nodes = new DOMParser().parseFromString(html, 'text/html');
            const body = nodes.querySelectorAll('.votes-wrap .vote-wrap:nth-child(-n+3)');
            for(var i = 0; i <= 2; i++) {
                document.querySelector('#ratingSection .vote-grid').appendChild(body[i]);
            }

            const body1 = nodes.querySelector('#ratingWrapper .rate-average-inner');
            document.querySelector('#ratingSection .rating-content').prepend(body1);

            const body2 = nodes.querySelector('#ratingWrapper .rate-average-inner .stars-label');
            document.querySelector('#ratingSectionCount').prepend(body2);

        };
        fetch("/"+ g_ratingUrl +"/")
            .then((response) => response.text())
            .then(loadRating)
    }

});