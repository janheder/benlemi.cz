
// =============================================================================
// ADVANCED ORCDER SUMMARY
// =============================================================================


if ($(":lang(cs)").length){
    var am_title = "Zboží bylo přidáno do košíku";
    var am_back = "Zpět do obchodu";
    var am_gotocart = "Přejít do košíku";
    var am_currency = "Kč";
}

if ($(":lang(sk)").length){
    var am_title = "Tovar bol pridaný do košíka";
    var am_back = "Späť do obchodu";
    var am_gotocart = "Prejsť do košíka";
    var am_currency = "€";
}


if ($(".type-detail").length){

    $("body").append('<div class="advancedModal"><div class="advancedModal__inner"><h2 class="advancedModal__title">'+ am_title +'</h2><div class="advancedModal__content"></div><div class="advancedModal__buttons"><a href="/" class="btn btn-ghost">'+ am_back +'</a><a href="/kosik" class="btn">'+ am_gotocart +'</a></div></div></div>');

    if ($(".products-related").length){
        var related = $(".products-related").html();
        $(".advancedModal__inner").append('<div id="productsRelated"><h3 class="advancedModal__relatedTitle">Související produkty</h3><div class="products-block">' + related + '</div></div>');
    }
    
    function advanceOrderCustom() {
    
        $("body").addClass("--advancedModal");
        $(".advancedModal__content").html("");
    
        var img = $(".p-detail-inner .p-image-wrapper a").html();
        var name = $(".p-detail-inner .p-detail-inner-header h1").html();
        if($(".p-detail-inner .parameter-dependent").length){
            var stock = $(".p-detail-inner .availability-value .parameter-dependent:not(.noDisplay) span").html();
        }else{
            var stock = $(".p-detail-inner .availability-value").html();
        }
        var amount = parseFloat($(".p-detail-inner .add-to-cart .amount").val());
    
        var priceSingle = $(".p-detail-inner .p-final-price-wrapper .price-final-holder:not(.noDisplay)").html();
        var priceTotal = parseFloat(priceSingle.replace('€', '').replace(',','.'))*amount;  //sk version
    
        $(".advancedModal__content").prepend('<div class="advancedProduct">' +
        '<div class="advancedProduct-img">' + img + '</div>' +
        '<div class="advancedProduct-content">' +
        '<div class="advancedProduct-name">' + name + '</div>' +
        '<div class="advancedProduct-stock">Dostupnost<span>' + stock + '</span></div>' +
        '<div class="advancedProduct-amount">Počet kusů<span>' + amount + 'x</span></div>' +
        '<div class="advancedProduct-priceTotal">Celková cena<span>' + priceTotal + ' '+ am_currency +'</span></div>' +
        '</div></div>');
        
    }
    
    /* call functions after order modal loaded */
    document.addEventListener('ShoptetCartUpdated', function () {
        advanceOrderCustom();
    },{
        passive: true
    });

    $('.advancedModal').on('click',function(e){
        if (e.target !== this)
        return;
        $("body").removeClass("--advancedModal");
    });

}



if ($(".p .add-to-cart-button").length){

    $("body").append('<div class="advancedModal --product"><div class="advancedModal__inner"><h2 class="advancedModal__title">Zboží bylo přidáno do košíku</h2><div class="advancedModal__content"></div><div class="advancedModal__buttons"><a href="/" class="btn btn-ghost">Zpět do obchodu</a><a href="/kosik" class="btn">Přejít do košíku</a></div></div></div>');

    
    /* call functions after order modal loaded */
    $(".p .add-to-cart-button").on('click',function(){

        var img = $(this).closest(".p").find(".image").html();
        var name = $(this).closest(".p").find(".name").html();
        var stock = $(this).closest(".p").find(".availability").html();

        var amount = 1;

        var priceSingle = $(this).closest(".p").find(".price-final strong").html();
        var priceTotal = parseFloat(priceSingle.replace('€', '').replace(',','.'))*amount; //sk version

        document.addEventListener('ShoptetCartUpdated', function () {
            $("body").addClass("--advancedModalProduct");
            $(".advancedModal__content").html("");
        
            $(".advancedModal__content").prepend('<div class="advancedProduct">' +
            '<div class="advancedProduct-img">' + img + '</div>' +
            '<div class="advancedProduct-content">' +
            '<div class="advancedProduct-name">' + name + '</div>' +
            '<div class="advancedProduct-stock">Dostupnost<span>' + stock + '</span></div>' +
            '<div class="advancedProduct-amount">Počet kusů<span>' + amount + 'x</span></div>' +
            '<div class="advancedProduct-priceTotal">Celková cena<span>' + priceTotal + ' Kč</span></div>' +
            '</div></div>');
        },{
            passive: true
        });
    });




    $('.advancedModal.--product').on('click',function(e){
        if (e.target !== this)
        return;
        $("body").removeClass("--advancedModal");
    });
}