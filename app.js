// Require Libraries
require('dotenv').config();
const express = require('express');

// App Setup
const app = express();

// tell Express that static files will live in 'public' folder
// had to use the more explicit __dirname, just 'public' wasn't working
app.use(express.static(__dirname + '/public'));

// Middleware

// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
// '/' is the root, home page
app.get('/', (req, res) => {
  // Handle the home page when we haven't queried yet
  let term = ""
  if (req.query.term) {
    term = req.query.term
  }
  
  // Build the API URL
  const apiKey = process.env.TENOR_API_KEY;
  const url = `https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${term}&limit=10&contentfilter=high`;
  
  // Make the API call using fetch instead of the wrapper
  fetch(url)
    .then(response => response.json())
    .then(data => {

       
      // The API returns results in data.results
      const gifs = data.results || [];
      res.render('home', { gifs })
    })
    .catch(error => {
      console.error('Error fetching gifs:', error);
      res.render('home', { gifs: [] })
    });
})
app.get('/greetings/:name', (req, res) => {
  // grab the name from the path provided
  const name = req.params.name;
  // render the greetings view, passing along the name
  res.render('greetings', { name });
})
// Start Server

app.listen(3000, () => {
  console.log('Gif Search listening on port localhost:3000!');
});