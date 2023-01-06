/**
 * Extend Warranty - tracking actions
 *
 * Guidance Magento Team <magento@guidance.com>
 * Copyright (c) 2022 Guidance Solutions (http://www.guidance.com)
 */
define([
    'jquery',
    'underscore',
    'Magento_Customer/js/customer-data',
    'Extend_Warranty/js/extendtrk/actions',
    'jquery/jquery-storageapi'
], function ($, _, customerData, actions) {
    'use strict';

    $.widget('mage.extendTrackingService', {
        component: 'extendTrackingService',
        options: {
            sectionName: 'extend-tracking'
        },
        subscriptions: [],

        /**
         * Product warranty offers creation
         * @protected
         */
        _create: function () {
            this._submitHandler = this.checkSubmitEvent.bind(this);
            this._customerDataHandler = this.customerDataHandler.bind(this);

            // check form submission and trigger "extend-tracking" customer data update
            $(document.body).on('submit', this._submitHandler);

            // listen for changes in "extend-tracking" customer data
            this.extendSection = customerData.get(this.options.sectionName);
            if (!_.contains(this.subscriptions, this.options.sectionName)) {
                this.extendSection.subscribe(this.customerDataHandler, this);
                this.subscriptions.push(this.options.sectionName);
            }
        },

        /**
         * Detect whether track recent action (by invalidating "extend-tracking" section)
         *
         * @param {Event} event - The event arguments
         */
        checkSubmitEvent: function (event) {
            if (event.target.method.match(/post|put|delete/i)) {
                var sections = $.sections.getAffectedSections(event.target.action);
                if (_.isEmpty(sections) || _.contains(sections, this.options.sectionName)) {
                    customerData.invalidate([this.options.sectionName]);
                }
            }
        },

        /**
         * Handler of the "extend-tracking" customer data
         *
         * @param {Object} section
         */
        customerDataHandler: function (section) {
            var sectionData = (section || {}).data || [];
            if (!sectionData.length || typeof(window.Extend) === 'undefined')
                return;

            for (var i = 0; i < sectionData.length; i++) {
                var data = sectionData[i];
                switch (data.eventName) {
                    case 'trackProductAddedToCart':
                        actions.trackProductAddToCart(data);
                        break;
                    case 'trackOfferAddedToCart':
                        actions.trackOfferAddToCart(data);
                        break;
                    case 'trackProductRemovedFromCart':
                        actions.trackProductRemoveFromCart(data);
                        break;
                    case 'trackOfferRemovedFromCart':
                        actions.trackOfferRemoveFromCart(data);
                        break;
                    case 'trackProductUpdated':
                        actions.trackProductQtyUpdate(data);
                        break;
                    case 'trackOfferUpdated':
                        actions.trackOfferQtyUpdate(data);
                        break;
                }
            }
            customerData.set(this.options.sectionName, {});
        },

        /**
         * Destructor
         */
        destroy: function () {
            if (this._submitHandler) {
                $(document.body).off('submit', this._submitHandler);
            }
        }
    });

    return $.mage.extendTrackingService;
});
