const bCrypt = require('bcrypt-nodejs');

module.exports = (passport, user) => {

    const User = user;
    const LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser((user, done) => {done(null, user.id)});
    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            const generateHash = (password) => {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: { email: email }
            }).then((user) => {
                if (user) {
                    return done(null, false, { message: 'That email is already taken' });
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

    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            const User = user;
            const isValidPassword = (userpass, password) => {
                return bCrypt.compareSync(password, userpass);
            }

            User.findOne({ where: { email: email }
    }).then(user => {
        if (!user) {
            return done(null, false, { message: 'Email does not exist' })
        }
        if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: 'Incorrect password.' });

        }

        const userinfo = user.get();
            return done(null, userinfo);

    }).catch(function(err) {
        console.log("Error:", err);
        return done(null, false, { message: 'Something went wrong with your Signin' });

    });
    }
 ));
}
