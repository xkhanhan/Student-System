var http = require('http')
var server = http.createServer();
var fs = require('fs');
var urlQuery = require('url');
var querystring = require('querystring');
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


//创建响应
server.on('request', function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*')

    var obj = urlQuery.parse(request.url, ['&'], ['='], [1000]);
    var url = obj.pathname;
    var data;
    var objCook = {};

    /**
     * 数据处理
     * 登录功能
     * 注册功能
     */
    var alldata = '';
    request.on('data', function (chunk) {
        alldata += chunk;
    });

    request.on('end', function () {
        //将字符串转换位一个对象
        var dataString = alldata.toString();
        //将接收到的字符串转换位为json对象
        data = dataString ? querystring.parse(dataString) : null;
        //有数据提交的请求
       
        
        if (data !== null) {
            var cookie = request.headers.cookie == undefined ? false : request.headers.cookie.split('; ');
            if(cookie){
                for (var i = 0; i < cookie.length; i++) {
                    var wan = cookie[i].split('=');
                    objCook[wan[0]] = wan[1];
                }
            }
            if (url == '/user/login') {
                //调用数据库线程
                
                connection.query(`select * from user where jurisdiction='${data.user}' and userName='${data.userName}';`, function (error, results, fields) {
                    console.log(results, data.userName, data.user);
                    
                        if (results.length == 0) {
                            //工号错误
                            response.end(JSON.stringify({ code: '404', message: '工号错误！' }));

                        } else if (data.userPassword != results[0].userPassword) {
                            response.end(JSON.stringify({ code: '404', message: '密码错误！' }));
                        } else {
                            response.end(JSON.stringify({ code: '200', message: '成功', userName: results[0].userName, jurisdiction: results[0].jurisdiction, url: '/view/index.html' }));
                        }
                });
            } else if(url == '/user/register'){
                connection.query(`select * from user where userName= '${ data.userName }'`,function (error, results, fields) {

                    if(results.length != 0){
                        response.end(JSON.stringify({code : '404', message : '该用户已存在'}));
                    }else{
                        connection.query(`insert into user (userName, userPassword, jurisdiction) values( '${ data.userName}' , '${ data.userPassword }', 'ordinary')`, function (error, results, fields) {
                            if(!error){
                                response.end(JSON.stringify({code : '200', message : '注册成功!正在返回登录界面'}))
                            }else{
                                response.end(JSON.stringify({code : '404', message : '注册失败'}));
                            }

                        })
                    }
                })
            }
            
            if (url == '/book/update') {
                //修改学生
                if (objCook.jurisdiction == 'ordinary') {
                    response.end(JSON.stringify({ code: 404, message: '对不起，你无权限修改!' }));
                } else {
                    connection.query(`update bookTable set bookId=${ data.bookId }, bookName='${ data.bookName }', bookSex='${ data.bookSex }', bookFather='${ data.bookFather }',bookTime='${ data.bookTime }', bookShop='${ data.bookShop }' where bookId=${data.bookId} ;`, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            
                            response.end(JSON.stringify({ code: 404, message: '修改失败' }))
                        }
                        response.end(JSON.stringify({ code: 200, message: '修改成功' }))
                    })
                }

            } else if (url == '/book/delete') {
                //删除
                if (objCook.jurisdiction == 'ordinary') {
                    response.end(JSON.stringify({ code: 404, message: '对不起，你无权限删除!' }));
                } else {
                    connection.query(`DELETE  FROM bookTable where bookId=${data.bookId};`, function (error, results, fields) {
                        if (!error) {
                            response.end(JSON.stringify({ code: 200, message: '删除成功' }))
                        }
                    })
                }
            } else if (url == '/book/add') {
                //添加
                connection.query(`insert into bookTable (bookId, bookName, bookSex, bookFather, bookTime, bookShop) values(${ data.bookId}, '${data.bookName}', '${data.bookSex}','${ data.bookFather}','${data.bookTime}','${data.bookShop}');`, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        response.end(JSON.stringify({ code: 404, message: 'id重复！' }))
                    }
                    response.end(JSON.stringify({ code: 200, message: '添加成功！' }));
                })
            }else if(url == '/select/book/id'){
                connection.query(`select * from bookTable where bookId=${ data.bookId };`, function (error, results, fields) {
                    if(error) {
                        response.end(JSON.stringify({code : 404, message : '未找到!'}));
                    }
                    if(results[0] == undefined){
                        response.end(JSON.stringify({code : 404, message : '未找到!'}))
                    }
                    response.end(JSON.stringify(results));
                })
                
            }else if( url == '/updateUser'){
                //修改密码
               

                connection.query(`select *  from user where userName='${ data.userName }'` ,function (error, result) {

                    if(result.length != 0){
                        console.log(result[0].userPassword,);
                        
                        if(result[0].userPassword == data.oldPaw){
                            connection.query(`update user set userPassword=${data.newPas},userName=${data.userName},jurisdiction='${data.jurisdiction}' where userName=${ data.userName };`, function (error, results, fields) {
                                if(error) {
                                    response.end(JSON.stringify({code : 404, message : '修改失败!'}));
                                }
                                response.end(JSON.stringify({code : 202,message : '修改成功！'}));
                            })
                        }else{
                            response.end(JSON.stringify({code : 404, message : '旧密码不正确!'}));
                        }
                        
                    }else{
                        response.end(JSON.stringify({code : 404, message : '修改失败!'}));
                    }
                })
            }
          
            
        } else {
            //显示页面
            requestUrl(url)
        }
    });



    /**
     * 请求页面
     * @param {*请求地址} url 
     */
    function requestUrl(url) {

        //管理页面
        if (url == '/view/index.html') {
            var cookie = request.headers.cookie == undefined ? false : request.headers.cookie.split('; ');

            if (cookie) {

                for (var i = 0; i < cookie.length; i++) {
                    var wan = cookie[i].split('=');
                    objCook[wan[0]] = wan[1];
                }

                //数据库线程
                connection.query(`select * from user where userName='${objCook.userName}';`, function (error, results, fields) {
                    if (results.length == 0) {
                        //没找到对应用户
                        response.end('404 Not Found');
                    } else if (objCook.userName != results[0].userName) {
                        //权限不相同
                        response.end('404 Not Found');
                    } else if (objCook.jurisdiction != results[0].jurisdiction) {
                        //权限不相同
                        response.end('404 Not Found');
                    } else {
                        //返回页面
                        fs.readFile('./view/index.html', function (error, data) {
                            if (error) {
                                return console.log(error);
                            }
                            response.end(data);
                        })
                    }
                });
            } else {
                //cookie过期
                response.end('404 Not Found');
            }


        } else if (url === '/') {
            //显示登录页面
            fs.readFile('./view/login.html', function (error, data) {
                if (error) {
                    return console.log(error);
                }
                response.end(data);
            })
        } else if (url == '/book/select') {
            //查询
            connection.query('select * from bookTable ORDER BY bookId ASC;', function (error, results, fields) {
                if(error){
                   return console.log(error);
                }
                response.end(JSON.stringify(results));
            })

        }
        //其他类型请求
        else {
            url = '.' + url;
            fs.readFile(url, function (error, data) {
                if (error) {
                    return console.log(error, 193);
                }
                response.end(data);
            })
        }
    }
}).listen(80, function (error) {
    if (error) return console.log(error);
    return console.log('running...');
});

