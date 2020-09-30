
function student() {
    /**
     * 数据处理代码
     */

    //请求
    var request = {
        Ajax: function (obj, callBack) {
            $.ajax({
                url: obj.url,
                data: obj.data,
                success: function (data) {
                    callBack(data);
                },

            })
        }
    }

    //数据填充
    var disposeData = {
        disposeData: function (formELem, id) {
            //表单
            var number;
            var sex;
            var mail;
            var age;
            var phone;
            var address;
            if (id) {
                var tr = document.getElementById(id);
                number =tr.children[0].innerText;
                name = tr.children[1].innerText;
                sex = tr.children[2].innerText;
                mail = tr.children[3].innerText;
                age = tr.children[4].innerText;
                phone = tr.children[5].innerText;
                address = tr.children[6].innerText;
            } else {
                number = formELem.number.value;
                sex = formELem.sex.value;
                mail = formELem.mail.value;
                age = formELem.age.value;
                phone = formELem.phone.value;
                address = formELem.address.value;
                name = formELem.name.value
            }
            return {
                number: parseInt(number),
                name: name,
                sex: sex,
                mail: mail,
                age: age,
                phone: phone,
                address: address
            }

        },
    }

    //表单验证
    var authentication = {
        main: function (data) {
            var rag = {
                number: /^\d{1,8}$/,
                name: /^(\D+){1}$/,
                sex: /(男|女)/,
                age: /^\d{1,3}$/,
                phone: /^\d{6,11}$/,
                mail: /^(\d)+@\w+(\.com)$/,
                address: /./,
            }
            if (!rag['name'].test(data['name'])) {
                return `姓名出错！`;
            } else if (!rag['number'].test(data['number'])) {
                return `学号出错！`;
            } else if (!rag['sex'].test(data['sex'])) {
                return `性别出错！`;
            } else if (!rag['age'].test(data['age'])) {
                return `年龄出错！`;
            } else if (!rag['mail'].test(data['mail'])) {
                return `邮箱出错！`;
            } else if (!rag['address'].test(data['address'])) {
                return `地址出错！`;
            } else {
                return true;
            }

        }
    }

    /**
     * 以下为主要代码
     */

    //显示所有学生
    var seleStudent = {
        active : 0,
        dataLength : 0, 
        init: function () {
            this.view();
        },
        view: function () {
            //显示学生
            var _self = this;
            request.Ajax({
                url: '/student/select',
            }, function (data) {
                _self.rendData(data);
                _self.pageTurning(data);
            })
        },
        rendData : function (data) {
            var tableList = document.getElementById('tableList');

            data = JSON.parse(data);
            this.dataLength = data.length;

            var index = this.active * 10;
            var len = this.dataLength > 10 ? (index + 10 > this.dataLength ? this.dataLength : index + 10) : this.dataLength;

            var taplem = ` `;
            for (var i = index; i < len; i++) {
                taplem += `<tr id = '${data[i].id}'>
                    <td class="number">${ data[i].id}</td>
                    <td class="name">${ data[i].name}</td>
                    <td class="sex">${ data[i].sex}</td>
                    <td class="mail">${ data[i].mail}</td>
                    <td class="age">${ data[i].age}</td>
                    <td class="phone">${ data[i].number}</td>
                    <td class="address">${ data[i].address}</td>
                    <td>
                        <button class="delete" data-id="${ data[i].id}">删除</button>
                        <button class="amend" data-id="${ data[i].id}" >修改</button>
                    </td>
                </tr>`
              
            }
            taplem = `<tr>
            <th>学号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>邮箱</th>
            <th>年龄</th>
            <th>手机号</th>
            <th>住址</th>
            <th>操作</th></tr>`+taplem;
            tableList.children[0].innerHTML = taplem;
        },
        //翻页
        pageTurning: function(data){
            var last = document.getElementsByClassName('last')[0];
            var indexActive = document.getElementsByClassName('indexActive')[0];
            var every = document.getElementsByClassName('every')[0];
            var next = document.getElementsByClassName('next')[0];
            var _self = this;

            indexActive.innerText = this.dataLength == 0 ? 0 : this.active + 1;
            every.innerText = Math.ceil(this.dataLength / 10);

            last.addEventListener('click', function () {
                
                if(_self.active !== 0){
                    _self.active--;
                    _self.rendData(data);
                    indexActive.innerText = _self.active + 1;
                }
               
            });

            next.addEventListener('click', function () {
                 if(Math.ceil(_self.dataLength / 10) > _self.active + 1){
                    _self.active++; 
                    _self.rendData(data);
                    indexActive.innerText = _self.active + 1;
                }
            })
        }
    }
    seleStudent.init();


    //列表切换
    var leftLi = {
        liChecked: document.getElementById('li-checked'),
        liAdd: document.getElementById('li-add'),
        contenIndex: document.getElementById('conten-index'),
        contenAdd: document.getElementById('conten-add'),
        init: function () {
            var _self = this;
            this.liChecked.addEventListener('click', function () {
                //内容区域
                _self.contenIndex.style.display = 'block';
                _self.contenAdd.style.display = 'none';

                //学生列表
                _self.liChecked.classList.add('active');

                //学生添加
                _self.liAdd.classList.remove('active');


            })

            this.liAdd.addEventListener('click', function () {
                //内容区域
                _self.contenIndex.style.display = 'none';
                _self.contenAdd.style.display = 'block';

                //学生添加
                _self.liAdd.classList.add('active');

                //学生列表
                _self.liChecked.classList.remove('active');
            })
        }
    }
    leftLi.init();


    //删除修改按钮
    var amendDeleBtn = {
        btnClick: function () {
            var _self = this;

            var tableList = document.getElementById('tableList');

            tableList.addEventListener('click', function (e) {
                var target = e.target;
                var deleteBtn = target.classList.contains('delete');
                var amendBtn = target.classList.contains('amend');

                if (deleteBtn) {
                    var thisListStudent = target.getAttribute('data-id');
                    var list = document.getElementById(thisListStudent);

                    //确认框
                    var bool = window.confirm('是否删除？');
                    //删除后台数据

                    if (bool) {
                        request.Ajax({
                            url: '/student/delete',
                            data: {
                                number: thisListStudent
                            }
                        }, function () {
                            seleStudent.init();
                        })

                    }


                } else if (amendBtn) {
                    //修改表单
                    var amendForm = document.getElementsByClassName('amendForm')[0];
                    var form = amendForm.children[0];
                    //提交按钮
                    var amendFormbtnYes = document.getElementsByClassName('amendFormbtnYes')[0];
                    //取消按钮
                    var amendFormbtnNo = document.getElementsByClassName('amendFormbtnNo')[0];

                    //数据
                    var id = target.getAttribute('data-id');
                    var data = disposeData.disposeData(form, id);
                    console.log(id);
                    
                    amendForm.style.display = 'block';
                    for (var attr in data) {
                        form[attr].value = data[attr];
                    }


                    //取消按钮
                    amendFormbtnNo.addEventListener('click', function () {
                        amendForm.style.display = 'none';
                    })

                    //提交按钮
                    amendFormbtnYes.addEventListener('click', function (e) {
                        data = disposeData.disposeData(form);
                        data.nextId = id;

                        e.preventDefault();

                        var auth = authentication.main(data);
                        if (auth == true) {
                            request.Ajax({
                                url: './student/update',
                                data: data,
                            }, function (data) {
                                data = JSON.parse(data);
                                if (data.code) {
                                    location.reload();
                                    amendForm.style.display = 'none';
                                }
                                alert(data.message);
                            })
                        } else {
                            alert(auth);
                        }
                    })
                }

            })

        }
    }
    amendDeleBtn.btnClick();

    //添加
    var addStudent = {
        add: function () {
            var form = document.getElementsByClassName('add')[0].children[0];
            var btn = document.getElementById('addBtn');

            btn.addEventListener('click', function (e) {
                e.preventDefault()
                var data = disposeData.disposeData(form);
                var auth = authentication.main(data);
                if (auth == true) {
                    request.Ajax({
                        url: '/student/inseter',
                        data: data
                    }, function (data) {
                        data = JSON.parse(data);
                        if (data.code) {
                            location.reload();
                        }
                        alert(data.message);
                    })
                } else {
                    alert(auth);
                }

            })
        }
    }
    addStudent.add();
}