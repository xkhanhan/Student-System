(function () {
    var verifyCode;
    var $verificationCode;
    /**
     * 入口函数
     */
    function init() {
        verifyCode = addVerifyCode();       
        $verificationCode = $('#verificationCode').text(verifyCode);
        login();

    }
    
    /**
     * 数据验证
     * @param {Object} data 
     */
    function formDataVerify(data) {
        var dataReg = {
            user: /\w+/g,
            userName: /^\d{6,11}$/g,
            userPassword: /^\w{6,11} ||$/g,
            verificationCode: /^\w{1,4}$/g
        }


        if (data == 'userName') {
            return {
                code: false,
                message: '用户名不能为空！'
            };
        } else if (data == 'userPassword') {
            return {
                code: false,
                message: '密码不能为空！'
            };
        } else if (data == 'verificationCode') {
            return {
                code: false,
                message: '验证码不能为空！！'
            };
        } else
            //判断数据是否合法
            if (!dataReg.userName.test(data.userName)) {
                return {
                    code: false,
                    message: '请输入6-11纯数字位工号！'
                };
            } else if (!dataReg.userPassword.test(data.userPassword)) {
                return {
                    code: false,
                    message: '请输入6-11密码！'
                };
            } else if (!dataReg.verificationCode.test(data.verificationCode)) {
                return {
                    code: false,
                    message: '验证码格式不正确！'
                };
            } else if(data.verificationCode.toUpperCase() != verifyCode){
                return {
                    code: false,
                    message : '验证码不正确！'
                }
            }else{
                return{
                    code : true,
                }
            }
    }


    /**
     * 表单数据格式化
     * @param {document}} form  表单
     */
    function dataDispose(form) {
        var formData = {};

        formData.user = form.user.value;
        formData.userName = form.userName.value;
        formData.userPassword = form.userPassword.value;
        formData.verificationCode = form.verificationCode.value;

        for (var prop in formData) {
            if (formData[prop] == '') {
                return prop;
            }
        }

        return formData;
    }
    /**
     * 登录功能
     */
    function login() {
        $('#login').click(function () {
            var form = $('form').get(0);
            var formData = dataDispose(form);
            var verify = formDataVerify(formData);

            if (verify.code) {
                request({
                    url : '/user/login',
                    formData : formData,
                    type : 'login'
                });
            } else {
               
                verifyCode = promptBoxAnimate(verify.message);
            }

        })
    }  
    init()
})()