// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')
const Cards = require('./cards')
// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const decksSchema = new Schema(
	[{
		name: { type: String },
		cards: { type: Array },
		// cards: [{ type: Schema.Types.ObjectID, ref: 'Card'}],
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
