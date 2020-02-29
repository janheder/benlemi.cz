
// -----------------------------------------------------------------------------
// HEADER AREA
// -----------------------------------------------------------------------------

/* add contacts into header area */ 
if ($(".search").length){
    var mail = $("#footer .mail").text();
    var tel = $("#footer .tel").text();

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
$("#js-menuToggle").click(function(){
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