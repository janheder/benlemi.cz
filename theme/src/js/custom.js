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
        var tel = $("#footer .tel").text();
    }else{
        var mail = $(".contact-box .mail a").text().replace(/\s/g,'');
        var tel = $(".contact-box  .tel").text();
    }
    $('<div class="header-contacts">'+
    '<a href="tel:' + tel + '">' + tel + '</a>'+
    '<a href="mailto:' + mail + '">' + mail + '</a>'+
    '</div>').insertBefore(".navigation-buttons");

    if($("html:lang(en)").length){
        $(".header-contacts").append('<span>Mon–Fri 8:30 a.m.– 4:00 p.m</span>');
    }
    if($("html:lang(ro)").length){
        $(".header-contacts").append('<span>Luni-Vineri 8:30 – 16:00</span>');
    }
    if($("html:lang(hu)").length){
        $(".header-contacts").append('<span>hétfő-péntek 8:30 – 16:00</span>');
    }
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
$(".header-top .search-form input").prop("placeholder", g_searchPlaceholder);

$(".header-top .search").insertAfter("#navigation .menu-level-1");


/* toggle show responsive searchbar */
$("#js-searchToggle").click(function(){
    $("#navigation .search").insertAfter(".navigation-buttons");
    if($(".search").hasClass("--active")){
        $(".search, #js-searchToggle").removeClass("--active");
        $(".header-top .search .form-control").blur();  
    }else{
        $(".search, #js-searchToggle").addClass("--active");
        $(".header-top .search .form-control").focus(); 
    }
});

/* *WIP* override shoptet cart function on mobile */
if ($(window).width() < 991) {
    $(".cart-count").removeClass("toggle-window");
 }

$(".cart-count").click(function(){
    window.location.href='/' + g_cartUrl + '/';
});

/* toggle submenu overlay (faster than shoptet default function submenu-visible) */
$(".menu-level-1 .ext, .cart-count.full, .cart-widget").hover(
    function(){
        $("body").addClass("submenu-active");
    },function(){
        $("body").removeClass("submenu-active");
    }
);

/* add header client section */
if ($(".popup-widget-inner h2").length){
    $('<div class="navLinks"><a href="/login/?backTo=%2F" class="top-nav-button top-nav-button-login primary login toggle-window navLinks__link" data-target="login" rel="nofollow">' + g_login + '</a><a href="/' + g_registrationUrl + '/" class="navLinks__link">' + g_register + '</a><span class="navLinks__span">' + g_language + ':</span></div>').insertAfter(".nav-user");
}else{
    $('<div class="navLinks"><a href="/' + g_inClientUrl + '/" class="navLinks__link --user">' + g_userAccount + '</a><span class="navLinks__span">' + g_language + ':</span></div>').insertAfter(".nav-user");
}

/* language toggle */
if ($(":lang(cs)").length){
    $(".navLinks").append('<div class="language-toggle" id="js-langToggle"> <div> <div class="language-toggle-item cz active">Česky</div> <a href="https://benlemi.sk" class="language-toggle-item sk">Slovensky</a> <a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a> <a href="https://benlemi.ro" class="language-toggle-item ro">Rumunsky</a> <a href="https://benlemi.hu" class="language-toggle-item hu">Maďarsky</a> </div></div>');
    $("#js-langToggle").click(function(){
        $("#js-langToggle").toggleClass("--active");
    });
} 
else if($(":lang(sk)").length){
    $(".navLinks").append('<div class="language-toggle" id="js-langToggle"> <div> <div class="language-toggle-item sk active">Česky</div> <a href="https://benlemi.cz" class="language-toggle-item cz">Česky</a> <a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a> <a href="https://benlemi.ro" class="language-toggle-item ro">Rumunsky</a> <a href="https://benlemi.hu" class="language-toggle-item hu">Maďarsky</a> </div></div>');
    $("#js-langToggle").click(function(){
        $("#js-langToggle").toggleClass("--active");
    });
}
else if($("html:lang(en)").length){
    $(".navLinks").append('<div class="language-toggle" id="js-langToggle"> <div> <div class="language-toggle-item com active">English</div> <a href="https://benlemi.cz" class="language-toggle-item cz">Czech</a> <a href="https://benlemi.sk" class="language-toggle-item sk">Slovak</a> <a href="https://benlemi.ro" class="language-toggle-item ro">Romanian</a> <a href="https://benlemi.hu" class="language-toggle-item hu">Hungarian</a> </div></div>');
    $("#js-langToggle").click(function(){
        $("#js-langToggle").toggleClass("--active");
    });
}
else if($("html:lang(ro)").length){
    $(".navLinks").append('<div class="language-toggle" id="js-langToggle"> <div> <div class="language-toggle-item ro active">Română</div> <a href="https://benlemi.cz" class="language-toggle-item cz">Ceh</a> <a href="https://benlemi.sk" class="language-toggle-item sk">Slovacă</a> <a href="https://benlemi.com" class="language-toggle-item com">Engleză</a> <a href="https://benlemi.hu" class="language-toggle-item hu">Maghiară</a> </div></div>');
    $("#js-langToggle").click(function(){
        $("#js-langToggle").toggleClass("--active");
    });
}
else if($("html:lang(hu)").length){
    $(".navLinks").append('<div class="language-toggle" id="js-langToggle"> <div> <div class="language-toggle-item hu active">Magyar</div> <a href="https://benlemi.cz" class="language-toggle-item cz">Cseh</a> <a href="https://benlemi.sk" class="language-toggle-item sk">Szlovák</a> <a href="https://benlemi.com" class="language-toggle-item com">Angol</a> <a href="https://benlemi.ro" class="language-toggle-item ro">Román</a> </div></div>');
    $("#js-langToggle").click(function(){
        $("#js-langToggle").toggleClass("--active");
    });
}else{

}



/* relocate site message */
if ($(".site-msg").length){
    if ($(".breadcrumbs").length){
        $(".site-msg").insertBefore(".breadcrumbs");
    } 
    if ($(".before-carousel").length){
        $(".site-msg").insertAfter("#header");
    } 
}

/* rename user account */
var name = $(".popup-widget-inner p strong").text();
$(".navLinks__link.--user").text(g_logged + ": " + name);

/* add responsive link into menu */
$(".menu-level-1 > li.ext").each(function() {
    $(this).prepend('<div class="menu-item-responsive"></div>');
    var catLink = $(this).children('a').prop("href");
    $(this).find(".menu-level-2").prepend('<a class="menu-item-more" href="' + catLink + '">' + g_viewAll + '</a>')
});

$(".menu-item-responsive").click(function(){
    $(this).siblings(".menu-level-2").toggleClass("--active");
});


$(".user-action-cart").insertAfter(".header-top .cart-count");

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


/* make advanced parameters required */
if ($(".advanced-parameter").length){
    $(".advanced-parameter input").prop("required", true);
    $(".hidden-split-parameter[data-parameter-name='Barva'] span input").prop("required", true).removeAttr("checked");
}


/* load shop rating */
if ($(".type-detail").length){
    $("#ratingTab").wrapInner("<div id='ratingProduct'></div>");
    $("#ratingTab").append("<div id='ratingStore'></div>");

    $("#ratingProduct").prepend("<h1>" + g_productRating + "</h1>");

    $("#ratingTab #ratingStore").load("/" + g_ratingUrl + "/ .content-inner", function() {
        $("<a href='/" + g_ratingUrl + "' class='btn btn-secondary' id='js-ratingStoreToggle'>" + g_addRating + "</div>").insertBefore("#ratingStore #rate-form");
        $("<a href='/" + g_ratingUrl + "' class='btn btn-secondary'>" + g_moreRating +"</a>").insertAfter("#ratingStore .content-inner>.votes-wrap");
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
$("#p-detail-tabs").append('<li class="shp-tab"><a href="#productsRelated" class="shp-tab-link" role="tab" data-toggle="tab">' + g_related + '</a></li>');

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
    
    if($('main select[data-parameter-name="' + g_propositions + '"]').length){
        $(".extended-description").append('<div class="description-infographics empty"><span>' + g_emptyInforgaphicsTitle + '</span></div>');
    }else{
        var src = $('#relatedFiles a').attr("href");
        $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
        $(".description-infographics img").attr("src", src);
        $(".description-infographics a").attr("href", src);  
    }
    
    $('main select[data-parameter-name="' + g_propositions + '"]').change(function() {
        $(".description-infographics").remove();
        var option = $('main select[data-parameter-name="' + g_propositions + '"] option:selected').text(); 
        var optionClean = option.replace(/[cm]/g,'').replace(/\s/g,'').split('(', 1);
        var src = $('#relatedFiles a[title*="' + optionClean + '"]').attr("href");
        if(typeof src != 'undefined'){
            $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
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
    $(".p-thumbnails-inner > div > a:last-child").after('<div id="thumbnailsShowMore"><div class="thumbnailsShowMore-inner">' + g_viewAll + '</div></div>');
}
$("#thumbnailsShowMore").click(function(){
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

/* Cross selling products */
if ($(relatedCats).length){

    if ($(relatedTags).length){
        var i=0;
        $(relatedTags).each(function(i){
            var ran = i+1;
            var pName = $(this).closest(".p").find(".name span:first-child").text().trim();
            var pImg = $(this).closest(".p").find(".image img").data("src");
            var pPrice = $(this).closest(".p").find(".price-final strong").text();
            $(".p-info-wrapper .add-to-cart").before('<div class="detail-cross-selling selling-'+ ran +'"><input type="checkbox" id="csell' + ran + '" name="csell' + ran + '"><label for="csell' + ran + '"><img src="' + pImg + '"><span><span>' + pName + '</span><span>' + pPrice + '</span></span></label></div>')
            var pUrl = $(this).closest("a.image").prop("href");
            $("body").append('<div id="crossSelling' + ran + '"></div>');

            setTimeout(function(){
                $("#crossSelling" + ran).load(pUrl + " #product-detail-form", function() {
                    $("#crossSelling" + ran + " form").prop("id", "product-detail-form-" + ran);
                    /*$("#crossSelling" + ran).find("select").attr("data-parameter-id", ran + 1000);*/

                    $("#crossSelling" + ran + " select option:nth-child(2)").prop("selected", true);
                    $("#crossSelling" + ran + " .variant-list label:nth-child(2) input").prop("checked", true);
                });
            }, 200);


            $("#product-detail-form select, #product-detail-form input").change(function(){
                setTimeout(function(){
                if ($("#crossSelling" + ran + " select[data-parameter-name='" + g_color + "']").length){
                    var one = $("#crossSelling" + ran + " select[data-parameter-name='" + g_color + "']").attr("data-parameter-id");
                    var two = $("#crossSelling" + ran + " select[data-parameter-name='" + g_color + "']").find("option:selected").prop("value");
                }else if($("#crossSelling" + ran + " div[data-parameter-name='" + g_color + "']").length){
                    var one = $("#crossSelling" + ran + " div[data-parameter-name='" + g_color + "']").attr("data-parameter-id");
                    var two = $("#crossSelling" + ran + " div[data-parameter-name='" + g_color + "']").find("input:checked").prop("value");
                };
                if ($("#crossSelling" + ran + " select[data-parameter-name='" + g_propositions + "']").length){
                    var one2 = $("#crossSelling" + ran + " select[data-parameter-name='" + g_propositions + "']").attr("data-parameter-id");
                    var two2 = $("#crossSelling" + ran + " select[data-parameter-name='" + g_propositions + "']").find("option:selected").prop("value");
                };


                if ($("#crossSelling" + ran + " select[data-parameter-name='" + g_colorOfPrism + "']").length){
                    var prism1 = $("#crossSelling" + ran + " select[data-parameter-name='" + g_colorOfPrism + "']").attr("data-parameter-id");
                    var prism2 = $("#crossSelling" + ran + " select[data-parameter-name='" + g_colorOfPrism + "']").find("option:selected").prop("value");
                };
    
                if ($("#crossSelling" + ran + " select[data-parameter-name='" + g_surfaceColor + "']").length){
                    var prism11 = $("#crossSelling" + ran + " select[data-parameter-name='" + g_surfaceColor + "']").attr("data-parameter-id");
                    var prism12 = $("#crossSelling" + ran + " select[data-parameter-name='" + g_surfaceColor + "']").find("option:selected").prop("value");
                };

                if (one === undefined){
                    var number = one2+"-"+two2;
                }else if(one2 === undefined){
                    var number = one+"-"+two;
                }else{
                    var number = one+"-"+two+"-"+one2+"-"+two2;
                    var number2 = one2+"-"+two2+"-"+one+"-"+two; // if order is reversed
                }

                if (prism1 === undefined){
                    var prism_num = prism11+"-"+prism12;
                }else if(prism2 === undefined){
                    var prism_num = prism1+"-"+prism2;
                }else{
                    var prism_num = prism1+"-"+prism2+"-"+prism11+"-"+prism12;
                    var prism_num2 = prism11+"-"+prism12+"-"+prism1+"-"+prism2; // if order is reversed
                }


  

           

          


                var pPrice = $("#crossSelling" + ran).find(".price-final-holder:not(.parameter-dependent)").text();
                
                if(pPrice === ''){
      
                    var pPrice = $("#crossSelling" + ran).find(".price-final-holder." + number).text();
                    if(pPrice === ''){
                        var pPrice = $("#crossSelling" + ran).find(".price-final-holder." + number2).text();
                    }

                    $('.selling-'+ ran + ' label>span>span:last-child').text(pPrice);


                }else{
                    
                    $('.selling-'+ ran + ' label>span>span:last-child').text(pPrice);
                }
                

                /*
                else if(prism_num.length){
                    var pPrice = $("#crossSelling" + ran).find(".price-final-holder." + prism_num).text();
                    $('.selling-'+ ran + ' label>span>span:last-child').text(pPrice);
                }

         
                */
                }, 300);



            });


            $("#product-detail-form div[data-parameter-name='" + g_color + "'] input").click(function(){
                var selected = $(this).siblings(".parameter-value").text();
                $("#crossSelling" + ran + " .advanced-parameter-inner[title='" + selected + "']").siblings("input").prop("checked", true);
            });

            $("#product-detail-form select[data-parameter-name='" + g_color + "']").change(function() {
                var selected = $("#product-detail-form select[data-parameter-name='" + g_color + "'] option:selected").text(); 
                $("#crossSelling" + ran + " option").filter(function(){
                    return $(this).text() == selected;
                }).prop("selected", true);
            });

            $("#product-detail-form select[data-parameter-name='" + g_propositions + "']").change(function() {
                var selected = $("#product-detail-form select[data-parameter-name='" + g_propositions + "'] option:selected").text(); 
                $("#crossSelling" + ran + " option").filter(function(){
                    return $(this).text() == selected;
                }).prop("selected", true);
            });

            $("#product-detail-form select[data-parameter-name='" + g_colorOfPrism + "']").change(function() {
                var selected = $("#product-detail-form select[data-parameter-name='" + g_colorOfPrism + "'] option:selected").text(); 
                $("#crossSelling" + ran + " option").filter(function(){
                    return $(this).text() == selected;
                }).prop("selected", true);
            });

            $("#product-detail-form select[data-parameter-name='" + g_surfaceColor + "']").change(function() {
                var selected = $("#product-detail-form select[data-parameter-name='" + g_surfaceColor + "'] option:selected").text(); 
                $("#crossSelling" + ran + " option").filter(function(){
                    return $(this).text() == selected;
                }).prop("selected", true);
            });

        });

        $("<h4 class='detail-cross-selling-heading'>" + g_accessories + "</h4>").insertBefore(".selling-1");


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

        $("#product-detail-form select, #product-detail-form input").change(function(){
            if ($("#product-detail-form select[data-parameter-name='" + g_color + "']").length){
                var one = $("#product-detail-form select[data-parameter-name='" + g_color + "']").attr("data-parameter-id");
                var two = $("#product-detail-form select[data-parameter-name='" + g_color + "']").find("option:selected").prop("value");
            }else if($("#product-detail-form div[data-parameter-name='" + g_color + "']").length){
                var one = $("#product-detail-form div[data-parameter-name='" + g_color + "']").attr("data-parameter-id");
                var two = $("#product-detail-form div[data-parameter-name='" + g_color + "']").find("input:checked").prop("value");
            };

            if ($("#product-detail-form select[data-parameter-name='" + g_propositions + "']").length){
                var one2 = $("#product-detail-form select[data-parameter-name='" + g_propositions + "']").attr("data-parameter-id");
                var two2 = $("#product-detail-form select[data-parameter-name='" + g_propositions + "']").find("option:selected").prop("value");
            };

            if ($("#product-detail-form select[data-parameter-name='" + g_colorOfPrism + "']").length){
                var prism1 = $("#product-detail-form select[data-parameter-name='" + g_colorOfPrism + "']").attr("data-parameter-id");
                var prism2 = $("#product-detail-form select[data-parameter-name='" + g_colorOfPrism + "']").find("option:selected").prop("value");
            };

            if ($("#product-detail-form select[data-parameter-name='" + g_surfaceColor + "']").length){
                var prism11 = $("#product-detail-form select[data-parameter-name='" + g_surfaceColor + "']").attr("data-parameter-id");
                var prism12 = $("#product-detail-form select[data-parameter-name='" + g_surfaceColor + "']").find("option:selected").prop("value");
            };

            if (one === undefined){
                var number = one2+"-"+two2;
            }else if(one2 === undefined){
                var number = one+"-"+two;
            }else{
                var number = one+"-"+two+"-"+one2+"-"+two2;
                var number2 = one2+"-"+two2+"-"+one+"-"+two; // if order is reversed
            }

            if (prism1 === undefined){
                var prism_num = prism11+"-"+prism12;
            }else if(prism2 === undefined){
                var prism_num = prism1+"-"+prism2;
            }else{
                var prism_num = prism1+"-"+prism2+"-"+prism11+"-"+prism12;
                var prism_num2 = prism11+"-"+prism12+"-"+prism1+"-"+prism2; // if order is reversed
            }

            $(".p-info-wrapper span, .price-save span, .price-standard span, .bottomCta__price span").each(function(){
                $(this).removeClass("force-display");
            });
            $("span."+ number).addClass("force-display");
            $("span."+ number2).addClass("force-display");

            $("span."+ prism_num).addClass("force-display");
            $("span."+ prism_num2).addClass("force-display");
        });
    }

}


/*  */
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

/* add button and product into advanced order modal */
function advanceOrderCustom() {

            var img = $(".overall-wrapper .p-image-wrapper a").html();
            var name = $(".overall-wrapper .p-detail-inner-header h1").html();
            if($(".overall-wrapper .parameter-dependent").length){
                var stock = $(".overall-wrapper .availability-value .parameter-dependent:not(.no-display) span, .overall-wrapper .availability-value .parameter-dependent.force-display span").html();
            }else{
                var stock = $(".overall-wrapper .availability-value .availability-label span").html();
            }
            var amount = parseInt($(".overall-wrapper .add-to-cart .amount").val());
            var priceSingle = $(".overall-wrapper .p-final-price-wrapper .price-final-holder:not(.noDisplay), .overall-wrapper .p-final-price-wrapper .price-final-holder.force-display").html();




            if($("html:lang(cs)").length){
                var priceTotal = parseInt(priceSingle.replace('Kč', '').replace(/ /g,'')) * amount;
                var priceTotalcurrency = priceTotal + " " + g_currency;

            }else if($("html:lang(en), html:lang(sk)").length){
                var priceTotal = parseFloat(priceSingle.split('<')[0].replace('€', '').replace(',', '.')).toFixed(2) * amount;
                var priceTotalcurrency = g_currency + priceTotal;

            }else if($("html:lang(ro)").length){
                var priceTotal = parseFloat(priceSingle.replace('lei', '').replace(',', '.').replace(/ /g,'')).toFixed(2) * amount;
                var priceTotalcurrency = priceTotal + " " + g_currency;

            }else if($("html:lang(hu)").length){
                var priceTotal = parseFloat(priceSingle.replace('Ft', '').replace(',', '.').replace(/ /g,'')).toFixed(2) * amount;
                var priceTotalcurrency = priceTotal + " " + g_currency;
            }



            $(".extras-wrap").prepend('<div class="extras-product-heading"><span>' + g_product + '</span><span>' + g_availability + '</span><span>' + g_quantity +'</span><span>' + g_price + '</span></div><div class="extras-product">' + 
            '<div class="extras-product-img">' + img + '</div>' + 
            '<div class="extras-product-name">' + name + '</div>' +
            '<div class="extras-product-stock">' + stock + '</div>' +
            '<div class="extras-product-amount">' + amount + ' ' + g_pieces + '</div>' +
            '<div class="extras-product-priceSingle">' + priceSingle + '</div>' +
            '<div class="extras-product-priceTotal">' + priceTotalcurrency + ' </div>' +
            '</div>');

            $(".detail-cross-selling.checked").each(function(){
                var selling = $(this).html();
                $("<div class='extras-product-selling'>" + selling + "</div>").insertAfter(".extras-product");
            });

            $("#backToShop").remove();
            $(".extra.step").prepend("<div class='btn' id='backToShop'>" + g_backToStore + "</div><div style='flex-grow:1;'></div>");
            $(".advanced-order .extra.step .btn-conversion").text(g_viewCart);
            $(".advanced-order .h1").text(g_addedToCart);
            $(".advanced-order .h1.advanced-order-suggestion").text(g_youMightLike);
            $("#backToShop").click(function(){
                $("#cboxClose").click();
            });
}

/* free delivery function, call in core js file */
if($("html:lang(en)").length){
    $(".headerFreeDelivery.free").remove();
    $("<div class='headerFreeDelivery free'>Worldwide shipping</div>").insertAfter(".navLinks");
    /* call functions after order modal loaded */

    document.addEventListener('ShoptetDOMAdvancedOrderLoaded', function () {
        advanceOrderCustom();
    });


}
else{

    function freeDelivery(){ 

        if ($(".cart-count.full .cart-price").length){
            $(".headerFreeDelivery").remove();
            var price = $(".cart-price").html().replace(/\s/g, '').replace(/\€/g, '');
            var priceFree = g_priceFree;
            priceInt = parseFloat(price).toFixed(2);
    
            if(priceInt > priceFree){
                $("<div class='headerFreeDelivery free'>" + g_freeDelivery + "</div>").insertBefore(".cart-count");
            }
            else{
                var priceFinal = priceFree - priceInt;
                $("<div class='headerFreeDelivery'>" + g_pickAdditionalItemsForAtLeast + " <span>"+ priceFinal +" " + g_currency + "</span><br>" + g_andGetFreeDeliveryOnYourOrder + "</div>").insertBefore(".cart-count");
            }
        }
        else{
            $(".headerFreeDelivery").remove();
            $("<div class='headerFreeDelivery free'>" + g_pickAdditionalItemsOver + "<br>" + g_andGetFreeDeliveryOnYourOrder + "</div>").insertBefore(".cart-count");  
        }
    
        if ($(".ordering-process").length){
            $("<div class='headerFreeDelivery free'>" + g_pickAdditionalItemsOver + "<br>" + g_andGetFreeDeliveryOnYourOrder + "</div>").insertAfter(".navLinks");
        }
    }
    
    
    freeDelivery();

    /* call functions after order modal loaded */

    document.addEventListener('ShoptetDOMAdvancedOrderLoaded', function () {
        freeDelivery();
        advanceOrderCustom();
    });


}





/* Adjust price displaying */
/*
if ($(":lang(cs) .type-detail").length){

    $(".price-final span").each(function() {
        var str = $(this).text();
        var strM = str.replace(/\s/g, '',).replace(g_currency, '').replace(g_from, ''); 
        $(this).text(strM);
        var str = $(this).append("<span class='price-final-currency'> " + g_currency + "</span>");
    });

    $(".price-final span.default-variant").prepend("<span class='price-final-pre'>" + g_from + " </span>");

    $(".price-additional span").each(function() {
        var str1 = $(this).text();
        var strM1 = str1.replace(/\s/g, '',).replace(g_excludingVatModified, '').replace(g_from, ''); 
        $(this).text(strM1);
        var str1 = $(this).append("<span class='price-final-dph'> " + g_excludingVat + "</span>"); 
    });

    $(".price-additional span.default-variant").prepend("<span class='price-final-pre'>" + g_from + " </span>");

    $(".price-standard span").each(function() {
        var str1 = $(this).text();
        var strM1 = str1.replace(/\s/g, '',).replace(g_currency, '').replace(g_from, ''); 
        $(this).text(strM1);
        var str1 = $(this).append("<span class='price-final-currency'> " + g_currency + "</span>");
    });

    $(".price-standard span.default-variant").prepend("<span class='price-final-pre'>" + g_from + " </span>");

    $(".price-additional:not(:has(span))").each(function() {
        var str1 = $(this).text();
        var strM1 = str1.replace(/\s/g, '',).replace(g_excludingVatModified, ''); 
        $(this).text(strM1);
        var str1 = $(this).append("<span class='price-final-dph'> " + g_excludingVat + "</span>");
    });
}
*/

/* rename titles */
if ($(".type-detail").length){
    $(".extended-description h3").text(g_advantagesAndSpecifications);
    $(".products-related-header").text(g_similarFixturesAndFittings);
    $('a[href="#productsRelated"]').text(g_fixturesAndFittings);
}

/* add add to cart cta fixed on bottom of a page */
if ($(".type-detail").length){
    var pName = $(".p-detail-inner-header h1").text();
    var pPrice = $(".p-final-price-wrapper .price-final").html();
    $('<div class="bottomCta"><div class="bottomCta__container"><div class="bottomCta__content"><div class="bottomCta__title">' + pName + '</div><div class="bottomCta__price">' + pPrice + '</div></div><div class="bottomCta__spinner"><input type="text" id="bottomCtaInput" value="1"><span class="increase"></span><span class="decrease"></span></div><div class="btn bottomCta__button" id="bottomCtaButton">' + g_addToCart + '</div></div></div>').insertBefore(".overall-wrapper");
    $("#bottomCtaInput").change(function(){
        var inputValue = $('#bottomCtaInput').val();
        $('.quantity input').val(inputValue);
    });
    $("#bottomCtaButton").click(function(){
        $('#product-detail-form').submit();
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

$("#ratingProduct>p").text(g_beFirstToRateThisProduct);

/* rewrite description */
if ($(":lang(en) .type-detail").length){
    if ($(".p-short-description").length){

    }else{
        $("<div class='p-short-description'><p></p></div>").insertAfter(".add-to-cart");
        var desc = $("main #descriptionLong .rte p").text();
        var descTrim = desc.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");
        $(".p-short-description p").text(descTrim);
    }

}

/* show add to cart section on scroll */
$(window).on('scroll', function() {
    scrollPosition = $(this).scrollTop();
    if (scrollPosition >= 1000) {
        $(".type-detail").addClass("--bottomCtaActive");
    }else{
        $(".type-detail").removeClass("--bottomCtaActive");
    }
});

/* rename default delivery text */
$("#content .availability-value .default-variant").text(g_chooseOptionToSeeDeliveryTime);




/* remove parameters */
$('.detail-parameters tr th:contains("' + g_category + ':"), .detail-parameters tr th:contains("' + g_color + ':"), .detail-parameters tr th:contains("' + g_model + ':")').parents('tr').remove();

if($('select[data-parameter-name="' + g_propositions + '"]').length){
    $('.detail-parameters tr th:contains("' + g_propositions + ':")').parents('tr').remove();
}




// -----------------------------------------------------------------------------
// REGISTER PAGE
// -----------------------------------------------------------------------------

/* add points above form */
if ($(".in-" + g_registrationUrl + " #register-form").length){
    $('<div class="register-points"><h4 class="register-points__title">' + g_whatWillYouGet + '</h4>'+
    '<span>' + g_orderHistory + '</span>'+
    '<span>' + g_designNewsInformation + '</span>'+
    '<span>' + g_higherDiscountEveryPurchase + '</span>'+
    '</div>').insertBefore("#register-form");


    $(".in-" + g_registrationUrl + " .content-inner h1").text(g_frequentBuyerRegistration);

    $("<p>" + g_frequentBuyerRegistrationText + "</p>").insertAfter(".in-" + g_registrationUrl + " .content-inner h1");
}

// -----------------------------------------------------------------------------
// STORE RATING PAGE
// -----------------------------------------------------------------------------

/* add title to rating */
if ($("#rate-form").length){
    $("#rate-form").prepend("<h3 class='vote-form-title'>" + g_addRating + "</h3>");
}

// -----------------------------------------------------------------------------
// BLOG
// -----------------------------------------------------------------------------

/* load blog posts into blog page main section */
if ($(".blogCategories").length){

    $(".blogCategories .blogCategories__bydleni .news-wrapper").load("/" + category1Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function() {
        $("<h2 class='blogCategories__sectionTitle'>" + category1 + "</h2>").insertBefore(".blogCategories .blogCategories__bydleni");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category1Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__bydleni .blogCategories__section .news-item:nth-child(2)");    
    });
    
    $(".blogCategories .blogCategories__rodina .news-wrapper").load("/" + category2Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function() {
        $("<h2 class='blogCategories__sectionTitle'>" + category2 + "</h2>").insertBefore(".blogCategories .blogCategories__rodina");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category2Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__rodina .blogCategories__section .news-item:nth-child(2)");    
    });

    $(".blogCategories .blogCategories__novinky .news-wrapper").load("/" + category3Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function() {
        $("<h2 class='blogCategories__sectionTitle'>" + category3 + "</h2>").insertBefore(".blogCategories .blogCategories__novinky");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category3Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__novinky .blogCategories__section .news-item:nth-child(2)");    
    });

    $(".blogCategories .blogCategories__benlemi-pomaha .news-wrapper").load("/" + category4Url + "/ .news-wrapper .news-item:nth-child(-n+3)", function() {
        $("<h2 class='blogCategories__sectionTitle'>" + category4 + "</h2>").insertBefore(".blogCategories .blogCategories__benlemi-pomaha");
        $("<div class='blogCategories__sectionShowMore'><a href='/" + category4Url + "/' class='blogCategories__sectionShowMoreLink'>" + g_moreArticles + "</a></div>").insertAfter(".blogCategories__benlemi-pomaha .blogCategories__section .news-item:nth-child(2)");    
    });

    $('<p style="text-align: center;">' + g_blogText + '</p>').insertAfter(".type-posts-listing .content-inner h1");

}

// -----------------------------------------------------------------------------
// USER PROFILE
// -----------------------------------------------------------------------------

if ($(".logout").length){
    $(".logout").insertAfter(".client-center-box");

    $("<div class='client-contact-box'></div>").insertAfter(".client-center-box + .logout");

    $(".client-contact-box").load("/" + g_cart1Url + "/ .checkout-box");
}

if ($(".in-" + g_inClientUrl + ", .in-" + g_inSettingsUrl + ", .in-" + g_inOrdersUrl + ", .in-" + g_inClientOrdersUrl + ", .in-" + g_inClientSaleUrl + ", .in-" + g_inClientRatingUrl + ", .in-" + g_inClientDocumentsUrl + ", .in-" + g_inClientDiscussionUrl + ", .in-" + g_inForgotPasswordUrl).length){
    var name = $(".sidebar-inner ul li strong").text();
    $(".sidebar-inner strong").text(name + " " + g_inBenlemi);
    $(".in-" + g_inClientUrl + " .content-inner h1").text(g_welcomeTitle);
    $("<p>" + g_welcomeText + "</p>").insertAfter(".in-" + g_inClientUrl + " .content-inner h1")
}

// -----------------------------------------------------------------------------
// FOOTER
// -----------------------------------------------------------------------------

if ($("#footer").length){

    $("#signature").html('<a href="https://benlemi.cz" class="title --benlemi" rel="noreferrer noopener">' + g_madeBy + ' <img src="https://www.benlemi.cz/user/documents/theme/dist/img/symbol-benlemi.svg" alt="Benlemi" class="image --benlemi"> Benlemi &</a><a href="https://www.shoptet.cz/" title="Vytvořil Shoptet" class="title" target="_blank" rel="noreferrer noopener"><img src="https://cdn.myshoptet.com/prj/2e0fa726/master/cms/img/shoptetLogo128x128.gif" width="" height="" alt="Shoptet.cz" class="image --benlemi">Shoptet</a>');
} 

// -----------------------------------------------------------------------------
// RATING STORE PAGE
// -----------------------------------------------------------------------------

$(".vote-form-title").click(function(){
    $(".vote-form-title+#formRating").addClass("--active");
    $(this).addClass("--hide");
});

// -----------------------------------------------------------------------------
// LOGIN FORM
// -----------------------------------------------------------------------------

$("<span class='login-close'></span>").insertAfter(".user-action .login-widget .popup-widget-inner");
$(".login-close").click(function(){
    $("body").removeClass("user-action-visible login-window-visible");
});

if ($(".in-login").length){
    $(".content-inner > h1").text(g_loginToYourAccount);
    $("#formLogin .password-helper").prepend('<div class="login-form-points"><h4 class="login-form-register-title">' + g_becomeMember + '</h4><div class="login-form-points-wrap">' +
    '<div class="login-form-point">' + g_discountForEachPurchase + '</div>' +
    '<div class="login-form-point">' + g_completeOverviewOfYourOrders + '</div>' +
    '<div class="login-form-point">' + g_designNewsInformation + '</div>' +
    '<div class="login-form-point">' + g_possibilityToRateAndDiscuss + '</div>' +
    '</div></div>');

    $("#formLogin .password-helper a:last-child").text(g_forgotPassword).insertAfter(".login-wrapper button");
}

// -----------------------------------------------------------------------------
// VOICE SEARCH
// -----------------------------------------------------------------------------

$("#formSearchForm .query-input").attr("id","searchbox");
$("<div id='speechToggle' onclick='startDictation()'></div>").insertBefore(".search-form .btn");

function startDictation() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var recognition = new webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.lang = "cs-CZ";
        recognition.start();

        recognition.onresult = function(e) {
            document.getElementById('searchbox').value = e.results[0][0].transcript;
            recognition.stop();
            document.getElementById('formSearchForm').submit();
        };

        recognition.onerror = function(e) {
            recognition.stop();
        }
    }
}

// -----------------------------------------------------------------------------
// REMOVE PHONE VALIDATION AND ADD CUSTOM FUNCTION TO COUNTRY SELECT
// -----------------------------------------------------------------------------
$(document).ready(function() {
    $("#phone").removeClass("js-validate-phone");

    $(".country-flag").on("click", function() {
        $(".country-flag").removeClass("selected");
        $(this).addClass("selected");
    });
});