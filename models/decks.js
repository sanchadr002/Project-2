// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const decksSchema = new Schema(
	[{
		name: { type: String, required: true },
		cards: { type: Array, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	}],
	{ timestamps: true }
)

const Decks = model('Deck', decksSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Decks
