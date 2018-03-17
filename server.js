const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: 925519512319-000-lchfej61qo0b4mp7uvtp9mpg2ovbp.apps.googleusercontent.com,
  clientSecret: K5x33K5NsPsbIapnr2hRUf69,
  callbackURL: "http://www.example.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
     User.findOrCreate({ googleId: profile.id }, function (err, user) {
       return done(err, user);
     });
}
));
//const db = require('./models');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

require('./routes/apiRoutes.js')(app);
require('./routes/htmlRoutes.js')(app);

//db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('Server listening on Port:' + port);
  });
//});