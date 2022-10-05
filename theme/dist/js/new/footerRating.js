$(document).ready(function() {

    if ($("#footer #ratingSection").length){

        const loadRating = (html) => {
            const nodes = new DOMParser().parseFromString(html, 'text/html');
            const body = nodes.querySelectorAll('.vote-wrap:nth-child(-n+3)');
            for(var i = 0; i <= 2; i++) {
                document.querySelector('#ratingSection .vote-grid').appendChild(body[i]);
            }


        };
        fetch("/hodnotenie-obchodu/")
            .then((response) => response.text())
            .then(loadRating)
    }

});