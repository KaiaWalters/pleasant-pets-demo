import fetch from 'node-fetch'
globalThis.fetch = fetch
import dotenv from 'dotenv'
import database from './config/database.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { ObjectId } from 'mongodb'

var url = database.url
var db 

app.use(bodyParser.json())

dotenv.config()

mongoose.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
}); 

app.put('/cards', (req, res) => {
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
          _id: -1
        },
        upsert: true 
      }, (err, result) => {
        if (err) {
          return err
        }
        if (result) {
          return result
        }
      })
  })

  async function loadApp(callBack) {
    //check if the collection contains any arrays.
    //async functions always return a promise 

    let numberOfDocuments = 0

   
    if(numberOfDocuments < 1) {
       getImages()
        .then((imageArray) => {
          console.log("Third Step")
          saveImageArrayId(imageArray)
          return new Promise((resolve, reject) => { // (*)
            resolve(imageArray)
          });
        })
        .then(()=> {
          returnRecentCatImageArray(ObjectId("61ef0c33802fc53a5f202383"))
          return new Promise((resolve, reject) => { 
            resolve(returnRecentCatImageArray)
          });
        }).then((result) => {
          callBack(result)
        })

    } else if (numberOfDocuments > 0) {
      renderCatImagesOnMainPage(null)     
    }
    //if db collection is empty, then call the fetch function 
    // else make a fetch to mongo db and get the first array of images.
    // Every time the user clicks the arrow, make a call for the next array. 
    // map the data between the array of urls and the votes
    // render the results using the get("/")
  }

  async function returnRecentCatImageArray(imageArrayId) {
    if(imageArrayId == null) { 
      console.log("there is no id") 
    } else {
      console.log("Current Image Id", imageArrayId)
      let dbResult = db.collection('images').findOne(
        {_id: imageArrayId}, (error, result) => {
          //ends here
            console.log("Current Result",result.array)
            console.log("Current Error",error)  
            return result.array
        })
    }
  }
  

  async function getImages() {
    await fetch(`https://api.thecatapi.com/v1/images/search?order=DESC&limit=20`)
    .then(res => {
      res.json()
      let imageArray = res.map(obj => {
          saveImageArrayId(obj.id)
          // return { url: obj.url, id: obj.id }
      })
    })
  }
  
  async function saveImageArrayId (imageArray) {
   await  db.collection('images').insertOne({array: imageArray}).then((result) => {
      let insertedId =  result.insertedId
      console.log(insertedId)
      return insertedId
     })
  }

  //load app contains multiple promises 
  //issue is a race condition 
  //the first request is not done by the time that the second on e is called 
app.get("/",(req, res) => {
  loadApp((imageArray) => {
    res.render("index", {array: imageArray})
    console.log("Last Step")
  })
})

