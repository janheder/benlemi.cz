
// =============================================================================
// ADVANCED ORCDER SUMMARY
// =============================================================================

if ($(":lang(cs)").length){
    var am_title = "Zboží bylo přidáno do košíku";
    var am_stock = "Dostupnost";
    var am_amount = "Počet kusů";
    var am_totalprice = "Celková cena";
    var am_back = "Zpět do obchodu";
    var am_gotocart = "Přejít do košíku";
    var am_currency = "Kč";
    var am_related = "Související produkty";
    var am_cartUrl = "/kosik";
}

if ($(":lang(sk)").length){
    var am_title = "Tovar bol pridaný do košíka";
    var am_stock = "Dostupnosť";
    var am_amount = "Počet kusov";
    var am_totalprice = "Celková cena";
    var am_back = "Späť do obchodu";
    var am_gotocart = "Prejsť do košíka";
    var am_currency = "€";
    var am_related = "Súvisiace produkty";
    var am_cartUrl = "/kosik";
}

if ($(":lang(en)").length){
    var am_title = "Product has been added to cart";
    var am_stock = "Availability";
    var am_amount = "Number of pieces";
    var am_totalprice = "Total price";
    var am_back = "Back to the store";
    var am_gotocart = "Go to cart";
    var am_currency = "€";
    var am_related = "Related products";
    var am_cartUrl = "/cart";
}

if ($(":lang(ro)").length){
    var am_title = "Produsul a fost adăugat în coș";
    var am_stock = "Stoc";
    var am_amount = "Număr de bucați";
    var am_totalprice = "Pretul total";
    var am_back = "Înapoi la magazin";
    var am_gotocart = "Du-te la coș";
    var am_currency = "lei";
    var am_related = "Produse asemanatoare";
    var am_cartUrl = "/cos-de-cumparaturi";
}

if ($(":lang(hu)").length){
    var am_title = "A termék a kosárba került";
    var am_stock = "Elérhetőség";
    var am_amount = "Darbok száma";
    var am_totalprice = "Teljes ár";
    var am_back = "Vissza az áruházba";
    var am_gotocart = "Ugrás a kosárba";
    var am_currency = "Ft";
    var am_related = "Kapcsolódó termékek";
    var am_cartUrl = "/kosar";
}

if ($(".type-detail").length){

    $("body").append('<div id="advancedModal" class="advancedModal"><div class="advancedModal__inner"><h2 class="advancedModal__title">'+ am_title +'</h2><div class="advancedModal__content"></div><div class="advancedModal__buttons"><a href="/" class="btn btn-ghost">'+ am_back +'</a><a href="'+ am_cartUrl +'" class="btn">'+ am_gotocart +'</a></div></div></div>');

    if ($(".products-related").length){
        var related = $(".products-related").html();
        $(".advancedModal__inner").append('<div id="productsRelated"><h3 class="advancedModal__relatedTitle">'+ am_related +'</h3><div class="products-block">' + related + '</div></div>');
    }
    

    
    /* call functions after order modal loaded */
    $(".p-detail .add-to-cart-button").on('click',function(){
    
        var img = $(".p-detail-inner .p-image-wrapper a").html();
        var name = $(".p-detail-inner .p-detail-inner-header h1").html();
        if($(".p-detail-inner .parameter-dependent").length){
            var stock = $(".p-detail-inner .availability-value .parameter-dependent:not(.noDisplay) span").html();
        }else{
            var stock = $(".p-detail-inner .availability-value").html();
        }
        var amount = parseFloat($(".p-detail-inner .add-to-cart .amount").val());
    
        var priceSingle = $(".p-detail-inner .p-final-price-wrapper .price-final-holder:not(.noDisplay)").html();
        if ($(":lang(cs)").length){
            var priceTotal = parseInt(priceSingle.replace('Kč', '').replace(/\s/g,''))*amount;  //cz version
        }
        if ($(":lang(sk)").length){
            var priceTotal = parseFloat(priceSingle.replace('€', '').replace(/\s/g, '').replace(',','.'))*amount;  //sk version
        }
        if ($(":lang(en").length){
            var priceTotal = parseFloat(priceSingle.replace('€', '').replace(/\s/g, '').replace(',','.'))*amount;  //sk version
        }
        if ($(":lang(ro)").length){
            var priceTotal = parseFloat(priceSingle.replace('lei', '').replace(/\s/g, '').replace(',','.'))*amount;  //ro version
        }
        if ($(":lang(hu)").length){
            var priceTotal = parseInt(priceSingle.replace('Ft', '').replace(/\s/g,''))*amount;  //hu version
        }

        document.addEventListener('ShoptetCartUpdated', function () {

            $("body").addClass("--advancedModal");
            $(".advancedModal__content").html("");

            $(".advancedModal__content").prepend('<div class="advancedProduct">' +
            '<div class="advancedProduct-img">' + img + '</div>' +
            '<div class="advancedProduct-content">' +
            '<div class="advancedProduct-name">' + name + '</div>' +
            '<div class="advancedProduct-stock">' + am_stock + '<span>' + stock + '</span></div>' +
            '<div class="advancedProduct-amount">' + am_amount + '<span>' + amount + 'x</span></div>' +
            '<div class="advancedProduct-priceTotal">' + am_totalprice + '<span>' + priceTotal + ' '+ am_currency +'</span></div>' +
            '</div></div>');
            console.log(priceTotal);
        },{
            passive: true
        });
    });

    $('.advancedModal').on('click',function(e){
        if (e.target !== this)
        return;
        $("body").removeClass("--advancedModal");
    });

}



if ($(".p .add-to-cart-button").length){

    $("body").append('<div id="advancedModalProduct" class="advancedModal"><div class="advancedModal__inner"><h2 class="advancedModal__title">'+ am_title +'</h2><div class="advancedModal__content"></div><div class="advancedModal__buttons"><a href="/" class="btn btn-ghost">'+ am_back +'</a><a href="'+ am_cartUrl +'" class="btn">'+ am_gotocart +'</a></div></div></div>');

    
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
            '<div class="advancedProduct-stock">' + am_stock + '<span>' + stock + '</span></div>' +
            '<div class="advancedProduct-amount">' + am_amount + '<span>' + amount + 'x</span></div>' +
            '<div class="advancedProduct-priceTotal">' + am_totalprice + '<span>' + priceTotal + ' '+ am_currency +'</span></div>' +
            '</div></div>');
        },{
            passive: true
        });
    });


    $('.advancedModal.--product').on('click',function(e){
        if (e.target !== this)
        return;
        $("body").removeClass("--advancedModalProduct");
    });
}