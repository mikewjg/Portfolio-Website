import Sequelize from "sequelize";

//setup sequelize instance for DB connection
const sequelize = new Sequelize("Portfolio Website", "postgres", "4Vuo6OivRw", {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

//Test db connection
sequelize.authenticate()
    .then(() => {
        console.log("connected to db");
    })
    .catch(error => {
        console.log("unable to connect to db:",error);
    });

export default sequelize;