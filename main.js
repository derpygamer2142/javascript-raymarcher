const express = require('express')
const app = express()
const port = 8000
const { GPU } = require("gpu.js")

app.use("/", express.static(__dirname + "/public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});