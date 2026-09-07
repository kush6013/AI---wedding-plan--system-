// User Routes - defines API endpoints for user operations
const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById } = require('../controllers/userController');

// POST /api/users - Create new user
router.post('/', createUser);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', getUserById);

module.exports = router;
