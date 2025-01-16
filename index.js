import "dotenv/config";

import express from "express";
import cors from "cors";
import xml from "xml2js";
import xmlparser from "express-xml-bodyparser";
import bodyParser from "body-parser";
import helmet from "helmet";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
app.disable("x-powered-by");
app.set("port", port);

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

const bustHeaders = (req, res, next) => {
  req.app.isXml = false;

  if (
    req.headers["content-type"] === "application/xml" ||
    req.headers["accept"] === "application/xml"
  ) {
    req.app.isXml = true;
  }

  next();
};

const builder = new xml.Builder({
  renderOpts: { pretty: false },
});

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

app.get("/", async (req, res) => {
  try {
    res.send("Sup bitj");
    // res.status(200).send("Data received");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  try {
    const data = req;
    if (!data) {
      return res.sendStatus(404);
    }
    console.log(data);
    res.status(200).send("Data received");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/xmail", bustHeaders, xmlparser(xmlOptions), async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      console.log(data);
      return buildResponse(res, 500, { message: "DATA NOT FOUND" });
    }
    console.log("FROM: " + data.from);
    console.log("BODY: " + data.body);
    return buildResponse(res, 200, data, "Data");
  } catch (err) {
    console.log(err);
    buildResponse(res, 500, { message: "INTERNAL SERVER ERROR" });
  }
});

app.post("/xl", bustHeaders, xmlparser(xmlOptions), (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.sendStatus(404);
    }
    console.log(data);
    res.status(200).send("XL data received");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/idt", bustHeaders, xmlparser(xmlOptions), (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.sendStatus(404);
    }
    console.log(data);
    res.status(200).send("Indosat data received");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
