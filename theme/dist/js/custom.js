if($("[data-force-scroll]").length&&$("[data-force-scroll]").each((function(){$(this).removeAttr("data-force-scroll")})),$(document).ready((function(){$('a[href*="#"]').click((function(e){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var t=$(this.hash);(t=t.length?t:$("[name="+this.hash.slice(1)+"]")).length&&(e.preventDefault(),$("html, body").animate({scrollTop:t.offset().top},1e3,(function(){var e=$(t);if(e.focus(),e.is(":focus"))return!1;e.attr("tabindex","-1"),e.focus()})))}}))})),$("#content-wrapper").wrap("<div id='content-wrapper-wrap'></div>"),$((function(){var e=$("#header");e.addClass("no-scroll"),$(window).scroll((function(){var t=$(window).scrollTop();t>=0&&e.removeClass("no-scroll").addClass("scroll"),t<=0&&e.removeClass("scroll").addClass("no-scroll")}))})),$((function(){var e=$(".no-scroll");$(window).scrollTop()>0&&e.removeClass("no-scroll").addClass("scroll"),scroll<0&&e.removeClass("scroll").addClass("no-scroll")})),$(".search").length){if($("#footer").length)var mail=$("#footer .mail").text().replace(/\s/g,""),tel=$("#footer .tel").text().replace(/\s/g,"");else mail=$(".contact-box .mail a").text().replace(/\s/g,""),tel=$(".contact-box  .tel").text().replace(/\s/g,"");$(".search").before('<div class="header-contacts"><a href="tel:'+tel+'">'+tel+'</a><a href="mailto:'+mail+'">'+mail+"</a></div>")}function freeDelivery(){if($(".cart-count.full .cart-price").length){$(".headerFreeDelivery").remove();var e=$(".cart-price").html().replace(/\s/g,"");if(priceInt=parseInt(e),priceInt>1234)$("<div class='headerFreeDelivery free'>Dopravu máte zdarma</div>").insertBefore(".cart-count");else{var t=1234-priceInt;$("<div class='headerFreeDelivery'>Vyberte ještě za <span>"+t+" Kč</span><br>a dopravu máte zdarma</div>").insertBefore(".cart-count")}}else $(".headerFreeDelivery").remove(),$("<div class='headerFreeDelivery free'>Vyberte nad 1234 Kč<br>a máte dopravu zdarma</div>").insertBefore(".cart-count");$(".ordering-process").length&&$("<div class='headerFreeDelivery free'>Vyberte nad 1234 Kč<br>a máte dopravu zdarma</div>").insertAfter(".navLinks")}$(".navigation-buttons").prepend('<div class="nav-search" id="js-searchToggle"></div><a href="/login" class="nav-user"></a>'),$(".header-top").prepend('<div class="nav-menu-toggle" id="js-menuToggle"><span></span></div>'),$("#js-menuToggle, .menu-helper").click((function(){$(".header-top").toggleClass("--active"),$("body").toggleClass("--noScroll")})),$(".header-top .search-form input").prop("placeholder","Napište, co hledáte. Např. domečková postel"),$(".header-top .search").insertAfter("#navigation .menu-level-1>li:last-child"),$("#js-searchToggle").click((function(){$("#navigation .search").insertAfter(".navigation-buttons"),$(".search").hasClass("--active")?($(".search").removeClass("--active"),$(".menu-helper .search .form-control").blur()):($(".search").addClass("--active"),$(".menu-helper .search .form-control").focus())})),$(".cart-count").click((function(){window.location.href="/kosik/"})),$(".menu-level-1 .ext").hover((function(){$("body").addClass("submenu-active")}),(function(){$("body").removeClass("submenu-active")})),$(".popup-widget-inner h2").length?$('<div class="navLinks"><a href="/login/?backTo=%2F" class="top-nav-button top-nav-button-login primary login toggle-window navLinks__link" data-target="login" rel="nofollow">Přihlášení</a><a href="/registrace/" class="navLinks__link">Registrace</a><span class="navLinks__span">Jazyk:</span></div>').insertAfter(".nav-user"):$('<div class="navLinks"><a href="/klient/" class="navLinks__link --user">Uživatelský účet</a><span class="navLinks__span">Jazyk:</span></div>').insertAfter(".nav-user"),$(".navLinks").append('<div class="language-toggle" id="js-langToggle"><div><div class="language-toggle-item cz active">Česky</div><a href="https://benlemi.sk" class="language-toggle-item sk">Slovensky</a><a href="https://benlemi.com" class="language-toggle-item com">Anglicky</a></div></div>'),$("#js-langToggle").click((function(){$("#js-langToggle").toggleClass("--active")})),freeDelivery(),$(".add-to-cart .add-to-cart-button").click((function(){setTimeout((function(){freeDelivery()}),1e3)})),$(".site-msg").length&&($(".breadcrumbs").length&&$(".site-msg").insertBefore(".breadcrumbs"),$(".before-carousel").length&&$(".site-msg").insertBefore(".before-carousel"));var name=$(".popup-widget-inner p strong").text();if($(".navLinks__link.--user").text("Přihlášen: "+name),$(".menu-level-1 > li.ext").each((function(){$(this).prepend('<div class="menu-item-responsive"></div>');var e=$(this).children("a").prop("href");$(this).find(".menu-level-2").prepend('<a class="menu-item-more" href="'+e+'">Zobrazit vše</a>')})),$(".menu-item-responsive").click((function(){$(this).siblings(".menu-level-2").toggleClass("--active")})),$(".p-detail-inner-header").length&&$(".p-detail-inner-header").insertBefore(".p-final-price-wrapper"),$(".stars-wrapper").length&&$(".stars-wrapper").insertBefore(".p-final-price-wrapper"),$(".type-detail").length&&($("#ratingTab").wrapInner("<div id='ratingProduct'></div>"),$("#ratingTab").append("<div id='ratingStore'></div>"),$("#ratingProduct").prepend("<h1>Hodnocení produktu</h1>"),$("#ratingTab #ratingStore").load("/hodnoceni-obchodu/ .content-inner",(function(){$("<a href='/hodnoceni-obchodu' class='btn btn-secondary' id='js-ratingStoreToggle'>Přidat hodnocení</div>").insertBefore("#ratingStore #rate-form"),$(".rate-wrapper .vote-form .vote-form-title").click((function(){$(".vote-form-title + #formRating").addClass("--active"),$(this).addClass("--hide")}))}))),$("#closeModal").click((function(){$("#cboxOverlay").click()})),$(".products-related-header, .products-related").wrapAll("<div id='productsRelated'>"),$("#p-detail-tabs").append('<li class="shp-tab"><a href="#productsRelated" class="shp-tab-link" role="tab" data-toggle="tab">Související</a></li>'),$(".hidden-split-parameter").length&&$(".hidden-split-parameter").each((function(){$(this).prop("required",!0)})),$("#p-detail-tabs").length&&$("#p-detail-tabs .shp-tab-link").each((function(){$(this).removeAttr("data-toggle")})),$("#relatedFiles").length&&$('select[data-parameter-name="Rozměr"]').change((function(){$(".description-infographics").remove();var e=$('select[data-parameter-name="Rozměr"] option:selected').text().replace(/[cm]/g,"").replace(/\s/g,""),t=$('#relatedFiles a[title*="'+e+'"]').attr("href");void 0!==t?($(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>Stáhnout infografiku</a></div>'),$(".description-infographics img").attr("src",t),$(".description-infographics a").attr("href",t)):$(".description-infographics").remove()})),$(".p-info-wrapper").length&&$(".p-info-wrapper .stars-wrapper, .p-detail-info > div:last-child").appendTo(".p-detail-inner-header"),$("#productVideos").length&&$("#productVideos").appendTo(".p-thumbnails-wrapper"),$(".p-thumbnails-wrapper").length&&$(".p-thumbnails-inner > div > a:last-child").after('<div id="thumbnailsShowMore"><div class="thumbnailsShowMore-inner">Zobrazit vše</div></div>'),$("#thumbnailsShowMore").click((function(){$(".p-thumbnails-inner").toggleClass("--active")})),$("#productsRelated").insertBefore("#productDiscussion"),$(".basic-description").attr("id","descriptionLong"),$('#p-detail-tabs a[href="#description"]').attr("href","#descriptionLong"),$("#p-detail-tabs").prepend('<li class="shp-tab"><a href="#description" class="shp-tab-link" role="tab">Parametry</a></li>'),$('.p-info-wrapper a[href="#description"]').text("Zobrazit informace "),$(".in-children-s-wooden-house-beds").length&&$("#productsRelated .flag-custom2").length){var i=0;$("#productsRelated .flag-custom2").each((function(e){var t=e+1,a=$(this).closest(".p").find(".name").prop("title"),i=$(this).closest(".p").find(".image img").prop("src"),n=$(this).closest(".p").find(".price-final strong").text();$(".p-info-wrapper .add-to-cart").before('<div class="detail-cross-selling selling-'+t+'"><input type="checkbox" id="csell'+t+'" name="csell'+t+'"><label for="csell'+t+'"><img src="'+i+'"><span><span>'+a+"</span><span>"+n+"</span></span></label></div>");var o=$(this).closest("a.image").prop("href");$("body").append('<div id="crossSelling'+t+'"></div>'),$("#crossSelling"+t).load(o+" #product-detail-form",(function(){$("#crossSelling"+t+" form").prop("id","product-detail-form-"+t)})),$("#product-detail-form select[data-parameter-name='Barva']").change((function(){var e=$("#product-detail-form select[data-parameter-name='Barva'] option:selected").text();$("#crossSelling"+t+" option").filter((function(){return $(this).text()==e})).prop("selected",!0)}))})),$("<h4 class='detail-cross-selling-heading'>Doplňky</h4>").insertBefore(".selling-1"),$("#product-detail-form").on("submit",(function(){$(".detail-cross-selling").each((function(e){var t=e+1;$("#csell"+t).prop("checked")&&setTimeout((function(){$("#product-detail-form-"+t+" button").click()}),300)}))})),$("#product-detail-form select").change((function(){if($("#product-detail-form select[data-parameter-name='Barva']").length)var e=$("#product-detail-form select[data-parameter-name='Barva']").attr("data-parameter-id"),t=$("#product-detail-form select[data-parameter-name='Barva']").find("option:selected").prop("value");if($("#product-detail-form select[data-parameter-name='Rozměr']").length)var a=$("#product-detail-form select[data-parameter-name='Rozměr']").attr("data-parameter-id"),i=$("#product-detail-form select[data-parameter-name='Rozměr']").find("option:selected").prop("value");if(void 0===e)var n=a+"-"+i;else if(void 0===a)n=e+"-"+t;else n=e+"-"+t+"-"+a+"-"+i;$(".p-info-wrapper span, .price-save span, .price-standard span, .bottomCta__price span").each((function(){$(this).removeClass("force-display")})),$("span."+n).addClass("force-display")}))}if($(".detail-cross-selling input").change((function(){$(this).is(":checked")?$(this).closest(".detail-cross-selling").addClass("checked"):$(this).closest(".detail-cross-selling").removeClass("checked")})),$(document).ready((function(){$(".p-final-price-wrapper .price-standard").length&&$(".p-final-price-wrapper .price-standard").insertBefore(".p-final-price-wrapper .price-final-holder:first-child")})),$(document).ready((function(){$(".add-to-cart-button").click((function(){setTimeout((function(){var e=$(".p-image-wrapper a").html(),t=$(".p-detail-inner-header h1").html(),a=$(".availability-value .parameter-dependent:not(no-display) span").html(),i=parseInt($(".add-to-cart .amount").val()),n=$(".price-final-holder:not(no-display)").html(),o=$(".price-final-holder:not(no-display)").html(),r=parseInt(o.split("<")[0])*i;$(".extras-wrap").prepend('<div class="extras-product-heading"><span>Produkt</span><span>Dostupnost</span><span>Počet kusů</span><span>Cena</span></div><div class="extras-product"><div class="extras-product-img">'+e+'</div><div class="extras-product-name">'+t+'</div><div class="extras-product-stock">'+a+'</div><div class="extras-product-amount">'+i+' kus/ů</div><div class="extras-product-priceSingle">'+n+'</div><div class="extras-product-priceTotal">'+r+" Kč</div></div>"),$("#backToShop").remove(),$(".extra.step").prepend("<div class='btn' id='backToShop'>Zpět do obchodu</div>"),$(".advanced-order .extra.step .btn-conversion").text("Přejít do košíku"),$(".advanced-order .h1").text("S radostí přidáno do vašeho košíku"),$(".advanced-order .h1.advanced-order-suggestion").text("Co se vám ještě hodí"),$("#backToShop").click((function(){$("#cboxClose").click()}))}),1e3)}))})),$(".type-detail").length&&($(".price-final span").each((function(){var e=$(this).text().replace(/\s/g,"").replace("Kč","").replace("od","");$(this).text(e);$(this).append("<span class='price-final-currency'> Kč</span>")})),$(".price-final span.default-variant").prepend("<span class='price-final-pre'>od </span>"),$(".price-additional span").each((function(){var e=$(this).text().replace(/\s/g,"").replace("KčbezDPH","").replace("od","");$(this).text(e);$(this).append("<span class='price-final-dph'> Kč bez DPH</span>")})),$(".price-additional span.default-variant").prepend("<span class='price-final-pre'>od </span>"),$(".price-standard span").each((function(){var e=$(this).text().replace(/\s/g,"").replace("Kč","").replace("od","");$(this).text(e);$(this).append("<span class='price-final-currency'> Kč</span>")})),$(".price-standard span.default-variant").prepend("<span class='price-final-pre'>od </span>"),$(".price-additional:not(:has(span))").each((function(){var e=$(this).text().replace(/\s/g,"").replace("KčbezDPH","");$(this).text(e);$(this).append("<span class='price-final-dph'> Kč bez DPH</span>")}))),$(".type-detail").length&&($(".extended-description h3").text("Výhody a parametry"),$(".products-related-header").text("Potřebné příslušenství, které oceníte:"),$('a[href="#productsRelated"]').text("Příslušenství")),$(".type-detail").length){var pName=$(".p-detail-inner-header h1").text(),pPrice=$(".p-final-price-wrapper .price-final").html();$('<div class="bottomCta"><div class="bottomCta__container"><div class="bottomCta__content"><div class="bottomCta__title">'+pName+'</div><div class="bottomCta__price">'+pPrice+'</div></div><div class="bottomCta__spinner"><input type="text" id="bottomCtaInput" value="1"><span class="increase"></span><span class="decrease"></span></div><div class="btn bottomCta__button" id="bottomCtaButton">Přidat do košíku</div></div></div>').insertBefore(".overall-wrapper"),$("#bottomCtaInput").change((function(){var e=$("#bottomCtaInput").val();$(".quantity input").val(e)})),$("#bottomCtaButton").click((function(){$(".add-to-cart-button").click()})),$(".bottomCta__spinner .increase").click((function(){var e=parseInt($("#bottomCtaInput").val());$(".add-to-cart .amount, #bottomCtaInput").val(e+1)})),$(".bottomCta__spinner .decrease").click((function(){var e=parseInt($("#bottomCtaInput").val());e>1&&$(".add-to-cart .amount, #bottomCtaInput").val(e-1)})),$(".add-to-cart .increase").click((function(){var e=parseInt($(".add-to-cart .amount").val());$("#bottomCtaInput").val(e+1)})),$(".add-to-cart .decrease").click((function(){var e=parseInt($(".add-to-cart .amount").val());e>1&&$("#bottomCtaInput").val(e-1)}))}if($("#ratingProduct>p").text("Buďte první, kdo napíše hodnocení k tomuto produktu"),$(".type-detail").length){var desc=$("#descriptionLong .rte p").text(),descTrim=desc.replace(/(([^\s]+\s\s*){40})(.*)/,"$1…");$(".p-short-description p").text(descTrim)}if($(window).on("scroll",(function(){scrollPosition=$(this).scrollTop(),scrollPosition>=1e3?$(".bottomCta").addClass("--active"):$(".bottomCta").removeClass("--active")})),$("#content .availability-value .default-variant").text("Zvolte variantu pro zobrazení dob doručení"),$(".in-registrace #register-form").length&&($('<div class="register-points"><h4 class="register-points__title">Co získáte?</h4><span>Kompletní historii všech svých objednávek </span><span>Info o designových novinkách </span><span>Vyší slevy s každým dalším nákupem</span></div>').insertBefore("#register-form"),$(".in-registrace .content-inner h1").text("Vybíráte u nás častěji? Rovnou se zaregistrujte"),$("<p>Automaticky se stanete členem věrnostního programu rodiny Benlemi a budete sbírat slevy za každý svůj nákup.</p>").insertAfter(".in-registrace .content-inner h1")),$("#rate-form").length&&$("#rate-form").prepend("<h3 class='vote-form-title'>Přidat hodnocení</h3>"),$(".blogCategories").length&&($(".blogCategories .blogCategories__bydleni").load("/blog-bydleni/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>Bydlení</h2>").insertBefore(".blogCategories .blogCategories__bydleni"),$("<div class='blogCategories__sectionShowMore'><a href='/blog-bydleni/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__bydleni .blogCategories__section .news-item:nth-child(2)")})),$(".blogCategories .blogCategories__rodina").load("/blog-rodina/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>Rodina</h2>").insertBefore(".blogCategories .blogCategories__rodina"),$("<div class='blogCategories__sectionShowMore'><a href='/blog-rodina/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__rodina .blogCategories__section .news-item:nth-child(2)")})),$(".blogCategories .blogCategories__novinky").load("/blog-novinky/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>Novinky</h2>").insertBefore(".blogCategories .blogCategories__novinky"),$("<div class='blogCategories__sectionShowMore'><a href='/blog-novinky/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__novinky .blogCategories__section .news-item:nth-child(2)")})),$(".blogCategories .blogCategories__benlemi-pomaha").load("/blog-benlemi-pomaha/ .news-wrapper",(function(){$("<h2 class='blogCategories__sectionTitle'>Benlemi pomáhá</h2>").insertBefore(".blogCategories .blogCategories__benlemi-pomaha"),$("<div class='blogCategories__sectionShowMore'><a href='/blog-benlemi-pomaha/' class='blogCategories__sectionShowMoreLink'>Více článků</a></div>").insertAfter(".blogCategories__benlemi-pomaha .blogCategories__section .news-item:nth-child(2)")}))),$(".logout").length&&($(".logout").insertAfter(".client-center-box"),$("<div class='client-contact-box'></div>").insertAfter(".client-center-box + .logout"),$(".client-contact-box").load("/objednavka/krok-1/ .checkout-box")),$(".in-klient, .in-nastaveni, .in-objednavky, .in-klient-objednavky, .in-klient-slevy, .in-klient-hodnoceni, .in-klient-doklady, .in-klient-diskuze, .in-zapomenute-heslo").length){name=$(".sidebar-inner ul li strong").text();$(".sidebar-inner strong").text(name+" v Benlemi"),$(".in-klient .content-inner h1").text("Vítejte v naší rodině"),$("<p>Patříte mezi nás. Proto můžete sbírat slevy, hodnotit produkty nebo si prohlížet své objednávky, kdykoliv se vám zachce.</p>").insertAfter(".in-klient .content-inner h1")}$("#footer").length&&($("#signature .title").text("Shoptet"),$("#signature").prepend('<a href="https://benlemi.cz" class="title --benlemi">Vytvořili <img src="https://janheder.github.io/benlemi.cz/theme/dist/img/symbol-benlemi.svg" alt="Benlemi" class="image --benlemi"> Benlemi &</a>')),$(".vote-form-title").click((function(){$(".vote-form-title+#formRating").addClass("--active"),$(this).addClass("--hide")})),$(".empty-content-404 h1").text("Tahle stránka je vzhůru nohama"),$("<p>Náš kvalitní nábytek naštěstí stojí všema nohama pevně na zemi. Tak si vyberte unikátní domečkovou postel nebo cokoliv, čím proměníte svůj byt v krásný domov.</p>").insertAfter(".empty-content-404 h1"),$("<span class='login-close'></span>").insertAfter(".user-action .login-widget .popup-widget-inner"),$(".login-close").click((function(){$("body").removeClass("user-action-visible login-window-visible")})),$(".in-login").length&&($(".content-inner > h1").text("Přihlaste se ke svému účtu"),$("#formLogin .password-helper").prepend('<div class="login-form-points"><h4 class="login-form-register-title">Staňte se členem rodiny<br>Benlemi a získáte:</h4><div class="login-form-points-wrap"><div class="login-form-point">slevy za každý svůj nákup</div><div class="login-form-point">kompletní přehled o objednávkách</div><div class="login-form-point">info o designových novinkách</div><div class="login-form-point">možnost hodnotit i debatovat</div></div></div>'),$("#formLogin .password-helper a:last-child").text("Zapomněli jste heslo?").insertAfter(".login-wrapper button"));