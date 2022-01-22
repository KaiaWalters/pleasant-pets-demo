import mongoose from 'mongoose'


// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
// `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.2knf4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.2knf4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url) 

// console.log("connection", conn)

const catCardSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Card = mongoose.model('Card', catCardSchema)

const card = new Card ({
  imageId: "url",
  upVotes: int,
  downVotes: int,
})

async function saveCard() {
    card.save().then(result => {
    
        console.log('note saved!')-
        mongoose.connection.close()
      })
}

saveCard()