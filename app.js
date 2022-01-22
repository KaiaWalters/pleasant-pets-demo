import fetch from 'node-fetch'
globalThis.fetch = fetch
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

var app = express()

app.set('view engine', "ejs")
app.use(express.static('public'));


// grab content from cat api 

app.get("/", (req, res) => {

    fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
        .then(res => res.json())
        .then(response => {
            console.log(response)
            let catArray = response.map(obj => {
                console.log(obj)
                return { url: obj.url, id: obj.id }
            }) 
            res.render("index", {array: catArray}) 
        })
})

// collect information from web page and make a fetch request 

app.listen(process.env.PORT)

//logic for what is being done in routes should be kept separate