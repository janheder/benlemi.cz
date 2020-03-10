
// -----------------------------------------------------------------------------
// HEADER AREA
// -----------------------------------------------------------------------------

/* add contacts into header area */ 
if ($(".search").length){
    if ($("#footer").length){
        var mail = $("#footer .mail").text();
        var tel = $("#footer .tel").text();
    }else{
        var mail = $(".contact-box .mail a").text();
        var tel = $(".contact-box  .tel").text();
    }
    $(".search").before('<div class="header-contacts">'+
    '<a href="tel:' + tel + '">' + tel + '</a>'+
    '<a href="mailto:' + mail + '">' + mail + '</a>'+
    '</div>');
}

/* add search and user icons to header area */ 
$(".navigation-buttons").prepend('<div class="nav-search" id="js-searchToggle"></div><a href="/login" class="nav-user"></a>');

/* add hamburger menu on mobile */ 
$(".header-top").prepend('<div class="nav-menu-toggle" id="js-menuToggle"><span></span></div>');

/* toggle control of responsive menu */ 
$("#js-menuToggle, .menu-helper").click(function(){
    $(".header-top").toggleClass("--active");
    $("body").toggleClass("--noScroll");
});

/* toggle show responsive searchbar */ 
$("#js-searchToggle").click(function(){
    $(".search").toggleClass("--active");
});

// -----------------------------------------------------------------------------
// HOMEPAGE
// -----------------------------------------------------------------------------

/* unwrap homepage section */
if ($("#homepageSection").length){
    $("#homepageSection").unwrap().unwrap().unwrap().unwrap().unwrap();
}

/* load blog posts into homepage section */
if ($("#blogSection").length){
    $("#blogSection .container").load("/blog/ .news-wrapper");
}

/* relocate benefit points depending on page type */
if ($("#pointsSection").length){
    if ($("body.type-index").length){
        $("#pointsSection").insertAfter(".before-carousel");
    }else{
        $("#pointsSection").insertBefore("#footer");
    }
}

/* relocate instagram from footer abuve footer */
if ($("#instagramSection").length){
    $("#instagramSection").insertBefore("#footer");
}

// -----------------------------------------------------------------------------
// PRODUCT PAGE
// -----------------------------------------------------------------------------

/* relocate product title */
if ($(".p-detail-inner-header").length){
    $(".p-detail-inner-header").insertBefore(".p-final-price-wrapper");
}

/* relocate rating stars */
if ($(".stars-wrapper").length){
    $(".stars-wrapper").insertBefore(".p-final-price-wrapper");
}

/* add button into advanced-order modal */   
$(document).ready(function() { 
    if ($("#colorbox").length){
        $(".advanced-order .extra.step a").before('<div id="closeModal" class="btn btn-back">Jdu dále nakupovat</div>');
    }
    $("#closeModal").click(function(){
        $("#cboxOverlay").click();
    });    
});

