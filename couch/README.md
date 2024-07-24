Можно работать с базой данных CouchDB
--
Для запуска тестого примера, нужно выполнить следующие действия:
1. Скачать установщик с сайта: https://couchdb.apache.org/#download
2. Переместить в Applications, запустить через Launchpad и ввести логин/пароль: admin/a
3. Перейти по адресу: http://localhost:5984 и увидеть в браузере примерно следующее: {"couchdb":"Welcome","version":"3.3.3","git_sha":"40afbcfc7","uuid":"e46d843c15aca274110a20d3ec0de5ac","features":["access-ready","partitioned","pluggable-storage-engines","reshard","scheduler"],"vendor":{"name":"The Apache Software Foundation"}}
4. Зайти в административную панель Fauxton по адресу: http://127.0.0.1:5984/_utils/
5. Создать базу данных с названием 'test'
6. Перейти в каталог с исходниками и выполнить команду: 'npm install cradle'
7. Запустить скрипт на выполнение: 'node sv'
8. Открыть страницу: http://localhost:8071 и убедиться в успешном добавлении документа. Например, так: 'SUCESSFUL SAVE'
