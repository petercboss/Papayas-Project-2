module.exports = (app, passport) => {
	const express = require('express');
	const request = require('request');
	const db = require('../models/');
	const authController = require('../controllers/authcontroller');
	const email = require('../controllers/email');

	app.get('/signup', authController.signup);
	app.get('/signin', authController.signin);
	app.get('/logout', authController.logout);
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	}));

	// the callback after google has authenticated the user
	app.get('/auth/google/redirect', passport.authenticate('google', {
		// passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/signup'
	}));

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup'
	}));

	app.post('/signin', passport.authenticate('local-signin', {
		successRedirect: '/',
		failureRedirect: '/signin'
	}));

	app.get("/", isLoggedIn, function (req, res) {
		let username = req.user.firstname;
		let calEvent = `https://calendar.google.com/calendar/embed?mode=DAY&src=${req.user.email}&ctz=America%2FChicago" style="border: 0" width="800" height="600" frameborder="0" scrolling="yes"`;
		let emailLabel;
		request(
			`http://api.openweathermap.org/data/2.5/weather?q=${
					req.user.city
				}&units=imperial&appid=b93ca65a1efb368d1b3d4a3af522cd1a`,
			(err, response, body) => {
				let weather = JSON.parse(body);
				let weatherCity = `${weather.name}`;
				let weatherTemp = `${weather.main.temp}°`;
				let weatherIcon = weather.weather[0].main;
				let currentWeather;

				function setIcon(weatherIcon) {
					switch (weatherIcon) {
						case "Rain":
							currentWeather = `<div class="rain">
                        <ul>
                          <li></li>
                          <li></li>
                          <li></li>
                       </ul>
                     </div>`;
							break;
						case "Drizzle":
							currentWeather = `<div class="rain">
                        <ul>
                          <li></li>
                          <li></li>
                          <li></li>
                       </ul>
                     </div>`;
							break;
						case "Clear":
							currentWeather = `<div class="sun"></div>`;
							break;
						case "Clouds":
							currentWeather = `<div class="cloud"><div class="cloud1">
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                          </ul>
                        </div>
                        <div class="cloud1 c_shadow">
                          <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                          </ul>
                        </div>
                      </div>`;
							break;
						case "Thunderstorm":
							currentWeather = '<div class="thunder"></div>';
							break;
						case "Snow":
							currentWeather = `<div class="sleet">
                        <ul>
                          <li></li>
                          <li></li>
                          <li></li>
                       </ul>
                     </div>`;
							break;
						case "Haze":
							currentWeather = '<div class="haze"></div>';
							break;
					}
				}
				setIcon(weatherIcon);
				request(
					`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=a49ca69ef1f34e03abdc6463849a01bf`,
					(err, response, body) => {
						let news = JSON.parse(body);
						let newsText = [];
						for (i = 0; i < 5; i++) {
							newsText.push(
								`<li><a href="${news.articles[i].url}">${
										news.articles[i].title
									}</a></li>`
							);
						}
						request(
							`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${
									req.user.sports
								}`,
							(err, response, body) => {
								let sports = JSON.parse(body);
								let teamID = sports.teams[0].idTeam;
								let teamPhoto = sports.teams[0].strTeamLogo;
								let sportsText = `My teams: ${sports.teams[0].strTeam}`;
								let sportsLogo = `${sports.teams[0].strTeamBadge}`;
								request(
									`https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=${teamID}`,
									(err, response, body) => {
										let fiveEvents = JSON.parse(body);
										let allEvents = [];
										for (i = 0; i < 5; i++) {
											allEvents.push(
												`<li>${fiveEvents.events[i].strFilename}</li>`
											);
										}
										email().then(function (resolve) {
											console.log(resolve);
											emailLabel = resolve;
											res.render("index", {
												username: username,
												news: newsText.join(''),
												city: weatherCity,
												weatherIcon: currentWeather,
												weather: weatherTemp,
												sports: allEvents.join(''),
												logo: sportsLogo,
												email: emailLabel,
												calendar: calEvent
											});
										});
									}
								);
							}
						);
					}
				);
			}
		);
	});

	app.get('/public/assets/img/:png', function (req, res) {
		res.send(true);
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/signin');
	}
}