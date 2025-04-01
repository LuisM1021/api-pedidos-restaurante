const express = require("express");
const cors = require("cors");
const routerApi = require('./routes');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/prueba', (req, res) => {
    res.send('Hello from express');
});

routerApi(app);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});