if($(".type-category").length&&($(".category-title").insertBefore(".content-wrapper-in"),$(".subcategories").insertAfter(".category-title"),$(".category-perex").insertAfter(".category-title")),$(".filters-wrapper").length&&($("#content-wrapper").append('<div id="filtersToggle">'+g_openFilter+"</div>"),$("#filtersToggle").click((function(){$("#content-wrapper").toggleClass("--showFilters"),$("#content-wrapper").hasClass("--showFilters")?$("#filtersToggle").text(g_hideFilter):$("#filtersToggle").text(g_showFilter)}))),$(".pagination-loader").length&&$(".pagination-loader span").text(g_showMore),$(".product").length&&$(".product").each((function(){$(this).find(".p-tools .btn").text(g_show),$(this).find(".price-final strong > small").length&&$(this).find(".name").append("<span class='p-variants'>"+g_moreVariants+"</span>")})),$("#category-header").length&&($("#category-header").insertBefore(".content-wrapper-in"),$("#category-header").prepend('<div id="filterToggleDesktop" class="btn">'+g_showFilter+"</div>"),$("#filterToggleDesktop").click((function(){$(".sidebar-left").toggleClass("--active"),$("#filterToggleDesktop").hasClass("active")?($(this).text(g_showFilter),$(this).removeClass("active")):($(this).text(g_hideFilter),$(this).addClass("active"))}))),$(".category-perex").length&&$(window).width()<=991){var text=$(".category-perex p").text(),textMod=text.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");$("<div class='perex-short'></div><div class='perex-showMore'>"+g_fullDescription+"</div>").insertAfter(".category-perex > p"),$(".perex-short").text(textMod),$(".perex-showMore").click((function(){$(".category-perex").addClass("active")}))}if($(".category-header").length){var catHead=$(".category-header div strong").html();$(".category-header div:last-child").text(g_totalQuantity+":"+catHead)}$(".filters-wrapper").append("<div class='filter-contact'></div>"),$(".filter-contact").load(g_cart1Url+" .checkout-box");