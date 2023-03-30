const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Kiểm tra kết nối cơ sở dữ liệu
sequelize
  .authenticate()
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.log(`Unable to connect to the database: ${error}`));

// Đọc tất cả các file model trong thư mục models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Gọi phương thức associate nếu có trong các model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export các đối tượng sequelize và Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export các đối tượng mô hình
db.User = require('./rest/user')(sequelize, Sequelize.DataTypes);

module.exports = db;
