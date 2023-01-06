/**
 * Extend Warranty - Cart/minicart item widget
 *
 * Guidance Magento Team <magento@guidance.com>
 * Copyright (c) 2022 Guidance Solutions (http://www.guidance.com)
 */
define([
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/alert',
    'Magento_Customer/js/customer-data',
    'Extend_Warranty/js/extendtrk/actions',
    'extendWarrantyOffers',
    'domReady!'
], function ($, $t, alert, customerData, trackActions) {
    'use strict';

    $.widget('mage.cartItemWarranty', 'extendWarrantyOffers', {
        component: 'cartItemWarranty',
        options: {
            isInCartPage: true,
            productSku: null,
            addToCartUrl: null,
            addToCartEvent: null,
            buttonEnabled: true,
            trackingEnabled: true
        },

        /**
         * Cart warranty offers creation
         * @protected
         */
        _create: function () {
            this.renderSimpleButton(this._addToCart.bind(this));
        },

        /**
         * Warranty "Add To Cart" handler
         * @protected
         * @param {Object|null} warranty - warranty plan data
         */
        _addToCart: function (warranty) {
            if (!warranty)
                return;

            $.ajax({
                url: this.options.addToCartUrl,
                data: $.param({
                    warranty: warranty,
                    form_key: $.cookies.get('form_key')
                }),
                type: 'POST',
                dataType: 'json',

                beforeSend: function () {
                    $(document.body).trigger('processStart');
                },

                complete: function () {
                    $(document.body).trigger('processStop');
                },

                success: function (response) {
                    if (response.status) {
                        this._onAddToCartSuccess(response);
                    } else {
                        this._onAddToCartError(response.error);
                    }
                }.bind(this),

                error: function (xhr, status, error) {
                    this._onAddToCartError($t('Sorry, there has been an error processing your request. Please try again or contact our support.'));
                }.bind(this)
            });
        },

        /**
         * Warranty "Add To Cart" succeed
         * @protected
         * @param {Object} response - ajax-response data
         */
        _onAddToCartSuccess: function (response) {
            // track warranty 'Add To Cart'
            if (this.options.trackingEnabled && typeof (response.trackingData) !== 'undefined') {
                trackActions.trackOfferAddToCart(response.trackingData);
            }

            // trigger warranty 'Add To Cart' event
            if (this.options.addToCartEvent) {
                $(document).trigger('ajax:' + this.options.addToCartEvent);
            }

            if (this.options.isInCartPage) {
                // reload Cart page
                window.location.reload(false);
            } else {
                // reload Customer cart data
                customerData.reload(['cart'], false);
            }
        },

        /**
         * Warranty "Add To Cart" failed
         * @protected
         */
        _onAddToCartError: function (errorMessage) {
            $.alert({
                title: $t('Error'),
                content: errorMessage
            });
        },

        /**
         * Destructor
         */
        destroy: function () {
            this.element.get(0).innerHTML = '';
        }
    });

    return $.mage.cartItemWarranty;
});
