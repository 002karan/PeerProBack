const express = require("express");
const {register} = require("../controllers/authController.js");
const {login} = require("../controllers/loginUser.js");
const {createGroup} = require("../controllers/createGroup.js")
const {getGroups} = require("../controllers/createGroup.js")
const {getUserByToken} = require("../controllers/userProfile.js")
const { connectUserToGroup } = require('../controllers/groupUserController');
const { getConnectedUsers } = require('../controllers/groupController');
const { verifyToken } = require('../middleware/authMiddleware.js');
const { executeCodeController } = require('../controllers/codeExecution.js');

const router = express.Router();

router.post('/register', register)
router.post('/login',login)
router.post('/createGroup',createGroup)
router.get('/getGroupData',getGroups)
router.get('/profile',getUserByToken)
router.post('/group/connect', verifyToken, connectUserToGroup);
router.get('/group/:groupId/users', verifyToken, getConnectedUsers);
router.post("/coderunner", executeCodeController);

module.exports = router;


