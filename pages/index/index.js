Page({
    data:{
        bg:"../../static/bg.png",
        checked:true
    },
    onTap(e){
        let url = e.currentTarget.dataset.url;

        const { checked } = this.data;

        if(!checked){
            wx.showModal({
                title:"提示",
                content:"请阅读并接受《用户使用协议》及《隐私政策》",
                showCancel:false,
                success:(res)=>{
                    console.log(res)
                }
            })
            return false;
        }

        wx.navigateTo({
            url: `../${url}/${url}`
        })
    },
    onChange(e){
        this.setData({
            checked:e.detail
        })
    },
    handleGoServe(){
        wx.navigateTo({
            url:"../service/service"
        })
    },
    handleGoSecret() {
        wx.navigateTo({
            url: "../secret/secret"
        })
    }
})