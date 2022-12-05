/**
 * Extend Warranty - PDP/PLP widget for configurable product
 *
 * Guidance Magento Team <magento@guidance.com>
 * Copyright (c) 2022 Guidance Solutions (http://www.guidance.com)
 */
define([
    'jquery',
    'underscore',
    'extendWarrantyOffers',
    'simpleProductWarranty',
    'domReady!'
], function ($, _) {
    'use strict';

    $.widget('mage.configurableProductWarranty', 'simpleProductWarranty', {
        component: 'configurableProductWarranty',
        options: {
            isInProductView: true,
            productId: null,
            productSku: null,
            buttonEnabled: true,
            modalEnabled: false,
            blockClass: 'product-warranty-offers',
            insertionPoint: 'div.fieldset',
            insertionLogic: 'after',
            formInputName: 'warranty',
            formInputClass: 'extend-warranty-input',
            selectors: {
                addToCartForm: '#product_addtocart_form',
                addToCartButton: '#product-addtocart-button',
                optionsWrap: 'div.product-options-wrapper'
            }
        },

        /**
         * Bind events
         * @protected
         */
        _bind: function () {
            this._super();

            if (this.options.selectors.optionsWrap) {
                $(this.options.selectors.optionsWrap, this.mainWrap).on('change', this._onOptionsChanged.bind(this));
            }
        },

        /**
         * Handles product options `change` event
         * @protected
         * @param {Event} event - The event arguments
         */
        _onOptionsChanged: function (event) {
            if (!this.options.buttonEnabled)
                return;

            var productSku = this._getWarrantyProductSku();
            this.warrantyBlock.extendWarrantyOffers('updateActiveProduct', productSku);
        },

        /**
         * Returns currently selected simple product SKU
         * @protected
         */
        _getWarrantyProductSku: function () {
            var swatches = $('div.swatch-attribute', this.mainWrap);
            var selectedSku = null;

            if (swatches.length > 0 ) {
                var swatchesElem = this.options.isInProductView ?
                    $('[data-role=swatch-options]', this.mainWrap) :
                    $('[data-role^=swatch-option-]', this.mainWrap);
                var swatchRenderer = swatchesElem.data('mageSwatchRenderer');

                if (swatchRenderer) {
                    var selectedProducts = swatchRenderer._CalcProducts();
                    var selectedId = _.isArray(selectedProducts) && selectedProducts.length === 1 ? selectedProducts[0] : null;
                    if (selectedId && selectedId !== '') {
                        selectedSku = swatchRenderer.options.jsonConfig.skus[selectedId];
                    }
                }
            } else if (this.options.isInProductView) {
                var selectedId = $('input[name=selected_configurable_option]', this.mainWrap).val();
                if (selectedId && selectedId !== '') {
                    var spConfig = this.addToCartForm.data('mageConfigurable').options.spConfig;
                    selectedSku = spConfig && spConfig.skus ? spConfig.skus[selectedId] : null;
                }
            }

            return selectedSku ? selectedSku : this.options.productSku;
        },

        /**
         * Destructor
         */
        destroy: function () {
            this._super();
        }
    });

    return $.mage.configurableProductWarranty;
});
