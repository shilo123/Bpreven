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
  let data = await SQL(q);

  console.log(data);
  // console.log(res);
}

// const q = `SELECT * FROM Questions
// `;

// SQLOS(q);
app.get("/", async (req, res) => {
  const q = `SELECT * 
FROM [Questionnaire]
`;
  let result = await SQL(q);
  // console.log(result);
  res.json(result);
});

app.get("/GetOPtionForQuestion/:qushinnare", async (req, res) => {
  try {
    let activQushinnare = req.params.qushinnare;
    const Query = `SELECT Id FROM Questionnaire WHERE [Desc] = '${activQushinnare}'`;
    let idQus = await SQL(Query);
    idQus = idQus[0].Id;
    console.log(idQus);
    const query = `SELECT * FROM Questions WHERE QuestionnaireId = ${idQus}`;
    let questions = await SQL(query);
    console.log(questions);
    let arr = [];
    const Promises = questions.map(async (e) => {
      let q = `SELECT * FROM QuestionsOptions WHERE QuestionsId = ${e.Id} ORDER BY sek`;
      let result = await SQL(q);
      arr.push({ [e.Desc]: result });
    });
    console.log(arr);
    await Promise.all(Promises);
    // console.log(activQushinnare);
    res.json(arr);
  } catch (error) {
    res.json(true);
  }
});
app.get("/GetallQuestions", async (req, res) => {
  try {
    const q = `SELECT Id ,[Desc] FROM Questionnaire `;
    let resultA = await SQL(q);
    let obj = {};
    const Promises = resultA.map(async (el) => {
      let propery = el.Desc;
      const QU = `SELECT Questions.*, DataTypes.[Desc] AS DescDateTypes FROM Questions 
      LEFT JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId
       WHERE QuestionnaireId = ${el.Id}`;
      let val = await SQL(QU);
      // console.log(val);
      obj[propery] = val;
    });
    // console.log(resultA);
    await Promise.all(Promises);
    // console.log(obj);
    //
    //
    // let arr = [];
    // for (const key in obj) {
    //   arr.push({ nameQuesinnare: key, qustions: obj[key] });
    // }
    // console.log(arr[0].qustions);

    //
    //
    res.json(obj);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
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
  // console.log(req.body.Desc);
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
app.post("/SerchQushinnere", async (req, res) => {
  try {
    const query = req.body.query;
    const Clumn = req.body.clumn;
    // console.log(query, Clumn);
    const q = `SELECT * FROM Questionnaire WHERE [${Clumn}] LIKE '${query}%'`;
    let result = await SQL(q);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.get("/GetQuestions", async (req, res) => {
  // Questions.NextQuestionId,
  // Questions.ScreenId,
  const q = `SELECT 
  Q1.Id,
  Q1.[Desc],
  Q1.StatusId,
  Q1.IsEnd,
  Questionnaire.[Desc] AS DescQuestionnaire,
  DataTypes.[Desc] AS DescDataType,
  Q2.[Desc] AS NextQuestionDesc
FROM Questions AS Q1
LEFT JOIN Questionnaire ON Questionnaire.Id = Q1.QuestionnaireId
LEFT JOIN Questions AS Q2 ON Q1.NextQuestionId = Q2.Id
LEFT JOIN DataTypes ON DataTypes.Id = Q1.DataTypesId ORDER BY Questionnaire.[Desc] Desc;

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
  let body = req.body;
  try {
    let nextQuestionId = null;

    // חיפוש מספר הזיהוי של השאלה הבאה, אם קיימת
    if (body.NextQuestionDesc && body.NextQuestionDesc !== "ללא שאלה הבאה") {
      const nextQuestionQuery = `SELECT Id FROM Questions WHERE [Desc] = '${body.NextQuestionDesc}'`;
      const nextQuestionResult = await SQL(nextQuestionQuery);
      if (nextQuestionResult[0]) {
        nextQuestionId = nextQuestionResult[0].Id;
      }
    }

    let questionnaireId = null;
    // חיפוש מספר הזיהוי של השאלון, אם קיים
    if (body.DescQuestionnaire) {
      const questionnaireQuery = `SELECT Id FROM Questionnaire WHERE [Desc] = '${body.DescQuestionnaire}'`;
      const questionnaireResult = await SQL(questionnaireQuery);
      if (questionnaireResult[0]) {
        questionnaireId = questionnaireResult[0].Id;
      }
    }

    let dataTypesId = null;
    // חיפוש מספר הזיהוי של סוג הנתונים, אם קיים
    if (body.DescDataType) {
      const dataTypesQuery = `SELECT Id FROM DataTypes WHERE [Desc] = '${body.DescDataType}'`;
      const dataTypesResult = await SQL(dataTypesQuery);
      if (dataTypesResult[0]) {
        dataTypesId = dataTypesResult[0].Id;
      }
    }

    // עדכון שדות השאלה
    let updateQuery = `
          UPDATE Questions
          SET
              [Desc] = '${body.Desc}',
              IsEnd = ${body.IsEnd ? 1 : 0},
              StatusId = ${body.StatusId}
      `;

    // הוספת QuestionnaireId, DataTypesId ו-NextQuestionId לשאילתה אם קיימים
    if (questionnaireId !== null) {
      updateQuery += `, QuestionnaireId = ${questionnaireId}`;
    }
    if (dataTypesId !== null) {
      updateQuery += `, DataTypesId = ${dataTypesId}`;
    }
    if (nextQuestionId !== null) {
      updateQuery += `, NextQuestionId = ${nextQuestionId}`;
    } else {
      updateQuery += `, NextQuestionId = NULL`;
    }

    updateQuery += ` WHERE Id = ${body.Id}`;

    await SQL(updateQuery);
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
  console.log(id);
  try {
    const q = `SELECT QuestionsOptions.[Desc], QuestionsOptions.Id, Questions.[Desc] AS Nextques
    FROM QuestionsOptions
    LEFT JOIN Questions ON QuestionsOptions.NextQuestionId = Questions.Id
     WHERE QuestionsId = ${id} ORDER BY sek`;
    let result = await SQL(q);
    // console.log(result);
    res.json(result);
    // res.json([]);
  } catch (error) {
    console.log(error);
  }
});
app.post("/AddAnswer", async (req, res) => {
  console.log(req.body);
  try {
    const query = `SELECT MAX(sek) AS maxSec FROM QuestionsOptions WHERE QuestionsId = ${req.body.id}`;
    let sek = await SQL(query);
    sek = sek[0].maxSec;
    // console.log(sek);
    if (!sek) {
      sek = 1;
    } else {
      sek++;
    }
    const q = `INSERT INTO QuestionsOptions (QuestionsId,[Desc],sek) VALUES (${req.body.id},'${req.body.text}',${sek})`;
    let Request = await SQL(q);
    console.log(Request);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(true);
  }
});
app.delete("/DeleteAnswer/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
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
  // console.log(req.body);
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
app.post("/GetQestion", async (req, res) => {
  // console.log(req.body);
  try {
    const query = `SELECT Id FROM Questionnaire WHERE [Desc] = '${req.body.DescQuestionnaire}'`;
    let id = await SQL(query);
    id = id[0].Id;
    const query2 = `SELECT * FROM Questions 
    WHERE QuestionnaireId = ${id} AND [Desc] != '${req.body.Desc}'
    `;
    let data = await SQL(query2);
    // console.log("data", data);
    // console.log(id);
    res.json(data);
    // res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/addNewQustionsId", async (req, res) => {
  try {
    console.log(req.body);
    const query = `SELECT Id FROM Questions WHERE [Desc] = '${req.body.nextQusions}'`;
    let id = await SQL(query);
    if (req.body.nextQusions !== "ללא שאלה הבאה") {
      id = id[0].Id;
    } else {
      id = null;
    }
    console.log(id);
    const Q = `UPDATE QuestionsOptions
    SET NextQuestionId = ${id}
    WHERE QuestionsId = ${req.body.IdQuestion} AND Id = ${req.body.idOfOption}
    `;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/AddnewNextquestionNoOption", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.neXtQuestionsId === "ללא שאלה הבאה") {
      req.body.neXtQuestionsId = null;
    }
    const q = `UPDATE Questions
    SET NextQuestionId = ${req.body.neXtQuestionsId}
    WHERE Id = ${req.body.id}
    `;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/updateSek", async (req, res) => {
  try {
    console.log(req.body);

    const Promises = req.body.arr.map(async (e) => {
      let q = `UPDATE QuestionsOptions
        SET sek = ${e.newSek}
        WHERE Id = ${e.id}`;
      await SQL(q);
    });
    await Promise.all(Promises);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
