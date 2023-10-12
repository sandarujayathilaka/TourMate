const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd, matchPwd, email } = req.body;
    console.log("1");
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    console.log("2");
    try {
        console.log("3");
        // Check for duplicate usernames in the db
        const duplicate = await User.findOne({ username: user });
        console.log("4");
        if (duplicate) {
            return res.status(409).json({ 'message': 'Username already exists.' });
        }

        const emailDuplicate = await User.findOne({ email: email });
        console.log("4");
        if (emailDuplicate) {
            return res.status(406).json({ 'message': 'Email already exists.' });
        }
        if (pwd === matchPwd) {
            const hashedPwd = await bcrypt.hash(pwd, 10);

            // Create and store the new user
            const result = await User.create({
                username: user,
                password: hashedPwd,
                email: email,
                roles: {User:2001},
                image:null
            });

            res.status(201).json({ 'success': `New user ${user} created!` });
        } else {
            return res.status(401).json({ 'message': 'Passwords do not match.' });
        }
    } catch (err) {
        // Handle other errors, e.g., database connection issues
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleNewUser };
