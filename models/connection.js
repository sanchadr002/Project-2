// make our .env variables available via process.env
require('dotenv').config()
// import mongoose
const mongoose = require('mongoose')

// connect to the database
// local database connection --> process.env.DATABASE_URL
// remote database connection --> process.env.MONGODB_URI
mongoose.connect(process.env.DATABASE_URL, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
})

// save the connection in a variable
const db = mongoose.connection

// create some notification
// mongoose.connection.host mongoose.connection.port
db.on('open', () => console.log('You are connected to mongo'))
db.on('close', () => console.log('You are disconnected from mongo'))
db.on('error', (error) => console.log(error))

// export the connection
module.exports = mongoose
