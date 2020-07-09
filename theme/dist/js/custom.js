if($("[data-force-scroll]").length&&$("[data-force-scroll]").each((function(){$(this).removeAttr("data-force-scroll")})),$(document).ready((function(){$('a[href*="#"]').click((function(e){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var t=$(this.hash);(t=t.length?t:$("[name="+this.hash.slice(1)+"]")).length&&(e.preventDefault(),$("html, body").animate({scrollTop:t.offset().top},1e3,(function(){var e=$(t);if(e.focus(),e.is(":focus"))return!1;e.attr("tabindex","-1"),e.focus()})))}}))})),$("#content-wrapper").wrap("<div id='content-wrapper-wrap'></div>"),$((function(){var e=$("#header");e.addClass("no-scroll"),$(window).scroll((function(){var t=$(window).scrollTop();t>=0&&e.removeClass("no-scroll").addClass("scroll"),t<=0&&e.removeClass("scroll").addClass("no-scroll")}))})),$((function(){var e=$(".no-scroll");$(window).scrollTop()>0&&e.removeClass("no-scroll").addClass("scroll"),scroll<0&&e.removeClass("scroll").addClass("no-scroll")})),$(".search").length){if($("#footer").length)var mail=$("#footer .mail").text().replace(/\s/g,""),tel=$("#footer .tel").text().replace(/\s/g,"");else mail=$(".contact-box .mail a").text().replace(/\s/g,""),tel=$(".contact-box  .tel").text().replace(/\s/g,"");$(".search").before('<div class="header-contacts"><a href="tel:'+tel+'">'+tel+'</a><a href="mailto:'+mail+'">'+mail+"</a></div>"),$("html:lang(en)").length&&$(".header-contacts").append("<span>Mon–Fri 9:30 a.m.– 4:00 p.m</span>")}function freeDelivery(){if($(":lang(en)").length)$("<div class='headerFreeDelivery free'>Worldwide shipping</div>").insertAfter(".navLinks");else{if($(".cart-count.full .cart-price").length){$(".headerFreeDelivery").remove();var e=$(".cart-price").html().replace(/\s/g,"").replace(/\€/g,""),t=g_priceFree;if(priceInt=parseFloat(e).toFixed(2),priceInt>t)$("<div class='headerFreeDelivery free'>"+g_freeDelivery+"</div>").insertBefore(".cart-count");else{var a=t-priceInt;$("<div class='headerFreeDelivery'>"+g_pickAdditionalItemsForAtLeast+" <span>"+a+" "+g_currency+"</span><br>"+g_andGetFreeDeliveryOnYourOrder+"</div>").insertBefore(".cart-count")}}else $(".headerFreeDelivery").remove(),$("<div class='headerFreeDelivery free'>"+g_pickAdditionalItemsOver+"<br>"+g_andGetFreeDeliveryOnYourOrder+"</div>").insertBefore(".cart-count");$(".ordering-process").length&&$("<div class='headerFreeDelivery free'>"+g_pickAdditionalItemsOver+"<br>"+g_andGetFreeDeliveryOnYourOrder+"</div>").insertAfter(".navLinks")}}$(".navigation-buttons").prepend('<div class="nav-search" id="js-searchToggle"></div><a href="/login" class="nav-user"></a>'),$(".header-top").prepend('<div class="nav-menu-toggle" id="js-menuToggle"><span></span></div>'),$("#js-menuToggle, .menu-helper").click((function(){$(".header-top").toggleClass("--active"),$("body").toggleClass("--noScroll")})),$(".header-top .search-form input").prop("placeholder",g_searchPlaceholder),$(".header-top .search").insertAfter("#navigation .menu-level-1>li:last-child"),$("#js-searchToggle").click((function(){$("#navigation .search").insertAfter(".navigation-buttons"),$(".search").hasClass("--active")?($(".search").removeClass("--active"),$(".menu-helper .search .form-control").blur()):($(".search").addClass("--active"),$(".menu-helper .search .form-control").focus())})),$(".cart-count").click((function(){window.location.href="/"+g_cartUrl+"/"})),$(".menu-level-1 .ext, .cart-count.full, .cart-widget").hover((function(){$("body").addClass("submenu-active")}),(function(){$("body").removeClass("submenu-active")})),$(".popup-widget-inner h2").length?$('<div class="navLinks"><a href="/login/?backTo=%2F" class="top-nav-button top-nav-button-login primary login toggle-window navLinks__link" data-target="login" rel="nofollow">'+g_login+'</a><a href="/'+g_registrationUrl+'/" class="navLinks__link">'+g_register+'</a><span class="navLinks__span">'+g_language+":</span></div>").insertAfter(".nav-user"):$('<div class="navLinks"><a href="/'+g_inClientUrl+'/" class="navLinks__link --user">'+g_userAccount+'</a><span class="navLinks__span">'+g_language+":</span></div>").insertAfter(".nav-user"),$(":lang(cs)").length?($(".navLinks").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item cz active">Česky</div><a href="https://benlemi.sk" class="language-toggle-item sk">Slovensky</a><a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a></div></div>'),$("#js-langToggle").click((function(){$("#js-langToggle").toggleClass("--active")}))):$(":lang(en)").length?($(".navLinks").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item com active">English</div><a href="https://www.benlemi.cz" class="language-toggle-item cz">Czech</a><a href="https://benlemi.sk" class="language-toggle-item sk">Slovak</a></div></div>'),$("#js-langToggle").click((function(){$("#js-langToggle").toggleClass("--active")}))):$(":lang(sk)").length&&($(".navLinks").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item sk active">Slovensky</div><a href="https://www.benlemi.cz" class="language-toggle-item cz">Česky</a><a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a></div></div>'),$("#js-langToggle").click((function(){$("#js-langToggle").toggleClass("--active")}))),freeDelivery(),$(".add-to-cart .add-to-cart-button").click((function(){setTimeout((function(){freeDelivery()}),1e3)})),$(".site-msg").length&&($(".breadcrumbs").length&&$(".site-msg").insertBefore(".breadcrumbs"),$(".before-carousel").length&&$(".site-msg").insertAfter("#header"));var name=$(".popup-widget-inner p strong").text();if($(".navLinks__link.--user").text(g_logged+": "+name),$(".menu-level-1 > li.ext").each((function(){$(this).prepend('<div class="menu-item-responsive"></div>');var e=$(this).children("a").prop("href");$(this).find(".menu-level-2").prepend('<a class="menu-item-more" href="'+e+'">'+g_viewAll+"</a>")})),$(".menu-item-responsive").click((function(){$(this).siblings(".menu-level-2").toggleClass("--active")})),$(".user-action-cart").insertAfter(".header-top .cart-count"),$(".p-detail-inner-header").length&&$(".p-detail-inner-header").insertBefore(".p-final-price-wrapper"),$(".stars-wrapper").length&&$(".stars-wrapper").insertBefore(".p-final-price-wrapper"),$(".type-detail").length&&($("#ratingTab").wrapInner("<div id='ratingProduct'></div>"),$("#ratingTab").append("<div id='ratingStore'></div>"),$("#ratingProduct").prepend("<h1>"+g_productRating+"</h1>"),$("#ratingTab #ratingStore").load("/"+g_ratingUrl+"/ .content-inner",(function(){$("<a href='/"+g_ratingUrl+"' class='btn btn-secondary' id='js-ratingStoreToggle'>"+g_addRating+"</div>").insertBefore("#ratingStore #rate-form"),$(".rate-wrapper .vote-form .vote-form-title").click((function(){$(".vote-form-title + #formRating").addClass("--active"),$(this).addClass("--hide")}))}))),$("#closeModal").click((function(){$("#cboxOverlay").click()})),$(".products-related-header, .products-related").wrapAll("<div id='productsRelated'>"),$("#p-detail-tabs").append('<li class="shp-tab"><a href="#productsRelated" class="shp-tab-link" role="tab" data-toggle="tab">'+g_related+"</a></li>"),$(".hidden-split-parameter").length&&$(".hidden-split-parameter").each((function(){$(this).prop("required",!0)})),$("#p-detail-tabs").length&&$("#p-detail-tabs .shp-tab-link").each((function(){$(this).removeAttr("data-toggle")})),$("#relatedFiles").length&&($('main select[data-parameter-name="'+g_propositions+'"]').length&&$(".extended-description").append('<div class="description-infographics empty"><span>'+g_emptyInforgaphicsTitle+"</span></div>"),$('main select[data-parameter-name="'+g_propositions+'"]').change((function(){$(".description-infographics").remove();var e=$('main select[data-parameter-name="'+g_propositions+'"] option:selected').text().replace(/[cm]/g,"").replace(/\s/g,""),t=$('#relatedFiles a[title*="'+e+'"]').attr("href");void 0!==t?($(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>'+g_downloadInfographic+"</a></div>"),$(".description-infographics img").attr("src",t),$(".description-infographics a").attr("href",t)):$(".description-infographics").remove()}))),$(".p-info-wrapper").length&&$(".p-info-wrapper .stars-wrapper, .p-detail-info > div:last-child").appendTo(".p-detail-inner-header"),$("#productVideos").length&&$("#productVideos").appendTo(".p-thumbnails-wrapper"),$(".p-thumbnails-wrapper").length&&$(".p-thumbnails-inner > div > a:last-child").after('<div id="thumbnailsShowMore"><div class="thumbnailsShowMore-inner">'+g_viewAll+"</div></div>"),$("#thumbnailsShowMore").click((function(){$(".p-thumbnails-inner").toggleClass("--active"),window.scrollBy(0,1)})),$("#productsRelated").insertBefore("#productDiscussion"),$(".basic-description").attr("id","descriptionLong"),$('#p-detail-tabs a[href="#description"]').attr("href","#descriptionLong"),$("#p-detail-tabs").prepend('<li class="shp-tab"><a href="#description" class="shp-tab-link" role="tab">'+g_specifications+"</a></li>"),$('.p-info-wrapper a[href="#description"]').text(g_showMoreInfo),$(relatedCats).length&&$("#productsRelated .flag-custom1").length){var i=0;$("#productsRelated .flag-custom1").each((function(e){var t=e+1,a=$(this).closest(".p").find(".name").prop("title"),i=$(this).closest(".p").find(".image img").prop("src"),r=$(this).closest(".p").find(".price-final strong").text();$(".p-info-wrapper .add-to-cart").before('<div class="detail-cross-selling selling-'+t+'"><input type="checkbox" id="csell'+t+'" name="csell'+t+'"><label for="csell'+t+'"><img src="'+i+'"><span><span>'+a+"</span><span>"+r+"</span></span></label></div>");var n=$(this).closest("a.image").prop("href");$("body").append('<div id="crossSelling'+t+'"></div>'),$("#crossSelling"+t).load(n+" #product-detail-form",(function(){$("#crossSelling"+t+" form").prop("id","product-detail-form-"+t),$("#crossSelling"+t).find("select").attr("data-parameter-id",t+1e3)})),$("#product-detail-form select[data-parameter-name='"+g_color+"']").change((function(){var e=$("#product-detail-form select[data-parameter-name='"+g_color+"'] option:selected").text();$("#crossSelling"+t+" option").filter((function(){return $(this).text()==e})).prop("selected",!0)})),$("#product-detail-form select[data-parameter-name='"+g_propositions+"']").change((function(){var e=$("#product-detail-form select[data-parameter-name='"+g_propositions+"'] option:selected").text();$("#crossSelling"+t+" option").filter((function(){return $(this).text()==e})).prop("selected",!0)})),$("#product-detail-form select[data-parameter-name='"+g_colorOfPrism+"']").change((function(){var e=$("#product-detail-form select[data-parameter-name='"+g_colorOfPrism+"'] option:selected").text();$("#crossSelling"+t+" option").filter((function(){return $(this).text()==e})).prop("selected",!0)})),$("#product-detail-form select[data-parameter-name='"+g_surfaceColor+"']").change((function(){var e=$("#product-detail-form select[data-parameter-name='"+g_surfaceColor+"'] option:selected").text();$("#crossSelling"+t+" option").filter((function(){return $(this).text()==e})).prop("selected",!0)}))})),$("<h4 class='detail-cross-selling-heading'>"+g_accessories+"</h4>").insertBefore(".selling-1"),$("#product-detail-form").on("submit",(function(){$(".detail-cross-selling").each((function(e){var t=e+1;$("#csell"+t).prop("checked")&&setTimeout((function(){$("#product-detail-form-"+t+" button").click()}),300)}))})),$("#product-detail-form select").change((function(){if($("#product-detail-form select[data-parameter-name='"+g_color+"']").length)var e=$("#product-detail-form select[data-parameter-name='"+g_color+"']").attr("data-parameter-id"),t=$("#product-detail-form select[data-parameter-name='"+g_color+"']").find("option:selected").prop("value");if($("#product-detail-form select[data-parameter-name='"+g_propositions+"']").length)var a=$("#product-detail-form select[data-parameter-name='"+g_propositions+"']").attr("data-parameter-id"),i=$("#product-detail-form select[data-parameter-name='"+g_propositions+"']").find("option:selected").prop("value");if($("#product-detail-form select[data-parameter-name='"+g_colorOfPrism+"']").length)var r=$("#product-detail-form select[data-parameter-name='"+g_colorOfPrism+"']").attr("data-parameter-id"),n=$("#product-detail-form select[data-parameter-name='"+g_colorOfPrism+"']").find("option:selected").prop("value");if($("#product-detail-form select[data-parameter-name='"+g_surfaceColor+"']").length)var o=$("#product-detail-form select[data-parameter-name='"+g_surfaceColor+"']").attr("data-parameter-id"),s=$("#product-detail-form select[data-parameter-name='"+g_surfaceColor+"']").find("option:selected").prop("value");if(void 0===e)var l=a+"-"+i;else if(void 0===a)l=e+"-"+t;else{l=e+"-"+t+"-"+a+"-"+i;var c=a+"-"+i+"-"+e+"-"+t}if(void 0===r)var d=o+"-"+s;else if(void 0===n)d=r+"-"+n;else{d=r+"-"+n+"-"+o+"-"+s;var p=o+"-"+s+"-"+r+"-"+n}$(".p-info-wrapper span, .price-save span, .price-standard span, .bottomCta__price span").each((function(){$(this).removeClass("force-display")})),$("span."+l).addClass("force-display"),$("span."+c).addClass("force-display"),$("span."+d).addClass("force-display"),$("span."+p).addClass("force-display")}))}if($(".detail-cross-selling input").change((function(){$(this).is(":checked")?$(this).closest(".detail-cross-selling").addClass("checked"):$(this).closest(".detail-cross-selling").removeClass("checked")})),$(document).ready((function(){$(".p-final-price-wrapper .price-standard").length&&$(".p-final-price-wrapper .price-standard").insertBefore(".p-final-price-wrapper .price-final-holder:first-child")})),$(document).ready((function(){$(".add-to-cart-button").click((function(){setTimeout((function(){var e=$(".p-image-wrapper a").html(),t=$(".p-detail-inner-header h1").html(),a=$(".availability-value .parameter-dependent:not(.no-display) span").html(),i=parseInt($(".add-to-cart .amount").val()),r=$(".p-final-price-wrapper .price-final-holder:not(.noDisplay)").html(),n=parseFloat(r.split("<")[0].replace("€","").replace(",",".")).toFixed(2)*i;$(".extras-wrap").prepend('<div class="extras-product-heading"><span>'+g_product+"</span><span>"+g_availability+"</span><span>"+g_quantity+"</span><span>"+g_price+'</span></div><div class="extras-product"><div class="extras-product-img">'+e+'</div><div class="extras-product-name">'+t+'</div><div class="extras-product-stock">'+a+'</div><div class="extras-product-amount">'+i+" "+g_pieces+'</div><div class="extras-product-priceSingle">'+r+'</div><div class="extras-product-priceTotal">'+n+g_currency+" </div></div>"),$(".detail-cross-selling.checked").each((function(){var e=$(this).html("");$(e).insertAfter(".extras-product")})),$("#backToShop").remove(),$(".extra.step").prepend("<div class='btn' id='backToShop'>"+g_backToStore+"</div>"),$(".advanced-order .extra.step .btn-conversion").text(g_viewCart),$(".advanced-order .h1").text(g_addedToCart),$(".advanced-order .h1.advanced-order-suggestion").text(g_youMightLike),$("#backToShop").click((function(){$("#cboxClose").click()}))}),1e3)}))})),$(":lang(cs) .type-detail").length&&($(".price-final span").each((function(){var e=$(this).text().replace(/\s/g,"").replace(g_currency,"").replace(g_from,"");$(this).text(e);$(this).append("<span class='price-final-currency'> "+g_currency+"</span>")})),$(".price-final span.default-variant").prepend("<span class='price-final-pre'>"+g_from+" </span>"),$(".price-additional span").each((function(){var e=$(this).text().replace(/\s/g,"").replace(g_excludingVatModified,"").replace(g_from,"");$(this).text(e);$(this).append("<span class='price-final-dph'> "+g_excludingVat+"</span>")})),$(".price-additional span.default-variant").prepend("<span class='price-final-pre'>"+g_from+" </span>"),$(".price-standard span").each((function(){var e=$(this).text().replace(/\s/g,"").replace(g_currency,"").replace(g_from,"");$(this).text(e);$(this).append("<span class='price-final-currency'> "+g_currency+"</span>")})),$(".price-standard span.default-variant").prepend("<span class='price-final-pre'>"+g_from+" </span>"),$(".price-additional:not(:has(span))").each((function(){var e=$(this).text().replace(/\s/g,"").replace(g_excludingVatModified,"");$(this).text(e);$(this).append("<span class='price-final-dph'> "+g_excludingVat+"</span>")}))),$(".type-detail").length&&($(".extended-description h3").text(g_advantagesAndSpecifications),$(".products-related-header").text(g_similarFixturesAndFittings),$('a[href="#productsRelated"]').text(g_fixturesAndFittings)),$(".type-detail").length){var pName=$(".p-detail-inner-header h1").text(),pPrice=$(".p-final-price-wrapper .price-final").html();$('<div class="bottomCta"><div class="bottomCta__container"><div class="bottomCta__content"><div class="bottomCta__title">'+pName+'</div><div class="bottomCta__price">'+pPrice+'</div></div><div class="bottomCta__spinner"><input type="text" id="bottomCtaInput" value="1"><span class="increase"></span><span class="decrease"></span></div><div class="btn bottomCta__button" id="bottomCtaButton">'+g_addToCart+"</div></div></div>").insertBefore(".overall-wrapper"),$("#bottomCtaInput").change((function(){var e=$("#bottomCtaInput").val();$(".quantity input").val(e)})),$("#bottomCtaButton").click((function(){$(".add-to-cart-button").click()})),$(".bottomCta__spinner .increase").click((function(){var e=parseInt($("#bottomCtaInput").val());$(".add-to-cart .amount, #bottomCtaInput").val(e+1)})),$(".bottomCta__spinner .decrease").click((function(){var e=parseInt($("#bottomCtaInput").val());e>1&&$(".add-to-cart .amount, #bottomCtaInput").val(e-1)})),$(".add-to-cart .increase").click((function(){var e=parseInt($(".add-to-cart .amount").val());$("#bottomCtaInput").val(e+1)})),$(".add-to-cart .decrease").click((function(){var e=parseInt($(".add-to-cart .amount").val());e>1&&$("#bottomCtaInput").val(e-1)}))}if($("#ratingProduct>p").text(g_beFirstToRateThisProduct),$(".type-detail").length){$(".p-short-description").length||$("<div class='p-short-description'><p></p></div>").insertAfter(".add-to-cart");var desc=$("#descriptionLong .rte p").text(),descTrim=desc.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");$(".p-short-description p").text(descTrim)}if($(window).on("scroll",(function(){scrollPosition=$(this).scrollTop(),scrollPosition>=1e3?$(".type-detail").addClass("--bottomCtaActive"):$(".type-detail").removeClass("--bottomCtaActive")})),$("#content .availability-value .default-variant").text(g_chooseOptionToSeeDeliveryTime),$(".advanced-parameter").length&&$(".advanced-parameter").each((function(){var e=$(this).find(".advanced-parameter-inner").data("original-title");$(this).append("<div class='advanced-parameter-tooltip'>"+e+"</div>")})),$('.detail-parameters tr th:contains("'+g_category+':"), .detail-parameters tr th:contains("'+g_propositions+':"), .detail-parameters tr th:contains("'+g_color+':"), .detail-parameters tr th:contains("'+g_model+':")').parents("tr").remove(),$(".in-"+g_registrationUrl+" #register-form").length&&($('<div class="register-points"><h4 class="register-points__title">'+g_whatWillYouGet+"</h4><span>"+g_orderHistory+"</span><span>"+g_designNewsInformation+"</span><span>"+g_higherDiscountEveryPurchase+"</span></div>").insertBefore("#register-form"),$(".in-"+g_registrationUrl+" .content-inner h1").text(g_frequentBuyerRegistration),$("<p>"+g_frequentBuyerRegistrationText+"</p>").insertAfter(".in-"+g_registrationUrl+" .content-inner h1")),$("#rate-form").length&&$("#rate-form").prepend("<h3 class='vote-form-title'>"+g_addRating+"</h3>"),$(".blogCategories").length&&($(".blogCategories .blogCategories__bydleni").load("/"+category1Url+"/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>"+category1+"</h2>").insertBefore(".blogCategories .blogCategories__bydleni"),$("<div class='blogCategories__sectionShowMore'><a href='/"+category1Url+"/' class='blogCategories__sectionShowMoreLink'>"+g_moreArticles+"</a></div>").insertAfter(".blogCategories__bydleni .blogCategories__section .news-item:nth-child(2)")})),$(".blogCategories .blogCategories__rodina").load("/"+category2Url+"/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>"+category2+"</h2>").insertBefore(".blogCategories .blogCategories__rodina"),$("<div class='blogCategories__sectionShowMore'><a href='/"+category2Url+"/' class='blogCategories__sectionShowMoreLink'>"+g_moreArticles+"</a></div>").insertAfter(".blogCategories__rodina .blogCategories__section .news-item:nth-child(2)")})),$(".blogCategories .blogCategories__novinky").load("/"+category3Url+"/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>"+category3+"</h2>").insertBefore(".blogCategories .blogCategories__novinky"),$("<div class='blogCategories__sectionShowMore'><a href='/"+category3Url+"/' class='blogCategories__sectionShowMoreLink'>"+g_moreArticles+"</a></div>").insertAfter(".blogCategories__novinky .blogCategories__section .news-item:nth-child(2)")})),$(".blogCategories .blogCategories__benlemi-pomaha").load("/"+category4Url+"/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>"+category4+"</h2>").insertBefore(".blogCategories .blogCategories__benlemi-pomaha"),$("<div class='blogCategories__sectionShowMore'><a href='/"+category4Url+"/' class='blogCategories__sectionShowMoreLink'>"+g_moreArticles+"</a></div>").insertAfter(".blogCategories__benlemi-pomaha .blogCategories__section .news-item:nth-child(2)")})),$('<p style="text-align: center;">'+g_blogText+"</p>").insertAfter(".type-posts-listing .content-inner h1")),$(".logout").length&&($(".logout").insertAfter(".client-center-box"),$("<div class='client-contact-box'></div>").insertAfter(".client-center-box + .logout"),$(".client-contact-box").load("/"+g_cart1Url+"/ .checkout-box")),$(".in-"+g_inClientUrl+", .in-"+g_inSettingsUrl+", .in-"+g_inOrdersUrl+", .in-"+g_inClientOrdersUrl+", .in-"+g_inClientSaleUrl+", .in-"+g_inClientRatingUrl+", .in-"+g_inClientDocumentsUrl+", .in-"+g_inClientDiscussionUrl+", .in-"+g_inForgotPasswordUrl).length){name=$(".sidebar-inner ul li strong").text();$(".sidebar-inner strong").text(name+" "+g_inBenlemi),$(".in-"+g_inClientUrl+" .content-inner h1").text(g_welcomeTitle),$("<p>"+g_welcomeText+"</p>").insertAfter(".in-"+g_inClientUrl+" .content-inner h1")}$("#footer").length&&($("#signature .title").text("Shoptet"),$("#signature").prepend('<a href="https://benlemi.cz" class="title --benlemi">'+g_madeBy+' <img src="https://janheder.github.io/benlemi.cz/theme/dist/img/symbol-benlemi.svg" alt="Benlemi" class="image --benlemi"> Benlemi &</a>')),$(".vote-form-title").click((function(){$(".vote-form-title+#formRating").addClass("--active"),$(this).addClass("--hide")})),$("<span class='login-close'></span>").insertAfter(".user-action .login-widget .popup-widget-inner"),$(".login-close").click((function(){$("body").removeClass("user-action-visible login-window-visible")})),$(".in-login").length&&($(".content-inner > h1").text(g_loginToYourAccount),$("#formLogin .password-helper").prepend('<div class="login-form-points"><h4 class="login-form-register-title">'+g_becomeMember+'</h4><div class="login-form-points-wrap"><div class="login-form-point">'+g_discountForEachPurchase+'</div><div class="login-form-point">'+g_completeOverviewOfYourOrders+'</div><div class="login-form-point">'+g_designNewsInformation+'</div><div class="login-form-point">'+g_possibilityToRateAndDiscuss+"</div></div></div>"),$("#formLogin .password-helper a:last-child").text(g_forgotPassword).insertAfter(".login-wrapper button"));