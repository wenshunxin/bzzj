import WxValidate from "../../utils/WxValidate"
Page({
    data:{
        items: [
            { name: 'USA', value: '美国' },
            { name: 'CHN', value: '中国', checked: 'true' },
            { name: 'BRA', value: '巴西' },
            { name: 'JPN', value: '日本' },
            { name: 'ENG', value: '英国' },
            { name: 'TUR', value: '法国' },
        ],
        items1: [
            { name: 'USA', value: '美国' },
            { name: 'CHN', value: '中国' },
            { name: 'BRA', value: '巴西' },
            { name: 'JPN', value: '日本' },
            { name: 'ENG', value: '英国' },
            { name: 'FRA', value: '法国' },
        ]
    },
    onLoad(){
        this.initValidate();
    },
    initValidate() {
        let rules = {
            name: {
                maxlength: 10
            },
            checkbox:{
                required:true
            },
            radio:{
                required: true
            }
            // sex: {
            //     required: true,
            //     number: true
            // }
            // ,
            // birthDate: {
            //     required: true,
            //     dateISO: true,
            // },
            // Card: {
            //     required: false,
            //     idcard: true
            // }
        }

        let message = {
            name: {
                required: '请输入姓名',
                maxlength: '名字不能超过10个字'
            },
            checkbox:{
                required: '请x选择',
            },
            radio:{
                required:"请选择单选框"
            }
        }
        //实例化当前的验证规则和提示消息
        this.WxValidate = new WxValidate(rules, message);
    },
    formSubmit(e){
        let params = e.detail.value;
        console.log(params)
        if (!this.WxValidate.checkForm(params)) {
            //表单元素验证不通过，此处给出相应提示
            let error = this.WxValidate.errorList[0];
            console.log(error)
            wx.showToast({
                title: error.msg,
                icon: "none",
                duration: 2000,
            })
            // switch (error.param) {
            //     case "name":
            //         //TODO
            //         break;
            //     case "sex":
            //         //TODO
            //         break;
            //     case "birthDate":
            //         //TODO
            //         break;
            //     case "Card":
            //         //TODO
            //         break;

            // }
        }
        return false;
    }
    
})