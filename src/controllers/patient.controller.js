const db = require('../models');
const Patient = db.patient;
const Joi = require('joi');
const User = db.user;
const Role = db.role;
const BloodGroup = db.bloodGroup;


const patientSchemaCreate = Joi.object({
    weight: Joi.string().required(),
    health_insurance_number: Joi.string().required(),
    height: Joi.string(),
    user_id: Joi.string().required(),
    id_blood_groups: Joi.string().required(),
});

const patientSchemaupdate = Joi.object({
    weight: Joi.string(),
    health_insurance_number: Joi.string(),
    height: Joi.string(),
    user_id: Joi.string(),
    id_blood_groups: Joi.string(),
});


exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll(
            {
                attributes: { exclude: ['user_id', 'id_blood_groups'] },
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
                        model: BloodGroup,
                        attributes: ['blood_name']
                    },
                ]
            }
        );
        return res.status(200).json({
            status: 200,
            data: patients,
            message: 'Get all patients successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.createPatient = async (req, res) => {

    try {

        const { error, value } = patientSchemaCreate.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        };

        const existinghealth_insurance_number = await Patient.findOne({ where: { health_insurance_number: req.body.health_insurance_number } });
        if (existinghealth_insurance_number) {
            throw new Error('Health insurance number already exists');
        };

        const patient = await Patient.create(value);
        return res.json({
            data: patient,
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

exports.updatePatient = async (req, res) => {

    try {
        const { error, value } = patientSchemaupdate.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        };
        const { id } = req.params;
        const idPatient = await Patient.findOne({ where: { id: id } });
        if (!idPatient) {
            return res.status(404).json({
                status: 404,
                message: 'Patient not found',
            });
        }

        if (req.body.license_number) {
            const existingLicense_number = await Patient.findOne({ where: { license_number: req.body.license_number } });
            if (existingLicense_number && idPatient.id !== existingEmail.id) {
                throw new Error('Health insurance number already exists');
            };
        };

        await Patient.update(

            value,
            {
                where: { id },
                returning: true,
            }
        );

        return res.json({
            status: 200,
            message: 'Patient updated successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findOne({ where: { id } });
        if (!patient) {
            return res.status(404).json({
                status: 404,
                message: 'Patient not found!'
            });
        }
        await patient.destroy();

        return res.json({
            status: 200,
            message: 'Patient deleted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};