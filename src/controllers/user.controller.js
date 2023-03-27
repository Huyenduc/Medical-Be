const db = require('../models');

const User = db.sequelize.models.user;
console.log(User);
// console.log(db)

exports.getUser = async (req, res) => {
    res.send({
        message: "This iss"
    });
};