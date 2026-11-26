const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');                 // template engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // parse POST form data

const messages = [];

// 1. GET /        - home page
app.get('/', (req, res) => res.render('home', { title: 'Home', count: messages.length }));
// 2. GET /about   - about page
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
// 3. GET /contact - show contact form
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact', success: false }));
// 4. POST /contact - handle form submission
app.post('/contact', (req, res) => {
  const { name, message } = req.body;
  messages.push({ name, message, at: new Date().toLocaleString() });
  res.render('contact', { title: 'Contact', success: true });
});
// 5. GET /messages - list submitted messages
app.get('/messages', (req, res) => res.render('messages', { title: 'Messages', messages }));
// 6. GET /user/:name - route parameter
app.get('/user/:name', (req, res) => res.render('user', { title: 'User', name: req.params.name }));
// 7. POST /messages/clear
app.post('/messages/clear', (req, res) => { messages.length = 0; res.redirect('/messages'); });

app.use((req, res) => res.status(404).send('404 - Page not found'));
app.listen(3000, () => console.log('Running at http://localhost:3000'));
