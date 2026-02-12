const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // serve static files from root

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login');
  }
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'raygil' && password === 'unconditional') {
    req.session.authenticated = true;
    res.redirect('/index.html');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Protect HTML routes
app.get('/index.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/Polls.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'Polls.html'));
});
app.get('/Weekly.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'Weekly.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});