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
        successRedirect: '/',
        failureRedirect: '/signup'
    }));

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    }));

    app.get('/', isLoggedIn, function (req, res) {
        let calEvent;
        let emailLabel;
        let data = [
            calendar().then(function(resolve) {
                // console.log(`this is my apiroutes test!`, resolve);
                // expected output: "Success!"
                calEvent = resolve;
                // console.log(`final test`, calEvent);
              }),
            email().then(function(resolve) {
                // console.log(`this is my apiroutes test!`, resolve);
                // expected output: "Success!"
                emailLabel = resolve;
                console.log(`final email test`, emailLabel);
              }),
        request(`http://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&appid=b93ca65a1efb368d1b3d4a3af522cd1a`, (err, response, body) => {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', {
                    weather: null
                });
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                request(`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=a49ca69ef1f34e03abdc6463849a01bf`, (err, response, body) => {
                    let news = JSON.parse(body);
                    if (news.articles == undefined) {
                        res.render('index', { news: null });
                    } else {
                        let newsText = `Todays headlines: ${news.articles[0].title}`;
                        request(`https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=134889`, (err, response, body) => {
                            let sports = JSON.parse(body);
                            console.log(sports);
                            if (sports.teams == undefined) {
                                res.render('index', { sports: null });
                            } else {
                                let sportsText = `My teams: ${sports.teams[0].strTeam}`;
                                let sportsLogo = `${sports.teams[0].strTeamLogo}`;
                                res.render('index', { news: newsText, weather: weatherText, sports: sportsText, logo: sportsLogo, email: emailLabel, calendar: calEvent });
                            };
                        });
                    };
                });
            };
        })];
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
}