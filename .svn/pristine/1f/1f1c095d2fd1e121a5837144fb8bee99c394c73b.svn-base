const BASEURL = 'https://www.xdmhome.cn/bzzj';

const http = (url, params, method) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASEURL+url,
            data: params,
            method: method || "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            dataType: "json",
            success(res) {
                resolve(res)
            },
            fail(res) {
                reject(res)
            }
        })
    })
};
export default http;