const {Client} = require('pg'); // npm install pg

const db = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'alexkit3',
    database: 'leti',
    port: 5432
});

db.connect();

db.query('SELECT * FROM zoo', (err, data) => {
    if (err)
        throw new Error(err);
    //console.log(data.rows, err);
    rows = data.rows;

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

    db.end();
});
