
function init() {
    location.hash = 'student-list'
    bindEvent();
}
init();
function bindEvent() {
    // 下拉列表
    var $dropList = $('.drop-list');
    $('header .btn').click(function () {
        $dropList.slideToggle();
    });

    $(window).resize(function () {
        if ($(window).innerWidth() >= 768) {
            $dropList.slideUp();
        }
    })

    // 列表切换
    $(window).on('hashchange', function () {
        var hash = location.hash;

        // 内容切换
        $('.show-list').removeClass('show-list');
        $('.right-content ' + hash).addClass('show-list');

        // 按钮切换
        $('.active').removeClass('active');
        $('.list-menu .list-group>' + '.' + hash.slice(1)).addClass('active');


    })

    $('.list-item').click(function () {
        $('.drop-list').slideUp();
        var id = $(this).attr('data-id');
        location.hash = id;
    })

}

function getEcharts() {
    var pie = {
        init() {
            this.getData();

            // 两个图的公共样式
            this.option = {
                title: {
                    text: '',
                    subText: '纯属虚构',
                    left : 'center'
                },
                legend : {
                    data : [],
                    orient : 'vertical',
                    left : 'left'
                },
                series : {
                    name : '',
                    type : 'pie',
                    data : [],
                    radius : '55%',
                    center : ['50%','55%']
                }

            }
        },
        getData() {
            /**address: "重庆市"
            appkey: "hanhan1__1586220819397"
            birth: 15
            ctime: 1596355131
            email: "1427742566@qq.com"
            id: 59595
            name: "xk4"
            phone: "18918911198"
            sNo: "146510"
            sex: 1
            utime: 1596355131 */
            var This = this;
            $.ajax({
                url: 'http://open.duyiedu.com/api/student/findAll?appkey=hanhan1__1586220819397',
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data).data;

                    if (data.length > 0) {
                        This.areaChart(data);
                        This.sexChart(data);
                    }
                }
            })

            // $.ajax({
            //     url : 'http://open.duyiedu.com/api/student/addStudent?appkey=hanhan1__1586220819397&sNo=146518&name=xk4&sex=1&birth=15&phone=18918911198&address=M78&email=1427742566@qq.com',
            //     type : 'get',
            //     success : function (data) {
            //         console.log(data);
            //     }
            // })
        },
        areaChart(data) {

            var myChar = echarts.init($('.areaChart')[0]);
            var legendData = [];
            var seriesData = [];

            var newData = {}

            data.forEach(function (item) {
                if( !newData[item.address] ){
                    newData[item.address] = 1;
                    legendData.push(item.address);
                }else{
                    newData[item.address]++;
                }
            });

            for(var prop in newData){
                seriesData.push({
                    name : prop,
                    value : newData[prop]
                })
            }
            console.log(newData,legendData, seriesData);
            this.option.title.text = '学生地区分布统计',
            this.option.legend.data = legendData;
            this.option.series.name = '地区分布';
            this.option.series.data = seriesData;
            myChar.setOption(this.option)
        },
        sexChart(data) {
            var myChar = echarts.init($('.sexChart')[0]);
            var legendData = ['男','女'];
            

            var newData = {}

            data.forEach(function (item) {
                if( !newData[item.sex] ){
                    newData[item.sex] = 1;
                }else{
                    newData[item.sex]++;
                }
            });
            var seriesData = [
                {name : '男', value : newData[0]},
                {name : '女', value : newData[1]}
            ];
            
            console.log(newData,legendData, seriesData);
            this.option.title.text = '学生性别',
            this.option.legend.data = legendData;
            this.option.series.name = '性别';
            this.option.series.data = seriesData;
            myChar.setOption(this.option)
        }
    }
    pie.init();
}
getEcharts();