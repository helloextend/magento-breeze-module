/**
 * Extend Warranty - Minicart mixin
 *
 * Guidance Magento Team <magento@guidance.com>
 * Copyright (c) 2022 Guidance Solutions (http://www.guidance.com)
 */
define([
    'jquery',
    'underscore',
    'cartItemWarranty'
], function ($, _) {
    'use strict';

    $.mixin('minicart', {
        warrantyClass: 'product-item-warranty',

        create: function (original) {
            original();

            var self = this,
                updateHandler = _.debounce(function (e) {
                    self._onContentUpdated(e)
                }, 100);

            this.minicart().on('contentUpdated', updateHandler);
        },

        /**
         * Mini-cart content update handler
         * @param {Event} e
         * @private
         */
        _onContentUpdated: function (e) {
            var cartItems = this.cart.items() || [];
            _.each(cartItems, function (cartItem) {
                var qtyElem = $('#cart-item-' + cartItem.item_id + '-qty', this.minicart());
                if (qtyElem.length) {
                    this._initWarrantyOffers(cartItem, qtyElem.closest('[data-role=product-item]'));
                }
            }.bind(this));
        },

        /**
         * Initialize warranty offers simple button
         *
         * @param {object} cartItem
         * @param {jQuery} element
         * @private
         */
        _initWarrantyOffers: function (cartItem, element) {
            var blockID = 'warranty-offers-' + cartItem.product_id;
            var warrantyElem = $('#' + blockID, element);

            if (!cartItem.product_can_add_warranty) {
                warrantyElem.remove();
                return;
            }

            if (!warrantyElem.length) {
                warrantyElem = $('<div>')
                .attr('id', blockID)
                .addClass(this.warrantyClass);
                $('div.product-item-details', element).append(warrantyElem);
            }

            if (!warrantyElem.data('mageCartItemWarranty')) {
                warrantyElem.cartItemWarranty({
                    isInCartPage: window.location.href === this.shoppingCartUrl,
                    productSku: cartItem.product_sku,
                    addToCartUrl: cartItem.warranty_add_url,
                    buttonEnabled: true,
                    trackingEnabled: cartItem.product_is_tracking_enabled
                });
            }
        },

        /**
         * Destructor
         */
        destroy: function (original) {
            var warrantyBlocks = $('.' + this.warrantyClass, this.minicart());
            _.each(warrantyBlocks, function (block) {
                block.remove();
            });

            original();
        }
    });
});
