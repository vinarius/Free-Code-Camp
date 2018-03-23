const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.route('/')
    .get((req, res)=>{
        res.type('txt').send('hello world!');
    });

app.listen(port, (err)=>{
    if(err)console.error("Error starting node application:", err);
    console.log("Node application listening on", port);
});