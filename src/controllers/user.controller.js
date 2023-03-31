const db = require('../models');
const Joi = require('joi');
const User = db.user;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        return res.status(500).json(error);
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

    const createUserSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    try {
        const { error, value } = createUserSchema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        return res.json({ 
            data: user,
            status:200
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await User.update(
            { name, email, password },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.redirect('/users');
    } catch (error) {
        console.log(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.redirect('/users');
    } catch (error) {
        console.log(error);
    }
};
