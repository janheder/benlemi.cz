// -----------------------------------------------------------------------------
// HOMEPAGE
// -----------------------------------------------------------------------------

// =============================================================================
// LOAD NEWS 
// =============================================================================

$(document).ready(function() {

    if ($(".in-index").length){
        const loadNews = (html) => {
            const nodes = new DOMParser().parseFromString(html, 'text/html');
            const body = nodes.querySelectorAll('.news-wrapper .news-item:nth-child(-n+3)');
            for(var i = 0; i <= 2; i++) {
                document.querySelector('.in-index #newsWrapper').appendChild(body[i]);
            }
        };
        fetch("/" + category1Url + "/")
            .then((response) => response.text())
            .then(loadNews)
    }
});
