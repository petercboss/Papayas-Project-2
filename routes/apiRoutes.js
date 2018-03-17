module.exports = (app, passport) => { 
    const express = require('express');
    const request = require('request');
    const db = require('../models/');
    const authController = require('../controllers/authcontroller');
    const calendar = require('../controllers/calendar');
    const email = require('../controllers/email');

    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/index',
        failureRedirect: '/signup'
    }));

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/index',
        failureRedirect: '/signin'
    }));

    app.get('/index', isLoggedIn, function (req, res) {
        let data = [
            calendar(),
            email(),
        request(`http://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&appid=b93ca65a1efb368d1b3d4a3af522cd1a`, (err, response, body) => {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render("index", {
                    data: null
                });
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${
                    weather.name
                }!`;
                res.render("index", { data: weatherText });
            }
        }),
        request(`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=a49ca69ef1f34e03abdc6463849a01bf`, (err, response, body) => {
            console.log(JSON.parse(body))
        })];
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
}