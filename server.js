const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let images=[];

let comments=[];

app.use(cors());



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/comment', (req, res) => {
    res.status(201).json(comments);
});


app.post('/uploadcomment', (req, res) => {
    const comment = req.body;
    console.log(comment);
    comments.push(comment);
    res.json("success");
    res.status(201);
});

app.post('/uploadimage', (req, res) => {
    const image = req.body;
    console.log(image);
    images.push(image);
    res.json("success");
    res.status(201);
});

app.get('/image', (req, res) => {
    res.status(201).json(images);
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));