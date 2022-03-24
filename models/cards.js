// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// figure out way to insert references into card schema
// program should pull necessary information from the API and fill out the appropriate fields
const cardSchema = new Schema(
	{
		scryfallApiId: { type: String },
		name: { type: String },
		imageURL: { type: Object },
		mv: { type: String },
        colorIdentity: { type: String },
        cardType: { type: String },
		// topCard: { type: Boolean },
		// owner: {
		// 	type: Schema.Types.ObjectID,
		// 	ref: 'User',
		// },
        
	},
	{ timestamps: true }
)

const Cards = model('Cards', cardSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Cards