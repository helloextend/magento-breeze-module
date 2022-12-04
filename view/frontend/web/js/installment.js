/**
 * Extend SDK installment
 *
 * Guidance Magento Team <magento@guidance.com>
 * Copyright (c) 2022 Guidance Solutions (http://www.guidance.com)
 */
define([
    'jquery'
], function ($) {
    'use strict';

    $.widget('mage.extendInstallment', {
        component: 'extendInstallment',
        options: {
            libURL: '',
            config: null
        },

        /** @inheritdoc */
        _create: function () {
            if (!this.options.libURL || !this.options.config)
                return;

            if (typeof window.Extend === 'undefined') {
                this.loadLibrary();
            } else {
                this.setConfig();
            }
        },

        /**
         * Load external Extend SDK js-library
         */
        loadLibrary: function () {
            var scriptId = '_extend_sdk_script';
            var script = document.getElementById(scriptId);

            if (!script) {
                var script = document.createElement('script');
                script.id = scriptId;
                script.src = this.options.libURL;
                script.onload = this.setConfig.bind(this);
                document.head.appendChild(script);
            } else {
                script.onload = this.setConfig.bind(this);
            }
        },

        /**
         * Configure Extend SDK instance
         */
        setConfig: function () {
            window.Extend.config(this.options.config);
            // trigger 'extendInstallment:initialized' event
            $(document).trigger('extendInstallment:initialized');
        }
    });

    return $.mage.extendInstallment;
});
