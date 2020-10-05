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
    $("#content-wrapper").append('<div id="filtersToggle">' + g_openFilter + '</div>');
    $("#filtersToggle").click(function(){
        $("#content-wrapper").toggleClass("--showFilters");
        if ($("#content-wrapper").hasClass("--showFilters")) {
            $("#filtersToggle").text(g_hideFilter);
        }else{
            $("#filtersToggle").text(g_showFilter);
        }
    });
}

/* rename show more button */;
if ($(".pagination-loader").length){
    $(".pagination-loader span").text(g_showMore);
}


function productCardEdit(){ 

    /* relocate hover overlay on product & add more variants into product box */
    if ($(".product").length){
        $(".product").each(function(){
            $(this).find(".p-tools .btn").text(g_show);

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

    $(".p").each(function() {
        var a = $(this).find(".flag-discount").html().replace('až','');
        $(this).find(".flag-discount").html(a);
    });
    
}

productCardEdit();

document.addEventListener('ShoptetDOMPageMoreProductsLoaded', function () {
    productCardEdit();  
});



/* category header edit */
if ($("#category-header").length){
    $("#category-header").insertBefore(".content-wrapper-in");
    $("#category-header").prepend('<div id="filterToggleDesktop" class="btn">' + g_showFilter + '</div>');

    $("#filterToggleDesktop").click(function(){
        $(".sidebar-left").toggleClass("--active");

        if($("#filterToggleDesktop").hasClass("active")){
            $(this).text(g_showFilter);
            $(this).removeClass("active");
        }
        else{
            $(this).text(g_hideFilter);
            $(this).addClass("active");
        }
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


$(".filters-wrapper").append("<div class='filter-contact'></div>");
$(".filter-contact").load(g_cart1Url + " .checkout-box");


