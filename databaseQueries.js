import pg from "pg";



export default class databaseQueries {
  //#region Getters
  async getAllUsers() {
    //Connect to database
    db.connect();

    var users;

    //query database
    db.query("SELECT * FROM public.users", (err, res) => {
      if (err) {
        console.error("Error executing query", err.stack);
      } else {
        users = res.rows;
        return users;
      }
    });

    db.end();

  }

  async getPasswordByUsername(username){

    //Create client
    const db = new pg.Client({
      user: "postgres",
      host: "localhost",
      database: "Portfolio Website",
      password: "4Vuo6OivRw",
      port: 5432,
    });

    //Connect to database
    await db.connect();

    //promise for await
    return new Promise((resolve, reject) => {
        //query database
        db.query("SELECT password FROM users WHERE username='" + username + "'" + ";", (err, res) => {
            if (err) {
              console.error("Error executing query", err.stack);
            } else {
                db.end();
                console.log(res.rows);
                if (res.rows.length > 0){
                    resolve(res.rows[0].password);
                }
                else{
                    resolve(false);
                }
            }
          }
        );
    });
    
  }

  //#endregion

  //#region Setters
  async addNewUser(username, password){
    //Create client
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "Portfolio Website",
        password: "4Vuo6OivRw",
        port: 5432,
      });
  
      //Connect to database
      await db.connect();

      const checkForExistingUsername = await this.getPasswordByUsername(username);

      return new Promise((resolve, reject) => {
        //Check username already exists
        if (checkForExistingUsername != false){
            resolve(false);
        }
        else{
            console.log("INSERT INTO users (username, password) VALUES ('" + username + "', '" + password + "');");
            //Add new user to database
            db.query("INSERT INTO users (username, password) VALUES ('" + username + "', '" + password + "');", (err, res) => {
                if (err) {
                  console.error("Error executing query", err.stack);
                  db.end()
                  //reject;
                } else {
                    db.end();
                    resolve(true);
                }
              });
        }

    });

      
  }


  //#endregion

}

//module.exports.databaseQueries = databaseQueries;
