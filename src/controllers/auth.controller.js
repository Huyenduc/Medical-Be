const db = require('../models');
const path = require('path');
const User = db.user;
const bcrypt = require('bcrypt');
const Role = db.role;
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
    const { user_name, password } = req.body;
    try {
        if (!user_name || !password) {
            return res.status(400).json({ message: 'User name and password are required.' });
        }

        const user = await User.findOne({
            where: { user_name },
            include: {
                model: Role,
                attributes: ['id', 'role_name']
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1y' });

        // Return token and user information
        res.json({
            message: "Login Successful!",
            status: 200,
            data: {
                id: user.id,
                user_name: user.user_name,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role.role_name,
                status: user.status
            },
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.getAvatar = async (req, res) => {
    try {
        const { imageName } = req.params;
        const filePath = path.join(__dirname, '../uploads', imageName);
        res.sendFile(filePath);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}

exports.uploadAvatar = async (req, res) => {
    try {

    } catch (error) {
        
    }
}


