const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const morgan = require("morgan");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(teamName);
// server.use(moodyGatekeeper);
server.use(restricted);
server.use("/api/hubs", restricted, only("frodo"));
server.use(errorHandler);

server.use("/api/hubs", hubsRouter);

server.get("/", (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.authorization;

  if (req.headers && req.headers.authorization) {
    if (password === "mellon") {
      next();
    } else {
      res.status(401).json({ message: "Invalid credentials." });
    }
  } else {
    next({ message: "No auth header provided." });
  }
}

function only(name) {
  return function(req, res, next) {
    const userName = req.headers.name;

    if (userName.toLowerCase() === name.toLowerCase()) {
      next();
    } else {
      res.status(403).json({ message: "Wrong name. Try again." });
    }
  };
}

function teamName(req, res, next) {
  req.team = "Lambda Students";

  next();
}

// function moodyGatekeeper(req, res, next) {
//   const seconds = new Date().getSeconds();

//   if (seconds % 3 === 0) {
//     res.status(403).json('none shall pass!');
//   } else {
//     next();
//   }
// };

function errorHandler(error, req, res, next) {
  res.status(400).json({ message: "Bad Panda!", error });
}

// server.use((req, res) => {
//   res.status(404).send('Aint nobody got time for that!')
// });

module.exports = server;
