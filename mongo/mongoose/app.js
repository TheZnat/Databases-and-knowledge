const mongoose = require("mongoose"); // npm install mongoose --save
const express = require("express"); // npm install express
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

app.use(express.static("public"));
app.use(express.json());

const userScheme = new Schema({name: String, age: Number}, {versionKey: false});
const User = mongoose.model("User", userScheme);

async function main() {

    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
        app.listen(3000);
        console.log("Сервер на mongoose и express ожидает подключения... http://127.0.0.1:3000");
    }
    catch(err) {
        return console.log(err);
    }
}

app.get("/api/users", async (req, res)=>{
    // получаем всех пользователей
    const users = await User.find({});
    res.send(users);
});

app.get("/api/users/:id", async(req, res)=>{

    const id = req.params.id;
    // получаем одного пользователя по id
    const user = await User.findById(id);
    if(user) res.send(user);
    else res.sendStatus(404);
});

app.post("/api/users", jsonParser, async (req, res) =>{

    if(!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userAge = req.body.age;
    const user = new User({name: userName, age: userAge});
    // сохраняем в бд
    await user.save();
    res.send(user);
});

app.delete("/api/users/:id", async(req, res)=>{

    const id = req.params.id;
    // удаляем по id
    const user = await User.findByIdAndDelete(id);
    if(user) res.send(user);
    else res.sendStatus(404);
});

app.put("/api/users", jsonParser, async (req, res)=>{

    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
    const newUser = {age: userAge, name: userName};
     // обновляем данные пользователя по id
    const user = await User.findOneAndUpdate({_id: id}, newUser, {new: true});
    if(user) res.send(user);
    else res.sendStatus(404);
});

main();
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async() => {

    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});
