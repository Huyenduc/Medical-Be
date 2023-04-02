const db = require('../models');
const Joi = require('joi');
const User = db.user;
const Role = db.role;
const bcrypt = require('bcrypt');

const userSchema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    user_name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string(),
    email: Joi.string().email(),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
    phone: Joi.string(),
    date_of_birth: Joi.date(),
    address: Joi.string(),
    status: Joi.string().valid('Active', 'Inactive'),
    roleId: Joi.string().required()
});

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Role,
                attributes: ['id', 'role_name']
            }
        });
        return res.status(200).json({
            status: 200,
            data: users,
            message: 'Get all users successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({
            where: { id },
            include: {
                model: Role,
                attributes: ['id', 'role_name']
            }

        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found!'
            });
        }

        return res.status(200).json({
            status: 200,
            data: user,
            message: 'Get one user successfully',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
};



exports.createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        const existingUserName = await User.findOne({ where: { user_name: req.body.user_name } });
        if (existingUser) {
            throw new Error('Email already exists');
        };

        if (existingUserName) {
            throw new Error('User_Name already exists');
        };
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        };
        const salt = await bcrypt.genSalt(5);
        value.password = await bcrypt.hash(value.password, salt);
        const user = await User.create(value);
        return res.json({
            data: user,
            status: 200
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};



exports.updateUser = async (req, res) => {

    try {
        const { id } = req.params;

        const { firstname, lastname, user_name, password, avatar, email, gender, phone, date_of_birth, address, status, roleId } = req.body;
        const idUser = await User.findOne({ where: { id: id } });

        if (email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail && idUser.id !== existingEmail.id) {
                throw new Error('Email already exists');
            };
        };

        if (user_name) {
            const existingUserName = await User.findOne({ where: { user_name } });
            if (existingUserName && idUser.id !== existingUserName.id) {
                throw new Error('User name already exists');
            };
        };

        const numberOfAffectedRows= await User.update(
            { firstname, lastname, user_name, password, avatar, email, gender, phone, date_of_birth, address, status, roleId },
            {
                where: { id },
                returning: true,
            }
        );

        if (numberOfAffectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        }

        return res.json({
            status: 200,
            message: 'User updated successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found!'
            });
        }
        await user.destroy();

        return res.json({
            status: 200,
            message: 'User deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};
