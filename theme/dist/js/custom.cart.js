if($(".ordering-process").length&&$(".cart-header").insertBefore(".content-wrapper-in"),$(".cart-table").length&&($("<div class='cart-table-heading'></div>").insertBefore(".content-wrapper-in"),$(".cart-table-heading").prepend("<span>Název produktu</span>"),$(".removeable:first-child .p-label").each((function(){var e=$(this).html();$(".cart-table-heading span:last-child").after("<span>"+e+"</span>")}))),$(".ordering-process").length&&($(".cart-header").append('<li class="step step-4"><strong><span>Dokončení objednávky</span></strong></li>'),$(".cart-header .step-2 span").text("Doprava a platba"),$(".cart-header .step-3 span").text("Kontaktní údaje")),$(".in-krok-2").length&&($(".in-krok-2 .co-billing-address #company-info").insertAfter(".in-krok-2 .co-billing-address fieldset > h4"),$(".in-krok-2 .co-billing-address .unveil-wrapper").insertAfter(".in-krok-2 .co-billing-address fieldset > h4"),$(".stay-in-touch .form-group:nth-child(2)").addClass("register"),$(".stay-in-touch .form-group.register").insertAfter(".co-contact-information"),$(".co-contact-information h4 + .form-group label").text("Už jste u nás zaregistrovaní?"),$(".co-contact-information h4 + .form-group a").text("Přihlaste se"),$("#sendNewsletter + label").text("Dostávejte naše maily. Posíláme skutečně jen užitečné informace o bydlení, novinkách a slevách.")),$("#company-shopping").change((function(){$("#company-info input").each((function(){$(this).prop("required",!0)}))})),$(".in-dekujeme").length){var num=$(".reca-number strong").text();$(".recapitulation-wrapper .co-order .order-content").text("Obsah objednávky: "+num),$(".order-summary-heading").text("Potvrzujeme, že jste si právě udělali radost"),$(".reca-number").text("Doma to budete mít krásné a ještě jste podpořili českou rodinnou firmu. Do 30 minut vám pošleme email se všemi důležitými informacemi.")}$(".related").each((function(){$(this).prepend('<h4 class="related-title">Související produkty</h4>')})),$(".main-link").each((function(){var e=$(this).attr("href");$(".cart-related-name[href='"+e+"']").parents(".cart-related-product").remove()}));