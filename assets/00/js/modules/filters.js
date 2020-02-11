/**
 * This function applies on pages with price filter
 *
 * @param {Number} categoryMinValue
 * categoryMinValue = value parsed from HTML element
 * @param {Number} categoryMaxValue
 * categoryMaxValue = value parsed from HTML element
 */
var priceFilter = function (categoryMinValue, categoryMaxValue) {
    var
        selectedValues = parseFilterValuesFromContent(),
        selectedMinValue = selectedValues[0],
        selectedMaxValue = selectedValues[1];

    formatFilterValues(selectedMinValue, selectedMaxValue);

    // jQueryUI slider
    $('#slider').slider({
        range: true,
        min: categoryMinValue,
        max: categoryMaxValue,
        values: [selectedMinValue, selectedMaxValue],
        slide: function (event, ui) {
            if (categoryMaxValue - categoryMinValue < 2) {
                return false;
            }
            var
                slidedMinValue = ui.values[0].toString(),
                slidedMaxValue = ui.values[1].toString();

            formatFilterValues(slidedMinValue, slidedMaxValue);
        },
        stop: function (event, ui) {
            if (categoryMaxValue - categoryMinValue < 2) {
                return false;
            }
            var rawSlidedMinValue = shoptet.helpers.toFloat(ui.values[0]) / currencyExchangeRate;
            var rawSlidedMaxValue = shoptet.helpers.toFloat(ui.values[1]) / currencyExchangeRate;
            var slidedMinValue = Math.round(rawSlidedMinValue);
            var slidedMaxValue = Math.round(rawSlidedMaxValue);

            $('#price-value-min').attr('value', slidedMinValue);
            $('#price-value-max').attr('value', slidedMaxValue);

            var url = window.location.href.split("?")[0];
            var queryVars = window.location.search.replace('?', '').split('&');
            var filteredQueryVars = [];
            var queryPair;

            url = url.replace(shoptet.content.regexp, '');

            for (var idx = 0; idx < queryVars.length; idx++) {
                queryPair = queryVars[idx].split('=');
                if (queryPair[0] === '' || queryPair[0] === 'priceMin' || queryPair[0] === 'priceMax') {
                    continue;
                }
                filteredQueryVars.push({
                    key: queryPair[0], value: queryPair[1], toString: function () {
                        return this.key + '=' + this.value;
                    }
                });
            }

            if (filteredQueryVars.length > 0) {
                url += '?' + filteredQueryVars.join('&');
            }

            var urlValuePriceMin;
            var urlValuePriceMax;

            if (currencyExchangeRate === 1) {
                urlValuePriceMin = slidedMinValue;
                urlValuePriceMax = slidedMaxValue;
            } else {
                urlValuePriceMin = (Math.round(rawSlidedMinValue * 100) / 100).toFixed(2);
                urlValuePriceMax = (Math.round(rawSlidedMaxValue * 100) / 100).toFixed(2);
            }

            url += (url.split('?')[1] ? '&' : '?');
            url += 'priceMin=' + urlValuePriceMin + '&priceMax=' + urlValuePriceMax;
            makeFilterAjaxRequest(
                url,
                true,
                false,
                event.target,
                'ShoptetPagePriceFilterChange'
            );
        }
    });
};

/**
 * Make AJAX GET request
 *
 * @param {String} url
 * url = url of the request
 * @param {Boolean} pushHistoryState
 * pushHistoryState = determines if current state is pushed to browser history
 * @param {Object} successCallback
 * successCallback = function that has to be fired after the request
 * is successfully executed
 * @param {Object} element
 * element = element where the function was called
 * @param {String} event
 * event = event which called the function
 */
function makeFilterAjaxRequest(url, pushHistoryState, successCallback, element, event) {
    showSpinner();
    pushHistoryState = typeof pushHistoryState !== 'undefined' ? pushHistoryState : true;
    shoptet.scripts.signalCustomEvent(event, element);

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        timeout: 10000,
        cache: true,
        success: function(payload) {
            var requestedDocument = shoptet.common.createDocumentFromString(payload);
            shoptet.tracking.trackProductsFromPayload(requestedDocument);
            var payloadContent = $(requestedDocument).find('#content');
            var $payloadContentWrapper = $('#content');
            $payloadContentWrapper.html(payloadContent[0].innerHTML);
            if ($(requestedDocument).find('#filters').length) {
                var payloadFilterContent = $(requestedDocument).find('#filters');
                if (!$('#filters').length) {
                    $('#category-header').after('<div id="filters" />');
                }
                $('#filters').html(payloadFilterContent[0].innerHTML);
            }
            if ($(requestedDocument).find('.breadcrumbs').length) {
                var payloadNavContent = $(requestedDocument).find('.breadcrumbs').clone();
                $('.breadcrumbs').html(payloadNavContent[0].innerHTML);
            }
            if ($(requestedDocument).find('.header-title').length) {
                var payloadH1Content = $(requestedDocument).find('.header-title').clone();
                $('.header-title').html(payloadH1Content[0].innerHTML);
            }
            var $categoryMinValue = $('#categoryMinValue');
            var $categoryMaxValue = $('#categoryMaxValue');
            if ($categoryMinValue.length) {
                // TODO: use corresponding shoptet object instead of global variable
                categoryMinValue = parseInt($categoryMinValue.text());
            }
            if ($categoryMaxValue.length) {
                // TODO: use corresponding shoptet object instead of global variable
                categoryMaxValue = parseInt($categoryMaxValue.text());
            }
            priceFilter(categoryMinValue, categoryMaxValue);
            $('#content-wrapper img').unveil();
            detectFilters();
            initTooltips();
            hideSpinner();
            dismissMessages();
            setTimeout(function () {
                sameHeightOfProducts();
            }, 1000);
            try {
                if (pushHistoryState) {
                    if ($('.breadcrumbs').length) {
                        var $selector = $('.breadcrumbs > span:last');
                        var current = $selector.find('span').data('title');
                        var baseTitle = $('#navigation-first').data('basetitle');

                        document.title = current + ' - ' + baseTitle;

                        history.pushState(null, null, $selector.find('meta').attr('content'));
                    } else {
                        history.pushState(null, null, url);
                    }
                } else {
                    document.title = $('meta[property="og:title"]').attr('content');
                }
            } catch (err) {
            }
            if (typeof (successCallback) === 'function') {
                successCallback();
            }
            shoptet.scripts.signalDomLoad('ShoptetDOMPageContentLoaded', $payloadContentWrapper[0]);
        },
        error: function () {
            hideSpinner();
            $('html, body').animate({
                scrollTop: 0
            }, shoptet.config.animationDuration, function () {
                showMessage(shoptet.messages['ajaxError'], 'warning', '', false, false);
            });
        }
    });
}
;

/**
 * Move filters to another location
 *
 * @param {Object} $el
 * $el = HTML object that will be moved
 * @param {String} targetLocation
 * targetLocation = location where the element has to be moved
 */
function moveFilters($el, targetLocation) {
    if (targetLocation != 'default') {
        $('#filters-wrapper').after($el);
    } else {
        $('#filters-default-position').after($el);
    }
}

/**
 * This function checks, if it's neccessary to move filters
 * to another location. If so, moves them.
 *
 * This function does not accept any arguments.
 */
function detectFilters() {
    if ($('.filters-wrapper').length) {
        $el = $('.filters-wrapper');
        var filtersDefaultPosition = $('#filters-default-position').attr('data-filters-default-position');
        if (filtersDefaultPosition == 'left' || filtersDefaultPosition == 'right') {
            if ($('aside .filters-wrapper').length) {
                if (!$('aside').is(':visible')) {
                    moveFilters($el, 'content');
                }
            } else {
                if ($('aside').is(':visible')) {
                    moveFilters($el, 'default');
                }
            }
        }
    }
}

/**
 * Parse filter values from HTML elements
 *
 * This function does not accept any arguments.
 */
var parseFilterValuesFromContent = function () {
    var values = [];
    values[0] = $('#min').text().toString();
    values[1] = $('#max').text().toString();
    return values;
};

/**
 * Format filter values
 *
 * @param {String} selectedMinValue
 * @param {String} selectedMaxValue
 */
var formatFilterValues = function (selectedMinValue, selectedMaxValue) {

    var
        reverseNumberMin = '',
        finalNumberMin = '',
        reverseNumberMax = '',
        finalNumberMax = '';

    for (var i = selectedMinValue.length; i >= 0; i--) {
        reverseNumberMin = reverseNumberMin + selectedMinValue.charAt(i);
    }
    var formatedNumber = reverseNumberMin.replace(/(.{3})/g, '$1' + shoptet.config.thousandSeparator);
    for (var i = formatedNumber.length; i >= 0; i--) {
        finalNumberMin = finalNumberMin + formatedNumber.charAt(i);
    }

    for (var i = selectedMaxValue.length; i >= 0; i--) {
        reverseNumberMax = reverseNumberMax + selectedMaxValue.charAt(i);
    }
    var formatedMaxNumber = reverseNumberMax.replace(/(.{3})/g, '$1' + shoptet.config.thousandSeparator);
    for (var i = formatedMaxNumber.length; i >= 0; i--) {
        finalNumberMax = finalNumberMax + formatedMaxNumber.charAt(i);
    }

    $('#min').text(finalNumberMin);
    $('#max').text(finalNumberMax);
};

$(function () {
    var $html = $('html');
    /* Filters */
    // History navigation
    if($('.filters').length) {
        window.onpopstate = function() {
            makeFilterAjaxRequest(
                location.href,
                false,
                false,
                document,
                'ShoptetPageFiltersRecalledFromHistory'
            );
        };
    }

    if ($('#slider').length) {
        priceFilter(categoryMinValue, categoryMaxValue);
    }

    $html.on('click', '.filter-section input, .active-filters .input', function(e) {
        makeFilterAjaxRequest(
            e.target.getAttribute('data-url'),
            true,
            false,
            e.target,
            'ShoptetPageFilterValueChange'
        );
    });

    $html.on('click', 'div.category-header input', function(e) {
        makeFilterAjaxRequest(
            e.target.getAttribute('data-url'),
            true,
            false,
            e.target,
            'ShoptetPageSortingChanged'
        );
    });

    $html.on('click', 'p#clear-filters a', function(e) {
        e.preventDefault();
        makeFilterAjaxRequest(
            e.target.getAttribute('href'),
            true,
            false,
            e.target,
            'ShoptetPageFiltersCleared'
        );
    });

    $html.on('click', 'div.pagination a', function(e) {
        e.preventDefault();
        var $scrollTarget = false;
        var ajaxCallback = false;
        if ($('.products:not(.products-top)').length) {
            $scrollTarget = $('.products:not(.products-top)');
        } else if ($('#newsWrapper').length) {
            $scrollTarget = $('#newsWrapper');
        } else if ($('#ratingWrapper').length) {
            $scrollTarget = $('#ratingWrapper');
        }
        if ($scrollTarget) {
            ajaxCallback = scrollToEl($scrollTarget);
        }
        makeFilterAjaxRequest(
            e.target.getAttribute('href'),
            true,
            ajaxCallback,
            e.target,
            'ShoptetPagePaginationUsed'
        );
    });

    // Filters
    if ($('.sidebar-right .filters-wrapper').length) {
        $('.sidebar-right').addClass('has-categories');
    }

    detectFilters();
});
