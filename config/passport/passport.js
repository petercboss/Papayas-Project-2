const bCrypt = require('bcrypt-nodejs');

module.exports = (passport, user) => {

	const User = user;
	const LocalStrategy = require('passport-local').Strategy;
	// const passport = require('passport');
	const GoogleStrategy = require("passport-google-oauth20");
	const keys = require('../email.json');
	passport.serializeUser((user, done) => {
		done(null, user.id)
	});
	passport.deserializeUser((id, done) => {
		User.findById(id).then((user) => {
			if (user) {
				done(null, user.get());
			} else {
				done(user.errors, null);
			}
		});
	});
	// =========================================================================
	// code for signup (use('local-signup', new LocalStategy))
	// =========================================================================
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		(req, email, password, done) => {
			const generateHash = (password) => {
				return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
			};

			User.findOne({
				where: {
					email: email
				}
			}).then((user) => {
				if (user) {
					return done(null, false, {
						message: 'That email is already taken'
					});
				} else {
					const userPassword = generateHash(password);
					const data = {
						email: email,
						password: userPassword,
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						city: req.body.city
					};

					User.create(data).then((newUser, created) => {
						if (!newUser) {
							return done(null, false);
						}
						if (newUser) {
							return done(null, newUser);
						}
					});
				}
			});
		}
	));
	// =========================================================================
	// code for login (use('local-signin', new LocalStategy))
	// =========================================================================

	passport.use('local-signin', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		(req, email, password, done) => {
			const User = user;
			const isValidPassword = (userpass, password) => {
				return bCrypt.compareSync(password, userpass);
			}

			User.findOne({
				where: {
					email: email
				}
			}).then(user => {
				if (!user) {
					return done(null, false, {
						message: 'Email does not exist'
					})
				}
				if (!isValidPassword(user.password, password)) {
					return done(null, false, {
						message: 'Incorrect password.'
					});

				}

				const userinfo = user.get();
				return done(null, userinfo);

			}).catch(function (err) {
				console.log("Error:", err);
				return done(null, false, {
					message: 'Something went wrong with your Signin'
				});

			});
		}
	));

	// =========================================================================
	// GOOGLE ==================================================================
	// =========================================================================
	passport.use(new GoogleStrategy({

		clientID: keys.installed.client_id,
		clientSecret: keys.installed.client_secret,
		callbackURL: 'auth/google/redirect'
	},
		function (token, refreshToken, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Google
			process.nextTick(function () {

				// try to find the user based on their google id
				User.findOne({
					'google.id': profile.id
				}, function (err, user) {
					if (err)
						return done(err);

					if (user) {

						// if a user is found, log them in
						return done(null, user);
					} else {
						// if the user isnt in our database, create a new user
						var newUser = new User();

						// set all of the relevant information
						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.name = profile.displayName;
						newUser.google.email = profile.emails[0].value; // pull the first email

						// save the user
						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			});

		}));


}