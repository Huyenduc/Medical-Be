const db = require('../models');
const BloodGroup = db.bloodGroup;
const Joi = require('joi');

const BloodGroupSchema = Joi.object({
    blood_name: Joi.string(),
});

exports.getAllBloodGroups = async (req, res) => {
    try {
        const bloodGroup = await BloodGroup.findAll();
        return res.status(200).json({
            status: 200,
            data: bloodGroup,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.createBloodGroup = async (req, res) => {
    const { blood_name } = req.body
    try {
        const existingBloodGroup = await BloodGroup.findOne({ where: { blood_name } });
        if (existingBloodGroup) {
            throw new Error('BloodGroup name already exists');
        };

        const { error, value } = BloodGroupSchema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        };

        const degree = await BloodGroup.create(value);
        return res.json({
            data: degree,
            status: 200
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.updateBloodGroup = async (req, res) => {
    const { id } = req.params;
    const { blood_name } = req.body;

    try {
        if (!blood_name) {
            throw new Error("Invalid blood_name or abbreviation");
        }
        const idBloodGroup = await BloodGroup.findOne({ where: { id } });
        if (!idBloodGroup) {
            throw new Error("BloodGroup not found");
        };
        if (blood_name) {
            const existingName = await BloodGroup.findOne({ where: { blood_name } });
            if (existingName && idBloodGroup.id !== existingName.id) {
                throw new Error('BloodGroup name already exists');
            }
        };

        await BloodGroup.update(
            { blood_name },
            {
                where: { id },
                returning: true
            }
        );
        return res.json({
            status: 200,
            message: 'BloodGroup updated successfully',
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deleteBloodGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const degree = await BloodGroup.findOne({ where: { id } });
        if (!degree) {
            return res.status(404).json({
                status: 404,
                message: 'BloodGroup not found!'
            });
        }
        await degree.destroy();
        return res.json({
            status: 200,
            message: 'BloodGroup deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};