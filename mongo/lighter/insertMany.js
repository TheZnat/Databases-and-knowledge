const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

const users = [{name: "Vasily Petrov", age: 43}, {name: "Nikita Semenov", age: 41}, {name: "Ivan Lifanov", age: 42}];

async function run() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("usersdb");
        const collection = db.collection("users");
        const results = await collection.insertMany(users);
        console.log(results);
        console.log(users);
    }catch(err) {
        console.log(err);
    } finally {
        await mongoClient.close();
    }
}
run().catch(console.error);
