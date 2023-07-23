const express = require('express')
const multer = require('multer')
const {getUsers, Register, findUsersId, login, logout} = require('../controllers/users')
const verifyToken = require('../middleware/VerifyToken')
const refreshToken = require('../controllers/refreshToken')
const { addProduct, getProduct, updateProduct, deleteProduct, upload, getProductById } = require('../controllers/product')

const router = express.Router()

// router.get('/users', getUsers)
router.post('/user', Register)
router.get('/getAllUsers',verifyToken, getUsers)
router.get('/getUsersId',verifyToken, findUsersId)
router.post('/login', login)
router.delete('/logout',verifyToken, logout)
router.get('/token', refreshToken)
router.post('/product',  verifyToken, upload , addProduct)
router.get('/product',verifyToken, getProduct)
router.put('/product',verifyToken,upload, updateProduct)
router.delete('/product',verifyToken, deleteProduct)
router.get('/productId',verifyToken, getProductById)

module.exports = router