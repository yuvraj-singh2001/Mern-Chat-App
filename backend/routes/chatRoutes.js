const express = require('express')
const { protect } = require('../middleware/auth')
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, groupRemove } = require('../controllers/chats')

const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)

router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupRemove').put(protect, groupRemove)
router.route('/groupAdd').put(protect, addToGroup)

module.exports = router