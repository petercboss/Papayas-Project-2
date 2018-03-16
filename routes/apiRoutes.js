module.exports = (app) => {
    const request = require('request');

    app.post("/", function(req, res) {
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
    });
    
}