// -----------------------------------------------------------------------------
// GLOBAL
// -----------------------------------------------------------------------------

/*  */
$('a[href*="#"]').not('[data-force-scroll]').click(function(event) {
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
    $(".search .form-control").focus(); 
});

/* toggle submenu overlay (faster than shoptet default function submenu-visible) */
$(".menu-level-1 .ext").hover(
    function(){
        $("body").addClass("submenu-active");
    },function(){
        $("body").removeClass("submenu-active");
    }
);

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

/* relocate benefit points depending on page type */
if ($("#pointsSection").length){
    if ($("body.type-index").length){

        if ($(".before-carousel").length){
            $("#pointsSection").insertAfter(".before-carousel");
        }else{
            $("#pointsSection").insertBefore("#footer");
        }

    }else{
        $("#pointsSection").insertBefore("#footer");
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

/* load infographic images into parameters*/
$(".extended-description").append('<div class="description-infographics"><img src=""></div>');

$('select[data-parameter-name="Propositions"]').change(function() {
    var option = $('select[data-parameter-name="Propositions"] option:selected').text(); 
    var optionClean = option.replace(/[cm]/g,'').replace(/\s/g,'')
    var src = $('.p-thumbnail[href*="' + optionClean + '.jpg"]').attr("href");
    if(typeof src != 'undefined'){
        $(".description-infographics img").attr("src", src);
    }else{
        $(".description-infographics img").attr("src", '');
    }
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
    $(".removeable:first-child .p-label").each(function(){
        var label = $(this).html();
        $(".cart-table-heading").prepend("<span>" + label + "</span>");
    });
}

// -----------------------------------------------------------------------------
// STORE RATING PAGE
// -----------------------------------------------------------------------------

if ($("#rate-form").length){
    $("html:lang(cs) #rate-form").prepend("<h3 class='vote-form-title'>Přidat hodnocení</h3>");
    $("html:lang(sk) #rate-form").prepend("<h3 class='vote-form-title'>Pridať hodnotenie</h3>");
}
