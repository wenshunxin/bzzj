Page({
    data:{
        bg:"../../static/bg.png",
        checked:true
    },
    onTap(e){
        let url = e.currentTarget.dataset.url;
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
    }
})