
import http from "../../utils/http";
let appInst = getApp();
import WxValidate from "../../utils/WxValidate"
Page({
    data: {
        items1: [{name:"男",checked:false},{name:"女",checked:false}],
        items2: [
            {name:"二代身份证",checked:false},
            {name:"护照",checked:false},
            {name:"港澳台居民来往通行证",checked:false},
            {name:"台湾居民来往大陆通行证",checked:false}
        ],

        
        isIncommunity:false,


        landlordInfo:{
            sid:"",
            landlordName:"",
            sex:"",
            mobile:"",
            idType:"",
            idNumber:"",

            spouseName:"",
            spouseMobile:"",
            spouseIdNumber:"",
            childrenNames:"",
            chilrenMoblies:"",
            chilrenIdNumbers:"",
            parentNames:"",
            parentMobiles:"",
            parentIdNumbers:"",


            area:"",
            street:"",
            community:"",
            detailAddress:"",


            leaseRoomNum:"",
            leaseRoomSize:"",


            isIncommunity:"否",
            rentedNums:"",
            rentedUserNums:"",


            addTime:""
        },
        areas: [],
        streetName:[],
        communityName:[],
        areasIndex:0,
        streetNameIndex:0,
        communityNameIndex:0,
    },

    onLoad(){
        let fn4 = this.handleGetData();
        let fn1 = this.handleGetAreaList();
        Promise.all([fn4,fn1 ]).then((res)=>{
            const { landlordInfo, items1, items2 } = this.data;
            const { sex, idType, area, street, community, isIncommunity } = landlordInfo;
            for(let i=0;i<items1.length;i++){
                if(items1[i].name == sex){
                    items1[i].checked = true;
                }else{
                    items1[i].checked = false;
                }
            }
            for(let i=0;i<items2.length;i++){
                if(items2[i].name == idType){
                    items2[i].checked = true;
                }else{
                    items2[i].checked = false;
                }
            };
            let index = 0;
            if (area != ""){
                index = this.data.areas.findIndex(item => item.areaName == area);
            }
            let isIncommunityflag = isIncommunity == "是"?true:false;
            this.setData({
                items1,
                items2,
                areasIndex:index,
                isIncommunity: isIncommunityflag
            });
        })
        
        this.initValidate();
    },

    initValidate() {
        let rules = {
            mobile: {
                required: true,
                tel: true
            },
            spouseMobile:{
                tel:""
            }
        }

        let message = {
            mobile: {
                required: '请输入手机号',
                tel: "请正确输入个人手机号"
            },
            spouseMobile:{
                tel:"请正确填写配偶手机号"
            }
        }
        //实例化当前的验证规则和提示消息
        this.WxValidate = new WxValidate(rules, message);
    },
    // 根据openid 数据回显
    handleGetData(){
        return new Promise((resolve,reject)=>{
            http(`/investigationController/getCurLandlordInfo.act?openid=${appInst.globalData.openId}`)
            .then(res => {
                if (res.data.rtState && res.data.rtData !=null) {
                    let data = res.data.rtData;
                    delete  data['tenantList'];
                    delete data['sid'];
                    this.setData({
                        landlordInfo: data
                    },()=>{
                        this.handleGetStreetList(res.data.rtData.area);
                        this.handleGetCommunityList(res.data.rtData.area, res.data.rtData.street);
                    });
                    resolve()
                }
            })
        })
    },

    // 获取区列表
    handleGetAreaList(){
        return new Promise((resolve,reject)=>{
            http("/areaInfoController/getAreaList.act")
            .then(res=>{
                if (res.data.rtState){
                    this.setData({
                        areas: [{"areaName":"请选择区"}].concat(res.data.rtData)
                    },()=>{
                        resolve()
                    })
                }
            })
        })


        
    },
    // 获取乡镇/街道
    handleGetStreetList(areaName){
       return new Promise((resolve,reject)=>{
             http("/areaInfoController/getStreetList.act?areaName=" + areaName)
            .then(res=>{
                if (res.data.rtState) {
                    this.setData({
                        streetName: [{"streetName":"请选择乡镇/街道"}].concat(res.data.rtData)
                    }, () => {
                        const { landlordInfo } = this.data;
                        if (landlordInfo.street != "") {
                            let indexStreetName = this.data.streetName.findIndex(item => item.streetName == landlordInfo.street);
                            this.setData({
                                streetNameIndex: indexStreetName
                            })
                        }
                        resolve();
                        // this.setData({
                        //     "landlordInfo.street":this.data.streetName[this.data.streetNameIndex].streetName
                        // })
                        // this.handleGetCommunityList(this.data.streetName[this.data.streetNameIndex].areaName, this.data.streetName[this.data.streetNameIndex].streetName)
                    })
                }
            })
        })
       
    },
    // 获取存列表
    handleGetCommunityList(areaName,streetName){
         return new Promise((resolve,reject)=>{
            http(`/areaInfoController/getCommunityList.act?areaName=${areaName}&streetName=${streetName}`)
            .then(res=>{
                // console.log(res)
                if (res.data.rtState) {
                    this.setData({
                        communityName: [{"communityName":"请选择村"}].concat(res.data.rtData)
                    }, () => {
                        const { landlordInfo } = this.data;
                        if (landlordInfo.community !=""){
                            let indexCommunityName = this.data.communityName.findIndex(item => item.communityName == landlordInfo.community);
                            this.setData({
                                communityNameIndex: indexCommunityName
                            });
                        }
                        
                        resolve();
                        // this.setData({
                        //     "landlordInfo.community":this.data.communityName[this.data.communityNameIndex].communityName
                        // })
                        // this.handleGetCommunityList(res.data.rtData[0].areaName, res.data.rtData[0].streetName)
                    })
                }
            })
         })
    },
     // 选择在京居住地址 区域选择
    bindPickerChange: function (e) {
        this.setData({
            areasIndex: e.detail.value,
            streetName: [],
            streetNameIndex: 0,
            "landlordInfo.street":"",
            communityName: [],
            communityNameIndex:0,
            "landlordInfo.community":""

        },()=>{
            this.setData({
                "landlordInfo.area": this.data.areas[this.data.areasIndex].areaName
            });
            this.handleGetStreetList(this.data.areas[this.data.areasIndex].areaName)
        })
    },
    // 在京选择乡镇、街道
    bindPickerChangeStreetName(e){
        this.setData({
            streetNameIndex: e.detail.value,
            communityName: [],
            communityNameIndex: 0,
            "landlordInfo.community": ""
        }, () => {
            this.setData({
                "landlordInfo.street": this.data.streetName[this.data.streetNameIndex].streetName
            });
            this.handleGetCommunityList(this.data.streetName[this.data.streetNameIndex].areaName, this.data.streetName[this.data.streetNameIndex].streetName)
        })
    },
    bindPickerChangeCommunityName(e){
        this.setData({
            communityNameIndex: e.detail.value
        }, () => {
            this.setData({
                "landlordInfo.community":this.data.communityName[e.detail.value].communityName
            })
        })
    },

    // 是否在村里居中
    onChange(e){
        this.setData({
            isIncommunity:e.detail,
            "landlordInfo.isIncommunity": e.detail?"是":"否"
        })
    },

    // // 选择在京居住地址 区域选择
    // bindPickerChange: function (e) {
    //     this.setData({
    //         areasIndex: e.detail.value
    //     })
    // },



    // 性别

    radioChangeSex(e){
        this.setData({
            "landlordInfo.sex":e.detail.value
        })
    },
    // 证件类型
    radioChangeIdType(e){
        this.setData({
            "landlordInfo.idType":e.detail.value
        })
    },

    formSubmit: function (e) {
        //  console.log('form发生了submit事件，携带数据为：', e.detail.value)
         let objData = e.detail.value;
        let landlordInfo = this.data.landlordInfo;

        if (!this.WxValidate.checkForm(objData)) {
            //表单元素验证不通过，此处给出相应提示
            let error = this.WxValidate.errorList[0];
            // console.log(error)
            wx.showToast({
                title: error.msg,
                icon: "none",
                duration: 2000,
            });
            return false;
        }
        // 个人姓名
        if(objData.landlordName == "" || objData.landlordName == null){
             wx.showToast({
                    title: '请填写个人姓名',
                    icon: 'none',
                    duration: 2000
                });
            return false;
        }
        // 性别
        if (landlordInfo.sex == "" || landlordInfo.sex == null) {
            wx.showToast({
                title: '请选择个人性别',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 手机号
        if (objData.mobile == "" || objData.mobile == null) {
            wx.showToast({
                title: '请填写个人手机号',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        // 证件类型
        if (landlordInfo.idType == "" || landlordInfo.idType == null) {
            wx.showToast({
                title: '请选择证件类型',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 证件号
        if (objData.idNumber == "" || objData.idNumber == null) {
            wx.showToast({
                title: '请填写证件号',
                icon: 'none',
                duration: 2000
            });
            return false;

            
        }

        if(landlordInfo.idType == "二代身份证"){
            if (!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(objData.idNumber))){
                wx.showToast({
                    title: '个人信息二代身份证不正确',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }

        if(landlordInfo.area == "" || landlordInfo.area == null){
            wx.showToast({
                title: '请选择区',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if(landlordInfo.street == "" || landlordInfo.street == null){
            wx.showToast({
                title: '请选择乡镇/街道',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if(landlordInfo.community == "" || landlordInfo.community == null){
            wx.showToast({
                title: '请选择村',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if(objData.detailAddress == "" || objData.detailAddress == null){
            wx.showToast({
                title: '请填写详细地址',
                icon: 'none',
                duration: 2000
            });
            return false;
        }


        // 请填写出租房屋数
        if (objData.leaseRoomNum == "" || objData.leaseRoomNum == null) {
            wx.showToast({
                title: '请填写出租房屋数',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        // 请填写出租房屋面积
        if (objData.leaseRoomSize == "" || objData.leaseRoomSize == null) {
            wx.showToast({
                title: '请填写出租房屋面积',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        // 请填写已出租户数
        if (objData.rentedNums == "" || objData.rentedNums == null) {
            wx.showToast({
                title: '请填写已出租户数',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        // 请填写已出出租人数
        if (objData.rentedUserNums == "" || objData.rentedUserNums == null) {
            wx.showToast({
                title: '请填写已出租人数',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        if (objData.spouseIdNumber !=""){
            if (reg.test(objData.spouseIdNumber) === false){
                wx.showToast({
                    title: '配偶身份证号不正确',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }

        if (objData.chilrenIdNumbers != ""){
            let chilrenIdNumbers = objData.chilrenIdNumbers;
            let newStr = chilrenIdNumbers.replace(/，/g, ',');
            let arr = newStr.split(",");
            try{
                arr.forEach(item=>{
                    if(reg.test(item) === false){
                        wx.showToast({
                            title: '子女身份证号不正确',
                            icon: 'none',
                            duration: 2000
                        });
                        
                        throw "错误"
                    }
                })
            }catch(e){
                return false;
            }
        }


        if (objData.parentIdNumbers != "") {
            let parentIdNumbers = objData.parentIdNumbers;
            let newStr1 = parentIdNumbers.replace(/，/g, ',');
            let arr1 = newStr1.split(",");
            try {
                arr1.forEach(item => {
                    if(reg.test(item) === false){
                        wx.showToast({
                            title: '父母身份证号不正确',
                            icon: 'none',
                            duration: 2000
                        });
                        throw "错误"
                    }
                })
            } catch (e) {
                return false;
            }
        }


        for (let key in landlordInfo) {
            if (objData.hasOwnProperty(key)) {
                landlordInfo[key] = objData[key];
            }
        }
        // console.log(landlordInfo);

        wx.setStorageSync("landlordInfo",JSON.parse(JSON.stringify(landlordInfo)))

        // landlordInfo['addTime'] = new Date().getFullYear() + "-" + new Date().getMonth() + 1 + "-" + new Date().getDay();
        this.setData({
            landlordInfo
        });
        

        http(`/investigationController/addLandlordInfo.act`,Object.assign({},this.data.landlordInfo,{'openid':appInst.globalData.openId}))
        .then(res=>{
            // console.log(res)
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
        // console.log(this.data.landlordInfo)
    },
    formReset: function () {
        console.log('form发生了reset事件')
    }
})