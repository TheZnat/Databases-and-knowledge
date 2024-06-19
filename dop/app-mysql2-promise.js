const mysql = require('mysql2/promise'); // npm install mysql2
const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const http = require('http');

const TABLE_NAME = 'myarttable';
const HOSTNAME = '127.0.0.1';
const PORT = 3001;

main(); // точка входа в код.
async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test',
        password: '',
    });

    const version = (await connection.query('SELECT VERSION() AS ver'))[0][0].ver;
    const columns = (await connection.query(`SHOW COLUMNS FROM ${TABLE_NAME}`))[0];

    // обработка параметров из формы.
    async function reqPost(request, response) {
        if (request.method == 'POST') {
            var body = '';
            request.on('data', function (data) {body += data;});
            request.on('end', async function () {
				// формирование запроса INSERT ...
                var post = qs.parse(body);
                const cols = columns.map((col) => col.Field).join(',');
                const values = columns.map((_, i) => `"${post[`col${i}`]}"`).join(',');
                var sInsert = `INSERT INTO ${TABLE_NAME} (${cols}) VALUES (${values})`;
                var results = await connection.query(sInsert);
                console.log('Done. Hint: ' + sInsert);
            });
			response.setHeader('Refresh', `0;url=http://${HOSTNAME}:${PORT}`);
        }
    }

    // выгрузка массива данных.
    async function ViewSelect(res) {
        res.write('<tr>');
        for (let i = 0; i < columns.length; i++)
            res.write('<td>' + columns[i].Field + '</td>');
        res.write('</tr>');

        const data = (await connection.query(`SELECT * FROM ${TABLE_NAME} ORDER BY id DESC`))[0];
        for (let i = 0; i < data.length; i++)
            res.write(`<tr>${Object.entries(data[i]).map(([key, value]) => `<td>${value}</td>`).join('')}</tr>`);
    }

    async function ViewVer(res) {
        res.write(version);
    }

    // создание ответа в браузер, на случай подключения.
    const server = http.createServer(async (req, res) => {
        reqPost(req, res);
        console.log('Loading...');
        res.statusCode = 200;
        // чтение шаблона в каталоге со скриптом.
		const filePath = path.join(__dirname, '../select.html');
        var array = fs.readFileSync(filePath).toString().split('\n');
        console.log(filePath);

        for (i in array) {
            const word = array[i].trim();

            if (word === '@tr') {
                await ViewSelect(res);
                continue;
            }
            if (word === '@ver') {
                await ViewVer(res);
                continue;
            }

            res.write(array[i]);
        }
        res.end();
        console.log('1 User Done.');
    });

    // запуск сервера, ожидание подключений из браузера.
    server.listen(PORT, HOSTNAME, () => {console.log(`Server running at http://${HOSTNAME}:${PORT}/`);});
}