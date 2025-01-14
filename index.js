import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.get("/xl", async (req, res) => {
  try {
    const data = req.data;
    if (data.length === 0) {
      return res.status(404);
    }
    res.status(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server has started on port: ${process.env.PORT}`)
);
