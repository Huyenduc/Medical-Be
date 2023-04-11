const db = require('../models');
const Role = db.role;

exports.getAllRoles = async (req, res) => {
    try {
        const limit = 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const roles = await Role.findAll({ limit, offset });

        const count = await Role.count();
        const totalPages = Math.ceil(count / limit);

        return res.json({
            status: 200,
            data: roles,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

exports.getOneRole = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.findOne({ where: { id } });
        return res.status(200).json({
            data: role,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}


exports.createRole = async (req, res) => {
    console.log(req.body)
    if (!req.body || !req.body.role_name) {
        return res.status(400).json({
            status: 400,
            message: 'role name parameter is required',
        });
    }
    try {
        const { role_name } = req.body;

        const existingRole = await Role.findOne({ where: { role_name } });
        if (existingRole) {
            return res.status(409).json({
                status: 409,
                message: 'Role name already exists'
            });
        }

        const role = await Role.create({ role_name });
        return res.json({
            data: {
                role_name: role.role_name,
                id: role.id
            },
            status: 200,
            message: 'Role create  successfully',
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            message: error
        });
    }
};

exports.deleteRoleById = async (req, res) => {
    console.log(req.params)
    try {
        const { id } = req.params;

        const role = await Role.findOne({ where: { id } });
        if (!role) {
            return res.status(404).json({
                status: 404,
                message: 'Role not found!'
            });
        }
        await role.destroy();

        return res.json({
            status: 200,
            id:id,
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

exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { role_name } = req.body;

    try {
        const role = await Role.findOne({ where: { id } });

        if (!role) {
            return res.status(404).json({
                status: 404,
                message: 'Role not found!',
            });
        }
        role.role_name = role_name;
        await role.save();

        return res.status(200).json({
            status: 200,
            message: 'Role updated successfully!',
            data: {
                id: role.id,
                role_name: role.role_name,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};


