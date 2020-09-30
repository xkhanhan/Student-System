$(function () {
    // 请求数据
    var data;
    var index = 0;
    var ye;

    init();
    function init() {
        render();
        addStudent();
        selectStudent();
        escStudent();
        upPassword();
        escStudent();
      
    }
    /**
     * 渲染入口
     */
    function render() {
        $.ajax({
            url: '/book/select',
            type: 'post',
            data: {},
            success: function (e) {
                data = e == undefined ? e : JSON.parse(e);
                renderNext();
                renderList();
                cutYe();
                delUpStudent();
                getEcharts(data);
            }
        })
    }




    /**
     * 渲染列表
     */
    function renderList() {
        // 列表模板
        var template = ``;

        // 数据长度
        var dataLen = data.length;
        let i = index * 10;
        var forLen = dataLen > 10 ? index * 10 + 10 > dataLen ? i + dataLen - index * 10 : index * 10 + 10 : dataLen;

        for (; i < forLen; i++) {
            template += ` <tr title='list'>
            <td >${ data[i].bookId}</td>
            <td data-toggle="tooltip" data-placement="top" title="${ data[i].bookName}" class="text-truncate">${data[i].bookName}</td>
            <td data-toggle="tooltip" data-placement="top" title="${ data[i].bookFather}" >${data[i].bookFather}</td>
            <td  data-toggle="tooltip" data-placement="top" title="${ data[i].bookShop}">${data[i].bookShop}</td>
            <td>${ data[i].bookSex}</td>
            <td class="text-truncate" data-toggle="tooltip" data-placement="top" title="${ data[i].bookTime}">${data[i].bookTime}</td>
            <td class="text-truncate" data='${data[i].bookId}'>
                <button class="btn bg-success text-light btn-sm" data-toggle="modal"
                    data-target="#exampleModalUp">修改</button>
                <button class="btn bg-danger text-light btn-sm"
                data-toggle="modal" data-target="#exampleModalDel" >删除</button>
            </td>
            </tr>`
        };
        $('#bookRenderList').get(0).innerHTML = template;
    }

    /**
     * 渲染图表
     */
    function getEcharts(data) {
        var pie = {
            init(data) {
                if(data.length == 0){
                    return;
                }
                // 两个图的公共样式
                this.option = {
                    title: {
                        text: '',
                        subText: '纯属虚构',
                        left: 'center'
                    },
                    legend: {
                        data: [],
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: {
                        name: '',
                        type: 'pie',
                        data: [],
                        radius: '55%',
                        center: ['60%', '55%']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                },

                }
                this.areaChart(data)
                this.sexChart(data);
               
            },
           
            areaChart(data) {
                var myChar = echarts.init($('.areaChart')[0]);
                var legendData = [];
                var seriesData = [];
                var newData = {}
                console.log();
                data.forEach(function (item) {
                    if (!newData[item.bookShop]) {
                        newData[item.bookShop] = 1;
                        legendData.push(item.bookShop);
                    } else {
                        newData[item.bookShop]++;
                    }
                });

                for (var prop in newData) {
                    seriesData.push({
                        name: prop,
                        value: newData[prop]
                    })
                }
               
                this.option.title.text = '图书出版社分布图',
                    this.option.legend.data = legendData;
                this.option.series.name = '出版社分布图';
                this.option.series.data = seriesData;
                myChar.setOption(this.option)
            },

            sexChart(data) {
                var myChar = echarts.init($('.sexChart')[0]);
                var legendData = ['A类', 'B类'];
                var newData = {}

                console.log(data);
                data.forEach(function (item) {
                    if (!newData[item.bookSex]) {
                        newData[item.bookSex] = 1;
                    } else {
                        newData[item.bookSex]++;
                    }
                });

                console.log(newData);
                var seriesData = [
                    { name: 'A类', value: newData['A类'] },
                    { name: 'B类', value: newData['B类'] }
                ];

                this.option.title.text = '图书类别',
                    this.option.legend.data = legendData;
                this.option.series.name = '类别';
                this.option.series.data = seriesData;
                myChar.setOption(this.option)
            }
        }
        pie.init(data);
    }
  

    /**
     * 渲染分页
    */
    function renderNext() {
        var dataLen = data.length;
        ye = Math.ceil(dataLen / 10);
        var $wrap = $('#nextFather');

        var lastBtn = `<li class="page-item" id='lastBtn'>
            <a class="page-link" href="#" aria-label="Previous">
               上一页
            </a>
        </li>`;
        var nextBtn = `<li class="page-item" id='nextBtn'>
            <a class="page-link" href="#" aria-label="Next">
               下一页
            </a>
        </li>`;
        var indexBtn = ``;
        var key = true;

        var indexBtnLen = ye > 11 ? 10 : ye == 0 ? 1 : ye;
        for (let i = 0; i < indexBtnLen; i++) {
            if (index < 5) {
                if (i < 7) {
                    indexBtn += `<li class="page-item"><a class="page-link" data='${i}' href="#">${i + 1}</a></li>`
                }
                if (i >= 6 && ye > 11 && key) {
                    indexBtn += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
                    key = false;
                }

                if (ye > 11 && i > 7) {
                    indexBtn += `<li class="page-item"><a class="page-link" data='${ye - 10 + i}' href="#">${ye - 9 + i}</a></li>`;
                }
            } else {
                if (i < 2) {
                    indexBtn += `<li class="page-item"><a class="page-link"  data='${i}'  href="#">${i + 1}</a></li>`
                } else {
                    if (i == 2 || (i == 8 && ye > 11 && ye - index > 5)) {
                        indexBtn += `<li class="page-item" id='tiao'><a class="page-link" href="#">..</a></li>`;
                        key = false;
                    }
                    var indexD;
                    if (ye - index > 8 && i > 7) {
                        indexD = ye - 9 + i;
                        if (index < ye - 5) {
                            indexD = ye - 9 + i;
                        } else {
                            indexD = ye + i - 9
                        }
                        indexBtn += `<li class="page-item"><a class="page-link" data='${indexD - 1}' href="#">${indexD}</a></li>`;
                    } else {
                        if (index < ye - 5) {
                            indexD = index - 3 + i
                        } else {
                            indexD = ye + i - 9
                        }
                        indexBtn += `<li class="page-item"><a class="page-link"  data='${indexD - 1}'  href="#">${indexD}</a></li>`
                    }
                }
            }

        }

        indexBtn = lastBtn + indexBtn + nextBtn;
        $wrap.get(0).innerHTML = indexBtn;
        $('#nextFather').find('.page-link').each(function (i, item) {
            if (parseInt($(item).attr('data')) == index) {
                $(item).parent().addClass('active');
                return;
            }
        })

    }

    //切换页
    function cutYe() {
        $('#nextFather').on('click', function (e) {
            var target = e.target;
            if ($(target).attr('class') == 'page-link') {
                if ($(target).parent().attr('id') == 'lastBtn') {
                    if (index != 0) {
                        index--;
                    }
                } else if ($(target).parent().attr('id') == 'nextBtn') {
                    if (index < ye - 1) {
                        index++;
                    }
                    console.log(index, '++');
                } else if ($(target).parent().attr('id') !== 'tiao') {
                    index = parseInt($(target).attr('data'));
                }
                renderNext();
                renderList();
            }
        })
    }

    /**
     * 弹框
     */
    function model(message, fun) {
        $('#exampleModalDel').modal();
        $('#exampleModalDel').find('.modal-body ').text(message);
        $('#exampleModalDel').on('hidden.bs.modal', function (e) {
            if (fun) {
                fun();
            }
        })
    }

    /**
     * 添加学生
     */
    function addStudent() {
        var bookAdd = $('#bookAdd');
        var form = bookAdd.find('form').get(0);
        var formInput;

        $('#sub').on('click', function (e) {
            e.preventDefault();
            formInput = {
                bookId: form.bookId.value,
                bookName: form.bookName.value,
                bookFather: form.bookFather.value,
                bookShop: form.bookshop.value,
                bookTime: form.bookTime.value,
                bookSex: form.bookSex.value,
            }
            $.ajax({
                url: '/book/add',
                data: formInput,
                type: 'post',
                beforeSend: function () {
                    for (var attr in formInput) {
                        if (formInput[attr] == '') {
                            model('请填写完整图书信息');
                            return false;
                        }
                    }
                },
                success: function (data) {
                    data = JSON.parse(data);
                    model(data.message, function () {
                        location.reload();
                    });
                }
            })

        })


    }

    //获取cookie
    function getCookie() {
        var objCook = {};
        var cookie = document.cookie == undefined ? false : document.cookie.split('; ');
        if (cookie) {
            for (var i = 0; i < cookie.length; i++) {
                var wan = cookie[i].split('=');
                objCook[wan[0]] = wan[1];
            }
        }
        return objCook
    }

    /**
     * 删除和修改学生
     */
    function delUpStudent() {
        $('#bookList').on('click', function (e) {
            var target = e.target;
            if ($(target).attr('data-target') == '#exampleModalDel') {
                /**
                 * 删除学生
                 */
                var id = $(target).parent().attr('data');
                if (getCookie().jurisdiction == 'super') {
                    $.ajax({
                        url: '/book/delete',
                        data: { bookId: id },
                        type: 'post',
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.code == 200) {
                                model(data.message, function () {
                                    location.reload();
                                });
                            }
                        }
                    })
                } else {
                    //弹出提示
                    model('对不起,你无权删除!');
                }
            } else if ($(target).attr('data-target') == '#exampleModalUp') {

                /**
                 * 修改学生
                 */
                var formData;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].bookId == $(target).parent().attr('data')) {
                        formData = data[i];
                        break;
                    }
                }
                var form = $('#exampleModalUp').find('form').get(0);

                for (var attr in formData) {
                    if (attr == 'bookSex') {
                        $(formData[attr]).attr('checked', true);
                    }
                    form[attr].value = formData[attr];
                }

                $('#upSubmit').click(function () {
                    if (getCookie().jurisdiction == 'super') {
                        for (var attr in formData) {
                            formData[attr] = form[attr].value;
                        }
                        $.ajax({
                            url: '/book/update',
                            type: 'post',
                            data: formData,
                            success: function (data) {
                                data = JSON.parse(data);
                                $('#exampleModalUp').modal('hide');
                                model(data.message, function () {
                                    location.reload()
                                })
                            }
                        })
                    } else {
                        $('#exampleModalUp').modal('hide');
                        model('对不起你无权修改')
                    }

                })
            }
        })
    }
    /**
     * 查询框
     */
    function selectStudent() {
        $('#searchBtn').click(function (e) {
            var bookId = $('#searchInput').val();

            if (bookId == '') {
                model('请输入图书号')
            } else {
                $.ajax({
                    url: '/select/book/id',
                    type: 'post',
                    data: { bookId: bookId },
                    success: function (data) {
                        data = data == undefined ? data : JSON.parse(data);
                        if (data.code != 404) {
                            var formData = data[0];
                            var form = $('#search').modal().find('form').get(0);

                            for (var attr in formData) {
                                if (attr == 'bookSex') {
                                    $(formData[attr]).attr('checked', true);
                                }
                                form[attr].value = formData[attr];
                            }

                            $('#searchSub').click(function () {
                                if (getCookie().jurisdiction == 'super') {
                                    for (var attr in formData) {
                                        formData[attr] = form[attr].value;
                                    }
                                    $.ajax({
                                        url: '/book/update',
                                        type: 'post',
                                        data: formData,
                                        beforeSend : function () {
                                            for(var attr in formData){
                                                if(formData[attr] == ''){
                                                    model('请输入完整信息');
                                                    return false;
                                                }
                                            }
                                        },
                                        success: function (data) {
                                            data = JSON.parse(data);
                                            $('#search').modal('hide');
                                            model(data.message, function () {
                                                location.reload()
                                            })
                                        }
                                    })
                                } else {
                                    $('#search').modal('hide');
                                    model('对不起你无权修改')
                                }
            
                            })
                            $('#delSubmit').click(function () {
                                if (getCookie().jurisdiction == 'super') {
                                    $.ajax({
                                        url: '/book/delete',
                                        data: { bookId: bookId },
                                        type: 'post',
                                        success: function (data) {
                                            data = JSON.parse(data);
                                            if (data.code == 200) {
                                                $('#search').modal('hide');
                                                model(data.message, function () {
                                                    location.reload();
                                                });
                                            }
                                        }
                                    })
                                } else {
                                    //弹出提示
                                    $('#search').modal('hide');
                                    model('对不起,你无权删除!');
                                }
                            })
                        } else {
                            model('未找到书号为 "' + bookId + ' "的图书信息')
                        }
                    }
                })
            }
        })
    }

    /**
     * 退出登录
     */
    function  escStudent() {
        $('#esc').on('click', function () {

            var date = new Date();
            date.setTime(date.getTime() - 10000);
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            console.log("需要删除的cookie名字：" + keys);
            if (keys) {
                for (var i = keys.length; i--;)
                    document.cookie = keys[i] + "=0; expire=" + date.toGMTString(0) + "; path=/";
            }
            location.replace('/view/login.html');
        })
    }

    /**
     * 修改密码
     */
    function upPassword(){
        $('#updatePassword').click(function(){
            $('#password').modal();
        });
        var cookie = getCookie();
        $('#upPasSub').click(function () {  
            var form = $('#password').find('form').get(0);
            var formData = {
                oldPaw : form.oldPaw.value,
                newPas : form.newPas.value,
                newPasOne : form.newPasOne.value,
            }

            var RegStr = /^\w{6,11}$/g;
            console.log(!RegStr.test(formData[attr]));
            for(var attr in formData){
                if(formData[attr] == ''){
                    model('请填写完整');
                    return;
                }
            }
            if( !RegStr.test(formData.newPas) ) {
                model('请输入6-11位包含字母或数字的密码' + attr);
                return;
            }

            formData.jurisdiction = cookie.jurisdiction;
            formData.userName =cookie.userName;

            if(formData.newPas != formData.newPasOne){
                model('两次密码不一致')
                return ;
            }


            $.ajax({
                url : '/updateUser',
                data : formData,
                type : 'post',
                success : function (data) {
                    data = JSON.parse(data);
                    if(data.code == '202'){
                        model(data.message,function(){
                            $('#esc').trigger('click');
                        });
                    }else{
                        model(data.message);
                    }
                }
            });
        })
    }
 
})