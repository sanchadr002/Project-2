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
		name: { type: String, required: true },
		mv: { type: Number, required: true },
        colorIdentity: { type: String, required: true },
        cardType: { type: String, required: true },
		topCard: { type: Boolean },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
        imageURL: { type: String, required: true },
        scryfallApiId: { type: String, required: true }
	},
	{ timestamps: true }
)

const Card = model('Card', cardSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Card