const express = require("express");
const {register} = require("../controllers/authController.js");
const {login} = require("../controllers/loginUser.js");
const {createGroup} = require("../controllers/createGroup.js")
const {joinPrivateGroup} = require("../controllers/createGroup.js")
const {getGroups} = require("../controllers/createGroup.js")
const {getUserByToken} = require("../controllers/userProfile.js")
const { connectUserToGroup } = require('../controllers/groupUserController');
const { getConnectedUsers } = require('../controllers/groupController');
const { removeUserFromGroup } = require('../controllers/groupController');
const { verifyToken } = require('../middleware/authMiddleware.js');
const { executeCodeController } = require('../controllers/codeExecution.js');
const { review } = require('../controllers/Review.js');
const { getReviews } = require('../controllers/Review.js');
const ChatGpt = require("../controllers/chatGpt.js")

const router = express.Router();

router.post('/register', register)
router.post('/login',login)
router.post('/createGroup',createGroup)
router.post('/joinPrivateGroup',joinPrivateGroup)
router.get('/getGroupData',getGroups)
router.get('/profile',getUserByToken)
router.post('/group/connect', verifyToken, connectUserToGroup);
router.get('/group/:groupId/users', verifyToken, getConnectedUsers);
router.post('/removeUser',  removeUserFromGroup);
router.post("/coderunner", executeCodeController);
router.post("/openAI", ChatGpt);
router.post("/review", review);
router.get("/getReviews", getReviews);

module.exports = router;


