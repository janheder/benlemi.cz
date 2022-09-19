if ($("#footer #ratingSection").length){

    const loadRating = (html) => {
        const nodes = new DOMParser().parseFromString(html, 'text/html');
        const body = nodes.querySelectorAll('.vote-wrap');
        for(var i = 0; i <= 2; i++) {
            document.querySelector('#ratingSection').appendChild(body[i]);
        }

    };
    fetch("https://www.benlemi.sk/hodnotenie-obchodu/")
        .then((response) => response.text())
        .then(loadRating)
}