/**
 * Changing main image after click on graphic variant, or thumbnail
 *
 * @param {String} bigImage
 * bigImage = New big image url
 */
function replaceImage(bigImage) {
    var $mainImage = $('.p-image-wrapper .p-image');
    if ($('.image360').length) {
        $('.image360').hide();
    }
    $mainImage.show();
    var $mainImageLink = $mainImage.find('a');

    var currentImage = bigImage.split('/');
    if (typeof currentImage === 'object') {
        var lastItem = currentImage[currentImage.length - 1];
        var imageName = lastItem.split('?');
        highlightActiveThumbnail(imageName[0]);
    }

    $mainImage.find('img').attr('src', bigImage);

    $mainImageLink.attr({
        'href': bigImage,
        'data-href': bigImage.replace(/\/(big|category_portrait)\//, "/orig/")
    });
    if ($('.cloud-zoom').length) {
        clearTimeout(shoptet.runtime.cloudZoom);
        // 201 - see frontend_templates/00/js/modules/jquery.cloud-zoom.1.0.2.js, we need to 200 declared there + 1
        shoptet.runtime.cloudZoom = setTimeout(function() {
            $('.cloud-zoom').data('zoom').destroy();
            $('.cloud-zoom').CloudZoom(shoptet.config.cloudZoomOptions);
        }, 201);
    }
}

/**
 * Highlight active thumbnail
 *
 * @param {String} imageName
 * imageName = Name of active big image
 */
function highlightActiveThumbnail(imageName) {
    $('.p-thumbnails-inner a.show360image').removeClass('highlighted');
    $('.p-thumbnails-inner a.p-thumbnail').each(function() {
        if ($(this).attr('href').indexOf(imageName) !== -1) {
            $('.p-thumbnails-inner a.p-thumbnail').removeClass('highlighted');
            $(this).addClass('highlighted');
            return false;
        }
    });
}

/**
 * Browse related/alternative products
 *
 * @param {Object} $el
 * $el = HTML element which triggered function
 */
function browseProducts($el) {
    if ($el.hasClass('p-all')) {
        $el.addClass('inactive');
        var pSwitchable = $el.parents('.browse-p').prev('.p-switchable');
        pSwitchable.addClass('show-all-related').find('.product').find('img').unveil();
        return false;
    }
    var products = $el.parents('.browse-p').prev('.p-switchable').find('.product');
    var productsLength = products.length;
    var firstActive, firstInactive;
    var activeProducts = shoptet.abilities.config.number_of_active_related_products;
    for (var i = 0; i < productsLength; i++) {
        if (typeof firstActive === 'undefined' && $(products[i]).hasClass('active')) {
            firstActive = i;
        }
        if (typeof firstInactive === 'undefined' && $(products[i]).hasClass('inactive')) {
            firstInactive = i;
        }
        if (typeof firstActive !== 'undefined' && typeof firstInactive !== 'undefined') {
            break;
        }
    }
    if ($el.hasClass('p-next')) {
        if (productsLength - activeProducts - firstActive > 0) {
            $(products[firstActive]).addClass('inactive').removeClass('active');
            $(products[firstActive + activeProducts]).addClass('active').removeClass('inactive').find('img').unveil();
        }
        if (productsLength - activeProducts - firstActive > 1) {
            $el.prev('.p-prev').removeClass('inactive');
        } else {
            $el.addClass('inactive');
        }
        if (productsLength - activeProducts - firstActive === 1) {
            $el.prev('.p-prev').removeClass('inactive');
        }
    }
    if ($el.hasClass('p-prev')) {
        if (firstActive + activeProducts <= productsLength) {
            $(products[firstActive - 1]).addClass('active').removeClass('inactive').find('img').unveil();
            $(products[firstActive - 1 + activeProducts]).addClass('inactive').removeClass('active');
        }
        if (firstActive === 1) {
            $el.addClass('inactive');
            $el.next('.p-next').removeClass('inactive');
        }
    }
}

/**
 * Set direction of thumbnails in product detail
 * according to template abilities, resolution and layout
 *
 * This function does not accept any arguments.
 */
function setThumbnailsDirection() {
    if (shoptet.abilities.feature.directional_thumbnails && $('#content.wide').length) {
        if (detectResolution(shoptet.config.breakpoints.sm)) {
            setThumbnails('vertical');
        } else {
            setThumbnails('horizontal');
        }
    } else {
        setThumbnails('horizontal');
    }
}

/**
 * Set necessary classes and variables for thumbnails direction in product detail
 *
 * @param {String} direction
 * direction = direction of image thumbnails
 */
function setThumbnails(direction) {
    shoptet.config.thumbnailsDirection = direction;
    $('.p-thumbnails').removeClass('p-thumbnails-horizontal p-thumbnails-vertical');
    $('.p-thumbnails').addClass('p-thumbnails-' + direction);
}

/**
 * This function adds necessary classes to thumbnails wrapper
 *
 * @param {Object} $thumbnailsWrapper
 * $thumbnailsWrapper = HTML element which contains thumbnails
 * @param {Number} diff
 * diff = sum of thumbnails inner width/height and thumbnails offset
 * @param {Number} thumbnailsWrapperDimensions
 * thumbnailsWrapperDimensions = dimensions of thumbnails wrapper
 * used for computing
 * @param {Number} thumbnailsScroll
 * thumbnailsScroll = offset of thumbnails
 */
function checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll) {
    if (diff > thumbnailsWrapperDimensions) {
        $thumbnailsWrapper.addClass('overflow-next');
    } else {
        $thumbnailsWrapper.removeClass('overflow-next');
    }
    if (thumbnailsScroll < 0) {
        $thumbnailsWrapper.addClass('overflow-prev');
    } else {
        $thumbnailsWrapper.removeClass('overflow-prev');
    }
}

/**
 * According to "action" parameter only gets informations about
 * thumbnails dimensions or fires checkThumbnailsAction function
 *
 * @param {String} direction
 * direction = accepts 'horizontal' or 'vertical'
 * @param {String} action
 * action = accepts 'check' or 'set'
 * @param {Boolean} reset
 * reset = if set to true, resets thumbnails to initial state
 */
function checkThumbnails(direction, action, reset) {

    var $thumbnailsWrapper = $('.p-thumbnails');
    var $thumbnails = $('.p-thumbnails-inner > div');
    var $thumbnailsInner = $('.p-thumbnails-inner');

    if (direction == 'horizontal') {

        var thumbnailsWrapperDimensions = $thumbnailsWrapper.width();
        var thumbnailsDimensions = $thumbnails.width();
        var thumbnailsScroll = parseInt($thumbnailsInner.css('left'));

    } else {

        var thumbnailsWrapperDimensions = $thumbnailsWrapper.height();
        var thumbnailsDimensions = $thumbnails.height();
        var thumbnailsScroll = parseInt($thumbnailsInner.css('top'));
    }


    var diff = thumbnailsDimensions + thumbnailsScroll;

    var sizes = {
        'thumbnailsScroll': thumbnailsScroll,
        'thumbnailsDimensions': thumbnailsDimensions,
        'thumbnailsWrapperDimensions': thumbnailsWrapperDimensions,
        'diff': diff
    };

    if (action == 'check') {
        return sizes;
    } else {
        if(reset == true) {
            if (direction == 'horizontal') {
                $thumbnailsInner.css('left', 0);
            } else {
                $thumbnailsInner.css('top', 0);
            }
            // Timeout must be set higher than CSS transition duration
            setTimeout(function() {
                checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll);
            }, shoptet.config.animationDuration);
        } else {
            checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll);
        }
    }

}

/**
 * Scrolls thumbnails in defined direction
 *
 * @param {String} direction
 * direction = accepts 'prev' or 'next'
 */
function switchThumbnails(direction) {
    var sizes = checkThumbnails(shoptet.config.thumbnailsDirection, 'check', false);
    var $el = $('.p-thumbnails-inner');
    $('.thumbnail-next, .thumbnail-prev').addClass('clicked');
    if (shoptet.config.thumbnailsDirection == 'horizontal') {
        var thumbnailsScroll = 'left';
    } else {
        var thumbnailsScroll = 'top';
    }
    if (direction == 'prev') {
          if ((sizes['diff'] - sizes['thumbnailsWrapperDimensions']) < sizes['thumbnailsWrapperDimensions']) {
              var thumbnailsScrollVar = sizes['thumbnailsDimensions'] - sizes['thumbnailsWrapperDimensions'];
          } else {
              var thumbnailsScrollVar = (-parseInt($el.css(thumbnailsScroll)) + sizes['thumbnailsWrapperDimensions']);
          }
          $el.css(thumbnailsScroll, -thumbnailsScrollVar);
    } else {
        $('.thumbnail-next').addClass('clicked');
        if (sizes['thumbnailsScroll'] + sizes['thumbnailsWrapperDimensions'] > 0) {
            var thumbnailsScrollVar = 0;
        } else {
            var thumbnailsScrollVar = sizes['thumbnailsWrapperDimensions'] + sizes['thumbnailsScroll'];
        }
        $el.css(thumbnailsScroll, thumbnailsScrollVar);
    }
    // Timeout must be set higher than CSS transition duration
    setTimeout(function() {
        checkThumbnails(shoptet.config.thumbnailsDirection, 'set', false);
        $el.find('img').unveil();
        $('.thumbnail-next, .thumbnail-prev').removeClass('clicked');
    }, shoptet.config.animationDuration)
}

/**
 * Hide empty discount flag
 *
 * This function does not accept any arguments.
 */
function checkDiscountFlag() {
    var $flag = $('.p-image-wrapper .flags-extra .flag-discount');
    if ($flag.length) {
        var childVisible = true;
        $flag.find('.empty').each(function() {
            if (!$(this).hasClass('no-display')) {
                childVisible = false;
                return false;
            }
        });
        if (childVisible) {
            $flag.removeClass('no-display');
        } else {
            $flag.addClass('no-display');
        }
    }
}

function cofidisCalculator($newPriceHolder, $cofidis) {
    var newPrice = parseFloat($newPriceHolder.text().replace(/[^\d,.-]/g, ''));
    $cofidis.attr(
        'onClick',
        $cofidis.attr('onClick').replace(/(cenaZbozi=)(.+)(&idObchodu)/, '$1' + newPrice + '$3')
    );
}

/**
 * Update classes in rating tab after user's rate by click
 *
 * @param {String} score
 * score is data attr
 */
function changeStyle(score) {
    $('.star.current, .rate-list.current').removeClass('current');

    $('.star-wrap .star[data-score="'+ score +'"]').addClass('current');
    $('.rate-list[data-score="'+ score +'"]').addClass('current');

    $('.rate-list .star.star-on').removeClass('star-on').addClass('star-off');
    $('.rate-list.current .star').addClass('star-on').removeClass('star-off');

    $('input[name="score"]').val(score);
}
/**
 * Update classes in rating tab after user's rate by mouseover
 *
 * @param {String} $selector
 * $selector is selector
 */
function setStyle($selector) {
    $selector.removeClass('star-off').addClass('star-on')
        .prevAll().removeClass('star-off').addClass('star-on');
    $selector.nextAll().removeClass('star-on').addClass('star-off');
}

/**
 * Return previous classes in rating tab after mouseleave
 *
 * @param {String} $selector
 * $selector is selector
 */
function returnStyle($selector) {
    $('.star-wrap .star.star-on').removeClass('star-on').addClass('star-off');

    setStyle($selector);
}

/**
 * Used for setting same height of products in list
 *
 * @param {String} target
 * target = CSS selector of targeted element
 */
function sameHeightOfProductsLoop(target) {
    var maxHeight = 0;
    $(target).each(function() {
        var currentHeight = $(this).outerHeight();
        if (currentHeight > maxHeight) {
            maxHeight = currentHeight;
        }
    });
    $(target).css('height', maxHeight);
}

/**
 * Used for setting height of big product
 *
 * This function does not accept any arguments.
 */
function setHeightOfBigProduct() {
    var $el = $('.products-block.big .p.big');
    if (!$el.length) {
        return;
    }

    if (detectResolution(shoptet.config.breakpoints.xl)) {
        var $sibling = $('.products-block.big .p:not(.big)').first();
        var $siblingsWrapper = $('.products-block.big > div:nth-child(2)');
        var siblingWrapperPadding = parseInt($siblingsWrapper.css('padding-bottom'));
        var siblingsHeight = $sibling.outerHeight();
        $el.css('min-height', (siblingsHeight * 2) + siblingWrapperPadding);
    }
}

/**
 * Set same height of products in products list
 *
 * This function does not accept any arguments.
 */
function sameHeightOfProducts() {
    if (shoptet.abilities.config.category.product.same_height_set)  {
        var notBigP = '.products-block:not(.big) .p';
        var bigP = '.products-block.big .p:not(.big)';

        $(bigP).removeAttr('style');
        $(notBigP).removeAttr('style');

        var breakpoint = shoptet.abilities.config.category.product.same_height_breakpoint;
        if (detectResolution(shoptet.config.breakpoints[breakpoint])) {
            if ($(notBigP).length) {
                sameHeightOfProductsLoop(notBigP);
            }
            if ($(bigP).length) {
                sameHeightOfProductsLoop(bigP);
            }
        }
        setHeightOfBigProduct();
    }
}

/**
 * Toggle visibility of share buttons in product detail
 *
 * This function does not accept any arguments.
 */
function toggleShareButtons() {
    $('.social-buttons').toggleClass('visible');
}

$(function() {

    var $html = $('html');

    $html.on('click', '.quantity span', function() {
        var $this = $(this);
        var $el = $this.parents('.quantity').find('.amount');
        var action = $this.attr('class');
        var callback = false;
        if ($el.parents('.cart-table').length || $el.parents('.cart-widget-product-amount').length) {
            function updateQuantityCallback() {
                shoptet.cart.updateQuantityInCart($el, shoptet.config.updateQuantityTimeout);
            }
            callback = updateQuantityCallback;
        }
        shoptet.helpers.updateQuantity(
            $el[0],
            $el.data('min'),
            $el.data('max'),
            $el.data('decimals'),
            action,
            callback
        );
    });

    if ($('#ogImage').length) {
        $('#ogImage').appendTo('head');
        if ($('#ogImageOriginal').length) {
            $('#ogImageOriginal').remove();
        }
    }

    setThumbnailsDirection();
    checkThumbnails(shoptet.config.thumbnailsDirection, 'set', true);

    $html.on('click', '.browse-p a:not(.inactive)', function(e) {
        e.preventDefault();
        browseProducts($(this));
    });

    $html.on('click', '.thumbnail-next', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('clicked')) {
            switchThumbnails('prev');
        }
    });

    $html.on('click', '.thumbnail-prev', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('clicked')) {
            switchThumbnails('next');
        }
    });

    $html.on('click', '.p-thumbnail', function(e) {
        e.preventDefault();
        replaceImage($(this).attr('href'));
    });

    $html.on('click', '.p-main-image', function(e) {
        e.preventDefault();
        var href = $(this).attr('href').replace(/\/orig\//, '/big/');
        $('.cbox-gal[href="' + href  + '"]').trigger('click');
    });

    // Remove quantity box from intro on detail page
    $('.p-intro .quantity').remove();

    if($('.type-product').length) {
        shoptet.variantsSimple.handler();
        shoptet.variantsSplit.handler();
    }

    // Product's detail tab rating
    $('.star-wrap .star').mouseover(function() {
        returnStyle($(this));
    }).click(function() {
        var $a = $(this);
        var score = $a.data('score');

        changeStyle(score);
        setStyle($a);
    });
    $('.star-wrap').mouseleave(function() {
        var a = $('.star-wrap .current').index();

        returnStyle($('.star-wrap').children().eq(a));
    });

    $('#ratingTab .rate-form-trigger').click(function() {
        $('.rate-list[data-score="5"]').addClass('current')
            .find('.star').addClass('star-on').removeClass('star-off');

        $('.rate-list .star').click(function() {
            var $a = $(this);
            var score = $a.parents('.rate-list').data('score');

            changeStyle(score);
            setStyle($('.star-wrap .star:nth-child(' + score + ')'));
        });
    });

    $('.productRatingAction').on('click',function() {
        var successCallback = function(response) {
            $(".stars-wrapper").html(response.response.payload);
            initTooltips();
        };

        var url = $(this).attr('href');

        shoptet.ajax.makeAjaxRequest(
            url,
            shoptet.ajax.requestTypes.get,
            '',
            {
                'success': successCallback
            }
        );

        return false;
    });

    $('#productDiscussion .add-comment').click(function() {
        $('#productDiscussion .add-comment').show();
        $(this).hide();

        $('.discussion-form').show();
        moveElementAfterSelector($('.discussion-form'), $(this));

        $('.discussion-form input[name="parentId"]').remove();
        if($(this).attr('data-id')) {
            $('<input name="parentId" value="' + $(this).data('id') + '" type="hidden">').insertAfter('.discussion-form input[name="productId"]');
        }
    });

    // load new products dynamically
    $html.on('click', '.load-products', function(e) {
        shoptet.scripts.signalCustomEvent('ShoptetPageMoreProductsRequested', e.target);
        var $el = $('.pagination .current');
        showSpinner();

        $.ajax({
            type: "POST",
            url: $el.next('a').attr('href'),
            success: function(payload) {
                var requestedDocument = shoptet.common.createDocumentFromString(payload);
                shoptet.tracking.trackProductsFromPayload(requestedDocument);
                var listing = $(requestedDocument).find('.products-page > .product');
                var pagination = $(requestedDocument).find('.pagination-wrapper');
                var $productsWrapper = $('.products-page');

                if (listing !== null) {
                    $productsWrapper.last().append(listing);
                    $('.pagination-wrapper').replaceWith(pagination);
                    sameHeightOfProducts();
                    initTooltips();
                    setTimeout(function() {
                        $('.products-page img').unveil();
                    }, 1);
                    hideSpinner();
                }
                shoptet.scripts.signalDomLoad('ShoptetDOMPageMoreProductsLoaded', $productsWrapper[0]);
            }
        });
    });

    $html.on('click', '.js-share-buttons-trigger', function(e) {
        e.preventDefault();
        $('.social-buttons').toggleClass('no-display');
    });
});
