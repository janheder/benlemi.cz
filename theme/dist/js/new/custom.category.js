// -----------------------------------------------------------------------------
// PRODUCT CATEGORY
// -----------------------------------------------------------------------------

/* relocate heading and categories */
if ($(".type-category").length){
    $(".category-title").insertBefore(".content-wrapper-in");
    $(".subcategories").insertAfter(".category-title");
    $(".category-perex").insertAfter(".category-title");
}


/* rename show more button */;
if ($(".pagination-loader").length){
    $(".pagination-loader span").text(g_showMore);
}


function productCardEdit(){ 

    /* relocate hover overlay on product & add more variants into product box */
    if ($(".product").length){
        $(".product").each(function(){
            $(this).find(".p-tools a.btn").text(g_show);

            if ($(this).find(".price-final strong > small").length){
                $(this).find(".name").append("<span class='p-variants'>" + g_moreVariants + "</span>");
            }
        });
    }

    /* relocate flags on mobile */

    if ($(".product").length){
        $(".product").each(function(){
            $(this).find(".flags-default").insertBefore($(this).find(".p-in-in"));
        });
    }

    $(".p").each(function(){
        var price = $(this).find(".flags .flag .price-standard").html();
        $(this).find(".prices span").remove();
        $(this).find(".prices").prepend(price);
    });

    if ($(".product .flag-discount:contains('až')").length){
        $(".p").each(function() {
            var a = $(this).find(".flag-discount:contains('až')").html();
            if(a === undefined){
                
            }else{
                var b = a.replace('až','');
                $(this).find(".flag-discount:contains('až')").html(b);
            }
        });
    }
}

productCardEdit();

document.addEventListener('ShoptetDOMPageContentLoaded', function () {
    productCardEdit();
});
document.addEventListener('ShoptetDOMPageMoreProductsLoaded', function () {
    productCardEdit();
});



/* category header edit */
if ($("#category-header").length){
    $("#category-header").insertBefore(".content-wrapper-in");
    $("#category-header").prepend('<div id="filterToggleDesktop" class="btn">' + g_showFilter + '</div><div id="sortToggle" class="btn btn-ghost">' + g_showSort + '</div>');

    $("#filters").prepend('<div id="filterToggleMobile" class="btn">' + g_hideFilter + '</div>');

    $("#filterToggleDesktop").click(function(){
        if($("body").hasClass("--showFilters")){
            $(this).text(g_showFilter);
            $("body").removeClass("--showFilters");
        }
        else{
            $(this).text(g_hideFilter);
            $("body").addClass("--showFilters");
        }
    });

    $("#filterToggleMobile").click(function(){
        if($("body").hasClass("--showFilters")){
            $("#filterToggleDesktop").text(g_showFilter);
            $("body").removeClass("--showFilters");
        }
        else{
            $("#filterToggleDesktop").text(g_hideFilter);
            $("body").addClass("--showFilters");
        }
    });

    $("#sortToggle").click(function(){
        $("body").toggleClass("--showSort");
    });
}

/* category perex */
if ($(".category-perex").length){
    if ($(window).width() <= 991) {
        var text = $(".category-perex p").text();
        var textMod = text.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");
        $("<div class='perex-short'></div><div class='perex-showMore'>" + g_fullDescription + "</div>").insertAfter(".category-perex > p");
        $(".perex-short").text(textMod);
        $(".perex-showMore").click(function(){
            $(".category-perex").addClass("active");
        });
    }
}

/* category header title */
if ($(".category-header").length){
    var catHead = $(".category-header div strong").html();
    $(".category-header div:last-child").text(g_totalQuantity + ":" + catHead);
}

/*
$(".filters-wrapper").append("<div class='filter-contact'></div>");
$(".filter-contact").load(g_cart1Url + " .checkout-box");
*/


$(".category__secondDescription").insertAfter(".category-title");
