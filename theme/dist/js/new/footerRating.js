$(document).ready(function() {

    if ($("#footer #ratingSection").length){

        const loadRating = (html) => {
            const nodes = new DOMParser().parseFromString(html, 'text/html');
            const body = nodes.querySelectorAll('.vote-wrap');
            for(var i = 0; i <= 2; i++) {
                document.querySelector('#ratingSection .vote-grid').appendChild(body[i]);
            }

            const body1 = nodes.querySelector('#ratingWrapper .rate-average-inner');
            document.querySelector('#ratingSection .rating-content').prepend(body1);

        };
        fetch("https://www.benlemi.sk/hodnotenie-obchodu/")
            .then((response) => response.text())
            .then(loadRating)
    }
    
});