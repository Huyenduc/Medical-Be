const db = require('../models');
const Joi = require('joi');
const User = db.user;
const Role = db.role;


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

        const users = User.findAll({
            include: {
                model: Role,
                attributes: ['id']
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
            message: 'Could not get all users',
        });
    }
};

exports.getUserById = async (req, res) => {
    try {

        const user = await User.findByPk(req.params.id);
        res.render('user/edit', { user });
    } catch (error) {
        console.log(error);
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

        if (req.body.email) {
            const existingEmail = await User.findOne({ where: { email: req.body.email } });
            if (existingEmail && idUser.id !== existingEmail.id) {
                throw new Error('Email already exists');
            };
        };

        if (req.body.user_name) {
            const existingUserName = await User.findOne({ where: { user_name: req.body.user_name } });
            if (existingUserName && idUser.id !== existingUserName.id) {
                throw new Error('User name already exists');
            };
        };

        const [numberOfAffectedRows, [updatedUser]] = await User.update(
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
            data: updatedUser,
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

        const user = await Role.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Role not found!'
            });
        }
        await user.destroy();

        return res.json({
            status: 200,
            message: 'Role deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};
