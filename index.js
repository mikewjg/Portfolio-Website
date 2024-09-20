
//#region Imports
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";
import databaseQueries from "./databaseQueries.js";
import axios from "axios";
//#endregion

//Create database client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Portfolio Website",
    password: "4Vuo6OivRw",
    port: 5432,
});

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
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next){
    res.locals.session = req.session;
    next();
});
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

    res.sendFile("C:\\Users\\micha\\Desktop\\Personal Projects\\Programming Projects\\Web Development\\Portfolio Website\\public\\game.js");
})

app.get("/public/myProfile.js", (req, res) => {
    res.setHeader("Content-Type", "text/javascript");

    res.sendFile("C:\\Users\\micha\\Desktop\\Personal Projects\\Programming Projects\\Web Development\\Portfolio Website\\public\\myProfile.js");
})

app.get("/public/styles.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");

    res.sendFile("C:\\Users\\micha\\Desktop\\Personal Projects\\Programming Projects\\Web Development\\Portfolio Website\\public\\styles.css");
})

app.get("/public/blackjack_stylesheet.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");

    res.sendFile("C:\\Users\\micha\\Desktop\\Personal Projects\\Programming Projects\\Web Development\\Portfolio Website\\public\\blackjack_stylesheet.css");
})

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

app.post("/submit", (req, res) => {
    console.log(req.body);
    res.send("Form submitted. Thank you!");
});

app.post("/login", (req, res) => {
    console.log(req.body);

    loginCheck(req, res);
    
});

app.post("/createAccount", (req, res) => {
    console.log(req.body);

    createAccount(req, res);

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


//app.listen(port, () => { //port number
//    console.log(`Server running on port ${port}.`); //callback function
//});

app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
//app.set('views', path.join(__dirname, 'views'));

export default app;
 
