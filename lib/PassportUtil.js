/**
 * Created by hp on 7/8/2015.
 */
!(function () {
    'use strict'

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../app/models/User');
    var BearerStrategy = require('passport-http-bearer').Strategy;
    var _ = require("underscore");

    var util = require('util');


    passport.use('login', new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        function (req, username, password, done) {

            User.findOne({'email': username,'status':'active'}).exec(
                function (err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        var err = new Error('User not found');
                        return done(err);
                    }

                    if (user.password != password) {
                        var err = new Error('Invalid email or password');
                        return done(err);
                    } else {
                        return done(null, user);
                    }
                }
            );
        }));


    passport.use('signup', new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        function (req, username, password, done) {
            var findOrCreateUser = function () {

                User.findOne({'email': username, status: {$ne: 'deleted'}}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                   if (user) {
                        var err = new Error('Email already exists');
                        err.name = "EmailExists";
                        return done(err);
                    } else {
                        var model = new User(_.extend(req.body, {email: username, password: password}));
                        model.user_type = req.params.type;
                        model.save(function (err) {
                            if (err) {
                                return done(err);
                            } else {
                                return done(null, model);
                            }
  })
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        }));


    passport.serializeUser(function (user, done) {
        var createAccessToken = function () {
            var token = user.generateRandomToken();
            User.findOne({access_token: token}, function (err, existingUser) {
                if (err) {
                    return done(err);
                }
                if (existingUser) {
                    createAccessToken();
                } else {

                    if (user.access_token == undefined || user.user_type == 'broker' || user.user_type == 'seller' || user.user_type == 'admin') {
                        user.set('access_token', token);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            return done(null, user.get('access_token'));
                        })
                    }
                    else
                        return done(null, user.get('access_token'));
                }
            });
        };

        if (user._id) {
            createAccessToken();
        }
    });

    passport.deserializeUser(function (token, done) {
        User.findOne({access_token: token}, function (err, user) {
            done(err, user);
        });
    });
})();
