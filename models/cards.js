// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const cardSchema = new Schema(
	{
		scryfallApiId: { type: String },
		name: { type: String },
		imageURL: { type: Object },
		mv: { type: String },
        colorIdentity: { type: String },
        cardType: { type: String },

		// topCard for later use
		// topCard: { type: Boolean },
		
        
	},
	{ timestamps: true }
)

const Cards = model('Cards', cardSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Cards