const db = require('../models');
const Workplace = db.workplace;
const Joi = require('joi');

const workplaceSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string(),
    email: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    type: Joi.string(),
});

exports.getAllWorkplace = async (req, res) => {
    try {
        const workplaces = await Workplace.findAll();
        return res.status(200).json({
            data: workplaces,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.getOneWorkplace = async (req, res) => {
    const { id } = req.params;
    try {
        const workplace = await Workplace.findOne({ where: { id } });
        return res.status(200).json({
            data: workplace,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}

exports.createWorkplace = async (req, res) => {
    const { name } = req.body
    try {
        const existingWorkplace = await Workplace.findOne({ where: { name } });
        if (existingWorkplace) {
            throw new Error('Workplace name already exists');
        };
        const { error, value } = workplaceSchema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        };

        const workplace = await Workplace.create(value);
        return res.json({
            data: workplace,
            status: 200,
            message: 'Workplace create  successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.updateWorkplace = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address, city, type } = req.body;

    try {
        // if (!name || !abbreviation) {
        //     throw new Error("Invalid name or abbreviation");
        // }
        const idWorkplace = await Workplace.findOne({ where: { id } });
        if (!idWorkplace) {
            throw new Error("User not found");
        };
        if (name) {
            const existingName = await Workplace.findOne({ where: { name } });
            if (existingName && idWorkplace.id !== existingName.id) {
                throw new Error('Workplace name already exists');
            }
        };

        const data = await Workplace.update(
            { name, phone, email, address, city, type },
            {
                where: { id },
                returning: true
            }
        );

        // console.log(data[1])

        return res.json({
            data: data[1][0].dataValues,
            status: 200,
            message: 'Workplace updated successfully',
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deleteWorkplace = async (req, res) => {
    try {
        const { id } = req.params;
        const workplace = await Workplace.findOne({ where: { id } });
        if (!workplace) {
            return res.status(404).json({
                status: 404,
                message: 'Degree not found!'
            });
        }
        await workplace.destroy();
        return res.json({
            id: id,
            status: 200,
            message: 'Workplace deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};