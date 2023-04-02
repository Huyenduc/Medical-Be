const db = require('../models');
const Doctor = db.doctor;
const Joi = require('joi');
const User = db.user;
const Role = db.role;
const Workplace = db.workplace;
const Degree = db.degree;

const doctorSchemaCreate = Joi.object({
    specialty: Joi.string().required(),
    license_number: Joi.string().required(),
    about: Joi.string(),
    exp: Joi.number().required(),
    rating: Joi.number(),
    user_id: Joi.string().required(),
    id_workplace: Joi.string().required(),
    id_degree: Joi.string().required(),
});

const doctorSchemaupdate = Joi.object({
    specialty: Joi.string(),
    license_number: Joi.string(),
    about: Joi.string(),
    exp: Joi.number(),
    rating: Joi.number(),
    user_id: Joi.string(),
    id_workplace: Joi.string(),
    id_degree: Joi.string(),
});


exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll(
            {
                attributes: { exclude: ['user_id', 'id_workplace', 'id_degree', 'roleId'] },
                include: [

                    {
                        model: User,
                        include: {
                            model: Role,
                            attributes: ['role_name']
                        },
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'roleId'] },
                    },
                    {
                        model: Workplace,
                        attributes: ['name', 'type']
                    },
                    {
                        model: Degree,
                        attributes: ['name', 'abbreviation']
                    }
                ]
            }
        );
        return res.status(200).json({
            status: 200,
            data: doctors,
            message: 'Get all doctors successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.createDoctor = async (req, res) => {

    try {

        const { error, value } = doctorSchemaCreate.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        };

        const existinglicenseNumber = await Doctor.findOne({ where: { license_number: req.body.license_number } });
        if (existinglicenseNumber) {
            throw new Error('License number already exists');
        };

        const doctor = await Doctor.create(value);
        return res.json({
            data: doctor,
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

exports.updateDoctor = async (req, res) => {

    try {
        const { error, value } = doctorSchemaupdate.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        };
        const { id } = req.params;
        const idDoctor = await Doctor.findOne({ where: { id: id } });
        if (!idDoctor) {
            return res.status(404).json({
                status: 404,
                message: 'Doctor not found',
            });
        }

        if (req.body.license_number) {
            const existingLicense_number = await Doctor.findOne({ where: { license_number: req.body.license_number } });
            if (existingLicense_number && idDoctor.id !== existingEmail.id) {
                throw new Error('Email already exists');
            };
        };
        
        await Doctor.update(

            value,
            {
                where: { id },
                returning: true,
            }
        );

        return res.json({
            status: 200,
            message: 'Doctor updated successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findOne({ where: { id } });
        if (!doctor) {
            return res.status(404).json({
                status: 404,
                message: 'Doctor not found!'
            });
        }
        await doctor.destroy();

        return res.json({
            status: 200,
            message: 'Doctor deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};