// Import Dependencies
require('dotenv').config()
const { Router } = require('express')
const express = require('express')
const res = require('express/lib/response')
const Cards = require('../models/cards')
const apiUrl = process.env.scryfallApiUrl
const fetch = require('node-fetch')

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
router.get('/', (req, res) => {
	
		// console.log(results)
		res.redirect('/cards/search')
})


router.get('/search', (req, res) => {
	// if (req.body.instant === 'on'){
	// 	console.log('instant is checked')
	// }
	// console.log(req.body.instant = req.body.instant === 'on' ? true : false)
	res.render('cards/search')

})

router.put('/results', (req, res) => {
	console.log(req.body)
	const searchParamaters = []
	if (req.body.instant === 'on'){
		searchParamaters.push('t%3Ainstant')
	}
	if (req.body.sorcery === 'on'){
		searchParamaters.push('t%3Asorcery')
	}
	console.log(searchParamaters)
	const searchString = searchParamaters.join('%20or%20')
	console.log(searchString)
	fetch(`${apiUrl}f%3Astandard+%28${searchString}%29`)
	.then(cardObjectsList=>{
		return cardObjectsList.json()
	})
	.then(async cardObjectsList => {
		const results = []
		await cardObjectsList.data.forEach( (card) => {
			
			console.log(card.name)
			// console.log(card.image_uris)
			// console.log(card.cmc)
			// console.log(card.color_identity)
			// console.log(card.type_line)
			// Cards.create({
			// 	scryfallApiId: cardObjectsList.data.id,
			// 	name: cardObjectsList.data.name,
			// 	// imageUrl: cardObjectsList.data.image_uris.small,
			// 	mv: cardObjectsList.data.cmc,
			// 	colorIdentity: cardObjectsList.data.color_identity,
			// 	cardType: cardObjectsList.data.type_line,
			// 	// owner: User
			// results.push(card.name)	
			
			// })
		})
		res.redirect('/cards/results')
	})
})

router.get('/results', (req, res) => {
	res.render('cards/results')
})

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


// ----------CODE GRAVEYARD-------------
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