import Sequelize from "sequelize";
import sequelize from "../config/database.js";
import DataTypes from "sequelize";

const Session = sequelize.define('Session', {
    sid:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: true,           
    },
    expires:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    data:{
        type: DataTypes.TEXT,
        allowNull: true
    }
},
{
    tableName: 'sessions',
    timestamps: false,
}
);

export default Session;