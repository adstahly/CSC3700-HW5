const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars')
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayouts: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

const routes = require('./routes/studentRoutes');
app.use('/', routes);

app.use((req, res) => {
    res.status(404).render('404', {title: 'Page Not Found'});
});

app.use((err, req, res, next) => {
    res.status(500).render('500', {title: 'Internal Server Error'});
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})