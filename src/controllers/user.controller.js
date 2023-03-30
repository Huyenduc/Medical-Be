const db = require('../models');

const User = require('../models/rest/user');

console.log("3434",User)

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('user/index', { users });
  } catch (error) {
    console.log(error);
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
  console.log("DDDĐ",req.body)
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    console.log(user)
    res.redirect('/user');
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
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
