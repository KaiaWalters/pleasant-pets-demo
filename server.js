import fetch from 'node-fetch'
globalThis.fetch = fetch
import dotenv from 'dotenv'
import database from './config/database.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import express from 'express'
var app = express()
app.use(express.static('public'));
app.set('view engine', "ejs")

var url = database.url
var db 
let docCount

app.use(bodyParser.json())

dotenv.config()
mongoose.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
  docCount = db.collection('cards').count()
}); 
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ',err));

//Overview of the Server Side Logic
//if db is empty {
    //fetch cat image urls from cat.api 
    //generate a new set of cards 
    //save this set of cards to mongo db
//}
  //queue a number of cards 
  //display that set of cards in the app body

//else  user requires more cards to vote on
  //fetch cat image urls from cat.api 
    //generate a new set of cards 
    //save this set of cards to mongo db
    //queue a number of cards 
    //display that set of cards in the app body


// GET / ENDPOINT 
//The site will need to be exposed from a / endpoint in order for a user to visit your site. 
//When the page is rendered you will need to:(1) determine whether or not you will need to call the external api for a fresh set
//of image urls. 
//(2) load the imaged that will be rendered on your site 

app.get("/", async (req, res) => {  
    console.log("server started") 
    console.log("queuing up cards to display")

    var limit = req.url.match(/\d+/) == null ? 5: parseInt(req.url.match(/\d+/).toString())
    
    if(docCount < 1) {
      getImages()
    }

    queueImages(limit)
    .then( results => {
      results.sort((a,b) => {
        let first = a.upVotes - a.downVotes
        let second = b.upVotes - b.downVotes
        return second - first
      })
      res.render("index", {array: results})
    })
  
    console.log("RENDERING COMPLETE")
})

//PUT to /cards collection
//You will need to find a way to send the number up and down votes that your user
// has created to mongo db to be stored.

app.put('/cards', (req, res) => {
  console.log("UPDATING VOTES")
    db.collection('cards')
      .findOneAndUpdate({
        url: req.body.url
      }, 
      {
        $set: {
          upVotes: req.body.upVotes, 
          downVotes: req.body.downVotes
        }
      }, {
        sort: {
          _id: 1
        },
        upsert: false 
      }, (err, result) => {
          console.log("ERROR", err, "RESULT" ,result)
          return {err, result}
      })
  })

  //Get Image Function:
  //This function is responsible for retrieving data from an external api. This supplies
  //our app with image urls. What tools do you have at your disposal to turn these urls
  //into cards that  can be saved and later retrieved by users? 

  function getImages() {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=${process.env.LIMIT}`)
    .then(res => res.json())
    .then(response => {
      let urls = response.map(obj => {
          return obj.url
      })
      console.log("SAVING IMAGES")
      saveNewCards(urls)
    })
  }

  //Queue Images function: 
  //This function is responsible for retrieving a set number of documents 
  //from mongodb. In our example, a call is made to the mongo db for the documents, 
  //THEN the data in each documents is mapped to match the structure of a card that would
  //be displayed in our app's ejs file. 

  async function queueImages(limitCount) {
    console.log("ADD DOCUMENTS TO QUEUE")

    let images = await db.collection("cards")
    .find({}, {"array": true})
    .sort({_id: 1}).limit(limitCount)
    .map(obj => {
        return {
          url: obj.url, 
          upVotes: obj.upVotes, 
          downVotes: obj.downVotes
      } 
      }).toArray()
    return images
  }

  //Save New Cards Function: 
  //This function is responsible for both mapping the data that has been returned from the 
  //external api and mapping that data into a card object. The function then upserts multiple 
  //cards to Mongo db to be stores for later retrieval. 

  function saveNewCards(imageArray) {
    let documents = imageArray.map( url => {
      return { url: url, upVotes: 0, downVotes: 0 }
    })
    db.collection('cards')
    .insertMany(
      documents,
      {ordered: true}
    )
    console.log(`${documents.length} NEW CARDS HAVE BEEN GENERATED`)
  }

//app.listen is responsible for rendering your app on a specific port on your local machine. 
app.listen(process.env.PORT)