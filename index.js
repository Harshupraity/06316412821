const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const routesh = require("./routesh/routesh.js");
const windowSize = 10;
let numberWindow = [];

app.use(express.json())
app.use("/",routesh)
app.listen(port, () => {
    console.log(`Average Calculator service running on http://localhost:${port}`);
});