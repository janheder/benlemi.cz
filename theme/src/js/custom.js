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


/* relocate search */
$(".header-top .search").insertAfter("#navigation .menu-level-1>li:last-child");


/* toggle show responsive searchbar */ 
$("#js-searchToggle").click(function(){
    $("#navigation .search").insertAfter(".navigation-buttons");
    if($(".search").hasClass("--active")){
        $(".search").removeClass("--active");
        $(".menu-helper .search .form-control").blur();  
    }else{
        $(".search").addClass("--active");
        $(".menu-helper .search .form-control").focus(); 
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

/* add header client section */
if ($(".popup-widget-inner h2").length){
    $('<div class="navLinks"><a href="/login/?backTo=%2F" class="top-nav-button top-nav-button-login primary login toggle-window navLinks__link" data-target="login" rel="nofollow">Přihlášení</a><a href="/registrace/" class="navLinks__link">Registrace</a><span class="navLinks__span">Jazyk:</span></div>').insertAfter(".nav-user");
}else{
    $('<div class="navLinks"><a href="/klient/" class="navLinks__link --user">Uživatelský účet</a><span class="navLinks__span">Jazyk:</span></div>').insertAfter(".nav-user");
}

/* language toggle */
$(".navLinks").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item cz active">Česky</div><a href="https://benlemi.sk" class="language-toggle-item sk">Slovensky</a><a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a></div></div>');
$("#js-langToggle").click(function(){
    $("#js-langToggle").toggleClass("--active");
});

/* free delivery fucntion */
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

/* add responsive link into menu */
$(".menu-level-1 > li.ext").each(function() {
    $(this).prepend('<div class="menu-item-responsive"></div>');
    var catLink = $(this).children('a').prop("href");
    $(this).find(".menu-level-2").prepend('<a class="menu-item-more" href="' + catLink + '">Zobrazit vše</a>')
});

$(".menu-item-responsive").click(function(){
    $(this).siblings(".menu-level-2").toggleClass("--active");
});


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

            var img = $(".p-image-wrapper a").html();
            var name = $(".p-detail-inner-header h1").html();
            var stock = $(".availability-value .parameter-dependent:not(no-display) span").html();
            var amount = parseInt($(".add-to-cart .amount").val());
            var priceSingle = $(".price-final-holder:not(no-display)").html();
            var priceTotalInt = $(".price-final-holder:not(no-display)").html();
            var priceTotal = parseInt(priceTotalInt.split('<')[0]) * amount;

            $(".extras-wrap").prepend('<div class="extras-product">' + 
            '<div class="extras-product-img">' + img + '</div>' + 
            '<div class="extras-product-name">' + name + '</div>' +
            '<div class="extras-product-stock">' + stock + '</div>' +
            '<div class="extras-product-amount">' + amount + ' kus/ů</div>' +
            '<div class="extras-product-priceSingle">' + priceSingle + '</div>' +
            '<div class="extras-product-priceTotal">' + priceTotal + '</div>' +
            '</div>');

            $("#backToShop").remove();
            $(".extra.step").prepend("<div class='btn' id='backToShop'>Zpět do obchodu</div>");
            $(".advanced-order .extra.step .btn-conversion").text("Přejít do košíku");
            $(".advanced-order .h1").text("S radostí přidáno do vašeho košíku");
            $(".advanced-order .h1.advanced-order-suggestion").text("Co se vám ještě hodí");
            $("#backToShop").click(function(){
                $("#cboxClose").click();
            });
        }, 1000);
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

/* show add to cart section on scroll */
$(window).on('scroll', function() {
    scrollPosition = $(this).scrollTop();
    if (scrollPosition >= 1000) {
        $(".bottomCta").addClass("--active");
    }else{
        $(".bottomCta").removeClass("--active");
    }
});


// -----------------------------------------------------------------------------
// REGISTER PAGE
// -----------------------------------------------------------------------------

/* add points above form */
if ($(".in-registrace #register-form").length){
    $('<div class="register-points"><h4 class="register-points__title">Co získáte?</h4>'+
    '<span>Kompletní historii všech svých objednávek </span>'+
    '<span>Info o designových novinkách </span>'+
    '<span>Vyší slevy s každým dalším nákupem</span>'+
    '</div>').insertBefore("#register-form");


    $(".in-registrace .content-inner h1").text("Vybíráte u nás častěji? Rovnou se zaregistrujte");

    $("<p>Automaticky se stanete členem věrnostního programu rodiny Benlemi a budete sbírat slevy za každý svůj nákup.</p>").insertAfter(".in-registrace .content-inner h1");
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

if ($(".in-klient, .in-nastaveni, .in-objednavky, .in-klient-objednavky, .in-klient-slevy, .in-klient-hodnoceni, .in-klient-doklady, .in-klient-diskuze, .in-zapomenute-heslo").length){
    var name = $(".sidebar-inner ul li strong").text();
    $(".sidebar-inner strong").text(name + " v Benlemi");
    $(".in-klient .content-inner h1").text("Vítejte v naší rodině");
    $("<p>Patříte mezi nás. Proto můžete sbírat slevy, hodnotit produkty nebo si prohlížet své objednávky, kdykoliv se vám zachce.</p>").insertAfter(".in-klient .content-inner h1")
}

// -----------------------------------------------------------------------------
// FOOTER
// -----------------------------------------------------------------------------

if ($("#footer").length){
    $("#signature .title").text("Shoptet");
    $("#signature").prepend('<a href="https://benlemi.cz" class="title --benlemi">Vytvořili <img src="https://janheder.github.io/benlemi.cz/theme/dist/img/symbol-benlemi.svg" alt="Benlemi" class="image --benlemi"> Benlemi &</a>');
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

// -----------------------------------------------------------------------------
// LOGIN FORM
// -----------------------------------------------------------------------------

$("<span class='login-close'></span>").insertAfter(".user-action .login-widget .popup-widget-inner");
$(".login-close").click(function(){
    $("body").removeClass("user-action-visible login-window-visible");
});

if ($(".in-login").length){
    $(".content-inner > h1").text("Přihlaste se ke svému účtu");
    $("#formLogin .password-helper").prepend('<div class="login-form-points"><h4 class="login-form-register-title">Staňte se členem rodiny<br>Benlemi a získáte:</h4><div class="login-form-points-wrap">' +
    '<div class="login-form-point">slevy za každý svůj nákup</div>' +
    '<div class="login-form-point">kompletní přehled o objednávkách</div>' +
    '<div class="login-form-point">info o designových novinkách</div>' +
    '<div class="login-form-point">možnost hodnotit i debatovat</div>' +
    '</div></div>');

    $("#formLogin .password-helper a:last-child").text("Zapomněli jste heslo?").insertAfter(".login-wrapper button");
}