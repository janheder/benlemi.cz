if($(".ordering-process").length&&$(".cart-header").insertBefore(".content-wrapper-in"),$(".cart-table").length&&($("<div class='cart-table-heading'></div>").insertBefore(".content-wrapper-in"),$(".cart-table-heading").prepend("<span>"+g_productName+"</span>"),$(".removeable:first-child .p-label").each((function(){var e=$(this).html();$(".cart-table-heading span:last-child").after("<span>"+e+"</span>")}))),$(".ordering-process").length&&($(".cart-header").append('<li class="step step-4"><strong><span>'+g_completeOrder+"</span></strong></li>"),$(".cart-header .step-2 span").text(g_deliveryAndPayment),$(".cart-header .step-3 span").text(g_contactInfo)),$(".in-krok-2").length&&($(".in-krok-2 .co-billing-address #company-info").insertAfter(".in-krok-2 .co-billing-address fieldset > h4"),$(".in-krok-2 .co-billing-address .unveil-wrapper").insertAfter(".in-krok-2 .co-billing-address fieldset > h4"),$(".stay-in-touch .form-group:nth-child(2)").addClass("register"),$(".stay-in-touch .form-group.register").insertAfter(".co-contact-information"),$(".co-contact-information h4 + .form-group label").text(g_areYouSigned),$(".co-contact-information h4 + .form-group a").text(g_signIn),$("#sendNewsletter + label").text(g_receiveOurEmailTitle)),$("#company-shopping").change((function(){$("#company-info input").each((function(){$(this).prop("required",!0)}))})),$(".in-dekujeme").length){var num=$(".reca-number strong").text();$(".recapitulation-wrapper .co-order .order-content").text(g_orderContent+": "+num),$(".order-summary-heading").text(g_orderCompleteTitle),$(".reca-number").text(g_orderCompleteText)}$(".related").each((function(){$(this).prepend('<h4 class="related-title">'+g_relatedProducts+"</h4>")})),$(".main-link").each((function(){var e=$(this).attr("href");$(".cart-related-name[href='"+e+"']").parents(".cart-related-product").remove()})),$(".show-related").text(g_showMoreRelatedProducts),$(".in-kosik .cart-related-button .btn").text(g_show),$(".related").append("<div class='showMoreRelated'>"+g_showMore+"</div>"),$(".showMoreRelated").click((function(){$(this).parent(".related").addClass("visible"),$(this).remove()}));