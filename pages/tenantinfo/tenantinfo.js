
import http from "../../utils/http";
var appInst =  getApp();
Page({
    data:{
        list:[],
        openId:""
    },
    onLoad(){
        this.handleGetTenantInfoByOpenid();
    },
    handleGetTenantInfoByOpenid(){
        let that = this;
        http(`/investigationController/getTenantInfoByOpenid.act?openid=${appInst.globalData.openId}`)
        .then(res=>{
            if(res.data.rtState){
                if(res.data.rtData !=null){
                     that.setData({
                        list:res.data.rtData
                    })
                }
            }
        })
    }
})