const db = require('../models');
const Joi = require('joi');
const fs = require('fs')
const multer = require('multer');
const path = require('path');

const User = db.user;
const Role = db.role;
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Create multer object for handling file upload
export const upload = multer({ storage });

const userSchema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    user_name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    // avatar: Joi.string(),
    email: Joi.string().email(),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
    phone: Joi.string(),
    date_of_birth: Joi.date(),
    address: Joi.string(),
    status: Joi.boolean(),
    roleId: Joi.string().required()
});

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
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
    // const { roleId } = req.roleId;
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            req.file && fs.unlinkSync(req.file.path);
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        };
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        const existingUserName = await User.findOne({ where: { user_name: req.body.user_name } });
        if (existingUser) {
            throw new Error('Email already exists');
        };

        if (existingUserName) {
            throw new Error('User_Name already exists');
        };
        const avatar_path = req.file ? req.file.filename : null;

        const salt = await bcrypt.genSalt(5);
        value.password = await bcrypt.hash(value.password, salt);
        const user = await User.create({ ...value, avatar_path });
        const role = await Role.findOne({ where: { id: user.roleId } });
        // console.log(role)
        return res.json({
            data: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.firstname,
                user_name: user.user_name,
                email: user.email,
                phone: user.phone,
                date_of_birth: user.date_of_birth,
                address: user.address,
                status: user.status,
                roleId: user.roleId,
                avatar_path: user.avatar_path,
                gender: user.gender,
                role: role,
            },
            status: 200,
            message: 'Create user successfully',
        });
    }
    catch (error) {
        console.log(error);
        req.file && fs.unlinkSync(req.file.path);
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
        if (!idUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        };
        if (password) {
            throw new Error('password not update');
        }

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
        const user = await User.update(
            { firstname, lastname, user_name, password, avatar, email, gender, phone, date_of_birth, address, status, roleId },
            {
                where: { id },
                returning: true,
            }
        );

        const role = await Role.findOne({ where: { id: user[1][0].dataValues.roleId } });

        return res.json({
            status: 200,
            data: {
                id: user[1][0].dataValues.id,
                firstname: user[1][0].dataValues.firstname,
                lastname: user[1][0].dataValues.lastname,
                user_name: user[1][0].dataValues.user_name,
                email: user[1][0].dataValues.email,
                phone: user[1][0].dataValues.phone,
                date_of_birth: user[1][0].dataValues.date_of_birth,
                address: user[1][0].dataValues.address,
                status: user[1][0].dataValues.status,
                roleId: user[1][0].dataValues.roleId,
                avatar_path: user[1][0].dataValues.avatar_path,
                gender: user[1][0].dataValues.gender,
                role: role,
            },
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
            id: id,
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
