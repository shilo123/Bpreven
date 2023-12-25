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

// const q = `SELECT * FROM Questions

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
    console.log(req.body);
    let id = req.body.Id;
    const q = `
    UPDATE Questionnaire
    SET [Desc] = '${req.body.Desc}',Symbol = '${req.body.Symbol}',StartQuestion = '${req.body.StartQuestion}',StatusId = ${req.body.StatusId} 
    WHERE Id = ${id}
    `;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(true);
  }
});
app.get("/GetQuestions", async (req, res) => {
  // Questions.NextQuestionId,
  // Questions.ScreenId,
  const q = `SELECT 
  Questions.Id,
  Questions.[Desc],
  Questions.StatusId,
  Questions.IsEnd,
  Questionnaire.[Desc] AS DescQuestionnaire,
  DataTypes.[Desc] AS DescDataType
  FROM Questions
  INNER JOIN Questionnaire ON Questionnaire.Id = Questions.QuestionnaireId
  INNER JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId
`;
  let result = await SQL(q);
  // console.log(result);
  res.json(result);
});
app.get("/GetData", async (req, res) => {
  try {
    const query = `SELECT [Desc] AS NameQuen FROM Questionnaire`;
    const queryTwo = `SELECT [Desc] AS DataType FROM DataTypes`;
    let result = await SQL(query);
    let result2 = await SQL(queryTwo);
    let NameQuen = result.map((e) => (e = e.NameQuen));
    let DataType = result2.map((e) => (e = e.DataType));
    // console.log(result);
    // console.log(result2);
    let datut = { NameQuen, DataType };
    // console.log(datut);

    res.json(datut);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/Updata", async (req, res) => {
  // console.log(req.body);
  // console.log("req.body.DescDataType", req.body.DescDataType);
  try {
    const Q = `SELECT Id AS id FROM Questionnaire WHERE [Desc] = '${req.body.DescQuestionnaire}'`;
    let idOfQuestionnaire = await SQL(Q);
    idOfQuestionnaire = idOfQuestionnaire[0].id;
    const qu = `SELECT Id FROM DataTypes  WHERE [Desc] = '${req.body.DescDataType}'`;
    let idOfDescDataType = await SQL(qu);
    idOfDescDataType = idOfDescDataType[0].Id;
    const query = `UPDATE Questions
    SET [Desc] = '${req.body.Desc}',IsEnd = '${req.body.IsEnd}',QuestionnaireId = ${idOfQuestionnaire},DataTypesId = ${idOfDescDataType}
    ,StatusId = ${req.body.StatusId}
    WHERE Id = ${req.body.Id} `;
    await SQL(query);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/AddQuestin", async (req, res) => {
  // console.log(req.body);
  try {
    const q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${req.body.NameQ}'`;
    let IDnameQ = await SQL(q);
    IDnameQ = IDnameQ[0].Id;
    // console.log(IDnameQ);
    const qu = `SELECT Id FROM DataTypes WHERE [Desc] = '${req.body.typeData}'`;
    let IDdataTy = await SQL(qu);
    IDdataTy = IDdataTy[0].Id;
    // console.log(IDdataTy);
    const query = `INSERT INTO Questions (QuestionnaireId,DataTypesId,[Desc],IsEnd,StatusId) VALUES 
    (${IDnameQ},${IDdataTy},'${req.body.DescQ}',
    '${req.body.IsEnd}',${req.body.StatusId}
    )`;
    await SQL(query);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.delete("/DeleteQustions/:id", async (req, res) => {
  try {
    const q = `DELETE FROM Questions WHERE Id = ${req.params.id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/FIndQustinnare", async (req, res) => {
  console.log(req.body);
  try {
    let query = `SELECT 
    Questions.Id,
    Questions.[Desc],
    Questions.StatusId,
    Questions.IsEnd,
    Questionnaire.[Desc] AS DescQuestionnaire,
    DataTypes.[Desc] AS DescDataType
    FROM Questions
    INNER JOIN Questionnaire ON Questionnaire.Id = Questions.QuestionnaireId
    INNER JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId WHERE Questionnaire.[Desc] = '${req.body.val}'`;
    let data = await SQL(query);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/Serch", async (req, res) => {
  // console.log(req.body);
  let Q;
  try {
    if (req.body.clumn !== "Questions.IsEnd" && req.body.clumn !== "הכל") {
      // console.log("heasdkahsdkasjbdhabsdajh");
      Q = `SELECT 
      Questions.Id,
      Questions.[Desc],
      Questions.StatusId,
      Questions.IsEnd,
      Questionnaire.[Desc] AS DescQuestionnaire,
      DataTypes.[Desc] AS DescDataType
      FROM Questions
      INNER JOIN Questionnaire ON Questionnaire.Id = Questions.QuestionnaireId
      INNER JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId
      WHERE ${req.body.clumn} LIKE '${req.body.val}%'
      `;
    } else if (req.body.clumn === "Questions.IsEnd") {
      Q = `SELECT 
      Questions.Id,
      Questions.[Desc],
      Questions.StatusId,
      Questions.IsEnd,
      Questionnaire.[Desc] AS DescQuestionnaire,
      DataTypes.[Desc] AS DescDataType
      FROM Questions
      INNER JOIN Questionnaire ON Questionnaire.Id = Questions.QuestionnaireId
      INNER JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId
      WHERE Questions.IsEnd = '${req.body.val}'
`;
    } else if (req.body.clumn === "הכל") {
      Q = `SELECT 
  Questions.Id,
  Questions.[Desc],
  Questions.StatusId,
  Questions.IsEnd,
  Questionnaire.[Desc] AS DescQuestionnaire,
  DataTypes.[Desc] AS DescDataType
  FROM Questions
  INNER JOIN Questionnaire ON Questionnaire.Id = Questions.QuestionnaireId
  INNER JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId
  WHERE Questions.[Desc] LIKE '%${req.body.val}%'
  OR
  Questionnaire.[Desc] LIKE '%${req.body.val}%'
  OR
  DataTypes.[Desc] LIKE '%${req.body.val}%'  
`;
    }
    `  OR
Questions.IsEnd = '${req.body.val}'
`;
    `  Questions.StatusId LIKE '${req.body.val}%'
OR
`;
    let result = await SQL(Q);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});
app.get("/GetOption/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const q = `SELECT * FROM QuestionsOptions WHERE QuestionsId = ${id} ORDER BY sek`;
    let result = await SQL(q);
    // console.log(result);
    res.json(result);
  } catch (error) {}
});
app.post("/AddAnswer", async (req, res) => {
  // console.log(req.body);
  try {
    const query = `SELECT MAX(sek) AS maxSec FROM QuestionsOptions WHERE QuestionsId = ${req.body.id}`;
    let sek = await SQL(query);
    sek = sek[0].maxSec;
    console.log(sek);
    if (!sek) {
      sek = 1;
    }
    const q = `INSERT INTO QuestionsOptions (QuestionsId,[Desc],sek) VALUES (${req.body.id},'${req.body.text}',${sek})`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(true);
  }
});
app.delete("/DeleteAnswer/:id", async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  try {
    const query = `DELETE FROM QuestionsOptions WHERE Id = ${id}
    `;
    await SQL(query);
    res.json(true);
  } catch (error) {
    console.log(error);
  }
});
app.put("/UpdateOP", async (req, res) => {
  console.log(req.body);
  try {
    const q = `UPDATE  QuestionsOptions 
    SET [Desc] = '${req.body.text}'
    WHERE Id = ${req.body.id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
