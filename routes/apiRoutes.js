module.exports = (app, passport) => {
	const express = require('express');
	const request = require('request');
	const db = require('../models/');
	const authController = require('../controllers/authcontroller');
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
		let username = req.user.firstname;
		let calEvent = `https://calendar.google.com/calendar/embed?mode=DAY&src=${req.user.email}&ctz=America%2FChicago" style="border-width:0" width="315" height="200" frameborder="0" scrolling="no"`;
		let emailLabel;
		console.log(emailLabel);
		// let emailLabel = $("#email").append("<p>" + emailLabel + "</p>");
		let data = [
			email().then(function (resolve) {
				// console.log(`this is my apiroutes test!`, resolve);
				// expected output: "Success!"
				emailLabel = resolve;
			}),
			request(`http://api.openweathermap.org/data/2.5/weather?q=${req.user.city}&units=imperial&appid=b93ca65a1efb368d1b3d4a3af522cd1a`, (err, response, body) => {
				let weather = JSON.parse(body);
				let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
				request(`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=a49ca69ef1f34e03abdc6463849a01bf`, (err, response, body) => {
					let news = JSON.parse(body);
					let newsText = [];
					for (i = 0; i < 5; i++) {
						newsText.push(`<a href="${news.articles[i].url}">${news.articles[i].title}</a>`)
					}
					request(`https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=134889`, (err, response, body) => {
						let sports = JSON.parse(body);
						let sportsText = `My teams: ${sports.teams[0].strTeam}`;
						let sportsLogo = `${sports.teams[0].strTeamLogo}`;
						res.render('index', {
							username: username,
							news: newsText,
							weather: weatherText,
							sports: sportsText,
							logo: sportsLogo,
							email: emailLabel,
							calendar: calEvent
						});
					});
				});
			})
		];
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/signin');
	}
}