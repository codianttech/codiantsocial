/**
 * Created by hp on 7/6/2015.
 */
!(function () {
    'use strict'

    module.exports = {
        app: {
            email: '',
            name: '',
            siteurl:'http://localhost:3000/'
        },
        database: {
            mysql: {
                host: 'localhost',
                user: 'root',
                password: '',
                db: ''
            },
            mongodb: {
                url: 'mongodb://localhost:27017/codiantsocial'
            }
        },
        mail: {
            from_email: 'contact@codiant.com',
            from_name: 'Codiant',
            no_reply_email: '',
            smtp: {
                host: '',
                port: '',
                user: '',
                password: ''
            },
            sendgrid: {
                api_user: '',
                api_password: ''
            }
        }
    }
})();