const express = require("express");
require("dotenv").config();

const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('host-csrf');
const cookieParser = require('cookie-parser');
const movieRouter = require('./routes/movies');
const xss = require('perfect-express-sanitizer');
const rateLimiter = require('express-rate-limit');

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

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
})
);
app.use(xss.clean({
    xss: true,
    noSQL: true,
}));

const sessionParams = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: "strict" },
};

app.set("view engine", "ejs");

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.urlencoded({ extended: false }));
let csrf_develeopment_mode = true;

if (app.get("env") === "production") {
    // sessionParams.cookie.secure = true; //serve secure cookies
    csrf_develeopment_mode = false;
    app.set("trust proxy", 1);
}

const csrf_options = {
    protected_operations: ["PATCH", "POST"],
    development_mode: csrf_develeopment_mode,
};

const csrf_middleware = csrf(csrf_options); //initialize and return middleware

app.use(session(sessionParams));
app.use(csrf_middleware);

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


const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");

app.use("/secretWord", auth, secretWordRouter);
app.use("/movies", movieRouter);


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
