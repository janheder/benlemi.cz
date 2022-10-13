
  
  
  // -----------------------------------------------------------------------------
// PRODUCT PAGE URL SHARE
// -----------------------------------------------------------------------------

/* runs on load checking url */

var urlParams = new URLSearchParams(window.location.search);

$(".detail-parameters select").each(function(){

    var qName = $(this).attr("data-parameter-name").replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); 
    let qPar = urlParams.get(qName);

    $(this).find("option").each(function(){
    var qOption = $(this).text().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if(qOption == qPar) {
        $(this).attr("selected",true);
        $(this).closest(".advanced-parameter-inner").addClass('yes-before');
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
        $(this).closest(".advanced-parameter-inner").addClass('yes-before');
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
