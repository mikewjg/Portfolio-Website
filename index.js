
//#region Imports
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";
import databaseQueries from "./databaseQueries.js";
import axios from "axios";
import bcrypt from "bcrypt";

import sequelize from "./config/database.js";

//Database models
import User from "./models/user.js";
import Session from "./models/sessions.js";

import session from "express-session";
import connectSessionSequelize from 'connect-session-sequelize';

//#endregion

//#region Objects and Variables
const dbQueries = new databaseQueries();
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
var userAuthorised = false;
var userCreated = false;
var weatherAPIKey = "a7b9e7fd2f5c4be5a42192134242708";
var currentUsername = "";
app.locals.loggedIn = false;
app.locals.weatherByCityText = "";
app.locals.myProfileActiveTab = Object.freeze({
    MYPROFILE: 0,
    DASHBOARD: 1,
    CALENDAR: 2,
});
const SequelizeStore = connectSessionSequelize(session.Store);

//#endregion 


//#region Database

//Set up express-session with Sequelize store
app.use(session({
    secret: 'mySecretKey',        // Secret for signing session ID cookies
    store: new SequelizeStore({
      db: sequelize,              // Use the Sequelize instance
      model: Session,           // Name of the session table (optional if you use the model)
      modelKey: 'sid',            // The column for session IDs
      expiration: 24 * 60 * 60 * 1000, // Session expiration (in milliseconds)
      checkExpirationInterval: 15 * 60 * 1000, // Interval for checking expired sessions (15 minutes)
    }),
    resave: false,                // Avoid resaving sessions that haven’t changed
    saveUninitialized: false,     // Only save initialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
      httpOnly: true,              // Helps mitigate XSS attacks
      secure: false                // Set to true if using HTTPS
    }
  }));

// sync database
// sequelize.sync({force:false})
//     .then(() => {
//         console.log("Database synced successfully.");
//     })
//     .catch(error => {
//         console.error("Unable to sync database:", error);
//     });


  //#endregion

//#region custom middleware
function logger(req, res, next){
    console.log("Request method: ", req.method);
    console.log("Request URL: ", req.url);
    next();
};
//#endregion

//#region Use Middleware 
app.use(logger);
app.use(express.static(__dirname + "/public"));
app.use('/images', express.static(__dirname + "/public/images"));
app.use('/videos', express.static(__dirname + "/public/videos"));
app.use('/images/Playing Cards', express.static(__dirname + "/public/images/Playing Cards"));
app.use('/images/Special Cards', express.static(__dirname + "/public/images/Special Cards"));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(function (req, res, next){
//    res.locals.session = req.session;
//    next();
//});
//app.use(loginCheck);
//app.use(createAccount);
//#endregion

//#region Functions
async function createAccount(req, res){
    const enteredPassword = req.body["password"];
    const enteredUsername = req.body["username"];

    const createAccountResult = await dbQueries.addNewUser(enteredUsername, enteredPassword);

    console.log(createAccountResult);

    if (createAccountResult){
        userCreated = true;
        res.render("createAccount.ejs", {
            createAccountResult: "Account created!",
        });
    }
    else{
        userCreated = false;
        res.render("createAccount.ejs", {
            createAccountResult: "Username already exists. Try a different username.",
        });
    }
};

async function checkEmailExists(email){
    try {
        const user = await User.findOne({
            where: { email: email },
        });

        return user !== null;
    }
    catch (error){
        console.error("Error checking email existence:", error);
    }
}

async function loginCheck(req, res){
    const enteredPassword = req.body["password"];
    const enteredUsername = req.body["username"];

    const actualPassword = await dbQueries.getPasswordByUsername(enteredUsername);

    if (enteredPassword === actualPassword){
        userAuthorised = true;
        app.locals.loggedIn = true;
        currentUsername = enteredUsername;

        res.render("login.ejs", {
            loginResult: "Login successful.",
            message: "Welcome!", 
        });

    }
    else{
        userAuthorised = false;
        res.render("login.ejs", {
            loginResult: "Login unsuccessful.",
            message: "Try again.", 
        });
    }
};

//#endregion

//#region Event Handling

//GET requests
app.get('/', (req, res) => {
    res.render('index');
});

app.get("/index", (req, res) => {
    res.render('index');
});

app.get("/hobbies", (req, res) => {
    res.render('hobbies.ejs');
});

app.get("/projects", (req, res) => {
    res.render('projects.ejs');
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

//TO DO: redirect to my profile if logged in.
app.get("/login", (req, res) => {
    res.render("login.ejs", {
        loginResult: "",
        message: "", 
        date: new Date().getDate() + "/" + new Date().getUTCMonth() + "/" + new Date().getFullYear(),
    });
});

app.get("/createAccount", (req, res) => {
    res.render("createAccount.ejs", {
        createAccountResult: "",
        error: false,
    });
})

app.get("/blackjack", (req, res) => {
    res.render("blackjack.ejs", {
    });
})

app.get("/public/game.js", async (req, res) => {
    // res.writeHead(200, {
    //     "Content-Type": "text/javascript",
    // });

    res.setHeader("Content-Type", "text/javascript");

    res.sendFile(__dirname + "/public/game.js");
})

app.get("/public/myProfile.js", (req, res) => {
    res.setHeader("Content-Type", "text/javascript");

    res.sendFile(__dirname + "/public/myProfile.js");
})

app.get("/public/styles.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");

    res.sendFile(__dirname + "/public/styles.css");
})

app.get("/styles.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");

    res.sendFile(__dirname + "/public/styles.css");
})

app.get("/public/blackjack_stylesheet.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");

    res.sendFile(__dirname + "/public/blackjack_stylesheet.css");
})

//TO DO: use session data to check if logged in
app.get("/myProfile", (req, res) => {
    if (app.locals.loggedIn){
        res.render("myProfile.ejs", {
            username: currentUsername,
            activeTab: app.locals.myProfileActiveTab.MYPROFILE,
        });

    }
    else{
        res.render("login.ejs", {
            loginResult: "",
            message: "", 
            date: new Date().getDate() + "/" + new Date().getUTCMonth() + "/" + new Date().getFullYear(),
        });
    };
})

app.get("/myProfile/myProfile", (req, res) => {
    res.render("myProfile.ejs",{
        username: currentUsername,
        activeTab: "myProfile",
    });
})

app.get("/myProfile/dashboard", (req, res) => {
    res.render("myProfile.ejs",{
        username: currentUsername,
        activeTab: "dashboard",
    });
})

app.get("/myProfile/dashboard/weather", async (req, res) => {

    try{
        const weatherByCityJSON = await axios.get("http://api.weatherapi.com/v1/current.json?key=<" + weatherAPIKey + ">&q=" + cityForWeatherForecastInput);
        const weatherByCityData = weatherByCityJSON.data;

        console.log(weatherByCityData);

        res.render("myProfile.ejs",{
            username: currentUsername,
            activeTab: "dashboard",
            weatherByCityText: "",
        });

    }

    catch(error){
        res.status(404);
    }
    
})

app.get("/myProfile/calendar", (req, res) => {
    res.render("myProfile.ejs",{
        username: currentUsername,
        activeTab: "calendar",
    });
})

app.get("/favicon.ico", (req, res) => {
    res.sendFile("/public/Images/favicon.ico");
})

//POST requests
app.post("/submit", (req, res) => {
    console.log(req.body);
    res.send("Form submitted. Thank you!");
});

app.post("/login", (req, res) => {
    console.log(req.body);

    loginCheck(req, res);
    
});

app.post("/createAccount", async (req, res) => {
    const {firstName, lastName, email, password, password2} = req.body;

    if (password !== password2)
    {
        return res.render("./views/createAccount.ejs",{error:"Passwords do not match. Please retype your password."});
    }

    const emailExists = await checkEmailExists(email);

    if (emailExists){
        return res.render("./views/createAccount.ejs",{error:"An account has already been created with this email address."});
    }
    
    try{
        const user = await User.create({firstName, lastName, email, password})
        res.status(201).render("createAccount.ejs", {
            createAccountResult: "Account created!",
            error: false,
        });
    }
    catch (error){
        console.error("unable to create account:", error);
        res.status(400).render("createAccount.ejs", {
            createAccountResult: "",
            error: "Unable to create account",
        });
    }
    
    //console.log(req.body);

    //createAccount(req, res);

})

app.put("/user/Michael", (req, res) => {
    res.sendStatus(200);
})

app.patch("/user/Michael", (req, res) => {
    res.sendStatus(200);
});

app.delete("/user/Michael", (req, res) => {
    res.sendStatus(200);
})

//#endregion Event Handling




app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
//app.set('views', path.join(__dirname, 'views'));

//export default app;

app.listen(port, () => { //port number
    console.log(`Server running on port ${port}.`); //callback function
});
