var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database : 'test'
});

connection.connect();

connection.query('SELECT * FROM myarttable', function (
    err,
    rows,
    fields
) {
    if (err) throw err;
    console.log('<html><head></head><table>');

    console.log('<tr>');
    for (let key in rows[0])
        console.log('<th>' + key + '</th>');
    console.log('</tr>');

    for (let row of rows) {
        console.log('<tr>');
        for (let key in row)
            console.log('<td>' + row[key] + '</td>');
        console.log('</tr>');
    }

    console.log('</table></html>');

});

connection.end();
