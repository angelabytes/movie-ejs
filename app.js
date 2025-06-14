const express = require("express");
require("dotenv").config();

const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

//store for session using mongoDB
const store = new MongoDBStore({
    //may throw an error
    uri: url,
    collection: "mySessions",
});

store.on("error", function (error) {
    console.log(error);
});

const sessionParams = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: "strict" },
};

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionParams.cookie.secure = true; //serve secure cookies
}

app.use(session(sessionParams));
app.use(require("connect-flash")());



const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
    res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));


//replace app.get and post with router and authentication middleware
const secretWordRouter = require("./routes/secretWord");

const auth = require("./middleware/auth");
app.use("/secretWord", auth, secretWordRouter);


app.use((req, res) => {
    res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
    console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await require("./db/connect")(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
