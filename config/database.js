import dotenv from 'dotenv'
dotenv.config()

export default {
    'url' : `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.2knf4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, 
    'dbName' : process.env.DB_NAME
}; 
