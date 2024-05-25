const express = require('express')
const { protect } = require('../middleware/auth')
const { sendMessage, allMessages } = require('../controllers/message')

const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:id').get(protect, allMessages)


module.exports = router