const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const env = require('dotenv').load();
const db = require('./models');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const authRoute = require('./routes/apiRoutes.js')(app, passport);
require('./config/passport/passport.js')(passport, db.user);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('Server listening on Port:' + port);
  });
});