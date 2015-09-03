/**
 * Created by hp on 7/8/2015.
 */
!(function () {
    'use strict'

    var BaseEmailer = require('./BaseEmailer')
        , config = require('../config/env/' + (process.env.NODE_ENV || 'production'));
    var Emailer = {

        /*
         * Send  signup email
         */
        SignupEmail: function (to, callback) {
            var options = {
                to: to,
                subject: ' ',
                html: ' ',
                template_id: ''
            };
            BaseEmailer.sendMail(options, callback);
        },


    }

    module.exports = Emailer;
})
();