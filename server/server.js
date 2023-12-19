const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
let mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
app.use(bodyParser.json());
app.use(cors());
const sql = require("mssql/msnodesqlv8");

const config = {
  server: "MC58148\\SQLEXPRESS",
  database: "Bpreven",
  driver: "msnodesqlv8",
  user: "sa",
  password: "Shilo123!!",
};
function SQL(query) {
  return new Promise((resolve, reject) => {
    sql.connect(config, (err) => {
      if (err) {
        console.log("errrrrr:::", err);
        return;
      }
      let request = new sql.Request();
      request.query(query, (err, res) => {
        if (err) {
          // console.log("err1:", err);
          reject(err);
        } else {
          const reso = res;
          // console.log("res", res);
          res = res.recordsets[0];
          if (res) {
            resolve(res);
          } else {
            resolve(reso);
          }
        }
      });
    });
  });
}
async function SQLOS(q) {
  let res = await SQL(q);
  console.log(res);
  // console.log(res);
}

// const q = `SELECT COLUMN_NAME AS a
// FROM INFORMATION_SCHEMA.COLUMNS
// WHERE TABLE_NAME = 'Questionnaire';
// `;
// SQLOS(q);
app.get("/", async (req, res) => {
  const q = `SELECT TOP (1000) [Id]
,[Desc]
,[Symbol]
,[StartQuestion]
,[StatusId]
FROM [Bpreven].[dbo].[Questionnaire]
`;
  let result = await SQL(q);
  // console.log(result);
  res.json(result);
});
app.get("/Getamudes", async (req, res) => {
  try {
    const q = `SELECT COLUMN_NAME AS a
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Questionnaire';
    `;
    let result = await SQL(q);
    // console.log(result);
    result = result.map((element) => {
      return (element = element.a);
    });
    // console.log(result);
    res.json(result);
  } catch (error) {
    res.json(false);
  }
});
app.post("/newequen", async (req, res) => {
  console.log(req.body.Desc);
  try {
    const q = `INSERT INTO Questionnaire ([Desc], Symbol, StartQuestion, StatusId) VALUES ('${req.body.Desc}', '${req.body.Symbol}', '${req.body.StartQuestion}', '${req.body.StatusId}')`;
    // let qo = `'INSERT INTO Questionnaire ([Desc], Symbol, StartQuestion, StatusId) VALUES ('${req.body.Desc}', '${req.body.Symbol}', '${req.body.StartQuestion}', '${req.body.StatusId}');
    // `
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.delete("/Delquen/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const q = `DELETE FROM Questionnaire WHERE Id = ${id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/EditOfquen", async (req, res) => {
  try {
    // console.log(req.body);
    let id = req.body.Id;
    const q = `
    UPDATE Questionnaire
    SET [Desc] = '${req.body.Desc}',Symbol = '${req.body.Symbol}',StartQuestion = '${req.body.StartQuestion}',StatusId =${req.body.StatusId} 
    WHERE Id = ${id}
    `;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(true);
  }
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
