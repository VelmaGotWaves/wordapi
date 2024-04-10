const express = require('express');
const app = express();
const path = require('path');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));

app.use('/word', require('./routes/word'))

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
app.listen(80, () => console.log(`Server running on port ${80}`));