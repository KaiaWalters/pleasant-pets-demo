import mongoose from 'mongoose'
import database from '../../config/database.js'

let url = database.url
mongoose.connect(url) 

//Mongo.js
//Not sure if this file is still useful

const catCardSchema = new mongoose.Schema({
  id: String,
  upVotes: String,
  downVotes: String,
})

const Card = mongoose.model('Card', catCardSchema)

const card = new Card ({
  id: "EJODJKO2FOFJ",
  upVotes: "4",
  downVotes: "4",
})

const saveCard = () => {
  card.save().then(result => {
    console.log('note saved!')-
    mongoose.connection.close()
  })
}

console.log(url)
saveCard()