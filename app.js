// работа с базой данных (через модуль для синхр. работы с MySQL, который может быть усталовлен командой: npm install sync-mysql)
// const mysql = require("mysql2");
const http = require("http");
var fs = require("fs");
var qs = require("querystring");

const hostname = "127.0.0.1";
const port = 3000;

const allBD = ["sector", "position", "objects", "naturalobjects", "linktable"];

const Mysql = require("sync-mysql"); // npm install sync-mysql
const connection = new Mysql({
  host: "localhost",
  port: 3306, // Указываем порт отдельно
  user: "root",
  password: "",
  database: "lab2v2",
});

// // обработка параметров из формы.

function reqPost(request, response) {
  let body = ""; // Инициализируем body для хранения данных запроса

  // Получаем данные запроса
  request.on("data", function (data) {
    body += data; // Сохраняем части данных
  });

  // Когда все данные получены
  request.on("end", function () {
    // Если запрос по адресу /add
    if (request.method === "POST" && request.url === "/add") {
      console.log("add");
      let post = qs.parse(body);
      let sInsert =
        "INSERT INTO `Position` (earth_position, moon_position, sun_position) VALUES (?, ?, ?)";
      connection.query(
        sInsert,
        [post["earth_position"], post["moon_position"], post["sun_position"]],
        function (error, results) {
          if (error) {
            console.error(error);
            response.writeHead(500, { "Content-Type": "text/plain" });
            return response.end("Database error");
          }

          response.writeHead(200, { "Content-Type": "text/plain" });
          return response.end("Data added successfully");
        }
      );
    } else if (request.method === "POST" && request.url === "/delete") {
      console.log("delete");
      let post = qs.parse(body);
      const PositionsDelete = "DELETE FROM `Position` WHERE id = ?";
      connection.query(
        PositionsDelete,
        [post["id"]],
        function (error, results) {
          if (error) {
            console.error(error);
            return response.end("Database error");
          }
          return response.end("Data deleted successfully");
        }
      );
    } else if (request.method === "POST" && request.url === "/update") {
      console.log("update");
      let post = qs.parse(body);
      const PositionsUpdate =
        "UPDATE Sector SET light_intensity = ?, foreign_objects = ? WHERE id = ?";
      connection.query(
        PositionsUpdate,
        [post["light_intensity"], post["foreign_objects"], post["id"]],
        function (error, results) {
          if (error) {
            console.error(error);
            return response.end("Database error");
          }
          return response.end("Data updated successfully");
        }
      );
    } else {
      // Если не POST-запрос или неправильный URL

      return response.end("Not Found");
    }
  });
}

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

function ViewJoinTables(res, table1, table2) {
  let joinTablesQuery = "CALL join_tables(?, ?)";

  let results = connection.query(joinTablesQuery, [table1, table2]);

  const rows = results[0];
  if (rows.length > 0) {
    const columns = Object.keys(rows[0]);

    res.write("<table><tr>");
    for (let column of columns) {
      res.write("<th>" + column + "</th>");
    }
    res.write("</tr>");

    rows.forEach((row) => {
      res.write("<tr>");
      columns.forEach((column) => {
        res.write("<td>" + row[column] + "</td>");
      });
      res.write("</tr>");
    });
  }

  res.write("</table>");
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
    if (array[i].trim() === "@join") {
      const urlParts = new URL(req.url, `http://${req.headers.host}`);
      const table1 = urlParts.searchParams.get("table1") || "linktable";
      const table2 = urlParts.searchParams.get("table2") || "position";
      ViewJoinTables(res, table1, table2);
    }
    if (array[i].trim() == "@tr") ViewSelect(res);
    if (array[i].trim() === "@ver") ViewVer(res); // Вставка версии базы данных
  }
  res.end();
  console.log("1 User Done.");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
