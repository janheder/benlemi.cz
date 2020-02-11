(function(shoptet) {

    /**
     * Update cart button
     * @param {Number} count
     * count = number of items in cart
     * @param {Number} price
     * price = price of items in cart
     */
    function updateCartButton(count, price) {
        var $cartWrapper = $('.place-cart-here');
        var $cartButton = $('#header .cart-count');
        var $priceHolder = $cartButton.find('.cart-price');
        var $overviewWrapper = $('.cart-overview');

        if (count > 0) {
            $cartWrapper.addClass('full');
            var i = $cartButton.find('i');
            if (parseFloat(count) > 0) {
                if (count > 99) {
                    count = '99+';
                } else {
                    count = Math.ceil(parseFloat(count));
                }
                if (i.length) {
                    i.text(count);
                } else {
                    $cartButton.append('<i>' + count + '</i>').addClass('full');
                }
                if ($priceHolder.length) {
                    $priceHolder.text(price);
                }
            }

        } else {
            $cartWrapper.removeClass('full');
            $cartButton.removeClass('full').find('i').remove();
            if ($priceHolder.length) {
                $priceHolder.text(shoptet.messages['emptyCart']);
            }
        }

        if ($overviewWrapper.length) {
            $overviewWrapper.find('.cart-overview-item-count').text(count);
            $overviewWrapper.find('.cart-overview-final-price').text(price);
        }

        shoptet.scripts.signalDomUpdate('ShoptetDOMCartCountUpdated');
    }

    /**
     * Get cart content by AJAX
     *
     * @param {Boolean} hide
     * hide = if set to true, function hides spinner
     * @param {Function} callback
     * callback = code to execute after the content is loaded
     */
    function getCartContent(hide, callback) {
        var cartUrlSuffix = '';
        if (shoptet.config.orderingProcess.active) {
            cartUrlSuffix += '?orderingProcessActive=1';
        }
        if (shoptet.abilities.feature.simple_ajax_cart && $('body').hasClass('cart-window-visible')) {
            cartUrlSuffix += cartUrlSuffix.indexOf('?') !== -1 ? "&" : "?";
            cartUrlSuffix += 'simple_ajax_cart=1';
        }

        var el, $cartContentWrapper;
        if ($('#cart-wrapper').length) {
            // full cart page or extended_ajax_cart
            el = '#cart-wrapper';
            $cartContentWrapper = $(el).parent();
        } else {
            // simple ajax cart
            el = '.place-cart-here';
            $cartContentWrapper = $(el);
        }

        var successCallback = function(response) {
            $cartContentWrapper.html(response.getFromPayload('content'));
            $(el + ' img').unveil();
            initColorbox();
            initTooltips();

            if (hide !== false) {
                hideSpinner();
            }
            if (typeof callback === 'function') {
                callback();
            }
            shoptet.scripts.signalDomLoad('ShoptetDOMCartContentLoaded');
        };

        shoptet.ajax.makeAjaxRequest(
            shoptet.config.cartContentUrl + cartUrlSuffix,
            shoptet.ajax.requestTypes.get,
            '',
            {
                'success': successCallback
            }
        );
    }

    /**
     * Get advanced order content by AJAX
     *
     * This function does not accept any arguments.
     */
    function getAdvancedOrder() {
        var successCallback = function(response) {
            var content = response.getFromPayload('content');
            if (content !== false) {
                $.colorbox({
                    html: shoptet.content.colorboxHeader + content + shoptet.content.colorboxFooter,
                    width: shoptet.config.colorbox.widthLg,
                    className: 'colorbox-lg',
                    onComplete: function() {
                        $('.colorbox-html-content img').unveil();
                        $('body').removeClass(shoptet.config.bodyClasses);
                        if ($('.overlay').length > 0) {
                            $('.overlay').detach();
                        }
                        shoptet.scripts.signalDomLoad('ShoptetDOMAdvancedOrderLoaded');
                    }
                });
            }
        };

        shoptet.ajax.makeAjaxRequest(
            shoptet.config.advancedOrderUrl,
            shoptet.ajax.requestTypes.get,
            '',
            {
                'success': successCallback
            }
        );
    }

    /**
     * This function calls another functions needed to
     * run after AJAX call is complete
     *
     * @param {Object} form
     * form = form submitted by AJAX
     */
    function functionsForCart(form) {
        shoptet.cart.triggerCofidisCalc();
        shoptet.tracking.handleAction(form);
        if (typeof shoptet.config.showAdvancedOrder !== 'undefined' && !shoptet.config.orderingProcess.active) {
            shoptet.cart.getAdvancedOrder();
        }
    }

    /**
     * This function calls another functions needed to
     * run after AJAX call is complete - in second step of ordering process
     *
     * This function does not accept any arguments.
     */
    function functionsForStep1() {
        shoptet.checkout.getStatedValues();
        shoptet.checkout.setFirstPossibleShippingAndBilling();
        shoptet.checkout.setActiveShippingAndPayments();
        shoptet.checkout.payu();
    }

    /**
     * Create name for custom event depending on form action
     *
     * @param {String} action
     * action = action attribute of submitted form
     */
    function createEventNameFromFormAction(action) {
        var actionName = action.replace(shoptet.config.cartActionUrl, '');
        actionName = actionName.replace(/\//gi, '');
        actionName = 'ShoptetCart' + actionName.charAt(0).toUpperCase() + actionName.slice(1);
        return actionName;
    }

    /**
     * Submit form by AJAX POST
     *
     * @param {String} action
     * action = action attribute of submitted form
     * @param {Object} form
     * form = submitted form
     * @param {String} callingFunctions
     * callingFunctions = group of functions which have to be called after submit
     * @param {Boolean} replaceContent
     * replaceContent = determines if content wil be replaced with AJAX call result
     * @param {Boolean} displaySpinner
     * displaySpinner = if set to true, the spinner is displayed before and hidden after submit
     */
    function ajaxSubmitForm(action, form, callingFunctions, replaceContent, displaySpinner) {
        var body = document.getElementsByTagName('body')[0];
        if (displaySpinner === true) {
            showSpinner();
        }

        var cartUrlSuffix = '';
        if (shoptet.abilities.feature.simple_ajax_cart && !shoptet.config.orderingProcess.active) {
            cartUrlSuffix = '?simple_ajax_cart=1';
            body.classList.add('ajax-pending');
        }

        var completeCallback = function() {
            if (typeof shoptet.content.addToNotifier !== 'undefined') {
                if (response.response.code !== 500) {
                    response.response.message += ' ' + shoptet.content.addToNotifier;
                }
                delete shoptet.content.addToNotifier;
            }
            body.classList.remove('ajax-pending');
        };

        var successCallback = function(response) {
            switch (replaceContent) {
                case 'cart':
                    var count = response.getFromPayload('count');
                    var price = response.getFromPayload('price');
                    shoptet.cart.updateCartButton(count, price);
                    if (
                        shoptet.config.orderingProcess.step === 0
                        || body.classList.contains('cart-window-visible')
                    ) {
                        if (callingFunctions === 'functionsForCart') {
                            var cartCallback = function() {
                                shoptet.cart.functionsForCart(form);
                            };
                        }
                        shoptet.cart.getCartContent(true, cartCallback);
                    } else {
                        delete shoptet.events.cartLoaded;
                        setTimeout(function() {
                            hideSpinner();
                        }, dismissTimeout);
                        hideSpinner();
                    }
                    break;
                case true:
                    var payloadContent = $(payload.content).find('#content-wrapper');
                    payloadContent.find('#toplist').remove();
                    $('#content-wrapper').replaceWith(payloadContent);
                    $('#content-wrapper img').unveil();
                    initColorbox();
                    resizeModal();
                    shoptet.scripts.signalDomLoad('ShoptetDOMPageContentLoaded');
                    break;
            }

            dismissMessages();

            if (callingFunctions === 'functionsForCart' && (typeof cartCallback === 'undefined')) {
                shoptet.cart.functionsForCart(form);
            }

            if (callingFunctions === 'functionsForStep1') {
                shoptet.cart.functionsForStep1();
            }
            initTooltips();
            // TODO: remove in future and let available only standardized Shoptet custom events below
            var ev = new CustomEvent('ajaxDone');
            document.dispatchEvent(ev);
            shoptet.scripts.signalCustomEvent('ShoptetCartUpdated', form);
            shoptet.scripts.signalCustomEvent(shoptet.cart.createEventNameFromFormAction(action), form);

        };

        var failedCallback = function() {
            hideSpinner();
            $('html, body').animate({
                scrollTop: 0
            }, shoptet.config.animationDuration);
            if (callingFunctions === 'functionsForCart') {
                var cartCallback = function() {
                    shoptet.cart.functionsForCart(form);
                };
                shoptet.cart.getCartContent(true, cartCallback);
            }
        };

        // TODO: serialize w/o jQuery: https://developer.mozilla.org/en-US/docs/Web/API/FormData
        shoptet.ajax.makeAjaxRequest(
            action + cartUrlSuffix,
            shoptet.ajax.requestTypes.post,
            $(form).serialize(),
            {
                'success': successCallback,
                'failed': failedCallback,
                'complete': completeCallback
            }
        );

        return false;
    }

    /**
     * Update quantity in cart by AJAX call
     *
     * @param {Object} $input
     * $input = input field with whose value will be cart updated
     * @param {Number} timeout
     * timeout = number of miliseconds between input change and cart update
     */
    function updateQuantityInCart($input, timeout) {
        clearTimeout(setPcsTimeout);
        var $parentForm = $input.parents('form');
        var displaySpinner = true;
        if (!shoptet.abilities.feature.extended_ajax_cart && $('body').hasClass('user-action-visible')) {
            displaySpinner = false;
        }
        setPcsTimeout = setTimeout(function() {
            shoptet.cart.ajaxSubmitForm(
                $parentForm.attr('action'),
                $parentForm[0],
                'functionsForCart',
                'cart',
                displaySpinner
            );
        }, timeout);
    }

    /**
     * Remove item from cart by AJAX call
     *
     * @param {Object} $el
     * $el = HTML element containing item to remove
     */
    function removeItemFromCart($el) {
        var $parentForm = $el.parents('form');
        var displaySpinner = true;
        if (!shoptet.abilities.feature.extended_ajax_cart && $('body').hasClass('user-action-visible')) {
            displaySpinner = false;
        }
        shoptet.cart.ajaxSubmitForm(
            $parentForm.attr('action'),
            $parentForm[0],
            'functionsForCart',
            'cart',
            displaySpinner
        );
    }

    /**
     * Toggle related products visibility in cart
     *
     * @param {Object} $target
     * $target = HTML element which has to be revealed/hidden
     */
    function toggleRelatedProducts($target) {
        $target.toggleClass('visible');
        $target.prev('tr').toggleClass('related-visible');
    }

    /**
     * Cofidis icon trigger onClick calc event
     *
     * This function does not accept any arguments.
     */
    function triggerCofidisCalc() {
        if ($('.cofidis.extra').length) {
            $('.installments').on('click', function(e) {
                e.stopPropagation();
            });
            $('.cofidis.extra').on('click', function() {
                $('.installments').trigger('click');
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        shoptet.cart.triggerCofidisCalc();

        var $html = $('html');
        // cart - set pcs form
        $html.on('change', 'input.amount', function() {
            if ($(this).parents('.cart-table').length || $(this).parents('.cart-widget-product-amount').length) {
                shoptet.cart.updateQuantityInCart($(this), shoptet.config.updateQuantityTimeout);
            }
        });

        $html.on('submit', '.quantity-form', function(e) {
            e.preventDefault();
            shoptet.cart.updateQuantityInCart($(this).find('input.amount'), shoptet.config.updateQuantityTimeout);
            return false;
        });

        // Show and hide related items in cart
        $html.on('click', '.show-related', function(e) {
            e.preventDefault();
            var $tr = $(this).parents('tr').next('.related');
            shoptet.cart.toggleRelatedProducts($tr);
            $tr.find('img').unveil();
        });

        // Check discount coupon
        $html.on('click touchend', '#continue-order-button', function(e) {
            if($('#discountCouponCode').val()) {
                showMessage(shoptet.messages['discountCouponWarning'], 'warning', '', false, true)
                e.preventDefault();
            } else {
                window.location = $(this).attr('href');
            }
        });

        // Choose free gift
        $html.on('click', '.free-gift-trigger', function (e) {
            e.preventDefault();
            $('.free-gifts-wrapper img').each(function() {
                $(this).attr('src', $(this).attr('data-src'));
            });

            var content = $('.free-gifts-wrapper').html();
            $.colorbox({
                html: shoptet.content.colorboxHeader + content + shoptet.content.colorboxFooter,
                width: shoptet.config.colorbox.widthSm,
                maxHeight: '95%',
                className: 'colorbox-sm'
            });
            $('#colorbox input').remove();
        });

        $html.on('click', '.remove-item', function(e) {
            e.preventDefault();
            $el = $(this);
            shoptet.cart.removeItemFromCart($el);
        });

        $html.on('click', '#colorbox .free-gifts label', function(e) {
            e.preventDefault();
            var id = $(this).attr('for');
            $('.free-gifts input').each(function () {
                if (id == $(this).attr('id')) {
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });
            $.colorbox.close();
            var $form = $('.free-gifts-wrapper form');
            shoptet.cart.ajaxSubmitForm(
                $form.attr('action'),
                $form[0],
                'functionsForCart',
                'cart',
                true
            );
        });

        $html.on('submit', 'form.pr-action, form.variant-submit', function(e) {
            e.preventDefault();
            if (shoptet.variantsCommon.handleSubmit($(this))) {
                var $this = $(this);
                var $amount = $this.find('.amount');
                var decimals = $amount.data('decimals') || 0;
                var max =
                    shoptet.helpers.toFloat($amount.data('max')) || shoptet.config.defaultProductMaxAmount;
                var min =
                    shoptet.helpers.toFloat($amount.data('min')) || shoptet.helpers.resolveMinimumAmount(decimals);
                var value = $amount.length ? shoptet.helpers.toFloat($amount.val()) : 1;
                if (value > max) {
                    $amount.val(shoptet.helpers.toLocaleFloat(max, decimals, true));
                    shoptet.content.addToNotifier = shoptet.messages['amountChanged'];
                }
                if (value < min) {
                    $amount.val(shoptet.helpers.toLocaleFloat(min, decimals, true));
                    shoptet.content.addToNotifier = shoptet.messages['amountChanged'];
                }
                shoptet.cart.ajaxSubmitForm(
                    $this.attr('action'),
                    $this[0],
                    'functionsForCart',
                    'cart',
                    true
                );
            }
        });

        $html.on('submit', '.discount-coupon form', function(e) {
            e.preventDefault();
            var $this = $(this);
            shoptet.cart.ajaxSubmitForm(
                $this.attr('action'),
                $this[0],
                'functionsForCart',
                'cart',
                true
            );
        });

        var $additionalInformation = $('#additionalInformation');
        if ($additionalInformation.length && !$additionalInformation.hasClass('visible')) {
            toggleRequiredAttributes($additionalInformation, 'remove', false);
        }

        var $shippingAddress = $('#shipping-address');
        if ($shippingAddress.length && !$shippingAddress.hasClass('visible')) {
            toggleRequiredAttributes($shippingAddress, 'remove', false);
        }

        $html.on('change', 'input[name="customerGroupId"]', function() {
            var $additionalInformation = $('#additionalInformation');
            if ($(this).hasClass('show-full-profile')) {
                if (!$additionalInformation.hasClass('visible')) {
                    $additionalInformation.addClass('visible');
                    if ($(this).hasClass('is-wholesale')) {
                        if (!$('#company-shopping').parent().hasClass('unveiled')) {
                            $('#company-shopping').trigger('click');
                        }
                        $('#company-shopping').parent().hide();
                    } else {
                        $('#company-shopping').parent().show();
                    }
                    toggleRequiredAttributes($additionalInformation, 'add', true);
                }
            } else {
                if ($additionalInformation.hasClass('visible')) {
                    $additionalInformation.removeClass('visible');
                    toggleRequiredAttributes($additionalInformation, 'remove', true);
                }
            }
        });

        $html.on('change', '#another-shipping', function() {
            shoptet.checkout.toggleAnotherShipping();
        });

        $('[data-change]').each(function() {
            $(this).prop('checked', true).trigger('change');
        });
    });

    shoptet.cart = shoptet.cart || {};
    shoptet.scripts.libs.cart.forEach(function(fnName) {
        var fn = eval(fnName);
        shoptet.scripts.registerFunction(fn, 'cart');
    });

})(shoptet);
