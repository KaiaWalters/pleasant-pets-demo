import express from 'express'
var app = express()
app.use(express.static('public'));
app.set('view engine', "ejs")


app.listen(process.env.PORT)