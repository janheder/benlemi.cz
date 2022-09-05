// -----------------------------------------------------------------------------
// CART
// -----------------------------------------------------------------------------

/* relocate cart heading navigation */
if ($(".ordering-process").length){
    $(".cart-header").insertBefore('.content-wrapper-in');
}

/* add heading to cart table */
if ($(".cart-table").length){
    $("<div class='cart-table-heading'></div>").insertBefore(".content-wrapper-in");
    $(".cart-table-heading").prepend("<span>" + g_productName + "</span>");

    $(".removeable:first-child .p-label").each(function(){
        var label = $(this).html();
        $(".cart-table-heading span:last-child").after("<span>" + label + "</span>");
    });
}

/* remove duplicated label for user discount */
if ($("html:lang(cs) .ordering-process .cart-table-heading span:contains('Sleva')").length){
    $(".cart-table-heading span:contains('Sleva')").remove();
    $("<span>Sleva</span>").insertBefore(".cart-table-heading span:contains('Součet')");
}

/* add 4. step */
if ($(".ordering-process").length){
    $(".cart-header").append('<li class="step step-4"><strong><span>' + g_completeOrder + '</span></strong></li>');
    $(".cart-header .step-2 span").text(g_deliveryAndPayment);
    $(".cart-header .step-3 span").text(g_contactInfo);

    $("#add-note").prop("checked", true);
}


/*
    if ($(".ordering-process").length){
        $(".discount-coupon").insertBefore('.price-wrapper .price-label.price-primary');
    }
*/

/* customize cart step 2 */
if ($(".in-" + g_cart2).length){
    $(".in-" + g_cart2 + " .co-billing-address #company-info").insertAfter('.in-' + g_cart2 + ' .co-billing-address fieldset > h4');
    $(".in-" + g_cart2 + " .co-billing-address .unveil-wrapper").insertAfter('.in-' + g_cart2 + ' .co-billing-address fieldset > h4');
    $(".stay-in-touch .form-group:nth-child(2)").addClass("register");
    $(".stay-in-touch .form-group.register").insertAfter(".co-contact-information");

    $(".co-contact-information h4 + .form-group label").text(g_areYouSigned);
    $(".co-contact-information h4 + .form-group a").text(g_signIn);

    $("#sendNewsletter + label").text(g_receiveOurEmailTitle);

}

/* make company info required */
$("#company-shopping").change(function(){
    $("#company-info input").each(function(){
        $(this).prop("required", true);
    });
});

/* cart finish step */
if ($(".in-" + g_inThankYou).length){
    var num = $(".reca-number strong").text();
    $(".recapitulation-wrapper .co-order .order-content").text(g_orderContent + ": "+ num);
    $(".order-summary-heading").text(g_orderCompleteTitle);
    $(".reca-number").text(g_orderCompleteText);
}

/* add title to related products */
$(".related").each(function(){
    $(this).prepend('<h4 class="related-title">' + g_relatedProducts + '</h4>');
});



/* remove duplicated related products in cart */
$(".main-link").each(function(){
    var href= $(this).attr("href");
    $(".cart-related-name[href='"+ href +"']").parents(".cart-related-product").remove();
});

$(".show-related").text(g_showMoreRelatedProducts);
$(".in-" + g_cartUrl + " .cart-related-button .btn").text(g_show);
$(".related").append("<div class='showMoreRelated'>" + g_showMore + "</div>");

$(".showMoreRelated").click(function(){
    $(this).parent(".related").addClass("visible");
    $(this).remove();
});


$(".cart-summary .extras-wrap .extra.discount").html('<a href="/registrace">' + g_discountText + '</div');


