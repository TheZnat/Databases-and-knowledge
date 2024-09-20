// работа с базой данных (через модуль для синхр. работы с MySQL, который может быть усталовлен командой: npm install sync-mysql)
// const mysql = require("mysql2");
const http = require("http");
var fs = require("fs");
var qs = require("querystring");

const hostname = "127.0.0.1";
const port = 3000;

const allBD = ["individuals", "borrowers", "credits", "loans"];

const Mysql = require("sync-mysql"); // npm install sync-mysql
const connection = new Mysql({
  host: "localhost",
  port: 3306, // Указываем порт отдельно
  user: "root",
  password: "",
  database: "lab1",
});

// // обработка параметров из формы.

function reqPost(request, response) {
  if (request.method == "POST") {
    var body = "";

    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      var post = qs.parse(body);
      var sInsert =
        'INSERT INTO borrowers (inn, entity_type, address, total_amount, conditions, legal_notes, contract_list) VALUES ("' +
        post["inn"] +
        '","' +
        post["entity_type"] +
        '","' +
        post["address"] +
        '","' +
        post["total_amount"] +
        '","' +
        post["conditions"] +
        '","' +
        post["legal_notes"] +
        '","' +
        post["contract_list"] +
        '")';
      var results = connection.query(sInsert);
      console.log("Done. Hin t: " + sInsert);
    });
  }
}

// const allBD = ['individuals', "borrowers", "credits", "loans"]

function ViewSelect(res) {
  for (let dbtable of allBD) {
    let query = `SELECT * FROM ${dbtable}`;
    let results = connection.query(query);
    res.write(`<p>${dbtable}</p>`);

    res.write("<table>");

    res.write("<tr>");
    for (let key in results[0]) {
      res.write("<td>" + key + "</td>");
    }
    res.write("</tr>");

    for (let row of results) {
      res.write("<tr>");
      for (let key in row) {
        res.write("<td>" + row[key] + "</td>");
      }
      res.write("</tr>");
    }
    res.write("</table>");
    res.write("<br>");
  }
}

function ViewVer(res) {
  try {
    let results = connection.query("SELECT VERSION() AS ver");
    res.write(results[0].ver);
  } catch (err) {
    console.error("Ошибка выполнения запроса:", err);
  }
}

// создание ответа в браузер, на случай подключения.
const server = http.createServer((req, res) => {
  reqPost(req, res);
  console.log("Loading...");

  res.statusCode = 200;

  // чтение шаблона в каталоге со скриптом.

  var array = fs
    .readFileSync(__dirname + "/select.html")
    .toString()
    .split("\n");
  console.log(__dirname + "/select.html");
  for (i in array) {
    // подстановка.
    if (array[i].trim() != "@tr" && array[i].trim() != "@ver")
      res.write(array[i]);
    if (array[i].trim() == "@tr") ViewSelect(res);
    if (array[i].trim() === "@ver") ViewVer(res); // Вставка версии базы данных
  }
  res.end();
  console.log("1 User Done.");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
