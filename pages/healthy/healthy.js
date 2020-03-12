import http from "../../utils/http";
import WxValidate from "../../utils/WxValidate"
let appInst = getApp();
Page({
    data:{
        day:new Date(),
        items1:[
            {name:"良好",checked:false},{name:"不舒服",checked:false}
        ],
        items2:[{name:'有',checked:false},{name:"无",checked:false}],
        items: [
            {name:"发热",checked:false},
            {name:"乏力",checked:false},
            {name:"干咳",checked:false},
            {name:"呼吸困难",checked:false},
            {name:"其他",checked:false}],

        disabledChecbox:false,

        items3: [{name:"37.2度以下",checked:false},{name:"37.2度以上",checked:false}],
        items4: [{name:"37.2度以下",checked:false},{name:"37.2度以上",checked:false}],
        items5: [{name:"37.2度以下",checked:false},{name:"37.2度以上",checked:false}],

        startDate: "2020-02-25",
        openId:"",
        checkinInfo:{
            sid:"",
            checkinDate:"",
            userName:"",
            userMobile:"",
            healthyStatus:"",
            bodyStatus:"",
            goOut:"",
            forenoon:"",
            noon:"",
            night:""
        },
        disabledBtn:false,
        endDate:""
    },
    onLoad(){
        let year = new Date().getFullYear();
        let month = (~~new Date().getMonth()+1)>9?(~~new Date().getMonth()+1):"0"+(~~new Date().getMonth()+1);
        let day = new Date().getDate()>9?new Date().getDate():"0"+new Date().getDate();
        this.setData({
            startDate: `${year}-${month}-${day}`,
            "checkinInfo.checkinDate":`${year}-${month}-${day}`,
            openId:appInst.globalData.openId,
            endDate:`${year}-${month}-${day}`
        });

        this.handleGetNameAndMobile();

        this.initValidate();
        this.handleGetData(`${year}-${month}-${day}`)
    },  

    handleGetData(startDate){
        http(`/investigationController/getCheckinInfoByOpenidAnd.act?openid=${appInst.globalData.openId}&checkinDate=${startDate}`)
        .then(res=>{
            // 数据回显
            if (res.data.rtState){
                this.setData({
                    disabledBtn:true,
                    items1: [
                        { name: "良好", checked: false }, { name: "不舒服", checked: false }
                    ],
                    disabledChecbox:false,
                    items: [
                        {name:"发热",checked:false},
                        {name:"乏力",checked:false},
                        {name:"干咳",checked:false},
                        {name:"呼吸困难",checked:false},
                        {name:"其他",checked:false}],
                    items2: [{ name: '有', checked: false }, { name: "无", checked: false }],
                    items3: [{ name: "37.2度以下", checked: false }, { name: "37.2度以上", checked: false }],
                    items4: [{ name: "37.2度以下", checked: false }, { name: "37.2度以上", checked: false }],
                    items5: [{ name: "37.2度以下", checked: false }, { name: "37.2度以上", checked: false }]
                })
                const { healthyStatus, bodyStatus, goOut, forenoon, noon, night } = res.data.rtData;
                const { items, items1, items2, items3, items4, items5 } = this.data;
                
                let itemsIndex = items1.findIndex(item=>item.name == healthyStatus);
                items1[itemsIndex].checked = true;

                this.radioChangeHealthyStatus({ detail: { value: healthyStatus}});
                
                for(let i=0;i<items.length;i++){
                    let it = items[i];
                    if (bodyStatus.indexOf(it.name)>-1){
                        items[i].checked = true;
                    }else{
                        items[i].checked = false;
                    }
                }
                let items2Index = items2.findIndex(item => item.name == goOut);
                // console.log(itemsIndex)
                items2[items2Index].checked = true;
                let items3Index = items3.findIndex(item => item.name == forenoon);
                // console.log(itemsIndex)
                items3[items3Index].checked = true;
                let items4Index = items4.findIndex(item => item.name == noon);
                // console.log(itemsIndex)
                items4[items4Index].checked = true;
                let items5Index = items5.findIndex(item => item.name == night);
                // console.log(itemsIndex)
                items5[items5Index].checked = true;
                this.setData({
                    items,items1, items2, items3, items4, items5
                })
            }else{
                this.setData({
                    disabledBtn:false,
                    items1: [
                        { name: "良好", checked: false }, { name: "不舒服", checked: false }
                    ],
                    disabledChecbox:false,
                    items: [
                        {name:"发热",checked:false},
                        {name:"乏力",checked:false},
                        {name:"干咳",checked:false},
                        {name:"呼吸困难",checked:false},
                        {name:"其他",checked:false}],
                    items2: [{ name: '有', checked: false }, { name: "无", checked: false }],
                    items3: [{ name: "37.2度以下", checked: false }, { name: "37.2度以上", checked: false }],
                    items4: [{ name: "37.2度以下", checked: false }, { name: "37.2度以上", checked: false }],
                    items5: [{ name: "37.2度以下", checked: false }, { name: "37.2度以上", checked: false }]
                },()=>{
                    
                     
                })
            }
        })
    },
    // 获取 当前姓名和手机号
    handleGetNameAndMobile(){
        http(`/investigationController/getCurTenantInfo.act?openid=${appInst.globalData.openId}`)
        .then(res=>{
            if(res.data.rtState){  

                if(res.data.rtData == null || res.data.rtData.mobile == "" || res.data.rtData.mobile == null){
                    wx.showModal({
                        title: '提示',
                        content: '请先填写离京返京信息',
                        showCancel:false,
                        success (res) {
                            if (res.confirm) {
                                 wx.navigateBack();
                            }
                        }
                    })
                    return false;
                }
                this.setData({
                    "checkinInfo.userName":res.data.rtData.userName,
                    "checkinInfo.userMobile":res.data.rtData.mobile
                })
            }
        })
    },

    bindPickerChangeCheckDate(e){
        // console.log(e)
        this.setData({
            startDate:e.detail.value,
            "checkinInfo.checkinDate":e.detail.value
        },()=>{
            this.handleGetData(e.detail.value)
        })
    },
    radioChangeHealthyStatus(e){
        let value = e.detail.value;
        let { items } = this.data;
        if(value == "良好"){
            items.forEach(item=>{
                item['checked']=false;
            })
            this.setData({
                disabledChecbox:true,
                items
            })
        }else{
            this.setData({
                disabledChecbox:false
            })
        }

        this.setData({
            "checkinInfo.healthyStatus":e.detail.value,
        })
    },
    checkboxChange(e){
        this.setData({
            "checkinInfo.bodyStatus":e.detail.value.join(",")
        })
    },
    radioChangeGoOut(e){
        this.setData({
            "checkinInfo.goOut":e.detail.value
        })
    },
    radioChangeForenoon(e){
        this.setData({
            "checkinInfo.forenoon": e.detail.value
        })
    },
    radioChangeNoon(e) {
        this.setData({
            "checkinInfo.noon": e.detail.value
        })
    },
    radioChangeNight(e) {
        this.setData({
            "checkinInfo.night": e.detail.value
        })
    },

    initValidate() {
        let rules = {
            // 打开时间
            startDate: {
                required:true
            }
        };
        let message = {
            name: {
                required: '请输入姓名',
                maxlength: '名字不能超过10个字'
            }
        };
        //实例化当前的验证规则和提示消息
        this.WxValidate = new WxValidate(rules, message);
    },
    formSubmit(e){
        let { checkinInfo } = this.data;

        let objData = e.detail.value;

        // if (!this.WxValidate.checkForm(objData)) {
        //     //表单元素验证不通过，此处给出相应提示
        //     let error = this.WxValidate.errorList[0];
        //     wx.showToast({
        //         title: error.msg,
        //         icon: "none",
        //         duration: 2000,
        //     });
        //     return false;
        // }

        if (objData.userName == '' || objData.userName == null){
            wx.showToast({
                title: '请填写姓名',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        if (objData.userMobile == '' || objData.userMobile == null) {
            wx.showToast({
                title: '请填写电话',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 健康状况
        if (checkinInfo.healthyStatus == '' || checkinInfo.healthyStatus == null) {
            wx.showToast({
                title: '请选择康状况',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        if(checkinInfo.healthyStatus == "不舒服"){
             // 身体症状
            if (checkinInfo.bodyStatus == '' || checkinInfo.bodyStatus == null) {
                wx.showToast({
                    title: '请选择身体症状',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }else{
            this.setData({
                "checkinInfo.bodyStatus":""
            })
        }
       

        if (checkinInfo.goOut == '' || checkinInfo.goOut == null) {
            wx.showToast({
                title: '请选择有无外出',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        if (checkinInfo.forenoon == '' || checkinInfo.forenoon == null) {
            wx.showToast({
                title: '请选择早上体温',
                icon: 'none',
                duration: 2000
            });
            return false;
        }


        if (checkinInfo.noon == '' || checkinInfo.noon == null) {
            wx.showToast({
                title: '请选择中午体温',
                icon: 'none',
                duration: 2000
            });
            return false;
        }


        if (checkinInfo.night == '' || checkinInfo.night == null) {
            wx.showToast({
                title: '请选择晚上体温',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        
        for (let key in checkinInfo) {
            if (objData.hasOwnProperty(key)) {
                checkinInfo[key] = objData[key];
            }
        }
        // checkinInfo['addTime'] = new Date().getFullYear() + "-" + new Date().getMonth() + 1 + "-" + new Date().getDay();
        this.setData({
            checkinInfo
        });
        http(`/investigationController/addCheckinInfo.act`,Object.assign({},this.data.checkinInfo,{'openid':appInst.globalData.openId}))
        .then(res=>{
            if(res.data.rtState){
                wx.showToast({
                    title:"保存成功",
                    icon:"success",
                    duration:2000,
                    success(){
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 2000)
                    }
                })
            }
            
        })
        // console.log(this.data.checkinInfo)
    },
    formReset: function () {
        console.log('form发生了reset事件')
    }
})