import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import { redisStore } from "./redis.js";
export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(compression()); 
app.use(
  session({
      store: redisStore,
      secret: 'yourSecretKey', // Replace with a secure, random key
      resave: false, // Avoid resaving unchanged sessions
      saveUninitialized: false, // Don't save empty sessions
      cookie: {
          secure: false, // Set to true if using HTTPS
          maxAge: 1000 * 60 * 60 * 24, // Session expiration in milliseconds (1 day here)
      },
  })
);

//routes import
import routes from "./routes/index.js";
//routes declaration
app.get('/redis', (req, res) => {
  if (req.session.views) {
      req.session.views++;
      res.send(`Number of views: ${req.session.views}`);
  } else {
      req.session.views = 1;
      res.send('Welcome! Refresh the page to track session views.');
  }
});
app.use("/", routes);
