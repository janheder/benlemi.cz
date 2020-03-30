// -----------------------------------------------------------------------------
// GLOBAL
// -----------------------------------------------------------------------------

/* remove native scroll function - bugs */
if ($("[data-force-scroll]").length){
    $("[data-force-scroll]").each(function(){
        $(this).removeAttr("data-force-scroll");
    });
}

/* anchor scroll setup */
$( document ).ready(function() {
    $('a[href*="#"]').click(function(event) {
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
          && 
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        }
    });
});


// -----------------------------------------------------------------------------
// HEADER AREA
// -----------------------------------------------------------------------------

/* add contacts into header area */ 
if ($(".search").length){
    if ($("#footer").length){
        var mail = $("#footer .mail").text().replace(/\s/g,'');
        var tel = $("#footer .tel").text().replace(/\s/g,'');
    }else{
        var mail = $(".contact-box .mail a").text().replace(/\s/g,'');
        var tel = $(".contact-box  .tel").text().replace(/\s/g,'');
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
    $(".search .form-control").focus(); 
});

/* *WIP* override shoptet cart function on mobile */ 
$(".cart-count").click(function(){
    window.location.href='/kosik/';
});

/* toggle submenu overlay (faster than shoptet default function submenu-visible) */
$(".menu-level-1 .ext").hover(
    function(){
        $("body").addClass("submenu-active");
    },function(){
        $("body").removeClass("submenu-active");
    }
);


$("html:lang(cs) .menu-level-1").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item cz active">Česky</div><a href="https://benlemi.sk" class="language-toggle-item sk">Slovensky</a><a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a></div></div>');
$("#js-langToggle").click(function(){
    $("#js-langToggle").toggleClass("--active");
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
    $("#blogSection .blogSection__content").load("/blog/ .news-wrapper");
}

/* load rating into homepage section */
if ($("#ratingSection").length){
    $("#ratingSection .ratingSection__content").load("/hodnoceni-obchodu/ .content-inner");
}

/* relocate benefit points and email form depending on page type */
if ($("#pointsSection").length){
    if ($("body.type-index").length){

        if ($(".before-carousel").length){
            $("#pointsSection").insertAfter(".before-carousel");
        }else{
            $("#pointsSection").insertBefore("#footer");
        }

    }else{
        $("#footer").before('<section id="newsletterSection"></section>');
        $("#newsletterSection").load("/ #newsletterSection .container");
        $("#pointsSection").insertBefore("#newsletterSection");
    }
}

/* relocate instagram from footer to above footer */
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
    $(".add-to-cart-button").click(function(){
        $("html:lang(cs) .advanced-order .extra.step a").before('<div id="closeModal" class="btn btn-back">Jdu dále nakupovat</div>');
        $("html:lang(sk) .advanced-order .extra.step a").before('<div id="closeModal" class="btn btn-back">Jdu ďalej nakupovat</div>');
    }); 
});

/* load shop rating */
if ($(".type-detail").length){
    $("#ratingTab").wrapInner("<div id='ratingProduct'></div>");
    $("#ratingTab").append("<div id='ratingStore'></div>");

    $("html:lang(cs) #ratingProduct").prepend("<h1>Hodnocení produktu</h1>");
    $("html:lang(cs) #ratingTab #ratingStore").load("/hodnoceni-obchodu/ .content-inner");
}

/* click on modal overlay closes the whole modal window */   
$("#closeModal").click(function(){
    $("#cboxOverlay").click();
});

/* related products setup */
$(".products-related-header, .products-related").wrapAll("<div id='productsRelated'>");
$("#p-detail-tabs").append('<li class="shp-tab"><a href="#productsRelated" class="shp-tab-link" role="tab" data-toggle="tab">Související</a></li>');

/* make variant selects required */
if ($(".hidden-split-parameter").length){
    $(".hidden-split-parameter").each(function(){
        $(this).prop('required',true);
    });
}

/* remove scroll function from tabs */
if ($("#p-detail-tabs").length){
    $("#p-detail-tabs .shp-tab-link").each(function(){
        $(this).removeAttr("data-toggle");
    });
}

/* load infographic images into parameters */

if ($("#relatedFiles").length){
    $('select[data-parameter-name="Propositions"]').change(function() {
        var option = $('select[data-parameter-name="Propositions"] option:selected').text(); 
        var optionClean = option.replace(/[cm]/g,'').replace(/\s/g,'');
        var src = $('#relatedFiles a[title*="' + optionClean + '"]').attr("href");
        if(typeof src != 'undefined'){
            $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>Stáhnout infografiku</a></div>');
            $(".description-infographics img").attr("src", src);
            $(".description-infographics a").attr("href", src);
        }else{
            $(".description-infographics").remove();
        }
    });
}

/* relocate product code and brand name */
if ($(".p-info-wrapper").length){
    $(".p-info-wrapper .stars-wrapper, .p-detail-info > div:last-child").appendTo(".p-detail-inner-header");
}

/* relocate video */
if ($("#productVideos").length){
    $("#productVideos").appendTo(".p-thumbnails-wrapper");
}

/* add "show more" button to thumbnails */
if ($(".p-thumbnails-wrapper").length){
    $(".p-thumbnails-inner > div > a:nth-child(8)").after('<div id="thumbnailsShowMore"><div class="thumbnailsShowMore-inner">Zobrazit vše</div></div>');
}
$("#thumbnailsShowMore").click(function(){
    $(".p-thumbnails-inner").toggleClass("--active");
});

// -----------------------------------------------------------------------------
// PRODUCT CATEGORY
// -----------------------------------------------------------------------------

/* relocate heading and categories */
if ($(".type-category").length){
    $(".category-title").insertBefore(".content-wrapper-in");
    $(".subcategories").insertAfter(".category-title");
}

// -----------------------------------------------------------------------------
// CART STEP 1
// -----------------------------------------------------------------------------

if ($(".cart-table").length){
    $("<div class='cart-table-heading'></div>").insertBefore(".cart-table tbody");
    $(".cart-table-heading").prepend("<span>Název produktu</span>");

    $(".removeable:first-child .p-label").each(function(){
        var label = $(this).html();
        $(".cart-table-heading span:last-child").after("<span>" + label + "</span>");
    });
}

// -----------------------------------------------------------------------------
// STORE RATING PAGE
// -----------------------------------------------------------------------------

if ($("#rate-form").length){
    $("html:lang(cs) #rate-form").prepend("<h3 class='vote-form-title'>Přidat hodnocení</h3>");
    $("html:lang(sk) #rate-form").prepend("<h3 class='vote-form-title'>Pridať hodnotenie</h3>");
}
