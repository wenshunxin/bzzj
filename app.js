//app.js
import http from './utils/http';
App({
	onLaunch: function() {
        // 展示本地存储能力
        let that = this;
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);
		// 登录
		wx.login({
			success: (res) => {

                http(`/investigationController/getUserInfo.act?code=${res.code}`)
                .then(res=>{
                    if(res.data.rtState){
                        // console.log(JSON.parse(res.data.rtData))
                        that.globalData.openId = JSON.parse(res.data.rtData).openid
                    }
                })
				// console.log(res);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // wx.request({
                //     url:`http://192.168.0.165:8080/bzzj/`,
                //     methods:"POST",
                //     success(res){
                //         console.log(res)
                //         // wx.showToast({
                //         //     title: "2",
                //         //     icon: 'none',
                //         //     duration: 2000
                //         // });
                //         // if(res.statusCode == 200){

                //         //    wx.showToast({
                //         //         title: res.data.openid,
                //         //         icon: 'none',
                //         //         duration: 2000
                //         //     });
                //         //     that.globalData.openId = res.data.openid;
                //         //     // that.handleGetTenantInfoByOpenid(res.data.openid);
                //         // }
                //     }
                // })
			}
		});
		// 获取用户信息
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: (res) => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo;

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res);
							}
						}
					});
				}
			}
		});
    },
    // handleGetTenantInfoByOpenid(openId){
    //     let that = this;
    //     http(`/investigationController/getTenantInfoByOpenid.act?openid=${openId}`)
    //     .then(res=>{
    //         if(res.data.rtState){
    //             that.globalData.list = res.data.rtData;
    //         }
    //     })
    // },
	globalData: {
        list:[],
        userInfo: null,
        openId:"",
        appId:'wx3ae9bdc0f6227a1a',
        secret:"f2fd2700bbad42aa3bd30bc5b1bb3b77"

	}
});
// appId:wx3ae9bdc0f6227a1a
// secret:f2fd2700bbad42aa3bd30bc5b1bb3b77
