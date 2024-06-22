# practNode
Как можно работать с таблицами в MySQL на Node.js

Внешний вид главного окна представлен далее.

![image](https://user-images.githubusercontent.com/10297748/230503674-84807929-9e4c-4de7-b97d-7676b2de80b5.png)

Пример не требует Web-сервера. Достаточно установить Node.js, отредактировать пути в файле app.js, запустить файл run_server.bat, открыть страницу http://127.0.0.1:3000/

Перед запуском необходимо доустановить компонент с помощью команды: npm install sync-mysql. Дополнительный набор команд Chocolatey устанавливать необязательно.

Пример гарантированно работает:
1) Версия Node.js v18.15.0, установленная из node-v18.15.0-x64.msi
2) Версия npm: 9.6.4

Допустима работа скрипта как с асинхронным (sync-mysql), так и синхронным (mysql2) модулем взаимодействия с MySQL. Оба скрипта доступны в каталоге dop с примером. Первый модуль устанавливается командой: npm install sync-mysql, второй: npm install mysql2. В каталоге со скриптами появятся дополнительные модули.

Все примеры работают под macOS Sonoma 14.5 без доработки. Вид в браузере Safari 17.5:

<img width="967" alt="Снимок экрана 2024-06-21 в 23 34 06" src="https://github.com/alex1543/practNode/assets/10297748/78c05713-78a2-4b63-8515-bd71cefabb79">

Для работы под macOS необходимо сделать след. действия:
1) Установить MongoDB Community по официальной инструкции из док-ции: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
2) Установить Node.js из пакета node-v20.15.0.pkg с оф. сайта: https://nodejs.org/
3) Установить модули для работы с MongoDB (СУБД NoSQL) с помощью команды: npm install mongodb express
4) Для примеров из каталога dop установить модуль для MySQL: npm install mysql2

Внешний вид сайта для редактирования одной коллекции MongoDB:

<img width="835" alt="Снимок экрана 2024-06-22 в 21 14 04" src="https://github.com/alex1543/practNode/assets/10297748/39f4f89d-7ebb-45f2-b1bc-a12f90008d40">
