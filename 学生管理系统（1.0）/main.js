var http = require('http')
var server = http.createServer();
var fs = require('fs');
var urlQuery = require('url');

//数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'student'
});
connection.connect();


//监听端口
server.listen(80, function (error) {
    if (error) return console.log(error);
    return console.log('running...');
});

//创建响应
server.on('request', function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*')
   
    
    var obj = urlQuery.parse(request.url, ['&'], ['='], [1000]);
    var url = obj.pathname;
    var data = obj.query;

    //主页面
    if (url === '/') {
        fs.readFile('./view/index.html', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else
    //样式页面
    if (url === '/public/css/index.css') {
        fs.readFile('./public/css/index.css', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else
    //logo
    if (url === '/image/logo.png') {
        fs.readFile('./image/logo.png', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else
    if (url === '/image/user.png') {
        fs.readFile('./image/user.png', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else
    if (url === '/image/more.jpg') {
        fs.readFile('./image/more.jpg', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else
    //js文件
    if (url === '/index.js') {
        fs.readFile('./public/js/index.js', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else if (url === '/jQuery.js') {
        fs.readFile('./public/js/jQuery.js', function (error, data) {
            if (error) {
                return console.log(error);
            }
            response.end(data);
        })
    } else
    //显示学生列表
    if (url === '/student/select') {
        connection.query('select * from studenttable ORDER BY id ASC;', function (error, results, fields) {
            if (error) console.log(error);
            response.end(JSON.stringify(results))
        });
    }
    else
    //删除学生
    if(url === '/student/delete') {
        var sql = `delete from studenttable where id =${ data.number } ;`

        connection.query(sql, function (error, results, fields) {
            if (error) console.log(error);
            response.end(JSON.stringify(results))
        });
    }
    else 
    //修改学生
    if(url == '/student/update'){
        var sql = `update studenttable set id='${data.number}', name='${data.name}', sex='${data.sex}', mail='${data.mail}',age=${data.age}, number=${data.phone}, address='${data.address}' where id=${data.nextId} ;` 

        connection.query(sql, function (error, results, fields) {
            if (error){
                return response.end(JSON.stringify({code : false,message : 'id重复'}))
            };
            response.end( JSON.stringify({code : true,message : '修改成功'}) );
        });
    }
    else 
    //添加学生
    if(url == '/student/inseter'){

        var sql = `insert into studenttable (id, name, sex, mail, age, number, address) values(${data.number}, '${data.name}', '${data.sex}', '${data.mail}',${data.age}, ${data.phone}, '${data.address}');`
        //数据库线程
        connection.query(sql, function (error, results, fields) {
            if (error){
                return response.end(JSON.stringify({code : false,message : 'id重复'}))
            };
            response.end( JSON.stringify({code : true,message : '添加成功'}) );
        });

    }

})

