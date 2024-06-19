// пример работает через модуль sync-mysql независимо от количества столбцов.
// работа с базой данных (через модуль для синхр. работы с MySQL, который должен быть усталовлен командой: npm install sync-mysql)
const Mysql = require('sync-mysql'); // npm install sync-mysql
const connection = new Mysql({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
const TABLE_NAME = 'myarttable';
const HOSTNAME = '127.0.0.1';
const PORT = 3002;

const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const http = require('http');

// создание ответа в браузер, на случай подключения.
const server = http.createServer((req, res) => {
	reqPost(req, res);
	console.log('Loading...');
	res.statusCode = 200;
	// чтение шаблона в каталоге со скриптом.
	const filePath = path.join(__dirname, '../select.html');
	var array = fs.readFileSync(filePath).toString().split("\n");
	console.log(filePath);
	for(i in array) {
		// подстановка.
		if ((array[i].trim() != '@tr') && (array[i].trim() != '@ver')) res.write(array[i]);
		if (array[i].trim() == '@tr') ViewSelect(res);
		if (array[i].trim() == '@ver') ViewVer(res);
	}
	res.end();
	console.log('1 User Done.');
});

// запуск сервера, ожидание подключений из браузера.
server.listen(PORT, HOSTNAME, () => {console.log(`Server running at http://${HOSTNAME}:${PORT}/`);});

// обработка параметров из формы.
function reqPost(request, response) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {body += data;});
        request.on('end', function () {
			// формирование INSERT ...
			const columns = connection.query(`SHOW COLUMNS FROM ${TABLE_NAME}`);
            const cols = columns.map((col) => col.Field).join(',');
			var post = qs.parse(body);
            const values = columns.map((_, i) => `"${post[`col${i}`]}"`).join(',');
            var sInsert = `INSERT INTO ${TABLE_NAME} (${cols}) VALUES (${values})`;
			var results = connection.query(sInsert);
            console.log('Done. Hint: ' + sInsert);
        });
		response.setHeader('Refresh', `0;url=http://${HOSTNAME}:${PORT}`);
    }
}

// выгрузка массива данных.
function ViewSelect(res) {
    const query = `SELECT * FROM ${TABLE_NAME} WHERE id>14 ORDER BY id DESC`;
    const results = connection.query(query);

    res.write('<tr>');
    for (let key in results[0])
        res.write('<td>' + key + '</td>');
    res.write('</tr>');

    for (let row of results) {
        res.write('<tr>');
        for (let key in row)
            res.write('<td>' + row[key] + '</td>');
        res.write('</tr>');
    }
}
function ViewVer(res) {
	var results = connection.query('SELECT VERSION() AS ver');
	res.write(results[0].ver);
}