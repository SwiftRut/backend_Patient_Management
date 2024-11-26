import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import { redisStore } from "./redis.js";
import logger from './config/logger.js';
import { httpLogger } from './middleware/httpLogger.js';

export const app = express();

app.use(httpLogger);

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
app.get("/ssr", (req, res) => {
  // Dynamic values for meta tags
  const dynamicTitle = "Dynamic Title";
  const dynamicDescription = "Dynamic Description";
  const dynamicImage = "https://brd.so/page-fallback-img.png";

  // Constructing meta tags with template literals
  const metaTags = `
    <meta property="og:type" content="website">
    <meta property="og:url" content="">
    <meta property="og:title" content="${dynamicTitle}">
    <meta property="og:description" content="${dynamicDescription}">
    <meta property="og:image" content="${dynamicImage}">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="">
    <meta property="twitter:title" content="${dynamicTitle}">
    <meta property="twitter:description" content="${dynamicDescription}">
    <meta property="twitter:image" content="${dynamicImage}">
  `;

  // Respond with the full HTML structure
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <link rel="apple-touch-icon" href="icons/Icon-192.png">
  <link rel="icon" type="image/png" href="favicon.png">
  ${metaTags}
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>
  <script type="text/javascript">
    window.flutterWebRenderer = "html";
  </script>
  <title>${dynamicTitle}</title>
</head>
<body>
</body>
</html>`);
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

