// -----------------------------------------------------------------------------
// GLOBAL
// -----------------------------------------------------------------------------

/* remove native shoptet scroll function - bugs */
if ($("[data-force-scroll]").length){
    $("[data-force-scroll]").each(function(){
        $(this).removeAttr("data-force-scroll");
    });
}

/* anchor scroll setup */
$(document).ready(function() {
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

$("#content-wrapper").wrap("<div id='content-wrapper-wrap'></div>");


// -----------------------------------------------------------------------------
// HEADER AREA
// -----------------------------------------------------------------------------

$(function() {
    //caches a jQuery object containing the header element
    var header = $("#header");
    header.addClass("no-scroll");
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 0) {
            header.removeClass("no-scroll").addClass("scroll");
        }
        if (scroll <= 0) {
            header.removeClass("scroll").addClass("no-scroll");
        }
    });
});

$(function() {
    //caches a jQuery object containing the header element
    var header2 = $(".no-scroll");
    var scroll2 = $(window).scrollTop();
    if (scroll2 > 0) {
        header2.removeClass('no-scroll').addClass("scroll");
    }
    if (scroll < 0) {
        header2.removeClass("scroll").addClass('no-scroll');
    }
});


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
    $(".menu-level-1 .search").insertAfter(".navigation-buttons");
    if($(".search").hasClass("--active")){
        $(".search").removeClass("--active");
        $(".search .form-control").blur();  
    }else{
        $(".search").addClass("--active");
        $(".search .form-control").focus(); 
    }
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

$(".search").insertAfter(".menu-level-1>li:last-child");

if ($(".popup-widget-inner h2").length){
    $('<div class="navLinks"><a href="/login/?backTo=%2F" class="top-nav-button top-nav-button-login primary login toggle-window navLinks__link" data-target="login" rel="nofollow">Přihlášení</a><a href="/registrace/" class="navLinks__link">Registrace</a><span class="navLinks__span">Jazyk:</span></div>').insertAfter(".nav-user");
}else{
    $('<div class="navLinks"><a href="/klient/" class="navLinks__link --user">Uživatelský účet</a><span class="navLinks__span">Jazyk:</span></div>').insertAfter(".nav-user");
}


$(".navLinks").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item cz active">Česky</div><a href="https://benlemi.sk" class="language-toggle-item sk">Slovensky</a><a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a></div></div>');
$("#js-langToggle").click(function(){
    $("#js-langToggle").toggleClass("--active");
});

function freeDelivery(){ 
    if ($(".cart-count.full .cart-price").length){
        $(".headerFreeDelivery").remove();
        var price = $(".cart-price").html().replace(/\s/g, '');
        var priceFree = 1234;
        priceInt = parseInt(price);

        if(priceInt > priceFree){
            $("<div class='headerFreeDelivery free'>Dopravu máte zdarma</div>").insertBefore(".cart-count");
        }
        else{
            var priceFinal = priceFree - priceInt;
            $("<div class='headerFreeDelivery'>Vyberte ještě za <span>"+ priceFinal +" Kč</span><br>a dopravu máte zdarma</div>").insertBefore(".cart-count");
        }
    }
    else{
        $(".headerFreeDelivery").remove();
        $("<div class='headerFreeDelivery free'>Vyberte nad 1234 Kč<br>a máte dopravu zdarma</div>").insertBefore(".cart-count");  
    }

    if ($(".ordering-process").length){
        $("<div class='headerFreeDelivery free'>Vyberte nad 1234 Kč<br>a máte dopravu zdarma</div>").insertAfter(".navLinks");
    }
}
freeDelivery();
$(".add-to-cart .add-to-cart-button").click(function(){
    setTimeout(function(){
        freeDelivery();
    }, 1000);
});

/* relocate site message */
if ($(".site-msg").length){
    if ($(".breadcrumbs").length){
        $(".site-msg").insertBefore(".breadcrumbs");
    } 
    if ($(".before-carousel").length){
        $(".site-msg").insertBefore(".before-carousel");
    } 
}

/* rename user account */
var name = $(".popup-widget-inner p strong").text();
$(".navLinks__link.--user").text("Přihlášen: " + name);


$(".menu-level-1 > li.ext").each(function() {
    $(this).prepend('<div class="menu-item-responsive"></div>');
    var catLink = $(this).children('a').prop("href");
    $(this).find(".menu-level-2").prepend('<a class="menu-item-more" href="' + catLink + '">Zobrazit vše</a>')
});

$(".menu-item-responsive").click(function(){
    $(this).siblings(".menu-level-2").toggleClass("--active");
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
    $("#blogSection .blogSection__content").load("/blog-bydleni/ .news-wrapper");
}

/* load rating into homepage section */
if ($("#ratingSection").length){
    $("#ratingSection .ratingSection__content").load("/hodnoceni-obchodu/ .content-inner", function() {
        $('<div style="display:block;text-align:center;"><a href="hodnoceni-obchodu" class="btn btn-secondary">Další hodnocení</a></div>').insertAfter(".ratingSection__content #ratingWrapper + .votes-wrap");
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

/* relocate middle categories section */


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
        $(".advanced-order .extra.step a").before('<div id="closeModal" class="btn btn-back">Jdu dále nakupovat</div>');
    }); 
});

/* load shop rating */
if ($(".type-detail").length){
    $("#ratingTab").wrapInner("<div id='ratingProduct'></div>");
    $("#ratingTab").append("<div id='ratingStore'></div>");

    $("#ratingProduct").prepend("<h1>Hodnocení produktu</h1>");

    $("#ratingTab #ratingStore").load("/hodnoceni-obchodu/ .content-inner", function() {
        $("<a href='/hodnoceni-obchodu' class='btn btn-secondary' id='js-ratingStoreToggle'>Přidat hodnocení</div>").insertBefore("#ratingStore #rate-form");
        
        /*
        $("#js-ratingStoreToggle").click(function(){
            $("#ratingStore #rate-form").addClass("--active");
            $(this).addClass("--hide");
        });
        */
        
        $(".rate-wrapper .vote-form .vote-form-title").click(function(){
            $(".vote-form-title + #formRating").addClass("--active");
            $(this).addClass("--hide");
        });
    });
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
    $('select[data-parameter-name="Rozměr"]').change(function() {
        $(".description-infographics").remove();
        var option = $('select[data-parameter-name="Rozměr"] option:selected').text(); 
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
    $(".p-thumbnails-inner > div > a:last-child").after('<div id="thumbnailsShowMore"><div class="thumbnailsShowMore-inner">Zobrazit vše</div></div>');
}
$("#thumbnailsShowMore").click(function(){
    $(".p-thumbnails-inner").toggleClass("--active");
});

/* reloace related product before rating */
$("#productsRelated").insertBefore("#productDiscussion");

/* Description hooks changes */
$(".basic-description").attr('id', 'descriptionLong');
$('#p-detail-tabs a[href="#description"]').attr('href', '#descriptionLong');
$("#p-detail-tabs").prepend('<li class="shp-tab"><a href="#description" class="shp-tab-link" role="tab">Parametry</a></li>');

/* Rename decription link */
$('.p-info-wrapper a[href="#description"]').text("Zobrazit informace ");



/* Cross selling products */
if ($(".in-children-s-wooden-house-beds").length){
    if ($("#productsRelated .flag-custom2").length){
        var i=0;
        $("#productsRelated .flag-custom2").each(function(i){
            var ran = i+1; 
            var pName = $(this).closest(".p").find(".name").prop("title");
            var pImg = $(this).closest(".p").find(".image img").prop("src");
            var pPrice = $(this).closest(".p").find(".price-final strong").text();
            $(".p-info-wrapper .add-to-cart").before('<div class="detail-cross-selling selling-'+ ran +'"><input type="checkbox" id="csell' + ran + '" name="csell' + ran + '"><label for="csell' + ran + '"><img src="' + pImg + '"><span><span>' + pName + '</span><span>' + pPrice + '</span></span></label></div>')
            var pUrl = $(this).closest("a.image").prop("href");
            $("body").append('<div id="crossSelling' + ran + '"></div>');

            $("#crossSelling" + ran).load(pUrl + " #product-detail-form", function() {
                $("#crossSelling" + ran + " form").prop("id", "product-detail-form-" + ran);
            });

            $("#product-detail-form select[data-parameter-name='Barva']").change(function() {
                var selected = $("#product-detail-form select[data-parameter-name='Barva'] option:selected").text(); 
                $("#crossSelling" + ran + " option").filter(function(){
                    return $(this).text() == selected;
                }).prop("selected", true);
            
            });
        });

        $("<h4 class='detail-cross-selling-heading'>Doplňky</h4>").insertBefore(".selling-1");


        $("#product-detail-form").on("submit", function(){
            var i = 0;
            $(".detail-cross-selling").each(function(i){
                var ran = i+1; 
                if($("#csell" + ran).prop("checked")){
                    setTimeout(function(){
                        $("#product-detail-form-" + ran +" button").click();
                    }, 300);
                }
            });
        });

        $("#product-detail-form select").change(function(){
            if ($("#product-detail-form select[data-parameter-name='Barva']").length){
                var one = $("#product-detail-form select[data-parameter-name='Barva']").attr("data-parameter-id");
                var two = $("#product-detail-form select[data-parameter-name='Barva']").find("option:selected").prop("value");
            };

            if ($("#product-detail-form select[data-parameter-name='Rozměr']").length){
                var one2 = $("#product-detail-form select[data-parameter-name='Rozměr']").attr("data-parameter-id");
                var two2 = $("#product-detail-form select[data-parameter-name='Rozměr']").find("option:selected").prop("value");
            };

            if (one === undefined){
                var number = one2+"-"+two2;
            }else if(one2 === undefined){
                var number = one+"-"+two;
            }else{
                var number = one+"-"+two+"-"+one2+"-"+two2;
            }
            
            $(".p-info-wrapper span, .price-save span, .price-standard span, .bottomCta__price span").each(function(){
                $(this).removeClass("force-display");
            });
            $("span."+ number).addClass("force-display");
        });
    }

}

$('.detail-cross-selling input').change(function() {
    if($(this).is(":checked")) {
        $(this).closest(".detail-cross-selling").addClass("checked");
    }else{
        $(this).closest(".detail-cross-selling").removeClass("checked");
    }
});

/* relocate standard price */
$(document).ready(function() {
    if ($(".p-final-price-wrapper .price-standard").length){
        $(".p-final-price-wrapper .price-standard").insertBefore(".p-final-price-wrapper .price-final-holder:first-child");
    }
});

/* add button into advanced order modal */
$(document).ready(function() {
    $(".add-to-cart-button").click(function(){
        setTimeout(function(){
            $("#backToShop").remove();
            $(".extra.step").prepend("<div class='btn' id='backToShop'>Zpět do obchodu</div>");
            $("#backToShop").click(function(){
                $("#cboxClose").click();
            });
        }, 500);
    });
});


/* Adjust price displaying */
if ($(".type-detail").length){

    $(".price-final span").each(function() {
        var str = $(this).text();
        var strM = str.replace(/\s/g, '',).replace("Kč", '').replace("od", ''); 
        $(this).text(strM);
        var str = $(this).append("<span class='price-final-currency'> Kč</span>");
    });

    $(".price-final span.default-variant").prepend("<span class='price-final-pre'>od </span>");

    $(".price-additional span").each(function() {
        var str1 = $(this).text();
        var strM1 = str1.replace(/\s/g, '',).replace("KčbezDPH", '').replace("od", ''); 
        $(this).text(strM1);
        var str1 = $(this).append("<span class='price-final-dph'> Kč bez DPH</span>"); 
    });

    $(".price-additional span.default-variant").prepend("<span class='price-final-pre'>od </span>");

    $(".price-standard span").each(function() {
        var str1 = $(this).text();
        var strM1 = str1.replace(/\s/g, '',).replace("Kč", '').replace("od", ''); 
        $(this).text(strM1);
        var str1 = $(this).append("<span class='price-final-currency'> Kč</span>");
    });

    $(".price-standard span.default-variant").prepend("<span class='price-final-pre'>od </span>");

    $(".price-additional:not(:has(span))").each(function() {
        var str1 = $(this).text();
        var strM1 = str1.replace(/\s/g, '',).replace("KčbezDPH", ''); 
        $(this).text(strM1);
        var str1 = $(this).append("<span class='price-final-dph'> Kč bez DPH</span>");
    });
}

/* rename titles */
if ($(".type-detail").length){
    $(".extended-description h3").text("Výhody a parametry");
    $(".products-related-header").text("Potřebné příslušenství, které oceníte:");
    $('a[href="#productsRelated"]').text("Příslušenství");
}

/* add add to cart cta fixed on bottom of a page */
if ($(".type-detail").length){
    var pName = $(".p-detail-inner-header h1").text();
    var pPrice = $(".p-final-price-wrapper .price-final").html();
    $('<div class="bottomCta"><div class="bottomCta__container"><div class="bottomCta__content"><div class="bottomCta__title">' + pName + '</div><div class="bottomCta__price">' + pPrice + '</div></div><div class="bottomCta__spinner"><input type="text" id="bottomCtaInput" value="1"><span class="increase"></span><span class="decrease"></span></div><div class="btn bottomCta__button" id="bottomCtaButton">Přidat do košíku</div></div></div>').insertBefore(".overall-wrapper");
    $("#bottomCtaInput").change(function(){
        var inputValue = $('#bottomCtaInput').val();
        $('.quantity input').val(inputValue);
    });
    $("#bottomCtaButton").click(function(){
        $('.add-to-cart-button').click();
    });

    $(".bottomCta__spinner .increase").click(function(){

        var inputValue = parseInt($('#bottomCtaInput').val());
        $('.add-to-cart .amount, #bottomCtaInput').val(inputValue+1);
    });
    $(".bottomCta__spinner .decrease").click(function(){

        var inputValue = parseInt($('#bottomCtaInput').val());
        if(inputValue>1){
            $('.add-to-cart .amount, #bottomCtaInput').val(inputValue-1);
        }
    });

    $(".add-to-cart .increase").click(function(){
        var inputValue = parseInt($('.add-to-cart .amount').val());
        $('#bottomCtaInput').val(inputValue+1);
    });
    $(".add-to-cart .decrease").click(function(){
        var inputValue = parseInt($('.add-to-cart .amount').val());
        if(inputValue>1){
            $('#bottomCtaInput').val(inputValue-1);
        }
    });

}

$("#ratingProduct>p").text("Buďte první, kdo napíše hodnocení k tomuto produktu");

/* rewrite description */
if ($(".type-detail").length){
    var desc = $("#descriptionLong .rte p").text();
    var descTrim = desc.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");
    $(".p-short-description p").text(descTrim);
}


$(window).on('scroll', function() {
    scrollPosition = $(this).scrollTop();
    if (scrollPosition >= 1000) {
        $(".bottomCta").addClass("--active");

    }else{
        $(".bottomCta").removeClass("--active");
    }
    
});


// -----------------------------------------------------------------------------
// PRODUCT CATEGORY
// -----------------------------------------------------------------------------

/* relocate heading and categories */
if ($(".type-category").length){
    $(".category-title").insertBefore(".content-wrapper-in");
    $(".subcategories").insertAfter(".category-title");
    $(".category-perex").insertAfter(".category-title");
}

/* relocate sort into filters */
if ($(".filters-wrapper").length){
    $("#content-wrapper").append('<div id="filtersToggle">Otevřít filtr</div>')
    $("#filtersToggle").click(function(){
        $("#content-wrapper").toggleClass("--showFilters");
        if ($("#content-wrapper").hasClass("--showFilters")) {
            $("#filtersToggle").text("Zavřít filtr");
        }else{
            $("#filtersToggle").text("Otevřít filtr");
        }
    });
}

/* rename show more button */
if ($(".pagination-loader").length){
    $(".pagination-loader span").text("Zobrazit další");
}

/* relocate hover overlay on product & add more variants into product box*/
if ($(".product").length){
    $(".product").each(function(){
        $(this).find(".p-tools").insertBefore($(this).find('.image img'));

        if ($(this).find(".price-final strong > small").length){
            $(this).find(".name").append("<span class='p-variants'>Více variant</span>");
        }

    });
}

if ($("#category-header").length){
    $("#category-header").prepend('<div id="filterToggleDesktop" class="btn">Filtr</div>');

    $("#filterToggleDesktop").click(function(){
        $(".sidebar-left").toggleClass("--active");
    });
}



// -----------------------------------------------------------------------------
// CART
// -----------------------------------------------------------------------------

/* relocate cart heading navigation */
if ($(".ordering-process").length){
    $(".cart-header").insertBefore('.content-wrapper-in');
}


/* add heading to cart table */
if ($(".cart-table").length){
    $("<div class='cart-table-heading'></div>").insertBefore(".content-wrapper-in");
    $(".cart-table-heading").prepend("<span>Název produktu</span>");

    $(".removeable:first-child .p-label").each(function(){
        var label = $(this).html();
        $(".cart-table-heading span:last-child").after("<span>" + label + "</span>");
    });
}


/* add 4. step */
if ($(".ordering-process").length){
    $(".cart-header").append('<li class="step step-4"><strong><span>Dokončení objednávky</span></strong></li>');
    $(".cart-header .step-2 span").text('Doprava a platba');
    $(".cart-header .step-3 span").text('Kontaktní údaje');
}

/*
    if ($(".ordering-process").length){
        $(".discount-coupon").insertBefore('.price-wrapper .price-label.price-primary');
    }
*/

if ($(".in-krok-2").length){
    $(".in-krok-2 .co-billing-address #company-info").insertAfter('.in-krok-2 .co-billing-address fieldset > h4');
    $(".in-krok-2 .co-billing-address .unveil-wrapper").insertAfter('.in-krok-2 .co-billing-address fieldset > h4');
    $(".stay-in-touch .form-group:nth-child(2)").addClass("register");
    $(".stay-in-touch .form-group.register").insertAfter(".co-contact-information");

    $(".co-contact-information h4 + .form-group label").text("Už jste u nás zaregistrovaní?");
    $(".co-contact-information h4 + .form-group a").text("Přihlaste se");

    $("#sendNewsletter + label").text("Dostávejte naše maily. Posíláme skutečně jen užitečné informace o bydlení, novinkách a slevách.");

}

$("#company-shopping").change(function(){
    $("#company-info input").each(function(){
        $(this).prop("required", true);
    });
});

if ($(".in-dekujeme").length){
    var num = $(".reca-number strong").text();
    $(".recapitulation-wrapper .co-order .order-content").text("Obsah objednávky: "+ num);
    $(".order-summary-heading").text("Potvrzujeme, že jste si právě udělali radost");
    $(".reca-number").text("Doma to budete mít krásné a ještě jste podpořili českou rodinnou firmu. Do 30 minut vám pošleme email se všemi důležitými informacemi.");
}

if ($(".category-perex").length){
    var text = $(".category-perex p").text();
    var textMod = text.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");
    $("<div class='perex-short'></div><div class='perex-showMore'>Celý popis</div>").insertAfter(".category-perex > p");
    $(".perex-short").text(textMod);
    $(".perex-showMore").click(function(){
        $(".category-perex").addClass("active");
    });
}


// -----------------------------------------------------------------------------
// STORE RATING PAGE
// -----------------------------------------------------------------------------

/* add title to rating */
if ($("#rate-form").length){
    $("#rate-form").prepend("<h3 class='vote-form-title'>Přidat hodnocení</h3>");
}

// -----------------------------------------------------------------------------
// BLOG
// -----------------------------------------------------------------------------

/* load blog posts into homepage section */
if ($(".blogCategories").length){

    $(".blogCategories .blogCategories__bydleni").load("/blog-bydleni/ .news-wrapper", function() {
        $("<h2 class='blogCategories__sectionTitle'>Bydlení</h2>").insertBefore(".blogCategories .blogCategories__bydleni");
        $("<div class='blogCategories__sectionShowMore'><a href='/blog-bydleni/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__bydleni .blogCategories__section .news-item:nth-child(2)");    
    });
    
    $(".blogCategories .blogCategories__rodina").load("/blog-rodina/ .news-wrapper", function() {
        $("<h2 class='blogCategories__sectionTitle'>Rodina</h2>").insertBefore(".blogCategories .blogCategories__rodina");
        $("<div class='blogCategories__sectionShowMore'><a href='/blog-rodina/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__rodina .blogCategories__section .news-item:nth-child(2)");    
    });

    $(".blogCategories .blogCategories__novinky").load("/blog-novinky/ .news-wrapper", function() {
        $("<h2 class='blogCategories__sectionTitle'>Novinky</h2>").insertBefore(".blogCategories .blogCategories__novinky");
        $("<div class='blogCategories__sectionShowMore'><a href='/blog-novinky/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__novinky .blogCategories__section .news-item:nth-child(2)");    
    });

    $(".blogCategories .blogCategories__benlemi-pomaha").load("/blog-benlemi-pomaha/ .news-wrapper", function() {
        $("<h2 class='blogCategories__sectionTitle'>Benlemi pomáhá</h2>").insertBefore(".blogCategories .blogCategories__benlemi-pomaha");
        $("<div class='blogCategories__sectionShowMore'><a href='/blog-benlemi-pomaha/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__benlemi-pomaha .blogCategories__section .news-item:nth-child(2)");    
    });

}

// -----------------------------------------------------------------------------
// USER PROFILE
// -----------------------------------------------------------------------------

if ($(".logout").length){
    $(".logout").insertAfter(".client-center-box");

    $("<div class='client-contact-box'></div>").insertAfter(".client-center-box + .logout");

    $(".client-contact-box").load("/objednavka/krok-1/ .checkout-box");
}

// -----------------------------------------------------------------------------
// FOOTER
// -----------------------------------------------------------------------------

if ($("#footer").length){
    $("#signature .title").text("Shoptet");
    $("#signature").prepend('<a href="https://benlemi.cz" class="title --benlemi">Vytvořili <img src="https://janheder.github.io/benlemi.cz/theme/dist/img/symbol-benlemi.svg" class="image --benlemi"> Benlemi &</a>');
}

// -----------------------------------------------------------------------------
// RATING STORE PAGE
// -----------------------------------------------------------------------------

$(".vote-form-title").click(function(){
    $(".vote-form-title+#formRating").addClass("--active");
    $(this).addClass("--hide");
});

// -----------------------------------------------------------------------------
// RATING STORE PAGE
// -----------------------------------------------------------------------------

$(".empty-content-404 h1").text("Tahle stránka je vzhůru nohama");
$("<p>Náš kvalitní nábytek naštěstí stojí všema nohama pevně na zemi. Tak si vyberte unikátní domečkovou postel nebo cokoliv, čím proměníte svůj byt v krásný domov.</p>").insertAfter(".empty-content-404 h1");