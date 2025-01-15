import "dotenv/config";

import express from "express";
import cors from "cors";
import xml from "xml2js";
import xmlparser from "express-xml-bodyparser";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const xmlOptions = {
  charkey: "value",
  trim: false,
  explicitRoot: false,
  explicitArray: false,
  normalizeTags: false,
  mergeAttrs: true,
};

const builder = new xml.Builder({
  renderOpts: { pretty: false },
});

const bustHeaders = (request, response, next) => {
  request.app.isXml = false;

  if (
    request.headers["content-type"] === "application/xml" ||
    request.headers["accept"] === "application/xml"
  ) {
    request.app.isXml = true;
  }

  next();
};

const buildResponse = (response, statusCode, data, preTag) => {
  response.format({
    "application/json": () => {
      response.status(statusCode).json(data);
    },
    "application/xml": () => {
      response.status(statusCode).send(builder.buildObject({ [preTag]: data }));
    },
    default: () => {
      // log the request and respond with 406
      response.status(406).send("Not Acceptable");
    },
  });
};

// app.post("/xl", async (req, res) => {
//   try {
//     const data = req.data;
//     if (!data) {
//       return res.status(404);
//     }
//     res.status(200);
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(500);
//   }
// });

app.post("/xl", bustHeaders, xmlparser(xmlOptions), (request, response) => {
  try {
    const data = request.body;
    if (!data) {
      return response.status(404);
    }
    response.status(200);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server has started on port: ${process.env.PORT}`)
);
