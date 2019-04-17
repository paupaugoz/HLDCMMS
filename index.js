const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
const models = require('./database');
var app = express();
var passport = require('passport');
var multer = require('multer');
var upload = multer();
var passportConfig = require('./config/passport');
var {
  ensureAuthenticatedManagement, 
  ensureAuthenticatedEncoder, 
  ensureAuthenticatedWarehouse, 
  ensureAuthenticatedEngineer} = require('./util/index');
const auth = require('./routes/auth');
const management = require('./routes/management');
const engineer = require('./routes/engineer');
const encoder = require('./routes/encoder');
const warehouse = require('./routes/warehouse');

var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      json: function (a) {
        var stringified = JSON.stringify(a);
        return stringified.replace(/&quot;/g, '\\"');
      }
  }
});

//register partials
//hbs.registerPartial('partial',)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(flash());
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(upload.array());
app.use('/static', express.static('public'));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth);
app.use('/management', ensureAuthenticatedManagement, management);
app.use('/engineer', ensureAuthenticatedEngineer, engineer);
app.use('/encoder', ensureAuthenticatedEncoder, encoder);
app.use('/warehouse', ensureAuthenticatedWarehouse, warehouse);

app.get('/', (req, res) => {
  res.render('index', {
    layout: false
  });
});

app.listen(3000, () => {
  console.log('app is running → PORT 3000');
});