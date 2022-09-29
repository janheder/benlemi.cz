// =============================================================================
// LOAD NEWS 
// =============================================================================

$(document).ready(function() {

    if ($(".in-index").length){
        const loadNews = (html) => {
            const nodes = new DOMParser().parseFromString(html, 'text/html');
            const body = nodes.querySelectorAll('.news-wrapper .news-item:nth-child(-n+3)');
            for(var i = 0; i <= 2; i++) {
                document.querySelector('.in-index #newsWrapper').appendChild(body[i]);
            }
        };
        fetch("/" + category1Url + "/")
            .then((response) => response.text())
            .then(loadNews)
    }
});

// =============================================================================
// REFACTORED PAGIANTION
// =============================================================================


if ($(".pagination").length){

    function refactorPagi(){ 
        var current = parseInt($(".pagination .current").text());
        var max = parseInt($(".pagination > *:last-child").text());
        var currentUrl = window.location.href;
        var currentUrlS = currentUrl.slice(0, currentUrl.indexOf('/strana'));

        $(".pagination *").remove();
    
        for(var i = 1; i <= max ; i++) {
            if(i == current){
                $('.pagination').append("<strong class='current'>" + i + "</strong>");
            }else if( (current - i)>1 || (i - current)>1){
                if(i == 1  || i == max ){
                     $('.pagination').append("<a href='"+ currentUrlS +"/strana-" + i + "'>" + i + "</a>");      
                }else{
                     $('.pagination').append("<a class='hidden' href='"+ currentUrlS +"strana-" + i + "'>" + i + "</a>");             
                }
    
            }else{
                $('.pagination').append("<a href='"+ currentUrlS +"/strana-" + i + "'>" + i + "</a>");  
            }
        }
        if(current != max){
            $(".pagination").append("<a href='"+ currentUrlS +"/strana-" + (current + 1) + "' class='next'>></a>");
        }
        if(current != 1){
            $(".pagination").prepend("<a href='"+ currentUrlS +"/strana-" + (current - 1) + "' class='previous'><</a>");
        }
    }

    refactorPagi();

    document.addEventListener('ShoptetDOMPageContentLoaded', function () {
        refactorPagi();
    },{
        passive: true
    });

}



// =============================================================================
// FAQ
// =============================================================================

$(document).ready(function() {

    $('#faqSearch').keyup(function(e) {
        var s = $(this).val().trim();
        if (s === '') {
            $('#FaqResult *').show();
            $('#FaqResult details').attr("open", false);
            return true;
        }
        $('#FaqResult details:not(:contains(' + s + '))').hide();
        $('#FaqResult h2:not(:contains(' + s + '))').hide();
        $('#FaqResult details:contains(' + s + ')').show();
        $('#FaqResult details:contains(' + s + ')').attr("open", true);
        return true;
    });

});


// =============================================================================
// ŔELATED
// =============================================================================




if ($("#relatedFiles").length){
   
    $('main select[data-parameter-name="Výška"], main select[data-parameter-name="Height"], main select[data-parameter-name="Înălţime"], main select[data-parameter-name="Magasság"]').change(function() {
        $(".description-infographics").remove();

            var option = $('main select[data-parameter-name="Výška"] option:selected, main select[data-parameter-name="Height"] option:selected, main select[data-parameter-name="Înălţime"] option:selected, main select[data-parameter-name="Magasság"] option:selected').text(); 
         
            var src = $('#relatedFiles a[title*="' + option + '"]').attr("href");
            if(typeof src != 'undefined'){
                $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
                $(".description-infographics img").attr("src", src);
                $(".description-infographics a").attr("href", src);
            }else{
                $(".description-infographics").remove();
            }
        
    });
}


if ($(":lang(cs)").length){
    $('.detail-parameters tr th:contains("Typ produktu:"), .detail-parameters tr th:contains("Věk dítěte:"), .detail-parameters tr th:contains("Tvar:"), .detail-parameters tr th:contains("Motiv:"), .detail-parameters tr th:contains("Pro model postele:"), .detail-parameters tr th:contains("Pro postel o délce:"), .detail-parameters tr th:contains("Pro postel o šířce:")').parents('tr').remove();
}

if ($("#relatedFiles").length){
    
    if($('main select[data-parameter-name="Varianta"]').length){
        $(".extended-description").append('<div class="description-infographics empty"><span>' + g_emptyInforgaphicsTitle + '</span></div>');
    }
    
    $('main select[data-parameter-name="Varianta"]').change(function() {
        $(".description-infographics").remove();

        
        if($('main select[data-parameter-name="Varianta"] option:selected').text() == 'Bez přídavných nohou navíc'){
            $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
            $(".description-infographics img").attr("src", "https://www.benlemi.cz/user/documents/upload/Infografiky produkty/Dětský nábytek/Stolky a ždiličky/Nanoc/nanoc bez foots.jpg");
            $(".description-infographics a").attr("href", "https://www.benlemi.cz/user/documents/upload/Infografiky produkty/Dětský nábytek/Stolky a ždiličky/Nanoc/nanoc bez foots.jpg");
        }
        else{
            var option = $('main select[data-parameter-name="Varianta"] option:selected').text(); 
            var optionClean = option.replace(/[Navícpřídavnénohym]/g,'').replace(/\s/g,'').split('(', 1);
            var src = $('#relatedFiles a[title*="' + optionClean + '"]').attr("href");
            if(typeof src != 'undefined'){
                $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
                $(".description-infographics img").attr("src", src);
                $(".description-infographics a").attr("href", src);
            }else{
                $(".description-infographics").remove();
            }
        }
    });
}


/* tooltip for advanced parameters */
$(document).ready(function() {
    if ($(".advanced-parameter").length){
        $(".advanced-parameter").each(function(){
            var tooltip = $(this).find(".parameter-value").text();
            $(this).append("<div class='advanced-parameter-tooltip'>" + tooltip + "</div>")
        });
    }
});


$(document).ready(function() {

    if ($(":lang(cs)").length){

        $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
        $("#userCheck").load("/klient/klient-slevy/ .content-inner table tr:first-child strong", function() {

            var userCheck = $("#userCheck strong").text();
            if( (userCheck == "CZ-B2B") || (userCheck == "CZ-B2BPLUS") || (userCheck == "CZ-B2B-DPH") || (userCheck == "CZ-B2BPLUS-DPH")){

                $('<div class="form-group" style="flex-direction:column;"><label for="post_phone">Doručovací telefon:</label><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">(Vložte telefonní číslo ve správném formátu, např.: +420776123456)</span><input type="text" id="post_phone" class="form-control"></div><div class="form-group" style="padding-bottom:20px;"><label for="post_email">Doručovací email:</label><input type="text" id="post_email" class="form-control"></div>').insertAfter('.co-shipping-address');

                $('#order-form').submit(function() {
                    dosomething();
                });
                
                function dosomething(){
                    var inputvalue=$("#post_phone").val(); 
                    var inputvalue2=$("#post_email").val(); 
                    var orgvalue= $('#remark').val().split('<')[0];
                    $('#remark').val("");
                    if(inputvalue != '' && inputvalue2 == ''){
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>');
                    }else if(inputvalue2 != '' && inputvalue == ''){
                    $('#remark').val(orgvalue + '<post_email>' + inputvalue2 + '</post_email>');
                    }else if(inputvalue != '' && inputvalue2 != ''){
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>' + '<post_email>' + inputvalue2 + '</post_email>');
                    }else{
                    
                    }
                }

            }else{

            }
        });
    }

    if ($(":lang(sk)").length){

        $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
        $("#userCheck").load("/klient/klient-zlavy/ .content-inner table tr:first-child strong", function() {

            var userCheck = $("#userCheck strong").text();
            if( (userCheck == "SK-B2BPLUS") || (userCheck == "SK-B2B") || (userCheck == "SK-B2B-DPH") || (userCheck == "SK-B2BPLUS-DPH")){

                $('<div class="form-group" style="flex-direction:column;"><label for="post_phone">Doručovací telefón:</label><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">(Vložte telefónne číslo v správnom formáte, napr.: +421776123456)</span><input type="text" id="post_phone" class="form-control"></div><div class="form-group" style="padding-bottom:20px;"><label for="post_email">Doručovací email:</label><input type="text" id="post_email" class="form-control"></div>').insertAfter('.co-shipping-address');

                $('#order-form').submit(function() {
                    dosomething();
                });
                
                function dosomething(){
                    var inputvalue=$("#post_phone").val(); 
                    var inputvalue2=$("#post_email").val(); 
                    var orgvalue= $('#remark').val().split('<')[0];
                    $('#remark').val("");
                    if(inputvalue != '' && inputvalue2 == ''){
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>');
                    }else if(inputvalue2 != '' && inputvalue == ''){
                    $('#remark').val(orgvalue + '<post_email>' + inputvalue2 + '</post_email>');
                    }else if(inputvalue != '' && inputvalue2 != ''){
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>' + '<post_email>' + inputvalue2 + '</post_email>');
                    }else{
                    
                    }
                }

            }else{

            }
        });
    }


    if ($(":lang(ro)").length){

        $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
        $("#userCheck").load("/centru-clienti/reducerile-mele/ .content-inner table tr:first-child strong", function() {

            var userCheck = $("#userCheck strong").text();
            if( (userCheck == "SK-B2BPLUS") || (userCheck == "SK-B2B") || (userCheck == "SK-B2B-DPH") || (userCheck == "SK-B2BPLUS-DPH")){

                $('<div class="form-group" style="flex-direction:column;"><label for="post_phone">Doručovací telefón:</label><span style="opacity:0.8;padding-bottom:0px;display:block;font-size:14px;">(Vložte telefónne číslo v správnom formáte, napr.: +421776123456)</span><input type="text" id="post_phone" class="form-control"></div><div class="form-group" style="padding-bottom:20px;"><label for="post_email">Doručovací email:</label><input type="text" id="post_email" class="form-control"></div>').insertAfter('.co-shipping-address');

                $('#order-form').submit(function() {
                    dosomething();
                });
                
                function dosomething(){
                    var inputvalue=$("#post_phone").val(); 
                    var inputvalue2=$("#post_email").val(); 
                    var orgvalue= $('#remark').val().split('<')[0];
                    $('#remark').val("");
                    if(inputvalue != '' && inputvalue2 == ''){
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>');
                    }else if(inputvalue2 != '' && inputvalue == ''){
                    $('#remark').val(orgvalue + '<post_email>' + inputvalue2 + '</post_email>');
                    }else if(inputvalue != '' && inputvalue2 != ''){
                    $('#remark').val(orgvalue + '<post_phone>' + inputvalue + '</post_phone>' + '<post_email>' + inputvalue2 + '</post_email>');
                    }else{
                    
                    }
                }

            }else{

            }
        });
    }


    if ($(":lang(en)").length){

        $("<div id='userCheck' style='visibility:hidden'></div>").insertAfter("#checkoutSidebar");
        $("#userCheck").load("/client-center/client-discounts/ .content-inner table tr:first-child strong", function() {

            var userCheck = $("#userCheck strong").text();

            if( (userCheck == "Koncový zákazík_COM") || (userCheck == "") ){}else{
                $("body").addClass("wholesale");
                $(".in-step-2 #billCountryId").attr("disabled", false);
                $(".in-step-2 #shipping-address").addClass("visible");
                $(".in-step-2 #another-shipping").prop("checked", true);
                
                $(".co-billing-address fieldset>.form-group:last-child").load("/client-center/my-account-settings/ #additionalInformation fieldset .form-group:last-child", function() {
                        var id = $(".co-billing-address #billCountryId option:selected").attr("value");
                        $('<input type="hidden" name="billCountryId" id="billCountryIdInput" value="'+ id +'" disabled="disabled">').insertAfter(".co-billing-address #billCountryId");
                });
            }

            if( (userCheck == "COM-B2B") || (userCheck == "COM-B2BPLUS") ){
                $("#shipping-61").css("display","none");
                $("#shipping-61 input").prop('checked', false);

                $("#shipping-141").css("display","flex");
            }

            if( (userCheck == "COM-B2B-DPH") || (userCheck == "COM-B2BPLUS-DPH") ){
                $("#shipping-141").css("display","none"); // hide transport without vat
                $("#shipping-141 input").prop('checked', false);

                $("#shipping-61").css("display","flex");
            }
        });


        $("<div id='userGroup' style='visibility:hidden'></div>").insertAfter("footer"); $("#userGroup").load("/client-center/client-discounts/ .content-inner table tr:first-child strong", function() {
            var userGroup = $("#userGroup strong").text();
            if(userGroup.includes("B2B")){
                $("body").addClass("velkoobchod");
            }
        });
    }




});


 

/*
$(document).ready(function() {

    $('.product').each(function(){
        var priceOld = parseInt($(this).find(".flag-discount .price-standard").text().replace(/[^0-9.]/g, ""));
        var price = parseInt($(this).find(".price-final strong").text().replace(/[^0-9.]/g, ""));
     var x =priceOld - price;
        $(this).find(".flag-discount .price-save").text("až - " + x + " Kč");
    });
    
    
    });
    */




    if ($(":lang(cs)").length){

        $("#navigation .menu-level-1").append('<div class="nav-search --responsive" id="js-searchToggle-res" style="padding-left:54px;padding-top:18px;width:100%;background-position:20px;">Vyhledávání</div>');

        $("#js-searchToggle-res").click(function(){
            $("#navigation .search").insertAfter(".navigation-buttons");
            if($(".search").hasClass("--active")){
                $(".search, #js-searchToggle-res").removeClass("--active");
                $(".header-top .search .form-control").blur();  
            }else{
                $(".search, #js-searchToggle-res").addClass("--active");
                $(".header-top .search .form-control").focus(); 
            }
        });

        
        /*
        $(".js-cookies-settings").text("Upravit nastavení");
        $(".siteCookies__links").insertBefore('.js-cookiesConsentSubmit[value="all"]');
        $('.js-cookiesConsentSubmit[value="reject"]').insertAfter(".siteCookies__text p a");
        */



$(".in-kosik .cart-table tbody").append("<div class='cart-custom-notice'>Ať máte vše <strong>doma najednou</strong>, Benlemi balík vám doručíme podle produktu s nejdelší dobou dodání ve vašem košíku. Chcete vybrané věci doručit zvlášť? Rozdělte si je do dvou samostatných objednávek.</div>");



$(document).ready(function() {
$('<div class="phone-nav"></div>').insertBefore(".menu-helper");
$(".phone-nav").append( $(".menu-helper .menu-level-1"));
     var nameattr = $(".p-detail-inner-header h1").html(); $("body").attr("data-name", nameattr);
     
     
$( ".availability-label .show-tooltip" ).each(function( index ) {
$('<div class="info-delivery"> Expedujeme hned zítra. Víkendové objednávky expedujeme v nejbližší pracovní den. </div>').insertAfter(this);
});

     
});


 
$( document ).ready(function() {






if($(".p-price.p-cell .show-tooltip.acronym").length){

$(".discount-coupon input[type='text'], .discount-coupon button").attr("disabled", "true");
$("<span>Slevový kód nelze uplatnit v košíku, který obsahuje zlevněný produkt</span>").insertAfter(".discount-coupon button");

}



if($(".in-matrace, .in-matrace-klasickych-i-atypickych-rozmeru ").length){
var img = $("#relatedFiles a").attr("href"); 
$(".extended-description").append('<div class="description-infographics-matrace"><img src="' + img + '"></div>')
}

function modular() {
 $('main select[data-parameter-name="' + g_propositions + '"]').each(function() {
     if($(this).find('option').length == 1){
         var srcD = $("#relatedFiles a").prop("href");
         $(".description-infographics.empty span").remove();
         $(".description-infographics.empty").append('<img src="' + srcD + '">');
     }
 });
}
setTimeout(modular, 1500);




});





$("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");

if($(".login.toggle-window").length){
   $(".headerFreeDeliveryNew").html("Registrujte se a sbírejte <br> slevy s každým svým nákupem");
}else{
   $.get('/klient/klient-slevy/', function (data) {
       data = $(data).find('.content-inner table tr:last-child strong').html();
       $(".headerFreeDeliveryNew").html("Nyní máte <br>" + data + " slevu za věrnost"); 

   });
   
}




/* cart phone validation */
$(document).ready(function() {

  $(".cart-content #phone, .co-registration #phone").removeClass("js-validate-phone js-validate js-validate-required js-error-field js-phone-form-control js-validated-field");
  $(".cart-content #phone, .co-registration #phone").attr("disabled",false);
   $( ".cart-content #phone, .co-registration #phone" ).change(function() {
    $(this).removeClass("js-validate-phone js-validate js-validate-required js-error-field js-phone-form-control js-validated-field");
    $(this).attr("disabled",false);
   });
   
   
if($(".removeable .show-tooltip").length){$(".applied-coupon .btn").click();}

});




 $(".variant-default").prop("required", false);
 $(".variant-default").prop("checked", true);
 
 
$( document ).ready(function() {

setTimeout(function(){

 $( ".detail-parameters select" ).change(function() {
 var x = $(".parameter-dependent:not(.no-display) span.show-tooltip.acronym").html(); 

 if(x != undefined){
   $(".add-to-cart, .bottomCta").css("display", "none");

 }else{
   $(".add-to-cart, .bottomCta").css("display", "flex")
 }
});

}, 500); 

});

    }












    if ($(":lang(sk)").length){

    
  $(".in-krok-2 .next-step button").text("Odoslať objednávku");
  if ($("#relatedFiles").length){
    
    if($('main select[data-parameter-name="Varianta"]').length){
        $(".extended-description").append('<div class="description-infographics empty"><span>' + g_emptyInforgaphicsTitle + '</span></div>');
    }
    
    $('main select[data-parameter-name="Varianta"]').change(function() {
        $(".description-infographics").remove();

        
        if($('main select[data-parameter-name="Varianta"] option:selected').text() == 'Bez prídavných nôh navyše'){
            $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
            $(".description-infographics img").attr("src", "https://www.benlemi.cz/user/documents/upload/Infografiky produkty/Dětský nábytek/Stolky a ždiličky/Nanoc/nanoc bez foots.jpg");
            $(".description-infographics a").attr("href", "https://www.benlemi.cz/user/documents/upload/Infografiky produkty/Dětský nábytek/Stolky a ždiličky/Nanoc/nanoc bez foots.jpg");
        }
        else{
            var option = $('main select[data-parameter-name="Varianta"] option:selected').text(); 
            var optionClean = option.replace(/[Navyšeprídavnénohycm]/g,'').replace(/\s/g,'').split('(', 1);
            var src = $('#relatedFiles a[title*="' + optionClean + '"]').attr("href");
            if(typeof src != 'undefined'){
                $(".extended-description").append('<div class="description-infographics"><img src=""><a href="" download>' + g_downloadInfographic + '</a></div>');
                $(".description-infographics img").attr("src", src);
                $(".description-infographics a").attr("href", src);
            }else{
                $(".description-infographics").remove();
            }
        }
    });
}

  
$("<div class='headerFreeDeliveryNew'>.</div>").insertBefore(".cart-count");

if($(".login.toggle-window").length){
    $(".headerFreeDeliveryNew").html("Registrujte sa a zbierajte <br> zľavy s každým svojim nákupom");
}else{
    $.get('/klient/klient-zlavy/', function (data) {
        data = $(data).find('.content-inner table tr:last-child strong').html();
        $(".headerFreeDeliveryNew").html("Teraz máte <br>" + data + " zľavu za vernosť"); 
    });
    
}

$('.detail-parameters tr th:contains("Rozměr:"), .detail-parameters tr th:contains("Tvar:")').parents('tr').remove();

  
$(document).ready(function() {

    $(".cart-content #phone, .co-registration #phone").removeClass("js-validate-phone js-validate js-validate-required js-error-field js-phone-form-control js-validated-field");
    $(".cart-content #phone, .co-registration #phone").attr("disabled",false);
     $( ".cart-content #phone, .co-registration #phone" ).change(function() {
      $(this).removeClass("js-validate-phone js-validate js-validate-required js-error-field js-phone-form-control js-validated-field");
      $(this).attr("disabled",false);
     });
     
     
  if($(".removeable .show-tooltip").length){$(".applied-coupon .btn").click();}
  
  });
  





if($(".in-matrace, .in-matrac-klasickych-i-atypickych-rozmerov ").length){
var img = $("#relatedFiles a").attr("href"); 
$(".extended-description").append('<div class="description-infographics-matrace"><img src="' + img + '"></div>')
}







/* runs on load checking url */

var urlParams = new URLSearchParams(window.location.search);

$(".detail-parameters select").each(function(){

    var qName = $(this).attr("data-parameter-name").replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); 
    let qPar = urlParams.get(qName);

    $(this).find("option").each(function(){
    var qOption = $(this).text().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if(qOption == qPar) {
        $(this).attr("selected",true);
    }

    });

    
});

$("div.hidden-split-parameter").each(function(){

    var qName = $(this).attr("data-parameter-name").replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); 
    let qPar = urlParams.get(qName);

    $(this).find("input").each(function(){
    var qOption = $(this).closest('.advanced-parameter').find('.parameter-value').text().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if(qOption == qPar) {
        $(this).prop('checked',true);
    }

    });

    
});

/* runs on option select modifying url */

$('.detail-parameters select').on('change', function() {
    var sName = $(this).attr("data-parameter-name").replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var sPar = $(this).find("option:selected:not(:first-child)").text().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);

    if(sPar.length ){
        url.searchParams.set(sName, sPar);
    }else{
        url.searchParams.delete(sName, sPar);
    }

    var newUrl = url.href; 
    window.history.replaceState("string", "Title", newUrl);
});


$('div.hidden-split-parameter').on('change', function() {
    var sName = $(this).attr("data-parameter-name").replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var sParAlt = $(this).find(".advanced-parameter input:checked + .parameter-value").text().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    
    if(sParAlt.length){
        url.searchParams.set(sName, sParAlt);
    }

    var newUrl = url.href; 
    window.history.replaceState("string", "Title", newUrl);
}); 











}