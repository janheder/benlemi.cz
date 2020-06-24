// -----------------------------------------------------------------------------
// HOMEPAGE
// -----------------------------------------------------------------------------


/* unwrap homepage section */
if ($("#homepageSection").length){
    $("#homepageSection").unwrap().unwrap().unwrap().unwrap().unwrap();
}

/* load blog posts into homepage section */
if ($("#blogSection").length){
    $("#blogSection .blogSection__content").load("/" + category1Url + "/ .news-wrapper");
}

/* load rating into homepage section */
if ($("#ratingSection").length){
    $("#ratingSection .ratingSection__content").load("/" + g_ratingUrl + "/ .content-inner", function() {
        $('<div style="display:block;text-align:center;"><a href="' + g_ratingUrl + '" class="btn btn-secondary">' + g_moreRating + '</a></div>').insertAfter(".ratingSection__content #ratingWrapper + .votes-wrap");
    });
}

/* relocate benefit points and email form depending on page type */
if ($("#pointsSection").length){
    if ($("body.type-index").length){

        if ($(".before-carousel").length){
            $("#pointsSection").insertAfter(".before-carousel");
        }
        else{
            $("#pointsSection").insertBefore("#footer");
        }
    }
    else if ($("body.type-product").length){
        $("#pointsSection").insertBefore(".p-detail-tabs-wrapper");
    }
    else{
        $("#footer").before('<section id="newsletterSection"></section>');
        $("#newsletterSection").load("/ #newsletterSection .container");
        $("#pointsSection").insertBefore("#newsletterSection");
    }
}

/* relocate instagram from footer to above footer */
if ($("#instagramSection").length){
    $("#instagramSection").insertBefore("#footer");
}

/* relocate middle categories section */
$(".middle-banners-wrapper").insertBefore("#pointsSection + .content-wrapper");

