Page({
    onClickLeft(){
        wx.navigateBack();
    },
    onTap(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: `../${url}/${url}`
        })
    }
})