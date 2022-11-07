// -----------------------------------------------------------------------------
// PRODUCT CATEGORY
// -----------------------------------------------------------------------------


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


    if ($(".product").length){
        $(".product").each(function(){
            $(this).find(".widget-parameter-wrapper").insertAfter($(this).find(".name"));
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

    function filterButtonDesktop(){ 
        $("#filterToggleDesktop, #sortToggle").remove();
        $("#category-header").prepend('<div id="filterToggleDesktop" class="btn">' + g_hideFilter + '</div><div id="sortToggle" class="btn btn-ghost">' + g_showSort + '</div>');


        $("#filterToggleDesktop").click(function(){
            if($("body").hasClass("--showFilters")){
                $(this).text(g_hideFilter);
                $("body").removeClass("--showFilters --noScroll");
            }
            else{
                $(this).text(g_hideFilter);
                $("body").addClass("--showFilters --noScroll");
            }
        });

        $("#sortToggle").click(function(){
            $("body").toggleClass("--showSort");
        });
    }
    filterButtonDesktop();

    function filterButtonMobile(){ 
        $("#filters").prepend('<div id="filterToggleMobile" class="btn">' + g_hideFilter + '</div>');

        $("#filterToggleMobile").click(function(){
            if($("body").hasClass("--showFilters")){
                $("#filterToggleDesktop").text(g_hideFilter);
                $("body").removeClass("--showFilters --noScroll");
            }
            else{
                $("#filterToggleDesktop").text(g_hideFilter);
                $("body").addClass("--showFilters --noScroll");
            }
        });
    }
    filterButtonMobile();

    document.addEventListener('shoptet.products.sameHeightOfProducts', function () {
        filterButtonDesktop()
        filterButtonMobile();
    });

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



/* category perex */
if ($(".category__secondDescription").length){
    $(".category__secondDescription").insertAfter(".category-title");

    $(".category__secondDescription").append("<div class='perex-showMore'>" + g_fullDescription + "</div>");

    $(".perex-showMore").click(function(){
        $(".category__secondDescription").addClass("--active");
    });
}
