const express = require('express')
const app = express()
const port = 8000
const http = require('http');
const { GPU } = require("gpu.js")
const gpu = new GPU()

app.use("/", express.static(__dirname + "/"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

module.exports = { gpu }

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});