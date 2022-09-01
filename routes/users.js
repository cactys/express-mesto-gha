const router = require('express').Router();
const { getUsers, getUserId, createUser } = require('../controllers/users');

router.get('/userd', getUsers);
router.get('/users/:userId', getUserId);
router.post('/users', createUser);
