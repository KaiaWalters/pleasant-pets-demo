
import mongoose from 'mongoose'

const catCardSchema = new mongoose.Schema({
  id: Number,
  upVotes: String,
  downVotes: String,
});

const Card = mongoose.model('Card', catCardSchema)

export default Card