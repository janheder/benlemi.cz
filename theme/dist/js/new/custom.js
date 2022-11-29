

// -----------------------------------------------------------------------------
// PRODUCTS PAGE SHOW WATCHDOG
// -----------------------------------------------------------------------------

if ($('.availability-label[style="color: #cb0000"]').length) {

    $(".add-to-cart").css("display", "none");
    $(".link-icon.watchdog").css("display", "flex");
}


// -----------------------------------------------------------------------------
// PRODUCTS GENERAL PAGE
// -----------------------------------------------------------------------------

$(document).ready(function () {

    if ($(".in-produkty").length) {

        const loadProducts = (html) => {
            const nodes = new DOMParser().parseFromString(html, 'text/html');
            const body = nodes.querySelector('#categoriesSection');
            document.querySelector('.in-produkty #content article div').prepend(body);
        };
        fetch("/")
            .then((response) => response.text())
            .then(loadProducts)
    }
});


// -----------------------------------------------------------------------------
// GLOBAL
// -----------------------------------------------------------------------------

/* remove native shoptet scroll function - bugs */
if ($("[data-force-scroll]").length) {
    $("[data-force-scroll]").each(function () {
        $(this).removeAttr("data-force-scroll");
    });
}

/* anchor scroll setup */
$(document).ready(function () {
    $('a[href*="#"]').click(function (event) {
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
                }, 1000, function () {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
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

$(function () {
    var header = $("#header");
    header.addClass("no-scroll");
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 0) {
            header.removeClass("no-scroll").addClass("scroll");
        }
        if (scroll <= 0) {
            header.removeClass("scroll").addClass("no-scroll");
        }
    });
});

$(function () {
    var header2 = $(".no-scroll");
    var scroll2 = $(window).scrollTop();
    if (scroll2 > 0) {
        header2.removeClass('no-scroll').addClass("scroll");
    }
    if (scroll < 0) {
        header2.removeClass("scroll").addClass('no-scroll');
    }
});


/* add search and user icons to header area */
$(".navigation-buttons").prepend('<div class="nav-search" id="js-searchToggle"></div><a href="/login" class="nav-user"></a>');

/* add hamburger menu on mobile */
$(".header-top").prepend('<div class="nav-menu-toggle" id="js-menuToggle"><span></span></div>');

/* toggle control of responsive menu */
$("#js-menuToggle").click(function () {
    $(".header-top").toggleClass("--active");
    $("body").toggleClass("--noScroll");
});


$(".menu-helper, .navigation-close").click(function () {
    $(".header-top").removeClass("--active");
    $("body").removeClass("--noScroll --showFilters");
});


/* relocate search 
$(".header-top .search-form input").prop("placeholder", g_searchPlaceholder);

$(".header-top .search").insertAfter("#navigation .menu-level-1");
*/

/* toggle show responsive searchbar */
$("#js-searchToggle").click(function () {
    $("#navigation .search").insertAfter(".navigation-buttons");
    if ($(".search").hasClass("--active")) {
        $(".search, #js-searchToggle").removeClass("--active");
        $(".header-top .search .form-control").blur();
    } else {
        $(".search, #js-searchToggle").addClass("--active");
        $(".header-top .search .form-control").focus();
    }
});

/* *WIP* override shoptet cart function on mobile */
if ($(window).width() < 991) {
    $(".cart-count").removeClass("toggle-window");
}

$(".cart-count").click(function () {
    window.location.href = '/' + g_cartUrl + '/';
});

/* toggle submenu overlay (faster than shoptet default function submenu-visible) */
$(".menu-level-1 .ext, .cart-count.full, .cart-widget").hover(
    function () {
        $("body").addClass("submenu-active");
    }, function () {
        $("body").removeClass("submenu-active");
    }
);

/* add header client section */
if ($(".popup-widget-inner h2").length) {
    $('<div class="navLinks"><a href="/login/?backTo=%2F" class="top-nav-button top-nav-button-login primary login toggle-window navLinks__link" data-target="login" rel="nofollow">' + g_login + '</a><a href="/' + g_registrationUrl + '/" class="navLinks__link">' + g_register + '</a><span class="navLinks__span">' + g_language + ':</span></div>').insertAfter(".nav-user");
} else {
    $('<div class="navLinks"><a href="/' + g_inClientUrl + '/" class="navLinks__link --user">' + g_userAccount + '</a><span class="navLinks__span">' + g_language + ':</span></div>').insertAfter(".nav-user");
}


/* rename user account */
var name = $(".popup-widget-inner p strong").text();
$(".navLinks__link.--user").text(g_logged + ": " + name);

/* add responsive link into menu */
$(".menu-level-1 > li.ext").each(function () {
    $(this).prepend('<div class="menu-item-responsive"></div>');
    var catLink = $(this).children('a').prop("href");
    $(this).find(".menu-level-2").prepend('<a class="menu-item-more" href="' + catLink + '">' + g_viewAll + '</a>')
});

$(".menu-item-responsive").click(function () {
    $(this).siblings(".menu-level-2").toggleClass("--active");
    $(".menu-level-2 img").unveil();
});


$(".user-action-cart").insertAfter(".header-top .cart-count");



// -----------------------------------------------------------------------------
// PRODUCT PAGE
// -----------------------------------------------------------------------------

if ($(".p-detail-inner .flag").length) {
    var p_tags = $(".p-detail-inner .flags-default").html();
    var p_tagsClean = "<div class='p-detail-tags'>" + p_tags + "</div>";

} else {
    var p_tagsClean = "<div class='p-detail-tags --hidden'></div>";
}

var p_name = $(".p-detail-inner-header h1").html();

if ($(".p-detail-inner .stars-wrapper").length) {
    var p_stars = $(".p-detail-inner .stars-wrapper").html();
} else {
    var p_stars = "";
}

var p_code = $(".p-detail-inner-header .p-code").html();



if ($(".flag.flag-premium").length) {
    var p_tagPremium = $(".flag.flag-premium").html()
    var p_tagPremiumClean = "<span class='flag flag-premium'>" + p_tagPremium + "</span>";
}
else if ($(".flag.flag-exclusive").length) {
    var p_tagPremium = $(".flag.flag-exclusive").html()
    var p_tagPremiumClean = "<span class='flag flag-exclusive'>" + p_tagPremium + "</span>";
}
else {
    var p_tagPremiumClean = "<span class='flag flag-premium --hidden'></span>";
}

$(p_tagsClean + "<div class='p-detail-header'><h1>" + p_name + "</h1></div><div class='p-detail-subheader'>" + p_tagPremiumClean + p_stars + "<span class='p-code'>" + p_code + "</span></div>").insertBefore(".p-final-price-wrapper");





/* make advanced parameters required */
if ($(".advanced-parameter").length) {
    $(".advanced-parameter input").prop("required", true);
    $(".hidden-split-parameter[data-parameter-name='Barva'] span input").prop("required", true).removeAttr("checked");
}


/* load shop rating */
if ($(".type-detail").length) {
    $("#ratingTab").wrapInner("<div id='ratingProduct'></div>");
    $("#ratingTab").append("<div id='ratingStore'></div>");

    $("#ratingProduct").prepend("<h1>" + g_productRating + "</h1>");

    $("#ratingTab #ratingStore").load("/" + g_ratingUrl + "/ .content-inner", function () {
        $("<a href='/" + g_ratingUrl + "' class='btn btn-secondary' id='js-ratingStoreToggle'>" + g_addRating + "</div>").insertBefore("#ratingStore #rate-form");
        $("<a href='/" + g_ratingUrl + "' class='btn btn-secondary'>" + g_moreRating + "</a>").insertAfter("#ratingStore .content-inner>.votes-wrap");
        /*
        $("#js-ratingStoreToggle").click(function(){
            $("#ratingStore #rate-form").addClass("--active");
            $(this).addClass("--hide");
        });
        */

        $(".rate-wrapper .vote-form .vote-form-title").click(function () {
            $(".vote-form-title + #formRating").addClass("--active");
            $(this).addClass("--hide");
        });
    });
}

/* click on modal overlay closes the whole modal window */
$("#closeModal").click(function () {
    $("#cboxOverlay").click();
});

/* related products setup */
$(".products-related-header, .products-related").wrapAll("<div id='productsRelated'>");
$("#p-detail-tabs").append('<li class="shp-tab"><a href="#productsRelated" class="shp-tab-link" role="tab" data-toggle="tab">' + g_related + '</a></li>');

/* make variant selects required */
if ($(".hidden-split-parameter").length) {
    $(".hidden-split-parameter").each(function () {
        $(this).prop('required', true);
    });
}

/* remove scroll function from tabs */
if ($("#p-detail-tabs").length) {
    $("#p-detail-tabs .shp-tab-link").each(function () {
        $(this).removeAttr("data-toggle");
    });
}

/* relocate video */
if ($("#productVideos").length) {
    $("#productVideos").appendTo(".p-thumbnails-wrapper");
}

/* add "show more" button to thumbnails */
if ($(".p-thumbnails-wrapper").length) {
    $(".p-thumbnails-inner > div > a:last-child").after('<div id="thumbnailsShowMore"><div class="thumbnailsShowMore-inner">' + g_viewAll + '</div></div>');
}
$("#thumbnailsShowMore").click(function () {
    $(".p-thumbnails-inner").toggleClass("--active");
    window.scrollBy(0, 1);
});

/* reloace related product before rating */
$("#productsRelated").insertBefore("#productDiscussion");

/* Description hooks changes */
$(".basic-description").attr('id', 'descriptionLong');
$('#p-detail-tabs a[href="#description"]').attr('href', '#descriptionLong');
$("#p-detail-tabs").prepend('<li class="shp-tab"><a href="#description" class="shp-tab-link" role="tab">' + g_specifications + '</a></li>');

/* Rename decription link */
$('.p-info-wrapper a[href="#description"]').text(g_showMoreInfo);



/* relocate standard price */
$(document).ready(function () {
    if ($(".p-final-price-wrapper .price-standard").length) {
        $(".p-final-price-wrapper .price-standard").insertBefore(".p-final-price-wrapper .price-final-holder:first-child");
    }
});



/* rename titles */
if ($(".type-detail").length) {
    $(".extended-description h3").text(g_advantagesAndSpecifications);
    $(".products-related-header").text(g_similarFixturesAndFittings);
    $('a[href="#productsRelated"]').text(g_fixturesAndFittings);
}

/* add add to cart cta fixed on bottom of a page */
if ($(".type-detail").length) {
    var pName = $(".p-detail-inner-header h1").text();
    var pPrice = $(".p-final-price-wrapper .price-final").html();
    $('<div class="bottomCta"><div class="bottomCta__container"><div class="bottomCta__content"><div class="bottomCta__title">' + pName + '</div><div class="bottomCta__price">' + pPrice + '</div></div><div class="bottomCta__spinner"><input type="text" id="bottomCtaInput" value="1"><span class="increase"></span><span class="decrease"></span></div><div class="btn bottomCta__button" id="bottomCtaButton">' + g_addToCart + '</div></div></div>').insertBefore(".overall-wrapper");
    $("#bottomCtaInput").change(function () {
        var inputValue = $('#bottomCtaInput').val();
        $('.quantity input').val(inputValue);
    });
    $("#bottomCtaButton").click(function () {
        $('#product-detail-form').submit();
    });

    $(".bottomCta__spinner .increase").click(function () {

        var inputValue = parseInt($('#bottomCtaInput').val());
        $('.add-to-cart .amount, #bottomCtaInput').val(inputValue + 1);
    });
    $(".bottomCta__spinner .decrease").click(function () {

        var inputValue = parseInt($('#bottomCtaInput').val());
        if (inputValue > 1) {
            $('.add-to-cart .amount, #bottomCtaInput').val(inputValue - 1);
        }
    });

    $(".add-to-cart .increase").click(function () {
        var inputValue = parseInt($('.add-to-cart .amount').val());
        $('#bottomCtaInput').val(inputValue + 1);
    });
    $(".add-to-cart .decrease").click(function () {
        var inputValue = parseInt($('.add-to-cart .amount').val());
        if (inputValue > 1) {
            $('#bottomCtaInput').val(inputValue - 1);
        }
    });
}

$("#ratingProduct>p").text(g_beFirstToRateThisProduct);

/* rewrite description */
if ($(":lang(en) .type-detail").length) {
    if ($(".p-short-description").length) {

    } else {
        $("<div class='p-short-description'><p></p></div>").insertAfter(".add-to-cart");
        var desc = $("main #descriptionLong .rte p").text();
        var descTrim = desc.replace(/(([^\s]+\s\s*){40})(.*)/, "$1…");
        $(".p-short-description p").text(descTrim);
    }

}

/* show add to cart section on scroll */
$(window).on('scroll', function () {
    scrollPosition = $(this).scrollTop();
    if (scrollPosition >= 1000) {
        $(".type-detail").addClass("--bottomCtaActive");
    } else {
        $(".type-detail").removeClass("--bottomCtaActive");
    }
});

/* rename default delivery text */
$("#content .availability-value .default-variant").text(g_chooseOptionToSeeDeliveryTime);




/* remove parameters */
$('.detail-parameters tr th:contains("' + g_category + ':"), .detail-parameters tr th:contains("' + g_color + ':"), .detail-parameters tr th:contains("' + g_model + ':")').parents('tr').remove();

if ($('select[data-parameter-name="' + g_propositions + '"]').length) {
    $('.detail-parameters tr th:contains("' + g_propositions + ':")').parents('tr').remove();
}


/* videos */
if ($("#productVideos").length) {
    $("<div id='productVideosToggle'>Přehrát video</div>").insertAfter(".product-top .p-image #wrap");

    $("#productVideosToggle, #productVideos").click(function () {
        $("body").toggleClass("--showVideo");
    });
}

// -----------------------------------------------------------------------------
// INFOGRAPHICS
// -----------------------------------------------------------------------------

if ($("#relatedFiles").length) {

    $(".extended-description").append('<div class="description-infographics empty"><span>' + g_emptyInforgaphicsTitle + '</span></div>');


    if ($("#relatedFiles > li").length == 1) {
        $(".description-infographics").remove();
        var src = $('#relatedFiles a').attr("href");
        $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
        $(".description-infographics img").attr("src", src);
        $(".description-infographics a").attr("href", src);

    } else {
        function loadInfographics() {

            $(".description-infographics").remove();


            let pickedOptions = '';
            $('.variant-list select').each(function () {
                pickedOptions += $(this).find("option:selected").text().replace(/ cm/i, '').replace(/ x /i, 'x');
                pickedOptions += ";";

            });
            var pickedOptionsClean = pickedOptions.replace(/.$/, "");
            console.log(pickedOptionsClean);
            var src = $('#relatedFiles a[title*="' + pickedOptionsClean + '"]').attr("href");
            if (typeof src != 'undefined') {

                $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
                $(".description-infographics img").attr("src", src);
                $(".description-infographics a").attr("href", src);
            } else {
                $(".description-infographics").remove();
            }

        }


        document.addEventListener('shoptet.products.replaceImage', function () {
            loadInfographics();
        }, { passive: true });
    }

}


// -----------------------------------------------------------------------------
// REGISTER PAGE
// -----------------------------------------------------------------------------

/* add points above form */
if ($(".in-" + g_registrationUrl + " #register-form").length) {
    $('<div class="register-points"><h4 class="register-points__title">' + g_whatWillYouGet + '</h4>' +
        '<span>' + g_orderHistory + '</span>' +
        '<span>' + g_designNewsInformation + '</span>' +
        '<span>' + g_higherDiscountEveryPurchase + '</span>' +
        '</div>').insertBefore("#register-form");


    $(".in-" + g_registrationUrl + " .content-inner h1").text(g_frequentBuyerRegistration);

    $("<p>" + g_frequentBuyerRegistrationText + "</p>").insertAfter(".in-" + g_registrationUrl + " .content-inner h1");
}

// -----------------------------------------------------------------------------
// STORE RATING PAGE
// -----------------------------------------------------------------------------

/* add title to rating */
if ($("#rate-form").length) {
    $("#rate-form").prepend("<h3 class='vote-form-title'>" + g_addRating + "</h3>");
}



// -----------------------------------------------------------------------------
// ADD SEARCH ON MOBILE
// -----------------------------------------------------------------------------

$("#navigation .menu-level-1").prepend('<div class="nav-search --responsive" id="js-searchToggle-res">Hledat</div>');

$("#js-searchToggle-res").click(function () {

    $("#navigation .search").insertAfter(".navigation-buttons");

    if ($(".search").hasClass("--active")) {
        $(".search, #js-searchToggle-res").removeClass("--active");
        $(".header-top").removeClass("--active");
        $("body").removeClass("--searchActive");
        $("body").removeClass("--noScroll");
        $(".header-top .search .form-control").blur();

    } else {
        $(".search, #js-searchToggle-res").addClass("--active");
        $(".header-top").removeClass("--active");
        $("body").addClass("--searchActive");
        $("body").removeClass("--noScroll");
        $(".header-top .search .form-control").focus();
    }
});


// -----------------------------------------------------------------------------
// BLOG
// -----------------------------------------------------------------------------

/* load blog posts into blog page main section */
if ($(".blogCategories").length) {

    $(".blogCategories .blogCategories__bydleni .news-wrapper").load("/" + category1Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function () {
        $("<h2 class='blogCategories__sectionTitle'>" + category1 + "</h2>").insertBefore(".blogCategories .blogCategories__bydleni");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category1Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__bydleni .blogCategories__section .news-item:nth-child(2)");
    });

    $(".blogCategories .blogCategories__rodina .news-wrapper").load("/" + category2Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function () {
        $("<h2 class='blogCategories__sectionTitle'>" + category2 + "</h2>").insertBefore(".blogCategories .blogCategories__rodina");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category2Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__rodina .blogCategories__section .news-item:nth-child(2)");
    });

    $(".blogCategories .blogCategories__novinky .news-wrapper").load("/" + category3Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function () {
        $("<h2 class='blogCategories__sectionTitle'>" + category3 + "</h2>").insertBefore(".blogCategories .blogCategories__novinky");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category3Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__novinky .blogCategories__section .news-item:nth-child(2)");
    });

    $(".blogCategories .blogCategories__benlemi-pomaha .news-wrapper").load("/" + category4Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function () {
        $("<h2 class='blogCategories__sectionTitle'>" + category4 + "</h2>").insertBefore(".blogCategories .blogCategories__benlemi-pomaha");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category4Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__benlemi-pomaha .blogCategories__section .news-item:nth-child(2)");
    });

    $('<p style="text-align: center;">' + g_blogText + '</p>').insertAfter(".type-posts-listing .content-inner h1");

}

// -----------------------------------------------------------------------------
// USER PROFILE
// -----------------------------------------------------------------------------

if ($(".logout").length) {
    $(".logout").insertAfter(".client-center-box");

    $("<div class='client-contact-box'></div>").insertAfter(".client-center-box + .logout");

    $(".client-contact-box").load("/" + g_cart1Url + "/ .checkout-box");
}

if ($(".in-" + g_inClientUrl + ", .in-" + g_inSettingsUrl + ", .in-" + g_inOrdersUrl + ", .in-" + g_inClientOrdersUrl + ", .in-" + g_inClientSaleUrl + ", .in-" + g_inClientRatingUrl + ", .in-" + g_inClientDocumentsUrl + ", .in-" + g_inClientDiscussionUrl + ", .in-" + g_inForgotPasswordUrl).length) {
    var name = $(".sidebar-inner ul li strong").text();
    $(".sidebar-inner strong").text(name + " " + g_inBenlemi);
    $(".in-" + g_inClientUrl + " .content-inner h1").text(g_welcomeTitle);
    $("<p>" + g_welcomeText + "</p>").insertAfter(".in-" + g_inClientUrl + " .content-inner h1")
}

// -----------------------------------------------------------------------------
// FOOTER
// -----------------------------------------------------------------------------

if ($("#footer").length) {

    $("#signature").html('<a href="https://benlemi.cz" class="title --benlemi" rel="noreferrer noopener">' + g_madeBy + ' <img src="https://www.benlemi.cz/user/documents/theme/dist/img/symbol-benlemi.svg" alt="Benlemi" class="image --benlemi"> Benlemi &</a><a href="https://www.shoptet.cz/" title="Vytvořil Shoptet" class="title" target="_blank" rel="noreferrer noopener"><img src="https://cdn.myshoptet.com/prj/2e0fa726/master/cms/img/shoptetLogo128x128.gif" width="" height="" alt="Shoptet.cz" class="image --benlemi">Shoptet</a>');
}

// -----------------------------------------------------------------------------
// RATING STORE PAGE
// -----------------------------------------------------------------------------

$(".vote-form-title").click(function () {
    $(".vote-form-title+#formRating").addClass("--active");
    $(this).addClass("--hide");
});

// -----------------------------------------------------------------------------
// LOGIN FORM
// -----------------------------------------------------------------------------

$("<span class='login-close'></span>").insertAfter(".user-action .login-widget .popup-widget-inner");
$(".login-close").click(function () {
    $("body").removeClass("user-action-visible login-window-visible");
});

if ($(".in-login").length) {
    $(".content-inner > h1").text(g_loginToYourAccount);
    $("#formLogin .password-helper").prepend('<div class="login-form-points"><h4 class="login-form-register-title">' + g_becomeMember + '</h4><div class="login-form-points-wrap">' +
        '<div class="login-form-point">' + g_discountForEachPurchase + '</div>' +
        '<div class="login-form-point">' + g_completeOverviewOfYourOrders + '</div>' +
        '<div class="login-form-point">' + g_designNewsInformation + '</div>' +
        '<div class="login-form-point">' + g_possibilityToRateAndDiscuss + '</div>' +
        '</div></div>');

    $("#formLogin .password-helper a:last-child").text(g_forgotPassword).insertAfter("#formLogin .login-wrapper button");
}

// -----------------------------------------------------------------------------
// VOICE SEARCH
// -----------------------------------------------------------------------------

$("#formSearchForm .query-input").attr("id", "searchbox");
$("<div id='speechToggle' onclick='startDictation()'></div>").insertBefore(".search-form .btn");

function startDictation() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var recognition = new webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.lang = "cs-CZ";
        recognition.start();

        recognition.onresult = function (e) {
            document.getElementById('searchbox').value = e.results[0][0].transcript;
            recognition.stop();
            document.getElementById('formSearchForm').submit();
        };

        recognition.onerror = function (e) {
            recognition.stop();
        }
    }
}

// -----------------------------------------------------------------------------
// REMOVE PHONE VALIDATION AND ADD CUSTOM FUNCTION TO COUNTRY SELECT
// -----------------------------------------------------------------------------

$(document).ready(function () {
    $("#phone").removeClass("js-validate-phone");

    $(".country-flag").on("click", function () {
        $(".country-flag").removeClass("selected");
        $(this).addClass("selected");
    });
});


// =============================================================================
// REFACTORED PAGIANTION
// =============================================================================

if ($(".pagination").length) {

    function refactorPagi() {
        var current = parseInt($(".pagination .current").text());
        var max = parseInt($(".pagination > *:last-child").text());
        var currentUrl = window.location.href.split('?')[0];
        var currentUrlS = currentUrl.slice(0, currentUrl.indexOf('/strana'));

        $(".pagination *").remove();

        for (var i = 1; i <= max; i++) {
            if (i == current) {
                $('.pagination').append("<strong class='current'>" + i + "</strong>");
            } else if ((current - i) > 1 || (i - current) > 1) {
                if (i == 1 || i == max) {
                    $('.pagination').append("<a href='" + currentUrlS + "/strana-" + i + "'>" + i + "</a>");
                } else {
                    $('.pagination').append("<a class='hidden' href='" + currentUrlS + "strana-" + i + "'>" + i + "</a>");
                }

            } else {
                $('.pagination').append("<a href='" + currentUrlS + "/strana-" + i + "'>" + i + "</a>");
            }
        }
        if (current != max) {
            $(".pagination").append("<a href='" + currentUrlS + "/strana-" + (current + 1) + "' class='next'>></a>");
        }
        if (current != 1) {
            $(".pagination").prepend("<a href='" + currentUrlS + "/strana-" + (current - 1) + "' class='previous'><</a>");
        }
    }

    refactorPagi();

    document.addEventListener('ShoptetDOMPageContentLoaded', function () {
        refactorPagi();
    }, { passive: true });

    document.addEventListener('ShoptetDOMPageMoreProductsLoaded', function () {
        refactorPagi();
    }, { passive: true });
}


// =============================================================================
// FAQ
// =============================================================================

$(document).ready(function () {

    $('#faqSearch').keyup(function (e) {
        var s = $(this).val().trim();
        if (s === '') {
            $('#FaqResult *').show();
            $('#FaqResult details').attr("open", false);
            return true;
        }
        $('#FaqResult details:not(:contains(' + s + '))').hide();
        $('#FaqResult h2:not(:contains(' + s + '))').hide();
        $('#FaqResult details:contains(' + s + ')').show();
        $('#FaqResult details:contains(' + s + ')').attr("open", true);
        return true;
    });

});



// =============================================================================
// tooltip for advanced parameters 
// =============================================================================

$(document).ready(function () {
    if ($(".advanced-parameter").length) {
        $(".advanced-parameter").each(function () {
            var tooltip = $(this).find(".parameter-value").text();
            $(this).append("<div class='advanced-parameter-tooltip'>" + tooltip + "</div>")
        });
    }
});



// =============================================================================
// FOOTER REVEAL CATEGORIES
// =============================================================================

$("#footer .custom-footer > div h4").click(function () {
    $(this).toggleClass("--active");
});



$(".in-kosik .related-title").click(function () {
    $(this).toggleClass("--active");
    $("img").unveil();
});



// =============================================================================
// HEADER OPENING HOURS ICON
// =============================================================================

var today = new Date().getHours();
if (today >= 9 && today <= 16) {
    $(".project-phone").addClass("--online");
}



// =============================================================================
// load cart images 
// =============================================================================

if ($("#checkoutSidebar .cart-item").length) {
    const loadPicImages = (html) => {
        const nodes = new DOMParser().parseFromString(html, 'text/html');
        const body = nodes.querySelectorAll('.cart-p-image a');
        const num = nodes.querySelectorAll('.cart-p-image a').length;
        for (var i = 0; i < num; i++) {
            document.querySelector('#checkoutSidebar .cart-item:nth-child(' + (i + 1) + ')').prepend(body[i]);
        }
        $("img").unveil();
    };
    fetch("/kosik/")
        .then((response) => response.text())
        .then(loadPicImages)
        .then($("img").unveil())
}

// =============================================================================
// nav redesign
// =============================================================================


if ($(":lang(cs)").length) {
    $('<div class="main-header-nav"><a href="/nabytek">Produkty</a>').insertAfter(".header-top > div:nth-child(2)");
    $('#navigation .menu-item-3951, #navigation .menu-item-3978, #navigation .menu-item-2960, #navigation .menu-item-1395').insertAfter(".main-header-nav a");
}
if ($(":lang(sk)").length) {
    $('<div class="main-header-nav"><a href="/produkty">Produkty</a>').insertAfter(".header-top > div:nth-child(2)");
    $('#navigation .menu-item-3756, #navigation .menu-item-3768, #navigation .menu-item-1386, #navigation .menu-item-3002').insertAfter(".main-header-nav a");
}
if ($(":lang(en)").length) {
    $('<div class="main-header-nav"><a href="/produkty">Products</a>').insertAfter(".header-top > div:nth-child(2)");
    $('#navigation .menu-item-1929, #navigation .menu-item-1959, #navigation .menu-item-1454, #navigation .menu-item-1276').insertAfter(".main-header-nav a");
}
if ($(":lang(ro)").length) {
    $('<div class="main-header-nav"><a href="/produkty">Products</a>').insertAfter(".header-top > div:nth-child(2)");
    $('#navigation .menu-item-1895, #navigation .menu-item-1952, #navigation .menu-item-1454, #navigation .menu-item-1276').insertAfter(".main-header-nav a");
}

$(".main-header-nav>li").hover(function () {
    $("img").unveil();
});

// =============================================================================
// remove cart phone validation
// =============================================================================


$(document).ready(function () {

    $(".cart-content #phone, .co-registration #phone").removeClass("js-validate-phone js-validate js-validate-required js-error-field js-phone-form-control js-validated-field");
    $(".cart-content #phone, .co-registration #phone").attr("disabled", false);
    $(".cart-content #phone, .co-registration #phone").change(function () {
        $(this).removeClass("js-validate-phone js-validate js-validate-required js-error-field js-phone-form-control js-validated-field");
        $(this).attr("disabled", false);
    });


});


// =============================================================================
// CZ SCRIPTS
// =============================================================================


if ($(":lang(cs)").length) {

    $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
    $("#userCheck").load("/klient/klient-slevy/ .content-inner table tr:first-child strong", function () {

        var userCheck = $("#userCheck strong").text();
        if ((userCheck == "CZ-B2B") || (userCheck == "CZ-B2BPLUS") || (userCheck == "CZ-B2B-DPH") || (userCheck == "CZ-B2BPLUS-DPH")) {

            $('<div class="form-group" style="flex-direction:column;"><label for="post_phone">Doručovací telefon:</label><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">(Vložte telefonní číslo ve správném formátu, např.: +420776123456)</span><input type="text" id="post_phone" class="form-control"></div><div class="form-group" style="padding-bottom:20px;"><label for="post_email">Doručovací email:</label><input type="text" id="post_email" class="form-control"></div>').insertAfter('.co-shipping-address');

            $('#order-form').submit(function () {
                dosomething();
            });

            function dosomething() {
                var inputvalue = $("#post_phone").val();
                var inputvalue2 = $("#post_email").val();
                var orgvalue = $('#remark').val().split('<')[0];
                $('#remark').val("");
                if (inputvalue != '' && inputvalue2 == '') {
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>');
                } else if (inputvalue2 != '' && inputvalue == '') {
                    $('#remark').val(orgvalue + '<post_email>' + inputvalue2 + '</post_email>');
                } else if (inputvalue != '' && inputvalue2 != '') {
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>' + '<post_email>' + inputvalue2 + '</post_email>');
                } else {

                }
            }

        } else {

        }
    });

    $('.detail-parameters tr th:contains("Typ produktu:"), .detail-parameters tr th:contains("Věk dítěte:"), .detail-parameters tr th:contains("Tvar:"), .detail-parameters tr th:contains("Motiv:"), .detail-parameters tr th:contains("Pro model postele:"), .detail-parameters tr th:contains("Pro postel o délce:"), .detail-parameters tr th:contains("Pro postel o šířce:")').parents('tr').remove();


    $("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");


    if ($(".p-price.p-cell .show-tooltip.acronym").length) {
        $(".discount-coupon input[type='text'], .discount-coupon button").attr("disabled", "true");
        $("<span>Slevový kód nelze uplatnit v košíku, který obsahuje zlevněný produkt</span>").insertAfter(".discount-coupon button");
        $(".js-remove-form .btn-primary").click();
    }


    if ($(".login.toggle-window").length) {
        $(".headerFreeDeliveryNew").html("Registrujte se a sbírejte <br> slevy s každým svým nákupem");
    } else {
        $.get('/klient/klient-slevy/', function (data) {
            data = $(data).find('.content-inner table tr:last-child strong').html();
            $(".headerFreeDeliveryNew").html("Nyní máte <br>" + data + " slevu za věrnost");
        });

    }

}


// =============================================================================
// SK SCRIPTS
// =============================================================================

if ($(":lang(sk)").length) {

    $(document).ready(function () {


        $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
        $("#userCheck").load("/klient/klient-zlavy/ .content-inner table tr:first-child strong", function () {

            var userCheck = $("#userCheck strong").text();
            if ((userCheck == "SK-B2BPLUS") || (userCheck == "SK-B2B") || (userCheck == "SK-B2B-DPH") || (userCheck == "SK-B2BPLUS-DPH")) {

                $('<div class="form-group" style="flex-direction:column;"><label for="post_phone">Doručovací telefón:</label><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">(Vložte telefónne číslo v správnom formáte, napr.: +421776123456)</span><input type="text" id="post_phone" class="form-control"></div><div class="form-group" style="padding-bottom:20px;"><label for="post_email">Doručovací email:</label><input type="text" id="post_email" class="form-control"></div>').insertAfter('.co-shipping-address');

                $('#order-form').submit(function () {
                    dosomething();
                });

                function dosomething() {
                    var inputvalue = $("#post_phone").val();
                    var inputvalue2 = $("#post_email").val();
                    var orgvalue = $('#remark').val().split('<')[0];
                    $('#remark').val("");
                    if (inputvalue != '' && inputvalue2 == '') {
                        $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>');
                    } else if (inputvalue2 != '' && inputvalue == '') {
                        $('#remark').val(orgvalue + '<post_email>' + inputvalue2 + '</post_email>');
                    } else if (inputvalue != '' && inputvalue2 != '') {
                        $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>' + '<post_email>' + inputvalue2 + '</post_email>');
                    } else {

                    }
                }

            } else {

            }
        });

    });


    $(".in-krok-2 .next-step button").text("Odoslať objednávku");


    $("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");



    if ($(".p-price.p-cell .show-tooltip.acronym").length) {
        $(".discount-coupon input[type='text'], .discount-coupon button").attr("disabled", "true");
        $("<span>Zľavový kód nemožno uplatniť na zľavnené produkty</span>").insertAfter(".discount-coupon button");
        $(".js-remove-form .btn-primary").click();
    }


    if ($(".login.toggle-window").length) {
        $(".headerFreeDeliveryNew").html("Registrujte sa a zbierajte <br> zľavy s každým svojim nákupom");
    } else {
        $.get('/klient/klient-zlavy/', function (data) {
            data = $(data).find('.content-inner table tr:last-child strong').html();
            $(".headerFreeDeliveryNew").html("Teraz máte <br>" + data + " zľavu za vernosť");
        });

    }

    $('.detail-parameters tr th:contains("Rozměr:"), .detail-parameters tr th:contains("Tvar:")').parents('tr').remove();


}



// =============================================================================
// EN SCRIPTS
// =============================================================================

if ($(":lang(en)").length) {


    $(document).ready(function () {

        $("#companyId").removeClass("js-validate-company-id");

        $('label[for="companyId"]').text("ID");
        $('label[for="vatId"]').text("VAT");



        if ($(".p-price.p-cell .show-tooltip.acronym").length) {
            $(".discount-coupon input[type='text'], .discount-coupon button").attr("disabled", "true");
            $("<span>The discount code cannot be applied to discounted products</span>").insertAfter(".discount-coupon button");
            $(".js-remove-form .btn-primary").click();
        }


        $(".payment-shipping-price.for-free").text("Please find in our invoice");

    });

    /* cart phone validation */
    $(document).ready(function () {


        if ($(".removeable .show-tooltip").length) { $(".applied-coupon .btn").click(); }

    });



    $('<div class="form-group"><label for="post_phone">CUSTOMER´S phone num.:</label><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">(INSERT PHONE NU IN CORRECT FORMAT - NO GAPS: +420776123456)</span><input type="text" id="post_phone" class="form-control"><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">* &#xFEFF;&#xFEFF;The telephone number is used by the transport services that require it for dispatch from the Czech Republic.</span></div><div class="form-group" style="padding-bottom:20px;"><label for="post_email">CUSTOMER´S email address:</label><input type="text" id="post_email" class="form-control"></div>').insertBefore('#remark');


    $('<span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">* &#xFEFF;&#xFEFF;The telephone number is used by the transport services that require it for dispatch from the Czech Republic.</span>').insertAfter("#checkoutContent .phone-combined-input");

    $('#order-form').submit(function () {
        dosomething();
    });


    function dosomething() {
        var inputvalue = $("#post_phone").val();
        var inputvalue2 = $("#post_email").val();
        var orgvalue = $('#remark').val().split('<')[0];
        $('#remark').val("");
        if (inputvalue != '' && inputvalue2 == '') {
            $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>');
        } else if (inputvalue2 != '' && inputvalue == '') {
            $('#remark').val(orgvalue + '<post_email>' + inputvalue2 + '</post_email>');
        } else if (inputvalue != '' && inputvalue2 != '') {
            $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>' + '<post_email>' + inputvalue2 + '</post_email>');
        } else {

        }

    }

    $("#note").insertBefore("#shipping-address .co-shipping-address > .form-group:last-child");

    $("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");

    if ($(".login.toggle-window").length) {
        $(".headerFreeDeliveryNew").html("Register and collect <br> discounts with every purchase");
    } else {
        $.get('/client-center/client-discounts/', function (data) {
            data = $(data).find('.content-inner table tr:last-child strong').html();
            $(".headerFreeDeliveryNew").html("Now you have discounts with every purchase");
        });

    }


    $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
    $("#userCheck").load("/client-center/client-discounts/ .content-inner table tr:first-child strong", function () {

        var userCheck = $("#userCheck strong").text();

        if ((userCheck == "Koncový zákazík_COM") || (userCheck == "")) { } else {
            $("body").addClass("wholesale");
            $(".in-step-2 #billCountryId").attr("disabled", false);
            $(".in-step-2 #shipping-address").addClass("visible");
            $(".in-step-2 #another-shipping").prop("checked", true);

            $(".co-billing-address fieldset>.form-group:last-child").load("/client-center/my-account-settings/ #additionalInformation fieldset .form-group:last-child", function () {
                var id = $(".co-billing-address #billCountryId option:selected").attr("value");
                $('<input type="hidden" name="billCountryId" id="billCountryIdInput" value="' + id + '" disabled="disabled">').insertAfter(".co-billing-address #billCountryId");
            });
        }

        if ((userCheck == "COM-B2B") || (userCheck == "COM-B2BPLUS")) {
            $("#shipping-61").css("display", "none");
            $("#shipping-61 input").prop('checked', false);

            $("#shipping-141").css("display", "flex");
        }

        if ((userCheck == "COM-B2B-DPH") || (userCheck == "COM-B2BPLUS-DPH")) {
            $("#shipping-141").css("display", "none"); // hide transport without vat
            $("#shipping-141 input").prop('checked', false);

            $("#shipping-61").css("display", "flex");
        }
    });


    $("<div id='userGroup' style='visibility:hidden'></div>").insertAfter("footer"); $("#userGroup").load("/client-center/client-discounts/ .content-inner table tr:first-child strong", function () {
        var userGroup = $("#userGroup strong").text();
        if (userGroup.includes("B2B")) {
            $("body").addClass("velkoobchod");
        }
    });


}


// =============================================================================
// RO SCRIPTS
// =============================================================================

if ($(":lang(ro)").length) {
    $("#billHouseNumber").remove(); $("label[for='billHouseNumber']").text("Județ"); $('<select id="" name="billHouseNumber" class="form-control short" data-warning="true" required=""> <option value="| Alba">Alba</option> <option value="| Arad">Arad</option> <option value="| Arges">Arges</option> <option value="| Bacau">Bacau</option> <option value="| Bihor">Bihor</option> <option value="| Bistrita-Nasaud">Bistrita-Nasaud</option> <option value="| Botosani">Botosani</option> <option value="| Braila">Braila</option> <option value="| Brasov">Brasov</option> <option value="| Bucuresti">Bucuresti</option> <option value="| Buzau">Buzau</option> <option value="| Calarasi">Calarasi</option> <option value="| Caras-Severin">Caras-Severin</option> <option value="| Cluj">Cluj</option> <option value="| Constanta">Constanta</option> <option value="| Covasna">Covasna</option> <option value="| Dambovita">Dambovita</option> <option value="| Dolj">Dolj</option> <option value="| Galati">Galati</option> <option value="| Giurgiu">Giurgiu</option> <option value="| Gorj">Gorj</option> <option value="| Harghita">Harghita</option> <option value="| Hunedoara">Hunedoara</option> <option value="| Ialomita">Ialomita</option> <option value="| Iasi">Iasi</option> <option value="| Ilfov">Ilfov</option> <option value="| Maramures">Maramures</option> <option value="| Mehedinti">Mehedinti</option> <option value="| Mures">Mures</option> <option value="| Neamt">Neamt</option> <option value="| Olt">Olt</option> <option value="| Prahova">Prahova</option> <option value="| Salaj">Salaj</option> <option value="| Satu Mare">Satu Mare</option> <option value="| Sibiu">Sibiu</option> <option value="| Suceava">Suceava</option> <option value="| Teleorman">Teleorman</option> <option value="| Timis">Timis</option> <option value="| Tulcea">Tulcea</option> <option value="| Valcea">Valcea</option> <option value="| Vaslui">Vaslui</option> <option value="| Vrancea">Vrancea</option></select>').insertAfter("label[for='billHouseNumber']");

    $("#billStreet").attr("id", "");

    $("label[for='billStreet']").text("Strada și numărul");

    /* remove parameters */
    $('.detail-parameters tr th:contains("Categorie:"), .detail-parameters tr th:contains("Tipul de produs:")').parents('tr').remove();
    
    /* cart coupon */
    $(document).ready(function () {

        if ($(".p-price.p-cell .show-tooltip.acronym").length) {

            $(".discount-coupon input[type='text'], .discount-coupon button").attr("disabled", "true");
            $("<span>Codul de reducere nu poate fi aplicat intr-un coș care conține un produs la reducere.</span>").insertAfter(".discount-coupon button");

        }

    });


    $("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");

    if ($(".login.toggle-window").length) {
        $(".headerFreeDeliveryNew").html("Înregistrați-vă și aveți o reducere de <br> 3% la prima achiziție");
    } else {
        $.get('/centru-clienti/reducerile-mele/', function (data) {
            data = $(data).find('.content-inner table tr:last-child strong').html();
            $(".headerFreeDeliveryNew").html("Aveți o reducere de <br>" + data + " la achiziție");
        });

    }


    $("<div id='userCheck'></div>").insertAfter("#checkoutSidebar");

    $("#userCheck").load("/centru-clienti/reducerile-mele/ .content-inner table tr:first-child strong", function () {

        var userCheck = $("#userCheck strong").text();
        if ((userCheck == "Koncový zákazík_RO") || (userCheck == "")) {

        } else {
            $("body").addClass("wholesale");
            $(".in-comanda-informatii-despre-dvs #billCountryId").attr("disabled", false);
            $(".in-comanda-informatii-despre-dvs #shipping-address").addClass("visible");
            $(".in-comanda-informatii-despre-dvs #another-shipping").prop("checked", true);


            $(".co-billing-address fieldset>.form-group:last-child").load("/centru-clienti/configurarea-contului-meu/ #additionalInformation fieldset .form-group:last-child", function () {
                var id = $(".co-billing-address #billCountryId option:selected").attr("value");
                $('<input type="hidden" name="billCountryId" id="billCountryIdInput" value="' + id + '" disabled="disabled">').insertAfter(".co-billing-address #billCountryId");

            });

        }
    });
}


// =============================================================================
// HU SCRIPTS
// =============================================================================

if ($(":lang(hu)").length) {
    if ($(".in-aludjon-egeszsegugyi-matracon, .in-aludjon-egeszsegugyi-matracon").length) {
        var img = $("#relatedFiles a").attr("href");
        $(".extended-description").append('<div class="description-infographics-matrace"><img src="' + img + '"></div>')
    }

    /* remove parameters */
    $('.detail-parameters tr th:contains("Kategória:"), .detail-parameters tr th:contains("Modell:")').parents('tr').remove();

    /* cart coupon */
    $(document).ready(function () {

        if ($(".p-price.p-cell .show-tooltip.acronym").length) {

            $(".discount-coupon input[type='text'], .discount-coupon button").attr("disabled", "true");
            $("<span>A kedvezmény kód nem alkalmazható olyan kosárra, amely leárazott terméket tartalmaz.</span>").insertAfter(".discount-coupon button");

        }
    });

    $("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");

    if ($(".login.toggle-window").length) {
        $(".headerFreeDeliveryNew").html("Regisztráljon, és <br> 3% kedvezményt kap az első vásárláskor");
    } else {
        $.get('/ugyfel/ugyfel-kedvezmenyek/', function (data) {
            data = $(data).find('.content-inner table tr:last-child strong').html();
            $(".headerFreeDeliveryNew").html("Most " + data + "<br> kedvezményben részesül a vásárlásból");
        });

    }
}