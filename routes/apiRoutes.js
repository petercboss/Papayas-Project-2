    const express = require('express');
    const router = express.Router();
    const request = require('request');
    const db = require('../models/');
    const calendar = require('../controllers/calendar');
    const email = require('../controllers/email');

    router.get('/', (req, res) => {
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
    
    
    
    
    
    

   /* app.post("/", function(req, res) {
        let city = req.body.city;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_KEY}`;
    
        request(url, function(err, response, body) {
            if (err) {
                res.render("index", { weather: null, error: "Error, please try again" });
            } else {
                let weather = JSON.parse(body);
                if (weather.main == undefined) {
                    res.render("index", {
                        weather: null,
                        error: "Error, please try again"
                    });
                } else {
                    let weatherText = `It's ${weather.main.temp} degrees in ${
                        weather.name
                    }!`;
                    res.render("index", { weather: weatherText, error: null });
                    console.log(weatherText);
                }
            }
        });
    */
    module.exports = router;