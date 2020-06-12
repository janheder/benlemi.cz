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
    $(".cart-table-heading").prepend("<span>Název produktu</span>");

    $(".removeable:first-child .p-label").each(function(){
        var label = $(this).html();
        $(".cart-table-heading span:last-child").after("<span>" + label + "</span>");
    });
}


/* add 4. step */
if ($(".ordering-process").length){
    $(".cart-header").append('<li class="step step-4"><strong><span>Dokončení objednávky</span></strong></li>');
    $(".cart-header .step-2 span").text('Doprava a platba');
    $(".cart-header .step-3 span").text('Kontaktní údaje');
}

/*
    if ($(".ordering-process").length){
        $(".discount-coupon").insertBefore('.price-wrapper .price-label.price-primary');
    }
*/

/* customize cart step 2 */
if ($(".in-krok-2").length){
    $(".in-krok-2 .co-billing-address #company-info").insertAfter('.in-krok-2 .co-billing-address fieldset > h4');
    $(".in-krok-2 .co-billing-address .unveil-wrapper").insertAfter('.in-krok-2 .co-billing-address fieldset > h4');
    $(".stay-in-touch .form-group:nth-child(2)").addClass("register");
    $(".stay-in-touch .form-group.register").insertAfter(".co-contact-information");

    $(".co-contact-information h4 + .form-group label").text("Už jste u nás zaregistrovaní?");
    $(".co-contact-information h4 + .form-group a").text("Přihlaste se");

    $("#sendNewsletter + label").text("Dostávejte naše maily. Posíláme skutečně jen užitečné informace o bydlení, novinkách a slevách.");

}

/* make company info required */
$("#company-shopping").change(function(){
    $("#company-info input").each(function(){
        $(this).prop("required", true);
    });
});

/* cart finish step */
if ($(".in-dekujeme").length){
    var num = $(".reca-number strong").text();
    $(".recapitulation-wrapper .co-order .order-content").text("Obsah objednávky: "+ num);
    $(".order-summary-heading").text("Potvrzujeme, že jste si právě udělali radost");
    $(".reca-number").text("Doma to budete mít krásné a ještě jste podpořili českou rodinnou firmu. Do 30 minut vám pošleme email se všemi důležitými informacemi.");
}

/* add title to related products */
$(".related").each(function(){
    $(this).prepend('<h4 class="related-title">Související produkty</h4>');
});



/* remove duplicated related products in cart */
$(".main-link").each(function(){
    var href= $(this).attr("href");
    $(".cart-related-name[href='"+ href +"']").parents(".cart-related-product").remove();
});

$(".show-related").text("Všechny související produkty");

$(".related").append("<div class='showMoreRelated'>Související produkt</div>");

$(".showMoreRelated").click(function(){
    $(this).parent(".related").addClass("visible");
    $(this).remove();
});