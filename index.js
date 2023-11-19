const express = require("express");
const mongoose = require('mongoose');
const session = require("express-session");
const redis = require("redis");
const core = require("cors");
let RedisStore = require("connect-redis").default;

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP, MONGO_PORT,
    REDIS_URL,
    SESSION_SECRET,
    REDIS_PORT
} = require("./config/config");

// Initialize client.
let redisClient = redis.createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT,
        legacyMode: true,
    }
});

redisClient.connect();

redisClient.on('error', function (err) {
    console.log('*Redis Client Error: ' + err.message);
});
redisClient.on('connect', function () {
    console.log('Connected to redis instance');
});

// Initialize store.
let redisStore = new RedisStore({
    client: redisClient,
})

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("successfully connected to DB"))
        .catch((e) => {
            console.log(e)
            setTimeout(connectWithRetry, 5000)
        });
}

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}))
app.use(
    session({
        store: redisStore,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 30000
        }
    })
)

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi Tsshere!!!s</h2>");
    console.log("yeah it ran");
});

// www/google.com -> www.yahoo.com

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));