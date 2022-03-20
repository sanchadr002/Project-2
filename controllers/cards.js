// Import Dependencies
require('dotenv').config()
const { Router } = require('express')
const express = require('express')
const res = require('express/lib/response')
const Cards = require('../models/cards')
const apiUrl = process.env.scryfallApiUrl
const fetch = require('node-fetch')
const forEach = require('for-each')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', async (req, res) => {
	fetch(`${apiUrl}q=f%3Astandard`)
	.then(cardObjectsList=>{
		return cardObjectsList.json()
	})
	.then(cardObjectsList => {
		// for (let i = 0; i < 100; i++){
		// 	Cards.create({
		// 		scryfallApiId: cardObjectsList.data[i].id,
		// 		name: cardObjectsList.data[i].name,
		// 		mv: cardObjectsList.data[i].cmc,
		// 		colorIdentity: cardObjectsList.data[i].color_identity.join(''),
		// 		cardType: cardObjectsList.data[i].type_line,
		// 		// owner: User
		// 		imageUrl: cardObjectsList.data[i].image_uris.small,
		// 	})
		// 	console.log('card is being created')
		// }
		// forEach(cardObjectsList.data, Cards.create({
		// 		scryfallApiId: cardObjectsList.data.id.toString(),
		// 		name: cardObjectsList.data.name,
		// 		mv: cardObjectsList.data.cmc,
		// 		colorIdentity: cardObjectsList.data.color_identity.join(''),
		// 		cardType: cardObjectsList.data.type_line,
		// 		// owner: User
		// 		imageUrl: cardObjectsList.data.image_uris.small,
		// 	})
		// )
		// Cards.create({
		// 	scryfallApiId: cardObjectsList.data.id,
		// 	name: cardObjectsList.data.name,
		// 	mv: cardObjectsList.data.cmc,
		// 	colorIdentity: cardObjectsList.data.color_identity.join(''),
		// 	cardType: cardObjectsList.data.type_line,
		// // 		// owner: User
		// 	imageUrl: cardObjectsList.data.image_uris.small,
		// })
		forEach(cardObjectsList.data,
			Cards.create({
				scryfallApiId: cardObjectsList.data.id,
				name: cardObjectsList.data.name,
				imageUrl: cardObjectsList.data.image_uris.small,
				mv: cardObjectsList.data.cmc,
				colorIdentity: cardObjectsList.data.color_identity,
				cardType: cardObjectsList.data.type_line,
				// owner: User
				
				
			})
		)

		console.log(cardObjectsList.data[0].name)
		res.render('cards/search')
	})
	// Cards.find({})
	// 	.then(decks => {
	// 		const username = req.session.username
	// 		const loggedIn = req.session.loggedIn
	// 		res.render('cards/index', { decks, username, loggedIn })
	// 	})
	// 	.catch(error => {
	// 		res.redirect(`/error?error=${error}`)
	// 	})
})


router.get('/search', (req, res) => {
	// if (req.body.instant === 'on'){
	// 	console.log('instant is checked')
	// }
	res.render('cards/search')

})

router.put('/results', (req, res) => {
	if (req.body.instant === 'on'){
		console.log('instant is checked')
	}
	res.redirect('/cards/results')
}
)

router.get('/results', (req, res) => {
	res.render('cards/results')
})

// // create -> POST route that actually calls the db and makes a new document
// router.post('/', (req, res) => {
// 	// req.body.ready = req.body.ready === 'on' ? true : false
// 	req.body.owner = req.session.userId
// 	// reference to decks
// 	Decks.create(req.body)
// 		// reference to decks
// 		.then(decks => {
// 			console.log('this was returned from create', decks)
// 			res.redirect('/decks')
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// // edit route -> GET that takes us to the edit form view
// router.get('/:id/edit', (req, res) => {
// 	// we need to get the id
// 	const deckId = req.params.id
// 	// reference to decks
// 	Decks.findById(deckId)
// 		// reference to decks
// 		.then(decks => {
// 			// reference to decks
// 			res.render('decks/edit', { decks })
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// // update route
// router.put('/:id', (req, res) => {
// 	const deckId = req.params.id
// 	// req.body.ready = req.body.ready === 'on' ? true : false
// 	// reference to decks
// 	Decks.findByIdAndUpdate(deckId, req.body, { new: true })
// 		// reference to decks
// 		.then(decks => {
// 			// reference to decks
// 			res.redirect(`/decks/${decks.id}`)
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// // show route
// router.get('/:id', (req, res) => {
// 	const deckId = req.params.id
// 	// reference to decks
// 	Decks.findById(deckId)
// 		// reference to decks
// 		.then(decks => {
//             const {username, loggedIn, userId} = req.session
// 			// reference to decks
// 			res.render('decks/show', { decks, username, loggedIn, userId })
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// delete route
// router.delete('/:id', (req, res) => {
// 	const deckId = req.params.id
// 	Decks.findByIdAndRemove(deckId)
// 		.then(decks => {
// 			res.redirect('/decks')
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// Export the Router
module.exports = router
