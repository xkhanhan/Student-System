
 
    /**
     * 生成验证码
     */
    function addVerifyCode() {
        var code = ['0', '1', '2', '3',
            '4', '5', '6', '7',
            '8', '9', 'A', 'B',
            'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N',
            'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V',
            'W', 'X', 'Y', 'Z'];
        var randomCode = '';
        var codeLength = code.length;
        for (var i = 0; i < 4; i++) {
            var codeIndex = Math.ceil(Math.random() * codeLength - 1)
            randomCode += code[codeIndex];
        }
        return randomCode;
    }

 /**
      * 警告框事件
      * @param {string} message 
      */
     function promptBoxAnimate(message ,fun) {
        var verifyCode 
        $('#promptBox').modal()
            .find('.modal-body')
            .find('p').text(message)
            .end()
            .end().on('hidden.bs.modal', function () {
                if(fun){
                    fun();
                }
            });

            verifyCode = addVerifyCode();
            $verificationCode = $('#verificationCode').text(verifyCode);
            return verifyCode;

    }
    /**
     * 发送请求
     * @param {object} formData 
     */
     function request(option) {
        $.ajax({
            url: option.url,
            type: 'post',
            data: option.formData,
            success: function (response) {
                response = JSON.parse(response);
                var resCode = response.code;
                var resMessage = response.message;
                var url = response.url;

                if(option.type == 'login'){
                    var responseUserName = response.userName;
                    var responseJurisdiction = response.jurisdiction;
                    /**
                     * 设置cookie
                     */
                    document.cookie =`userName=${responseUserName};path=/`;
                    document.cookie = `jurisdiction=${responseJurisdiction};path=/`;
                    if(resCode == '200') {
                        location.replace(url);
                    }else{
                        promptBoxAnimate(resMessage);
                    }
                }else if(option.type == 'register'){
                    if(resCode == '200') {
                        promptBoxAnimate(resMessage, function() {
                            location.replace('../view/login.html');
                        });
                        
                    }else{
                        promptBoxAnimate(resMessage);
                    }

                }
               
            },
        })
     }