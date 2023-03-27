const user = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.INTEGRE,
                primaryKey: true,
                autoIcrement: true
            },
            userName: {
                type: DataTypes.STRING,
                unique: true
            },
            passWord: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: true,
            freezeTableName: true
        }
    );

    User.sync();
    return User;
}

console.log("dddd")
console.log(user === sequelize.models.User);

export default user;