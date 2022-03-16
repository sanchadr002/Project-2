// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const deckSchema = new Schema(
	{
		name: { type: String, required: true },
		// cards: { array of cards references using card schema },
        // numCards: { code that counts num of references in cards },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Deck = model('Deck', deckSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Deck
