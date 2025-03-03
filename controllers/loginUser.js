const jwt = require('jsonwebtoken')
const user = require('../models/User.js')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {

    try {
        const {email , password} = req.body;

        const isemailmatch = await user.findOne({email});
        console.log(isemailmatch)

        if (!isemailmatch) {
            return res.status(404).json({message: 'User not found'});
        }

        const isValidPassword = await bcrypt.compare(password, isemailmatch.password);
        console.log("isValidPassword",isValidPassword)

        if (!isValidPassword) {
            return res.status(401).json({message: 'Invalid password'});
        }

        const token = jwt.sign(
            { id: isemailmatch._id, email: isemailmatch.email }, // Use the actual user data
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

            res.json({ message: "Login successful!", token });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }



}

