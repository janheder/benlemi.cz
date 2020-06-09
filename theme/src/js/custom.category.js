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
        $(this).find(".p-tools .btn").text("Zobrazit");

        if ($(this).find(".price-final strong > small").length){
            $(this).find(".name").append("<span class='p-variants'>Více variant</span>");
        }

    });
}

/* category header edit */
if ($("#category-header").length){
    $("#category-header").insertBefore(".content-wrapper-in");
    $("#category-header").prepend('<div id="filterToggleDesktop" class="btn">Filtr</div>');

    $("#filterToggleDesktop").click(function(){
        $(".sidebar-left").toggleClass("--active");
    });
}

/* category perex */
if ($(".category-perex").length){
    if ($(window).width() <= 991) {
        var text = $(".category-perex p").text();
        var textMod = text.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");
        $("<div class='perex-short'></div><div class='perex-showMore'>Celý popis</div>").insertAfter(".category-perex > p");
        $(".perex-short").text(textMod);
        $(".perex-showMore").click(function(){
            $(".category-perex").addClass("active");
        });
    }
}


if ($(".category-header").length){
    var catHead = $(".category-header div strong").html();
    $(".category-header div:last-child").text("Položek celkem:" + catHead);
}
