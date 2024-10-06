import Sequelize from "sequelize";
import sequelize from "../config/database.js";
import DataTypes from "sequelize";

const User = sequelize.define('users', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true            
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    }

},
{
    timestamps: true
});

export default User;

