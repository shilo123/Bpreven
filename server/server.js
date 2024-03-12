const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
let mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
const sql = require("mssql/msnodesqlv8");
const { Promise } = require("mssql/msnodesqlv8");
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use("/Upload", express.static("Upload"));
// const corsOpt = {
//   origin: "*",
//   methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOpt));
// app.options("*", cors(corsOpt));

const URL = `https://bprevenserver.dgtracking.co.il`;
// const URL = `http://localhost:3001`;

// console.log(port);
const config = {
  // server: "MC58148\\SQLEXPRESS",
  // database: "Bpreven",
  // driver: "msnodesqlv8",
  // user: "sa",
  // password: "Shilo123!!",
  //
  server: "185.68.120.69",
  database: "Bpreven",
  driver: "msnodesqlv8",
  user: "dgtracking_co_il_dgLaw",
  password: "dgtrackingJadekia556",
};
// console.log(config);
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
function isNumeric(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}
async function SQLOS(q) {
  let data = await SQL(q);

  console.log(data);
  // console.log(res);
}
function deleteFileInFolder(folderName, fileName) {
  const folderPath = path.join(__dirname, "Upload", folderName);

  // בדיקה אם התיקייה קיימת
  if (!fs.existsSync(folderPath)) {
    console.log("Folder does not exist");
    return;
  }

  const filePath = path.join(folderPath, fileName);

  // בדיקה אם הקובץ קיים
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      } else {
        console.log(`File ${fileName} was deleted successfully`);
      }
    });
  } else {
    console.log("File does not exist");
  }
}
function random(min, max) {
  if (min > max) {
    throw new Error("אחי אך המינימלי גדול מהמקמילי אחיי");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// const q = `SELECT * FROM QuestionsOptions WHERE QuestionsId = 10
// `;
// SQLOS(q);
// $ FILE
app.post("/postFilee/:Idcategory", upload.single("file"), async (req, res) => {
  let Id = req.params.Idcategory;
  let File = req.file;
  let Type;
  // console.log(File.mimetype);
  const pathFloader = path.join(__dirname, "Upload", Id);
  if (!fs.existsSync(pathFloader)) {
    fs.mkdirSync(pathFloader, { recursive: true });
  }

  let nameFile = File.originalname;
  if (nameFile.split(".")[1]) {
    nameFile = nameFile.split(".")[0];
  }
  if (nameFile.split(" ")[1]) {
    nameFile = nameFile.split(" ")[0];
  }
  Type = "image";
  if (File.mimetype.startsWith("image/")) {
    nameFile += JSON.stringify(random(0, 1000)) + ".png";
  } else if (File.mimetype.startsWith("video/")) {
    Type = "video";

    nameFile += JSON.stringify(random(0, 1000)) + ".mp4";
  } else if (File.mimetype.startsWith("audio/")) {
    Type = "audio";

    nameFile += JSON.stringify(random(0, 1000)) + ".mp3";
  } else {
    console.log("קובץ מוזר");
  }
  const filePath = path.join(pathFloader, nameFile);
  // debugger;
  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving the file.");
    }
    res.json({ response: `${URL}/Upload/${Id}/${nameFile}`, Type });
  });
});
app.post(
  "/postFileUpdate/:name/:idCategory",
  upload.single("file"),
  async (req, res) => {
    try {
      const nameFilea = req.params.name;
      const Id = req.params.idCategory;
      let Type = "";
      deleteFileInFolder(Id, nameFilea);
      let file = req.file;
      // console.log(file);
      let nameFile = req.file.originalname;
      if (nameFile.split(".")[1]) {
        nameFile = nameFile.split(".")[0];
      }
      if (nameFile.split(" ")[1]) {
        nameFile = nameFile.split(" ")[0];
      }
      if (file.mimetype.startsWith("image/")) {
        Type = "image";
        nameFile += JSON.stringify(random(0, 1000)) + ".png";
      } else if (file.mimetype.startsWith("video/")) {
        Type = "video";
        nameFile += JSON.stringify(random(0, 1000)) + ".mp4";
      } else if (file.mimetype.startsWith("audio/")) {
        Type = "audio";
        nameFile += JSON.stringify(random(0, 1000)) + ".mp3";
      } else {
        console.log("קובץ");
      }

      const pathFloader = path.join(__dirname, "Upload", Id);
      if (!fs.existsSync(pathFloader)) {
        fs.mkdirSync(pathFloader, { recursive: true });
      }
      const filePath = path.join(pathFloader, nameFile);
      fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving the file.");
        }
        res.json({ response: `${URL}/Upload/${Id}/${nameFile}`, Type });
      });
    } catch (error) {
      console.log("errFile", error);
      res.send(false);
    }
  }
);
//
// $ Qustionnaire
app.get("/", async (req, res) => {
  try {
    const q = `SELECT *
    FROM [Questionnaire]
    `;
    let result = await SQL(q);
    // console.log(result);
    let ids = result.map((e) => e.Id);
    // console.log(ids);
    const Promises = ids.map(async (id) => {
      const query = `SELECT CASE
         WHEN EXISTS (
           SELECT 1
        FROM Questions
        WHERE QuestionnaireId = ${id}
            )
         THEN 'true'
          ELSE 'false'
           END AS IsExists;
`;
      let resu = await SQL(query);
      let IsExists = resu[0].IsExists === "true";
      // console.log(IsExists);
      let I = result.findIndex((e) => e.Id === id);
      if (IsExists) {
        result[I].ifQ = true;
      } else {
        result[I].ifQ = false;
      }
    });
    await Promise.all(Promises);
    res.json(result);
  } catch (error) {
    res.json(false);
  }
});
app.get("/GetQueshianaire", async (req, res) => {
  try {
    const q = `SELECT * FROM Questionnaire`;
    res.json(await SQL(q));
  } catch (error) {
    res.json(false);
  }
});
app.get("/GetOPtionForQuestion/:qushinnare", async (req, res) => {
  try {
    let activQushinnare = req.params.qushinnare;
    const Query = `SELECT Id, QuestionnaireTypesId FROM Questionnaire WHERE [Desc] = '${activQushinnare}'`;
    let Quesoz = await SQL(Query);
    let idQus = Quesoz[0].Id;
    let typeId = Quesoz[0].QuestionnaireTypesId;
    // console.log({ idQus, typeId });
    const quz = `SELECT * FROM QuestionnaireTypes WHERE Id = ${typeId}`;
    let type = await SQL(quz);
    type = type[0];
    // console.log(idQus);
    const query = `SELECT * FROM Questions WHERE QuestionnaireId = ${idQus}`;
    let questions = await SQL(query);
    // console.log(questions);
    let arr = [];
    const Promises = questions.map(async (e) => {
      let q = `SELECT * FROM QuestionsOptions WHERE QuestionsId = ${e.Id} ORDER BY [Seq]`;
      let result = await SQL(q);
      arr.push({ [e.Desc]: result });
    });
    await Promise.all(Promises);
    // console.log({ arr, type });
    // console.log(activQushinnare);
    res.json({ arr, type });
    // res.json([]);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.get("/GetallQuestions", async (req, res) => {
  try {
    const q = `SELECT Id ,[Desc] FROM Questionnaire`;
    let resultA = await SQL(q);
    let obj = {};
    const Promises = resultA.map(async (el) => {
      let propery = el.Desc;
      const QU = `SELECT Questions.*, DataTypes.[Desc] AS DescDateTypes FROM Questions 
      LEFT JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId
       WHERE QuestionnaireId = ${el.Id} ORDER BY Questions.[Seq]`;
      let val = await SQL(QU);
      obj[propery] = val;
    });
    await Promise.all(Promises);
    res.json(obj);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.get("/GetOptionTypeQuesinnaire", async (req, res) => {
  try {
    const query = `SELECT * FROM QuestionnaireTypes`;
    const data = await SQL(query);
    res.json(data);
  } catch (error) {
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
  // console.log(req.body);
  try {
    const Desc = req.body.Desc ? req.body.Desc.replace(/'/g, "''") : "";
    const Symbol = req.body.Symbol ? req.body.Symbol.replace(/'/g, "''") : "";
    const StartQuestion = req.body.StartQuestion
      ? req.body.StartQuestion.replace(/'/g, "''")
      : " ";
    const StatusId = req.body.StatusId ? 1 : 0;
    // console.log(StatusId);
    const Date = req.body.Date;
    const defaultId = req.body.default;
    const monthi = req.body.monthi;
    const QuestionnaireTypesId = req.body.type;
    const EndQustion = req.body.EndQuestion
      ? req.body.EndQuestion.replace(/'/g, "''")
      : " ";

    let q;
    if (Date) {
      q = `INSERT INTO Questionnaire ([Desc], Symbol, StartQuestion, StatusId,Dayly,Monthly,DefaultId,QuestionnaireTypesId,EndQuestion)
       VALUES ('${Desc}', '${Symbol}', '${StartQuestion}', '${StatusId}','${Date}',NULL,NULL,${QuestionnaireTypesId},'${EndQustion}')`;
    } else if (defaultId) {
      q = `INSERT INTO Questionnaire ([Desc], Symbol, StartQuestion, StatusId,Dayly,Monthly,DefaultId,QuestionnaireTypesId,EndQuestion)
       VALUES ('${Desc}', '${Symbol}', '${StartQuestion}', '${StatusId}',NULL,NULL,${defaultId},${QuestionnaireTypesId},'${EndQustion}')`;
    } else if (monthi) {
      q = `INSERT INTO Questionnaire ([Desc], Symbol, StartQuestion, StatusId,Dayly,Monthly,DefaultId,QuestionnaireTypesId,EndQuestion)
       VALUES ('${Desc}', '${Symbol}', '${StartQuestion}', '${StatusId}',NULL,${monthi},NULL,${QuestionnaireTypesId},'${EndQustion}')`;
    } else if (!Date && !defaultId && !monthi) {
      q = `INSERT INTO Questionnaire ([Desc], Symbol, StartQuestion, StatusId,Dayly,Monthly,DefaultId,QuestionnaireTypesId,EndQuestion)
      VALUES ('${Desc}', '${Symbol}', '${StartQuestion}', '${StatusId}',NULL,NULL,NULL,${QuestionnaireTypesId},'${EndQustion}')`;
    }
    //QuestionnaireTypesId !== 1 ||
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
    // console.log(id);
    const q = `DELETE FROM Questionnaire WHERE Id = ${id}`;
    await SQL(q);
    const Query = `SELECT Id FROM Questions WHERE QuestionnaireId = ${id}`;
    let IDS = await SQL(Query);
    IDS = IDS.map((e) => {
      return e.Id;
    });
    // console.log(IDS);
    const Promises = IDS.map(async (e) => {
      let QuaQy = `DELETE FROM Questions WHERE Id = ${e}`;
      await SQL(QuaQy);
      let Querty = `DELETE FROM QuestionsOptions WHERE QuestionsId = ${e}`;
      await SQL(Querty);
    });
    await Promise.all(Promises);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/EditOfquen", async (req, res) => {
  try {
    // console.log("req", req.body);
    async function DalayRe() {
      const addDayAndFormat = (dateStr) => {
        let date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString();
      };
      let Dayl = req.body.Dayly ? req.body.Dayly : null;
      if (Dayl) {
        if (req.body.AddYom) {
          return addDayAndFormat(Dayl);
        } else {
          return Dayl;
        }
      } else {
        return null;
      }
    }
    const Desc = req.body.Desc ? req.body.Desc.replace(/'/g, "''") : null;
    const Symbol = req.body.Symbol ? req.body.Symbol.replace(/'/g, "''") : null;
    const StartQuestion = req.body.StartQuestion
      ? req.body.StartQuestion.replace(/'/g, "''")
      : req.body.StartQuestion;
    const StatusId = req.body.StatusId ? 1 : 0;
    const Monthly = req.body.Monthly;
    const Dayly = await DalayRe();
    const DefaultId = req.body.DefaultId;
    const QuestionnaireTypesId = req.body.QuestionnaireTypesId;
    const id = req.body.Id;
    const EndQustion = req.body.EndQuestion
      ? req.body.EndQuestion.replace(/'/g, "''")
      : req.body.EndQuestion;
    // const StatusId = req.body.StatusId ? 1 : 0;
    for (const key in req.body) {
      if (!req.body[key] && key !== "Id") {
        req.body[key] = "NULL";
      }
    }
    // console.log({
    //   Desc,
    //   Symbol,
    //   StartQuestion,
    //   StatusId,
    //   Monthly,
    //   Dayly,
    //   DefaultId,
    //   QuestionnaireTypesId,
    //   id,
    //   EndQustion,
    // });
    // if (QuestionnaireTypesId === 3) {
    //   const query = `SELECT * FROM Score WHERE QuestionnaireId = ${id}`;
    //   let datush = await SQL(query);
    //   if (!Boolean(datush.length)) {
    //     const q = `INSERT INTO Score (QuestionnaireId,QuestionsAnswersIds,QuestionnaireScore) VALUES
    //     (${id},NULL,NULL)`;
    //     await SQL(q);
    //   }
    // }
    let q;
    if (Dayly || Dayly === "NULL") {
      q = `UPDATE Questionnaire
      SET 
         [Desc] = '${Desc}',
          EndQuestion = '${EndQustion}',
          Symbol = '${Symbol}',
          StartQuestion = '${StartQuestion}',
          StatusId = ${StatusId},
          Monthly = NULL,
          QuestionnaireTypesId = ${QuestionnaireTypesId},
          DefaultId = NULL,
          Dayly = '${Dayly}'
          WHERE Id = ${id}
  `;
    } else if (Monthly || Monthly === "NULL") {
      q = `UPDATE Questionnaire
      SET 
         [Desc] = '${Desc}',
         EndQuestion = '${EndQustion}',

          Symbol = '${Symbol}',
          StartQuestion = '${StartQuestion}',
          StatusId = ${StatusId},
          Monthly = ${Monthly},
          QuestionnaireTypesId = ${QuestionnaireTypesId},
          DefaultId = NULL,
          Dayly = NULL
          WHERE Id = ${id}
  `;
    } else if (DefaultId || DefaultId === "NULL") {
      q = `UPDATE Questionnaire
      SET 
         [Desc] = '${Desc}',
         EndQuestion = '${EndQustion}',

          Symbol = '${Symbol}',
          StartQuestion = '${StartQuestion}',
          StatusId = ${StatusId},
          Monthly = NULL,
          QuestionnaireTypesId = ${QuestionnaireTypesId},
          DefaultId = ${DefaultId},
          Dayly = NULL
          WHERE Id = ${id}
  `;
    } else if (!Dayly && !Monthly && !DefaultId) {
      q = `UPDATE Questionnaire
      SET 
         [Desc] = '${Desc}',
         EndQuestion = '${EndQustion}',

          Symbol = '${Symbol}',
          StartQuestion = '${StartQuestion}',
          StatusId = ${StatusId},
          Monthly = NULL,
          QuestionnaireTypesId = ${QuestionnaireTypesId},
          DefaultId = NULL,
          Dayly = NULL
          WHERE Id = ${id}
  `;
    }
    // console.log(q);
    await SQL(q);

    res.json(true);
  } catch (error) {
    res.json(false);
    console.log(error);
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
  const q = `SELECT 
  Q1.Id,
  Q1.[Seq],
  Q1.[Desc],
  Q1.StatusId,
  Q1.IsEnd,
  Questionnaire.[Desc] AS DescQuestionnaire,
  Questionnaire.QuestionnaireTypesId AS TypeQ,
  DataTypes.[Desc] AS DescDataType,
  Q2.[Desc] AS NextQuestionDesc
FROM Questions AS Q1
LEFT JOIN Questionnaire ON Questionnaire.Id = Q1.QuestionnaireId
LEFT JOIN Questions AS Q2 ON Q1.NextQuestionId = Q2.Id
LEFT JOIN DataTypes ON DataTypes.Id = Q1.DataTypesId ORDER BY Questionnaire.[Desc] Desc ,Q1.[Seq] ASC;
`;

  // let result = [];
  let result = await SQL(q);
  // let IDS = result.map((e) => e.Id);
  // // console.log(IDS);
  // const Promises = IDS.map(async (id) => {
  //   // console.log(id);
  //   const Query = `SELECT CASE WHEN EXISTS(
  //     SELECT 1 FROM Score WHERE FIND_IN_SET(${id},) = ${id}
  //   )
  //   THEN 'true'
  //   ELSE 'false'
  //   END AS IsExists`;

  //   let data = await SQL(Query);
  //   let IsExists = data[0].IsExists === "true";
  //   const I = result.findIndex((e) => e.Id === id);
  //   result[I].IfOp = IsExists;
  // });
  // console.log("-");
  // await Promise.all(Promises);
  // console.log(result);
  res.json(result);
});
app.get("/GetGroups/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log({ id }.id);
    const query = `SELECT * FROM Groups WHERE QuestionsId = ${id}`;
    let data = await SQL(query);
    res.json(data);
  } catch (error) {
    res.json(null);
  }
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
app.get("/GetQuestinsFromQueshennaire/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = `SELECT * FROM Questions WHERE QuestionnaireId = ${id} ORDER BY Seq`;
    let data = await SQL(query);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/Updata", async (req, res) => {
  let body = req.body;
  let UpdateOption = false;
  // console.log(body);
  // console.log("beforQbeforQbeforQbeforQ", beforQ);
  for (const key in body) {
    if (typeof body[key] === "string") {
      body[key] = body[key].replace(/'/g, "''");
    }
  }
  body.StatusId = body.StatusId ? 1 : 0;
  try {
    let nextQuestionId = null;
    // חיפוש מספר הזיהוי של השאלה הבאה, אם קיימת
    if (
      body.NextQuestionDesc &&
      body.NextQuestionDesc !== "שאלה אחרונה" &&
      body.NextQuestionDesc !== "לפי האופציה"
    ) {
      nextQuestionId = body.NextQuestionDesc;
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
      // console.log("nextQuestionId", nextQuestionId);
      if (!isNumeric(nextQuestionId)) {
        const querdinio = `SELECT Id FROM Questions WHERE [Desc] = '${nextQuestionId}'`;
        let id = await SQL(querdinio);
        nextQuestionId = id[0].Id;
      }
      updateQuery += `, NextQuestionId = ${nextQuestionId}`;
      UpdateOption = true;
    } else {
      updateQuery += `, NextQuestionId = NULL`;
    }

    updateQuery += ` WHERE Id = ${body.Id}`;
    // console.log(updateQuery);
    await SQL(updateQuery);
    if (body.NextQuestionDesc !== "לפי האופציה") {
      if (UpdateOption) {
        let queryTue = `UPDATE QuestionsOptions SET NextQuestionId = ${nextQuestionId} WHERE QuestionsId = ${body.Id}`;
        await SQL(queryTue);
      } else {
        let queryTue1 = ` UPDATE QuestionsOptions SET NextQuestionId = NULL WHERE QuestionsId = ${body.Id}`;
        await SQL(queryTue1);
      }
    }
    res.json(true);
  } catch (error) {
    // console.log(error);
    const {
      Id,
      Seq,
      Desc,
      StatusId,
      IsEnd,
      DescQuestionnaire,
      DescDataType,
      NextQuestionDesc,
    } = body;
    const qu = `SELECT Id FROM Questionnaire`;
    let idq = await SQL(qu);
    idq = idq[0].Id;
    const que = `SELECT Id FROM DataTypes`;
    let idD = await SQL(que);
    idD = idD[0].Id;
    const quer = `SELECT Id FROM Questions WHERE [Desc] = '${NextQuestionDesc}'`;
    let idN = await SQL(quer);
    idN = idN[0].Id;
    const q = `SELECT * FROM Questions WHERE Id = ${Id}`;
    let beforQ = await SQL(q);
    beforQ = beforQ[0];
    const S = StatusId ? 1 : 0;
    let Booli =
      beforQ.Id === Id &&
      beforQ.QuestionnaireId === idq &&
      beforQ.DataTypesId === idD &&
      beforQ.Desc === Desc &&
      beforQ.NextQuestionId === idN &&
      beforQ.StatusId === S &&
      beforQ.IsEnd === IsEnd;
    if (Booli) {
      res.json(true);
      return;
    } else {
      res.json(false);
    }
  }
});
app.post("/AddQuestin", async (req, res) => {
  // console.log(req.body);
  try {
    const q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${req.body.NameQ.replace(
      /'/g,
      "''"
    )}'`;
    let IDnameQ = await SQL(q);
    IDnameQ = IDnameQ[0].Id;
    // console.log(IDnameQ);
    const qu = `SELECT Id FROM DataTypes WHERE [Desc] = '${req.body.typeData}'`;
    let IDdataTy = await SQL(qu);
    IDdataTy = IDdataTy[0].Id;
    // console.log(IDdataTy);
    const que = `SELECT MAX([Seq]) AS LastSek FROM Questions WHERE QuestionnaireId = ${IDnameQ}`;
    let lsatSek = await SQL(que);
    lsatSek = lsatSek[0];
    if (!lsatSek) {
      lsatSek = 1;
    } else {
      lsatSek = lsatSek.LastSek + 1;
    }
    // console.log("lsatSek", lsatSek);
    const query = `INSERT INTO Questions (QuestionnaireId,DataTypesId,[Desc],IsEnd,StatusId,[Seq]) VALUES 
    (${IDnameQ},${IDdataTy},'${req.body.DescQ.replace(/'/g, "''")}',
    '${req.body.IsEnd}',${req.body.StatusId},${lsatSek}
    )`;
    await SQL(query);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/UpNextQuestion", async (req, res) => {
  try {
    // console.log(req.body);
    const val = req.body.val;
    const idQ = req.body.id;
    if (val === "ללא שאלה הבאה") {
      let qourtoz = `UPDATE Questions
      SET IsEnd = 1
      WHERE Id = ${idQ}`;
      await SQL(qourtoz);
    } else {
      let qourtoz2 = `UPDATE Questions
      SET IsEnd = 0
      WHERE Id = ${idQ}`;
      await SQL(qourtoz2);
    }
    if (val !== "לפי האופציה" && val !== "ללא שאלה הבאה") {
      let id = val;
      const qu = `UPDATE  Questions
      SET NextQuestionId = ${id}
      WHERE Id = ${idQ}`;
      await SQL(qu);
    } else {
      const qu2 = `UPDATE  Questions
      SET NextQuestionId = NULL
      WHERE Id = ${idQ}`;
      await SQL(qu2);
    }
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/UpNextQuestions", async (req, res) => {
  try {
    const val = req.body.val.replace(/'/g, "''");
    const idQ = req.body.id;
    // console.log({ val, idQ });
    // if (val === "ללא שאלה הבאה") {
    //   let qourtoz = `UPDATE Questions
    //   SET IsEnd = 1
    //   WHERE Id = ${idQ}`;
    //   await SQL(qourtoz);
    // } else {
    //   let qourtoz2 = `UPDATE Questions
    //   SET IsEnd = 0
    //   WHERE Id = ${idQ}`;
    //   await SQL(qourtoz2);
    // }
    // if (val !== "לפי האופציה" && val !== "ללא שאלה הבאה") {
    //   let q = `SELECT Id FROM Questions WHERE [Desc] = '${val}'`;
    //   let data = await SQL(q);
    //   let id = data[0].Id;
    //   const qu = `UPDATE  Questions
    //   SET NextQuestionId = ${id}
    //   WHERE Id = ${idQ}`;
    //   await SQL(qu);
    // } else {
    //   const qu2 = `UPDATE  Questions
    //   SET NextQuestionId = NULL
    //   WHERE Id = ${idQ}`;
    //   await SQL(qu2);
    // }
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.delete("/DeleteQustions/:id", async (req, res) => {
  try {
    let id = req.params.id;
    // console.log(id);
    const q = `DELETE FROM Questions WHERE Id = ${id}`;
    await SQL(q);
    const Quer = `DELETE FROM QuestionsOptions WHERE QuestionsId = ${id}`;
    await SQL(Quer);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/FIndQustinnare", async (req, res) => {
  // console.log(req.body);
  try {
    let query = `SELECT 
    Questions.Id,
    Questions.[Seq],
    Questions.[Desc],
    Questions.StatusId,
    Questions.IsEnd,
    Questionnaire.[Desc] AS DescQuestionnaire,
    Questionnaire.QuestionnaireTypesId,
    DataTypes.[Desc] AS DescDataType
    FROM Questions
    INNER JOIN Questionnaire ON Questionnaire.Id = Questions.QuestionnaireId
    INNER JOIN DataTypes ON DataTypes.Id = Questions.DataTypesId WHERE Questionnaire.Id = '${req.body.val}'`;
    let data = await SQL(query);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.get("/GetQustionsz", async (req, res) => {
  try {
    const q = `SELECT * FROM Questionnaire`;
    let data = await SQL(q);
    res.json(data);
  } catch (error) {
    res.json(null);
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
  // console.log(id);
  try {
    const q = `SELECT 
     QuestionsOptions.[Desc],
     QuestionsOptions.Id, 
     QuestionsOptions.GroupId, 
     QuestionsOptions.NextQuestionId AS NextQuestionId,
     Questions.[Desc] AS Nextques
     
    FROM QuestionsOptions
    LEFT JOIN Questions ON QuestionsOptions.NextQuestionId = Questions.Id
     WHERE QuestionsId = ${id} ORDER BY QuestionsOptions.[Seq]`;
    let result = await SQL(q);
    // console.log(result);
    // console.log(result);
    // const IDS = result.map((e) => e.Id);
    // console.log(IDS);
    // await Promise.all(
    //   IDS.map(async (id) => {
    //     const Q = `SELECT CASE
    //     WHEN EXISTS(
    //       SELECT 1 FROM Score
    //       WHERE ',' + QuestionsAnswersIds + ',' LIKE '%,' + CAST(${id} AS VARCHAR) + ',%'
    //       )
    //     THEN 'true'
    //     ELSE 'false'
    //     END AS IsExists;
    //     `;
    //     let data = await SQL(Q);
    //     let IfO = data[0].IsExists === "true";
    //     // console.log(IfO);
    //     const I = result.findIndex((e) => e.Id === id);
    //     result[I].IfScore = IfO;
    //   })
    // );
    res.json(result);
    // res.json([]);
  } catch (error) {
    console.log(error);
  }
});
app.post("/AddAnswer", async (req, res) => {
  req.body.text = req.body.text.replace(/'/g, "''");
  try {
    const query = `SELECT MAX([Seq]) AS maxSec FROM QuestionsOptions WHERE QuestionsId = ${req.body.id}`;
    let sek = await SQL(query);
    sek = sek[0].maxSec;
    // console.log(sek);
    if (!sek) {
      sek = 1;
    } else {
      sek++;
    }
    const q = `INSERT INTO QuestionsOptions (QuestionsId,[Desc],[Seq]) VALUES (${req.body.id},'${req.body.text}',${sek})`;
    await SQL(q);
    // console.log(Request);
    res.json(true);
  } catch (error) {
    console.log("er", error);
    res.json(false);
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
  // console.log(req.body);
  try {
    const q = `UPDATE  QuestionsOptions 
    SET [Desc] = '${req.body.text.replace(/'/g, "''")}'
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
    const query = `SELECT Id FROM Questionnaire WHERE [Desc] = '${req.body.DescQuestionnaire.replace(
      /'/g,
      "''"
    )}'`;
    let id = await SQL(query);
    id = id[0].Id;
    const query2 = `SELECT * FROM Questions 
    WHERE QuestionnaireId = ${id} AND [Desc] != '${req.body.Desc.replace(
      /'/g,
      "''"
    )}'
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
    // console.log(req.body);
    // const query = `SELECT Id FROM Questions WHERE [Desc] =
    // '${req.body.nextQusions.replace(/'/g, "''")}'`;
    let id;
    if (req.body.nextQusions !== "ללא שאלה הבאה") {
      id = req.body.nextQusions;
    } else {
      id = null;
    }
    // console.log(id);
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
app.post("/addNewQustionsIdSAndOption", async (req, res) => {
  try {
    // console.log(req.body);
    let idQustionsNext;
    if (req.body.nextQusions !== "ללא שאלה הבאה") {
      idQustionsNext = req.body.nextQusions;
      const UpisEnd = `UPDATE Questions
      SET IsEnd = 0
      WHERE Id = ${req.body.IdQuestion}`;
      await SQL(UpisEnd);
    } else {
      idQustionsNext = "NULL";
      const UpisEnd = `UPDATE Questions
      SET IsEnd = 1
      WHERE Id = ${req.body.IdQuestion}`;
      await SQL(UpisEnd);
    }
    // console.log(idQustionsNext);
    const query = `UPDATE Questions
    SET NextQuestionId = ${idQustionsNext}
    WHERE Id = ${req.body.IdQuestion}`;
    // await SQL(query);
    await SQL(query);
    const qurty = `UPDATE QuestionsOptions 
     SET NextQuestionId = ${idQustionsNext}
      WHERE QuestionsId = ${req.body.IdQuestion}`;
    await SQL(qurty);
    res.json(true);
  } catch (error) {
    res.json(null);
  }
});
app.post("/AddnewNextquestionNoOption", async (req, res) => {
  try {
    // console.log(req.body);
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
app.post("/UpdateSeqTheQuestions", async (req, res) => {
  let body = req.body;
  const idQ = body.Idq;
  try {
    const Promises = body.arr.map(async (e, i) => {
      const Q = `UPDATE Questions
      SET Seq = ${e.newSeq} WHERE Id = ${e.id} AND QuestionnaireId = ${idQ}`;
      await SQL(Q);
    });
    await Promise.all(Promises);
    const query = `UPDATE QuestionsOptions
    SET QuestionsOptions.NextQuestionId = NULL
    FROM Questions
    WHERE QuestionsOptions.QuestionsId = Questions.Id AND QuestionnaireId = ${idQ}
    AND QuestionsOptions.NextQuestionId IS NOT NULL
    AND Questions.Seq >= (SELECT Seq FROM Questions WHERE Id = QuestionsOptions.NextQuestionId)`;
    await SQL(query);
    // const Q = `SELECT Seq S FROM Questions WHERE Id = ${body.newI.Id} AND QuestionnaireId = ${idQ}`;
    // let seq = await SQL(Q);
    // if (seq[0]) {
    //   seq = seq[0].S;
    // }
    // const q = `SELECT Id,Seq,[Desc] FROM Questions WHERE Seq < ${seq} AND QuestionnaireId = ${idQ}`;
    // let data = await SQL(q);
    // console.log(data);
    // // data = data.map((obj) => obj.Id);
    // let arr = [];
    // const priomiso = data.map(async (obj) => {
    //   const Q = `SELECT * FROM QuestionsOptions WHERE QuestionsId = ${obj.Id} AND NextQuestionId <= ${id}`;
    //   let data = await SQL(Q);
    //   console.log(data);
    // });
    // await Promise.all(priomiso);
    // console.log(arr);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/updateSek", async (req, res) => {
  try {
    // console.log(req.body);

    const Promises = req.body.arr.map(async (e) => {
      let q = `UPDATE QuestionsOptions
        SET [Seq] = ${e.newSek}
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
// $score
app.post("/AddScore", async (req, res) => {
  try {
    // console.log(req.body);
    const Score = req.body.Score.replace(/'/g, "''");
    const arrIds = req.body.arrIds;
    const QushinnareName = req.body.Qushinnare.replace(/'/g, "''");
    const Q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${QushinnareName}' `;
    let id = await SQL(Q);
    if (id) {
      id = id[0].Id;
    }
    const QueryIf = `SELECT * FROM Score WHERE QuestionnaireId = ${id} AND QuestionsAnswersIds = '${arrIds}'`;
    let Bool = await SQL(QueryIf);
    if (Bool.length === 0) {
      Bool = false;
    } else {
      Bool = true;
    }
    if (!Bool) {
      const query = `INSERT INTO Score (QuestionnaireId,QuestionsAnswersIds,QuestionnaireScore) VALUES (${id},'${arrIds}','${Score}')`;
      await SQL(query);
    } else {
      const QueryUpdate = `UPDATE Score
      SET QuestionnaireScore = '${Score}'
      WHERE QuestionnaireId = ${id} AND QuestionsAnswersIds = '${arrIds}'`;
      await SQL(QueryUpdate);
    }
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
  // console.log(id);
});
app.post("/deleteScore", async (req, res) => {
  // console.log("req.body", req.body);
  try {
    const Score =
      typeof req.body.Score === "string"
        ? req.body.Score.replace(/'/g, "''")
        : req.body.Score;
    const QushinnareName = req.body.Qushinnare.replace(/'/g, "''");
    const arrIds = req.body.arrIds.join();
    const Q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${QushinnareName}' `;
    let id = await SQL(Q);
    if (id) {
      id = id[0].Id;
    }
    // console.log({ Score, arrIds, id });
    const Query = `DELETE FROM Score WHERE QuestionnaireId = ${id} AND QuestionsAnswersIds = '${arrIds}' AND 
    QuestionnaireScore = '${Score}'`;
    await SQL(Query);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.get("/GetScore/:nameQueshenner", async (req, res) => {
  const Q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${req.params.nameQueshenner}' `;
  let id = await SQL(Q);
  if (id.length !== 0) {
    id = id[0].Id;
  }
  const q = `SELECT * FROM Score WHERE QuestionnaireId = ${id}`;
  let data = await SQL(q);
  // console.log(data);
  res.json(data);
});
app.get("/GetAllScore", async (req, res) => {
  try {
    //  const q = `SELECT Id FROM Questionnaire WHERE `

    const query = `SELECT Qu.[Desc] AS NameQ, Qu.Id AS QuId,S.* FROM Score S
    LEFT JOIN Questionnaire Qu
    ON  S.QuestionnaireId = Qu.Id WHERE Qu.[Desc] IS NOT NULL AND Qu.QuestionnaireTypesId != 3 	AND Qu.QuestionnaireTypesId != 4`;
    let data = await SQL(query);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/IfScoreMeTapel", async (req, res) => {
  const { arrIds } = req.body;
  try {
    const QueryIf = `SELECT * FROM Score  WHERE  QuestionsAnswersIds = '${arrIds}'`;
    let Bool = await SQL(QueryIf);
    let Data = Bool;
    // console.log(Bool);
    let score;
    let Ifinyonim;
    if (Data[0]) {
      const scoreId = Data[0].Id;
      const query2 = `SELECT 1 FROM ScoreActions WHERE ScoreTherapistsId = ${scoreId}`;
      let DAtrozino = await SQL(query2);
      Ifinyonim = Boolean(DAtrozino.length);
    }
    if (Bool.length === 0) {
      Bool = false;
      score = "";
    } else {
      Bool = true;
      score = Data[0].QuestionnaireScore;
    }
    // console.log({ Bool, score });
    res.json({ Bool, score, Ifinyonim });
  } catch (error) {
    console.log(error);
    res.json(null);
  }
});
app.get("/GetIdForScore/:NameScore", async (req, res) => {
  try {
    const nameS = req.params.NameScore;
    const query = `SELECT Id FROM Score WHERE QuestionnaireScore = '${nameS}'`;
    let id = await SQL(query);
    if (id[0]) {
      id = id[0].Id;
    }
    // console.log(id);
    res.json(id);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
// score.scoreAction
app.get(
  "/GetScoreActionFromTerapist/:scoreNormal/:scoreTerapist",
  async (req, res) => {
    try {
      const scoreNormal = +req.params.scoreNormal;
      const scoreTerapist = +req.params.scoreTerapist;
      // console.log({ scoreNormal, scoreTerapist });
      const query = `SELECT 
      SA.Id,
      SA.ScoreId,
      SA.ScoreTherapistsId,
      Ex.Id AS valEx,
      Ex.Title AS DescEx,
      Ex.Symbol AS SymbolEx,
      Me.Id AS valMe,
      Me.[Desc] AS DescMe,
      Me.Symbol AS SymbolMe,
      Fe.Id AS valFe,
      Fe.[Desc] AS DescFe,
      Fe.Symbol AS SymbolFe
      FROM ScoreActions SA
      LEFT JOIN Exercises Ex
      ON SA.ExercisesId = Ex.Id
      LEFT JOIN Messages Me
      ON SA.MessagesId = Me.Id 
      LEFT JOIN Features Fe
      ON SA.FeaturesId = Fe.Id
       WHERE ScoreId = ${scoreNormal} AND  ScoreTherapistsId = ${scoreTerapist}`;
      let dataSheyesh = await SQL(query);
      // console.log("🚀 ~ dataSheyesh:", dataSheyesh);
      // *#Sort Data
      let idsEx = dataSheyesh
        .map((e) => {
          return {
            valEx: e.valEx,
          }.valEx;
        })
        .filter((e) => e)
        .join();
      //
      let idsMe = dataSheyesh
        .map((e) => {
          return {
            valMe: e.valMe,
          }.valMe;
        })
        .filter((e) => e)
        .join();

      //
      let idsFe = dataSheyesh
        .map((e) => {
          return {
            valFe: e.valFe,
          }.valFe;
        })
        .filter((e) => e)
        .join();
      objDvarim = { idsEx, idsMe, idsFe };
      for (const key in objDvarim) {
        if (!objDvarim[key]) {
          objDvarim[key] = "0";
        }
      }
      console.log(objDvarim);
      let query2;

      // if (Boolean(dataSheyesh.length)) {
      query2 = `SELECT
       Ex.Id AS valEx,
       Ex.Title AS DescEx,
       Ex.Symbol AS SymbolEx,
       Me.Id AS valMe,
       Me.[Desc] AS DescMe,
       Me.Symbol AS SymbolMe,
       Fe.Id AS valFe,
       Fe.[Desc] AS DescFe,
       Fe.Symbol AS SymbolFe
       FROM ScoreActions SA
       LEFT JOIN Exercises Ex
       ON SA.ExercisesId != Ex.Id
       LEFT JOIN Messages Me
       ON SA.MessagesId != Me.Id
       LEFT JOIN Features Fe
       ON SA.FeaturesId != Fe.Id
        WHERE Ex.Id NOT IN (${objDvarim.idsEx}) OR Me.Id NOT IN (${objDvarim.idsMe}) OR Fe.Id  NOT IN (${objDvarim.idsFe})

        `;
      // } else {
      //   query2 = `SELECT
      //         Ex.Id AS valEx,
      //         Ex.Title AS DescEx,
      //         Ex.Symbol AS SymbolEx,
      //         Me.Id AS valMe,
      //         Me.[Desc] AS DescMe,
      //         Me.Symbol AS SymbolMe,
      //         Fe.Id AS valFe,
      //         Fe.[Desc] AS DescFe,
      //         Fe.Symbol AS SymbolFe
      //         FROM ScoreActions SA
      //         LEFT JOIN Exercises Ex
      //         ON SA.ExercisesId != Ex.Id
      //         LEFT JOIN Messages Me
      //         ON SA.MessagesId != Me.Id
      //         LEFT JOIN Features Fe
      //         ON SA.FeaturesId != Fe.Id`;
      // }
      let dataSheen = await SQL(query2);
      // let dataSheen = [];
      // console.log(dataSheen);

      // console.log(data);
      res.json({ dataSheen, dataSheyesh });
    } catch (error) {
      console.log("errrr:aserr", error);
      res.json(false);
    }
  }
);
app.get("/GetScoreAction/:arrIds/:Q", async (req, res) => {
  try {
    let arrIds = req.params.arrIds === "null" ? null : req.params.arrIds;
    let Qusinnaire = req.params.Q === "null" ? null : req.params.Q;
    // console.log({ arrIds, Qusinnaire });
    let data;
    if (arrIds) {
      const q = `SELECT Id FROM Score WHERE QuestionsAnswersIds = '${arrIds}'`;
      let id = await SQL(q);
      id = id[0].Id;

      const Query = `SELECT 
      E.Title AS ExercisesT,
      F.[Desc] AS DescFeacher,
      M.[Desc] AS DescMes 
      FROM ScoreActions SA 
      LEFT JOIN Exercises E ON E.Id = SA.ExercisesId
      LEFT JOIN Features F ON F.Id = SA.FeaturesId
      LEFT JOIN Messages M ON M.Id = SA.MessagesId
      WHERE SA.ScoreId = ${id} 
      `;
      data = await SQL(Query);
    } else if (Qusinnaire) {
      const q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${Qusinnaire}'`;
      let id = await SQL(q);
      id = id[0].Id;
      // console.log(id);
      "QuestionnaireId", "QuestionsAnswersIds", "QuestionnaireScore";
      const qu = `SELECT Id FROM Score WHERE QuestionnaireId = ${id} AND QuestionsAnswersIds IS NULL AND QuestionnaireScore IS NULL`;
      let idS = await SQL(qu);
      idS = idS[0].Id;
      // console.log("idS", idS);

      const Query = `SELECT 
      E.Title AS ExercisesT,
      F.[Desc] AS DescFeacher,
      M.[Desc] AS DescMes 
      FROM ScoreActions SA 
      LEFT JOIN Exercises E ON E.Id = SA.ExercisesId
      LEFT JOIN Features F ON F.Id = SA.FeaturesId
      LEFT JOIN Messages M ON M.Id = SA.MessagesId
      WHERE SA.ScoreId = ${idS} 
      `;
      data = await SQL(Query);
      // console.log(data);
      // console.log("haya");
    }
    let Newdata = [];
    let exercisesTSet = new Set(
      data.map((item) => item.ExercisesT).filter((item) => item !== null)
    );
    let descFeacherSet = new Set(
      data.map((item) => item.DescFeacher).filter((item) => item !== null)
    );
    let descMesSet = new Set(
      data.map((item) => item.DescMes).filter((item) => item !== null)
    );
    for (
      let i = 0;
      i < Math.max(exercisesTSet.size, descFeacherSet.size, descMesSet.size);
      i++
    ) {
      Newdata.push({
        ExercisesT: Array.from(exercisesTSet)[i] || null,
        DescFeacher: Array.from(descFeacherSet)[i] || null,
        DescMes: Array.from(descMesSet)[i] || null,
      });
    }
    res.json(Newdata);
  } catch (error) {
    console.log("errrror", error);
    res.json(false);
  }
});
app.post("/GetDataForTableScoreAction", async (req, res) => {
  if (!Array.isArray(req.body)) {
    if (!Object.keys(req.body).length) {
      req.body = [];
    }
  }
  // console.log("req.bodyreq.bodyreq.body", req.body);
  req.body.forEach((el) => {
    for (const key in el) {
      if (typeof el[key] === "string") {
        el[key] = el[key].replace(/'/g, "''");
      }
    }
  });
  try {
    let obj = {};
    let itemsE = req.body.map((e) => `'${e.ExercisesT}'`).filter((e) => e);
    itemsE = itemsE.join(",");
    let Q = `SELECT * FROM Exercises`;
    if (req.body.length > 0) {
      Q += ` WHERE Title NOT IN (${itemsE})`;
    }
    // const Q = `SELECT Title,Id FROM Exercises WHERE Title NOT IN (${itemsE}) `;
    let Exercises = await SQL(Q);
    // console.log(Exercises);
    obj.Exercises = Exercises;
    //
    //
    let itemsF = req.body.map((e) => `'${e.DescFeacher}'`).filter((e) => e);
    itemsF = itemsF.join(",");
    let QU = `SELECT * FROM Features `;

    if (req.body.length > 0) {
      QU += ` WHERE [Desc] NOT IN (${itemsF})`;
    }
    let DescFeacher = await SQL(QU);
    obj.DescFeacher = DescFeacher;
    //
    //
    let itemsM = req.body.map((e) => `'${e.DescMes}'`).filter((e) => e);
    itemsM = itemsM.join(",");
    let QUE = `SELECT * FROM Messages `;

    if (req.body.length > 0) {
      QUE += `WHERE [Desc] NOT IN (${itemsM})`;
    }
    let DescMes = await SQL(QUE);
    obj.DescMes = DescMes;
    // console.log(obj);
    res.json(obj);
  } catch (error) {
    console.log("error", error);
    res.json(false);
  }
});
app.post("/AddActionScore", async (req, res) => {
  // console.log(req.body);
  try {
    let arrIds = req.body.arrIDS;
    let qus = req.body.Q;
    let id;
    if (arrIds) {
      const q = `SELECT Id FROM Score WHERE QuestionsAnswersIds = '${arrIds}'`;
      id = await SQL(q);
      id = id[0].Id;
    } else if (qus) {
      const q = `SELECT Id FROM Questionnaire WHERE [Desc] = '${qus}'`;
      let idQ = await SQL(q);
      idQ = idQ[0].Id;
      // console.log(id);
      const qu = `SELECT Id FROM Score WHERE QuestionnaireId = ${idQ} AND QuestionsAnswersIds IS NULL AND QuestionnaireScore IS NULL`;
      id = await SQL(qu);
      id = id[0].Id;
    }
    let Colomn = "";
    const val = req.body.val;
    if (req.body.Colomn === "Exercises") {
      Colomn = "ExercisesId";
    }
    if (req.body.Colomn === "DescMes") {
      Colomn = "MessagesId";
    }
    if (req.body.Colomn === "DescFeacher") {
      Colomn = "FeaturesId";
    }
    // console.log(Colomn, val);
    const Q = `INSERT INTO ScoreActions (${Colomn},ScoreId) VALUES ('${val}',${id})`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.delete("/DeleteScoreAction", async (req, res) => {
  try {
    //.replace(/'/g, "''")
    // console.log("req.query", req.query);
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key].replace(/'/g, "''");
      }
    }
    let arrIds = req.query.arrIdso;
    let ques = req.query.Q;
    let Desco = req.query.Desco;
    let Colomn = req.query.Colomn;
    let boolenQues = ques !== "null";
    // console.log({ arrIds, ques, Desco, Colomn });
    let q;
    if (boolenQues) {
      const qu = `SELECT Id FROM Questionnaire WHERE [Desc] = '${ques}'`;
      let idQ = await SQL(qu);
      idQ = idQ[0].Id;
      q = `SELECT Id FROM Score WHERE QuestionnaireId = ${idQ}`;
    } else if (arrIds) {
      q = `SELECT Id FROM Score WHERE QuestionsAnswersIds = '${arrIds}'`;
    }
    let id = await SQL(q);
    id = id[0].Id;
    let TableNAme = "";
    let haze = "";
    if (Colomn === "FeaturesId") {
      TableNAme = "Features";
      haze = "[Desc]";
    } else if (Colomn === "ExercisesId") {
      TableNAme = "Exercises";
      haze = "Title";
    } else if (Colomn === "MessagesId") {
      TableNAme = "Messages";
      haze = "[Desc]";
    }
    const qu = `SELECT Id FROM ${TableNAme} WHERE ${haze} = '${Desco}'`;
    let ID = await SQL(qu);
    if (ID) {
      ID = ID[0].Id;
    }
    const query = `UPDATE ScoreActions
    SET ${Colomn} = NULL
    WHERE ScoreId = ${id} AND ${Colomn} = ${ID}`;
    await SQL(query);
    res.json(true);
  } catch (error) {
    console.log("erOr", error);
    res.json(false);
  }
});
app.post("/AddScoreActionTerapist", async (req, res) => {
  // console.log(req.body);
  try {
    const { ScoreTerapist, ScoreId, val, Ma } = req.body;
    let column;
    switch (Ma) {
      case 0:
        column = "ExercisesId";
        break;

      case 1:
        column = "MessagesId";
        break;

      case 2:
        column = "FeaturesId";
        break;
    }

    const query = `INSERT INTO ScoreActions (ScoreId,ScoreTherapistsId,${column},StatusId)
    VALUES (${ScoreId},${ScoreTerapist},${val},1)`;
    await SQL(query);
    // console.log(query);
    res.json(true);
  } catch (error) {
    // console.log("errorrr", error);
    res.json(false);
  }
});
app.post("/DeleteScoreActionTerapist", async (req, res) => {
  // console.log(req.body);
  const { ScoreId, ScoreTerapist, stringos, column } = req.body;
  //
  try {
    let Table;
    let key;
    switch (column) {
      case "ExercisesId":
        Table = "Exercises";
        key = "Title";
        break;
      case "FeaturesId":
        Table = "Features";
        key = "[Desc]";
        break;
      case "MessagesId":
        Table = "Messages";
        key = "[Desc]";
        break;
    }

    //
    const queryGetId = `SELECT Id FROM ${Table} WHERE ${key} = '${stringos}'`;
    let id = await SQL(queryGetId);
    id = id[0].Id;
    // console.log(id);

    const query = `DELETE ScoreActions
     WHERE ScoreId = ${ScoreId} AND ScoreTherapistsId = ${ScoreTerapist} AND ${column} = ${id}
    `;
    await SQL(query);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
// $ messages
app.get("/GetMessages", async (req, res) => {
  const Q = `SELECT * FROM Messages`;
  let data = await SQL(Q);
  res.json(data);
});
app.post("/UpdateMessage", async (req, res) => {
  console.log(req.body);
  try {
    const Desc = req.body.Desc.replace(/'/g, "''");
    const Symbol = req.body.Symbol.replace(/'/g, "''");
    const Content = req.body.Content.replace(/'/g, "''");
    const StatusId = req.body.StatusId ? 1 : 0;
    const id = req.body.ID;
    // console.log({ Desc, Symbol, StatusId });
    const Query = `UPDATE Messages
    SET [Desc] = '${Desc}',Symbol = '${Symbol}',StatusId = ${StatusId},Content = '${Content}'
    WHERE Id = ${id}`;
    await SQL(Query);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.delete("/DeleteMes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const Q = `DELETE FROM Messages WHERE Id = ${id}`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/AddMes", async (req, res) => {
  // console.log(req.body);
  let status = req.body.status ? 1 : 0;
  let DescMes = req.body.DescMes.replace(/'/g, "''");
  let SymbolMes = req.body.SymbolMes.replace(/'/g, "''");
  let Content = req.body.Content.replace(/'/g, "''");
  try {
    const query = `INSERT INTO Messages ([Desc],Symbol,StatusId,Content) VALUES ('${DescMes}','${SymbolMes}',${status},'${Content}')`;
    await SQL(query);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/serchMes", async (req, res) => {
  // console.log(req.body);
  let val = req.body.val;
  const Colomn = req.body.ClumnSerch;

  if (Colomn === "StatusId" || Colomn === "all") {
    if (val === "פעיל") {
      val = 1;
    }
    if (val === "לא פעיל") {
      val = 0;
    }
  }
  let Q = "";
  if (Colomn === "all") {
    Q = `SELECT * FROM Messages WHERE Symbol LIKE '${val}%' OR  [Desc] LIKE '${val}%' OR  StatusId LIKE '${val}%'`;
  } else {
    Q = `SELECT * FROM Messages WHERE ${Colomn} LIKE '${val}%'`;
  }
  let data = await SQL(Q);
  // console.log(data);
  res.json(data);
});
// $ Feachers :
app.get("/GetFeatures", async (req, res) => {
  try {
    const q = `SELECT * FROM Features`;
    let data = await SQL(q);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/serchFeach", async (req, res) => {
  // console.log(req.body);
  const val = req.body.val;
  const Clumn = req.body.ClumnSerch;
  let Q;
  if (Clumn === "all") {
    if (!isNumeric(val)) {
      Q = `SELECT * FROM Features WHERE Symbol LIKE '${val}%'  OR [Desc] LIKE '${val}%'`;
    } else {
      Q = `SELECT * FROM Features WHERE  Number = ${val}`;
    }
  } else {
    Q = `SELECT * FROM Features WHERE ${Clumn} LIKE '${val}%'`;
  }
  let data = await SQL(Q);
  // console.log(data);
  res.json(data);
});
app.post("/Addfeacher", async (req, res) => {
  // console.log(req.body);
  try {
    const Q = `INSERT INTO Features (Symbol,Number,[Desc]) VALUES ('${req.body.Symbol.replace(
      /'/g,
      "''"
    )}',${req.body.number},'${req.body.Name.replace(/'/g, "''")}')`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.delete("/DeleteFeacher/:id", async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  try {
    const Q = `DELETE FROM Features WHERE Id = ${id}`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    res.json(true);
  }
});
app.post("/UpFeacher", async (req, res) => {
  // console.log(req.body);
  try {
    const id = req.body.id;
    const Name = req.body.row.Name.replace(/'/g, "''");
    const Symbol = req.body.row.Symbol.replace(/'/g, "''");
    const number = req.body.row.number;
    const Q = `UPDATE Features
    SET Symbol = '${Symbol}',Number= ${number},[Desc] = '${Name}'
    WHERE Id = ${id}`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
// $ Exercises:
app.get("/GetExercises", async (req, res) => {
  try {
    const q = `SELECT Exercises.* ,ExercisesCategories.[Name] AS NameCategory FROM 
    Exercises LEFT JOIN  ExercisesCategories ON ExercisesCategories.Id = Exercises.ExercisesCategoriesId
    `;
    let data = await SQL(q);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/serchExercises", async (req, res) => {
  // console.log(req.body);
  try {
    const col = req.body.ClumnSerch;
    let val = req.body.val;
    let Q;
    if (col === "all") {
      Q = `SELECT Exercises.* ,ExercisesCategories.[Name] AS NameCategory FROM 
      Exercises LEFT JOIN  ExercisesCategories ON ExercisesCategories.Id = Exercises.ExercisesCategoriesId
      WHERE ExercisesCategories.[Name] LIKE '${val}%' OR Exercises.About LIKE '${val}%' OR Exercises.StatusId LIKE '${val}'
      OR  Exercises.Symbol LIKE '${val}%' OR Exercises.Title LIKE '${val}%'`;
    } else {
      Q = `SELECT Exercises.* ,ExercisesCategories.[Name] AS NameCategory FROM 
     Exercises LEFT JOIN  ExercisesCategories ON ExercisesCategories.Id = Exercises.ExercisesCategoriesId
     WHERE ${col} LIKE '${val}%'
      `;
    }
    let data = await SQL(Q);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.get("/GetCategiz", async (req, res) => {
  try {
    const Q = `SELECT * FROM ExercisesCategories`;
    let data = await SQL(Q);
    // console.log(data);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/AddNewExires", async (req, res) => {
  // console.log(req.body);
  try {
    const Title = req.body.Title.replace(/'/g, "''");
    const Symbol = req.body.Symbol.replace(/'/g, "''");
    const descrip = req.body.descrip.replace(/'/g, "''");
    const categityId = req.body.categityId;
    const stuts = req.body.stuts ? 1 : 0;
    const link = req.body.link.replace(/'/g, "''");
    // console.log({ Title, Symbol, descrip, categityId, stuts, link });
    const Q = `INSERT INTO Exercises (ExercisesCategoriesId,Symbol,Link,Title,About,StatusId)
    VALUES (${categityId},'${Symbol}','${link}','${Title}','${descrip}',${stuts})`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.delete("/delEx/:id/:nameFile/:floader", async (req, res) => {
  try {
    const floader = req.params.floader;
    const id = req.params.id;
    const nameFile = req.params.nameFile;
    const query = `DELETE FROM Exercises WHERE Id = ${id}`;
    await SQL(query);
    if (nameFile !== "none") {
      deleteFileInFolder(floader, nameFile);
    }
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/UpdateEx", async (req, res) => {
  // console.log(req.body);
  try {
    const id = req.body.id;
    const Title = req.body.Title.replace(/'/g, "''");
    const Symbol = req.body.Symbol.replace(/'/g, "''");
    const descrip = req.body.descrip.replace(/'/g, "''");
    const categityId = req.body.categityId;
    const stuts = req.body.stuts ? 1 : 0;
    const link = req.body.link.replace(/'/g, "''");
    // console.log({
    //   All: { id, Title, Symbol, descrip, categityId, stuts, link },
    // });
    const query = `UPDATE Exercises
SET ExercisesCategoriesId = ${categityId} ,Symbol = '${Symbol}'
,Link = '${link}',Title = '${Title}',About = '${descrip}',
StatusId = ${stuts} WHERE Id = ${id}`;
    await SQL(query);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.delete("/deleFile/:name/:f", async (req, res) => {
  // console.log("sdfsdfs");
  try {
    // console.log(req.params.name);
    // console.log(req.params.f);
    if (req.params.name !== "none") {
      deleteFileInFolder(req.params.f, req.params.name);
    }
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});

//Exercises.Category
app.post("/AddCategory", async (req, res) => {
  try {
    let val = req.body.val.replace(/'/g, "''");
    // console.log(val);
    const q = `INSERT INTO ExercisesCategories (Name,StatusId) VALUES ('${val}',1)`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.post("/EditCategory", async (req, res) => {
  try {
    const id = req.body.id;
    const val = req.body.val.replace(/'/g, "''");
    const q = `UPDATE ExercisesCategories
             SET Name = '${val}' WHERE Id = ${id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.delete("/DeeteCategory/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const q = `DELETE FROM ExercisesCategories WHERE Id = ${id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
// $ Users :
app.get("/GetTypeUser", async (req, res) => {
  try {
    const query = `SELECT * FROM UsersFlow`;
    let data = await SQL(query);
    // data = data.map((e) => e);
    // console.log(data);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.get("/GetUsers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const Q = `SELECT
    UST.Id,
    US.Id AS UserId,
    US.[Desc] AS UserDesc,
    US.Symbol AS SymbolUser,
    UST.Seq,
    UST.StatusId,
    Ques.[Desc] AS DescQuestion,
    Ques.Id AS QushinnareId
    FROM UsersFlow US
    LEFT JOIN UsersFlowSteps UST ON US.Id = UST.UsersFlowId
    LEFT JOIN Questionnaire Ques ON Ques.Id = UST.QuestionnaireId WHERE US.Id = ${id}  ORDER BY   UST.Seq`;
    let data = await SQL(Q);
    // console.log(data);
    // let data = [];
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/UpdateSeqUserz", async (req, res) => {
  // console.log(req.body);
  try {
    const { arr, UserId } = req.body;
    // console.log(UserId);
    const Promises = arr.map(async (e) => {
      // console.log(e);
      const query = `UPDATE UsersFlowSteps
      SET Seq = ${e.newSeq}
      WHERE Id = ${e.id} AND UsersFlowId = ${UserId}`;
      await SQL(query);
    });
    await Promise.all(Promises);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.get("/GetAlldataTheUserFlow", async (req, res) => {
  let objData = {};
  try {
    const q = `SELECT * FROM UsersFlow`;
    const qu = `SELECT Id,[Desc],Symbol FROM Questionnaire`;
    objData.UsersFlow = await SQL(q);
    objData.Questionnaire = await SQL(qu);
    res.json(objData);
  } catch (error) {
    res.json(false);
  }
});
app.put("/EditUserFlowStep", async (req, res) => {
  try {
    let { StatusId, TYpeUser, Quesinnaire, id } = req.body;
    StatusId = StatusId ? 1 : 0;
    const Q = `UPDATE UsersFlowSteps
    SET UsersFlowId = ${TYpeUser},QuestionnaireId = ${Quesinnaire},StatusId = ${StatusId} WHERE Id = ${id}`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/AddUserFlow", async (req, res) => {
  // console.log(req.body);
  try {
    const { Desc, Symbol, stat } = req.body;
    const Q = `INSERT INTO UsersFlow (Symbol,[Desc],StatusId)
    VALUES ('${Symbol}','${Desc}',${stat})`;
    await SQL(Q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.post("/AddUserFlowStep", async (req, res) => {
  // console.log(req.body);
  try {
    let { StatusId, TYpeUser, Quesinnaire } = req.body;
    StatusId = StatusId ? 1 : 0;
    const qGetMax = `SELECT MAX(Seq) AS Maxseq FROM UsersFlowSteps WHERE UsersFlowId = ${TYpeUser}`;
    let maxSeq = await SQL(qGetMax);
    maxSeq = maxSeq[0].Maxseq;
    maxSeq++;
    // console.log(maxSeq);
    const query = `INSERT INTO UsersFlowSteps (UsersFlowId,QuestionnaireId,Seq,StatusId)
    VALUES (${TYpeUser},${Quesinnaire},${maxSeq},${StatusId})`;
    await SQL(query);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.delete("/DelUserFlow/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const q = `DELETE UsersFlow WHERE Id = ${id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
app.put("/UpdateStatUserFlow", async (req, res) => {
  // console.log(req.body);

  try {
    const { id, newstat } = req.body;
    const q = `UPDATE UsersFlow  SET StatusId = ${newstat} WHERE Id = ${id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.put("/PutOfUserFlow", async (req, res) => {
  try {
    let { Desc, Symbol, id } = req.body;
    Desc = Desc.replace(/'/g, "''");
    Symbol = Symbol.replace(/'/g, "''");
    const query = `UPDATE UsersFlow 
  SET [Desc] = '${Desc}',Symbol = '${Symbol}' WHERE Id = ${id} `;
    await SQL(query);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
});
app.delete("/DeleteProtokol/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const q = `DELETE UsersFlowSteps WHERE Id = ${id}`;
    await SQL(q);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});
//
app.get("/GETregisterCodes", async (req, res) => {
  // console.log("haya");
  try {
    const query = `SELECT 
    S.Id IdScore,
    R.Id IdR,
    G.Name NameGender,
    R.GendersId,
    R.StartYear,
    R.EndYear,
    R.Score
    
    FROM Score  S
    LEFT JOIN RegisterCodes R
    LEFT JOIN Genders G
    ON R.GendersId = G.Id
    ON R.Score = S.QuestionsAnswersIds WHERE R.Id IS NOT NULL AND R.StartYear IS NOT NULL AND R.EndYear IS NOT NULL`;
    let data = await SQL(query);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
// $ Groups Of Questions:
app.post("/AddGroups", async (req, res) => {
  try {
    const { text, id } = req.body;
    const query = `INSERT INTO Groups (QuestionsId,Name) VALUES (${id},'${text}')`;
    await SQL(query);
    let quertinio = `SELECT * FROM Groups`;
    const data = await SQL(quertinio);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.delete("/DeleteGroup/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = `DELETE FROM Groups WHERE Id = ${id}`;
    await SQL(query);
    let quertinio = `SELECT * FROM Groups`;
    const data = await SQL(quertinio);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.put("/UpdateGroup", async (req, res) => {
  // console.log(req.body);
  try {
    const { text, id } = req.body;
    const query = `UPDATE Groups
    SET Name = '${text}'
    WHERE Id = ${id}`;
    await SQL(query);
    let quertinio = `SELECT * FROM Groups`;
    const data = await SQL(quertinio);
    res.json(data);
  } catch (error) {
    res.json(false);
  }
});
app.post("/AddGroupFromOption", async (req, res) => {
  const { IdGroup, id } = req.body;
  console.log(req.body);
  const query = `UPDATE QuestionsOptions
  SET GroupId = '${IdGroup}'
  WHERE Id = ${id}`;
  await SQL(query);
});
//
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
