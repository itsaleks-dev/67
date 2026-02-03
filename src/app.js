require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");

const connectMongo = require("./config/mongo");
const configurePassport = require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

connectMongo();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("session id:", req.sessionID);
  console.log("user:", req.user || null);
  next();
});

app.get("/", (req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/users", usersRoutes);

app.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
