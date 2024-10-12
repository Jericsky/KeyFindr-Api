const Auth = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        //check if username exists
        const exsistingUsername = await Auth.findOne({username})
        if(exsistingUsername){
            return res.status(400).send({error: 'Username already exists'})
        }

        //check if email exists
        const existingEmail = await Auth.findOne({email});
        if(existingEmail){
            return res.status(400).send({error: 'Email already exists'})
        }

        //check if email has '@'
        if(!email.includes('@')){
            return res.status(400).send({error: 'Invalid Email format'})
        }

        const hashedPassword = await bcrypt.hashSync(password, 10)

        let newUser = new Auth({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.send({message: 'Registered successdully', newUser})
    } catch (error) {
        console.log('Error register user: ', error);
        return res.status(500).send({error: 'Internal server error: Failed to register user'})
    }
}

module.exports.loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        //check if user exists
        const user = await Auth.findOne({email});
        if(!user){
            return res.status(401).send({error: 'Invalid Credentials!'})
        }

        //compare password
        const isPasswrodMatch = await bcrypt.compareSync(password, user.password)
        if(!isPasswrodMatch){
            return res.status(401).send({error: 'Email or Password is incorrect'})
        }

        
        //generate cookie token
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: age}
        )

        res.cookie('token', token, {
            httpOnly: true,
            // success: true,
            maxAge: age
        })
        .status(200)
        .send({message: 'Login Successful'})

        
    } catch (error) {
        console.log('Error logging in: ', error);
        return res.status(500).send({error: 'Internal server error: Failed to login'})
    }
}

module.exports.logoutUser = (req, res) => {
   
    res.clearCookie('token').status(200).send({message: 'Logout Successful'})

}