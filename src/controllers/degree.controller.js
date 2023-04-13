const db = require('../models');
const Degree = db.degree;
const Joi = require('joi');

const degreeSchema = Joi.object({
    name: Joi.string().required(),
    abbreviation: Joi.string().required(),
});

exports.getAllDegrees = async (req, res) => {
    try {
        const degrees = await Degree.findAll();
        return res.status(200).json({
            status: 200,
            data: degrees,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.getOneDegree = async (req, res) => {
    const { id } = req.params;
    try {
        const degree = await Degree.findOne({ where: { id } });
        return res.status(200).json({
            data: degree,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}

exports.createDegree = async (req, res) => {
    const { name } = req.body
    try {
        const existingDegree = await Degree.findOne({ where: { name } });
        if (existingDegree) {
            throw new Error('Degree name already exists');
        };

        const { error, value } = degreeSchema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        };

        const degree = await Degree.create(value);
        return res.json({
            data: degree,
            status: 200,
            message: "Degree create successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,

        });
    }
};

exports.updateDegree = async (req, res) => {
    const { id } = req.params;
    const { name, abbreviation } = req.body;

    try {
        if (!name || !abbreviation) {
            throw new Error("Invalid name or abbreviation");
        }
        const idDegree = await Degree.findOne({ where: { id } });
        if (!idDegree) {
            throw new Error("User not found");
        };
        if (name) {
            const existingName = await Degree.findOne({ where: { name } });
            if (existingName && idDegree.id !== existingName.id) {
                throw new Error('Degree name already exists');
            }
        };

        const degree = await Degree.update(
            { name, abbreviation },
            {
                where: { id },
                returning: true
            }
        );
        return res.json({
            data: degree[1][0].dataValues,
            status: 200,
            message: 'Degree updated successfully',
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deleteDegree = async (req, res) => {
    try {
        const { id } = req.params;
        const degree = await Degree.findOne({ where: { id } });
        if (!degree) {
            return res.status(404).json({
                status: 404,
                message: 'Degree not found!'
            });
        }
        await degree.destroy();
        return res.json({
            id: id,
            status: 200,
            message: 'Degree deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};