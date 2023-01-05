/**
 * Extend Warranty - Post-purchase via Aftermarket modal
 *
 * Guidance Magento Team <magento@guidance.com>
 * Copyright (c) 2022 Guidance Solutions (http://www.guidance.com)
 */
define([
    'jquery',
    'mage/cookies',
    'leadOrderWarranty',
    'domReady!'
], function ($) {
    'use strict';

    $.widget('mage.postPurchaseLeadWarranty', 'leadOrderWarranty', {
        component: 'postPurchaseLeadWarranty',
        options: {
            leadToken: null,
            buttonEnabled: false,
            addLeadUrl: null
        },

        /**
         * Post purchase lead token item warranty offers creation
         * @protected
         */
        _create: function () {
            var self = this;
            this.waitExtendLoaded()
                .then(function () {
                    Extend.aftermarketModal.open({
                        leadToken: self.options.leadToken,
                        onClose: function(plan, product) {
                            if (plan && product) {
                                self._addToCart({
                                    leadToken: self.options.leadToken,
                                    planId: plan.planId,
                                    price: plan.price,
                                    term: plan.term,
                                    product: product.id,
                                    formKey: $.cookies.get('form_key')
                                })
                            }
                        }
                    });
                }.bind(this));

        },

        /**
         * Wait for ExtendSDK
         * @return {Promise<void>}
         */
        waitExtendLoaded: function () {
            return new Promise(function (resolve) {
                if (typeof window.Extend !== 'undefined') {
                    resolve();
                } else {
                    $(document).on('extendInstallment:initialized', function () {
                        resolve();
                    }.bind(this));
                }
            }.bind(this));
        }
    });

    return $.mage.postPurchaseLeadWarranty;
});
