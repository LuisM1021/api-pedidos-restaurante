const express = require("express");

const app = express();

const port = process.env.port || 3000;

app.use(express.json());

app.get('/prueba', (req, res) => {
    res.send('Hello from express');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});