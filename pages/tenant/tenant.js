/**
 * @Date:   2020-03-06T17:58:22+08:00
 * @Last modified time: 2020-03-08T13:26:27+08:00
 */
import http from "../../utils/http";
import WxValidate from "../../utils/WxValidate"
let appInst = getApp();
Page({
    data: {
        items: [
            { name: "离京未返京", checked: false },
            { name: "离京已返京", checked: false },
            { name: "未离京", checked: false }
        ],
        items1: [
            { name: "男", checked: false },
            { name: "女", checked: false }
        ],
        items2: [
            { name: "二代身份证", checked: false },
            { name: "护照", checked: false },
            { name: "港澳台居民来往通行证", checked: false },
            { name: "台湾居民来往大陆通行证", checked: false }
        ],
        items3: [
            { name: "从武汉地区或经停武汉地区到京的", checked: false },
            { name: "从武汉以外其他湖北地区或经停武汉以外其他湖北地区到京的", checked: false },
            { name: "从其他省市地区或经停其他省市地区到京的", checked: false },
        ],
        items4: [{ name: "火车", checked: false }, { name: "自驾", checked: false }, { name: "长途客运", checked: false }, { name: "飞机", checked: false }],
        items5: [{ name: "居家", checked: false }, { name: "集中点隔离", checked: false }],
        items6: [{ name: "是", checked: false }, { name: "否", checked: false }],
        areas: [],
        streetName: [],
        communityName: [],
        areasIndex: 0,
        streetNameIndex: 0,
        communityNameIndex: 0,
        pickDisabled: false,
        pickDisabled1: false,
        pickDisabled2: false,
        // 在京其他家庭成员信息 如无 或者 不在京 其他项不可填写
        disabledNoBjMate: false, //配偶
        disabledNoBjChild: false, //子女
        disabledNoBjParent: false, // 父母
        tenantInfo: {
            // sid: "",
            inStatus: "",
            leaveDate: "",
            returnDate: "",
            expectReturnDate: "",
            // 个人信息
            userName: "",
            sex: "",
            mobile: "",
            idType: "",
            idNumber: "",
            workName: "",
            workCompany: "",
            // 居住地址
            area: "",
            street: "",
            community: "",
            detailAddress: "",
            // 返京前所在地址
            returnProvince: "",
            returnCity: "",
            returnCounty: "",
            returnStreet: '',
            returnDetailAddress: "",
            // 在京其他家庭成员
            spouseName: "",
            spouseMobile: "",
            spouseIdNumber: "",
            childrenNames: "",
            childrenIdNumbers: "",
            parentNames: "",
            parentIdNumbers: "",
            // 房东信息
            landlordName: "",
            landlordMobile: "",
            landlordWeixin: "",
            // 疫情防控相关信息
            relation: "",
            returnTraffic: "",
            divideType: "",
            isSingleRoom: "",
            addTime: ""
        },
        provinceList: [],
        provinceListIndex: 0,
        cityList: [],
        cityListIndex: 0,
        countyList: [],
        countyListIndex: 0
    },






    onChange(e) {
        const { tenantInfo } = this.data;
        this.setData({
            disabledNoBjMate: e.detail,
            "tenantInfo.spouseName": e.detail ? "" : tenantInfo.spouseName,
            "tenantInfo.spouseMobile": e.detail ? "" : tenantInfo.spouseMobile,
            "tenantInfo.spouseIdNumber": e.detail ? "" : tenantInfo.spouseIdNumber
        });
    },
    onChange1(e) {
        const { tenantInfo } = this.data;
        this.setData({
            disabledNoBjChild: e.detail,
            "tenantInfo.childrenNames": e.detail ? "" : tenantInfo.childrenNames,
            "tenantInfo.childrenIdNumbers": e.detail ? "" : tenantInfo.childrenIdNumbers
        });
    },
    onChange2(e) {
        const { tenantInfo } = this.data;
        this.setData({
            disabledNoBjParent: e.detail,
            "tenantInfo.parentNames": e.detail ? "" : tenantInfo.parentNames,
            "tenantInfo.parentIdNumbers": e.detail ? "" : tenantInfo.parentIdNumbers
        });
    },
    onLoad(options) {
        let fn1 = this.handleGetAreaList();
        let fn2 = this.handleGetProvinceList();
        let fn3 = this.handleGetTenantInfoByOpenid();

        Promise.all([fn1.fn2, fn3]).then(res => {
            this.setData({
                tenantInfo: res[1]
            }, () => {
                const { tenantInfo, items, items1, items2, provinceList, areas, items3, items4, items5, items6 } = this.data;
                const {
                    inStatus,
                    sex,
                    idType,
                    area,
                    spouseName,
                    spouseMobile,
                    spouseIdNumber,
                    childrenNames,
                    childrenIdNumbers,
                    parentNames,
                    parentIdNumbers,
                    relation,
                    returnTraffic,
                    divideType,
                    isSingleRoom,
                    returnProvince
                } = tenantInfo;
                // 在京状态数据回显
                let inStatusText = items.findIndex(item => item.name == inStatus);
                this.radioChange({ detail: { value: inStatus } })
                items[inStatusText].checked = true;
                // 男女数据回显
                let sexIndex = items1.findIndex(item => item.name == sex);
                items1[sexIndex].checked = true;

                // 证件类型
                let idTypeIndex = items2.findIndex(item => item.name == idType);
                items2[idTypeIndex].checked = true;

                // 设置区
                let areaIndex = areas.findIndex(item => item.areaName == area);


                // 设置家庭成员信息  
                //配偶
                if (spouseName == "" && spouseMobile == "" && spouseIdNumber == "") {
                    this.setData({
                        disabledNoBjMate: true
                    })
                } else {
                    this.setData({
                        disabledNoBjMate: false
                    })
                }
                // 子女
                if (childrenNames == "" && childrenIdNumbers == "") {
                    this.setData({
                        disabledNoBjChild: true
                    })
                } else {
                    this.setData({
                        disabledNoBjChild: false
                    })
                };
                // 父母

                if (parentNames == "" && parentIdNumbers == "") {
                    this.setData({
                        disabledNoBjParent: true
                    })
                } else {
                    this.setData({
                        disabledNoBjParent: false
                    })
                }

                // 返京前地址数据回显 
                // returnProvince
                // console.log(returnProvince)
                // console.log(provinceList.findIndex(item => item.cityFullName == returnProvince))
                this.setData({
                    provinceListIndex: provinceList.findIndex(item => item.cityFullName == returnProvince)
                })
                // 设置疫情防控相关信息回显
                let fyIndex1 = items3.findIndex(item => item.name == relation);
                if (fyIndex1 > -1) {
                    items3[fyIndex1].checked = true;
                }

                let fyIndex2 = items4.findIndex(item => item.name == returnTraffic);
                if (fyIndex2 > -1) {
                    items4[fyIndex2].checked = true;
                }
                let fyIndex3 = items5.findIndex(item => item.name == divideType);
                if (fyIndex3 > -1) {
                    items5[fyIndex3].checked = true;
                }
                let fyIndex4 = items6.findIndex(item => item.name == isSingleRoom);
                if (fyIndex4 > -1) {
                    items6[fyIndex4].checked = true;
                }
                this.setData({
                    items, items1, items2, items3, items4, items5, items6,
                    areasIndex: areaIndex
                })

            })

        });

        this.initValidate();
    },

    initValidate() {
        let rules = {
            mobile: {
                required: true,
                tel:true
            },
            landlordMobile:{
                required:true,
                tel:true
            },
            spouseMobile:{
                tel:true
            }
        }

        let message = {
            mobile: {
                required: '请输入手机号',
                tel: "请正确输入个人手机号"
            },
            landlordMobile:{
                required: '请输入房东手机号',
                tel:"请正确输入房东手机号"
            },
            spouseMobile:{
                tel:"请正确填写配偶手机号"
            }
        }
        //实例化当前的验证规则和提示消息
        this.WxValidate = new WxValidate(rules, message);
    },
    // 数据回显
    handleGetTenantInfoByOpenid() {
        return new Promise((resolve, reject) => {
            http(`/investigationController/getCurTenantInfo.act?openid=${appInst.globalData.openId}`)
            .then(res => {
                if (res.data.rtState) {
                    delete res.data.rtData['addTime'];
                    delete res.data.rtData['sid'];
                    resolve(res.data.rtData);
                }
            })
        })
    },

    // 获取全国省
    handleGetProvinceList() {
        return new Promise((resolve, reject) => {
            http(`/cityController/getProvinceList.act`)
            .then(res => {
                if (res.data.rtState) {
                    this.setData({
                        provinceList: res.data.rtData
                    }, () => {
                        const { tenantInfo, provinceList } = this.data;
                        if (tenantInfo.returnProvince != "") {
                            let index = provinceList.findIndex(item => item.cityFullName == tenantInfo.returnProvince);
                            this.handleGetCityList(provinceList[index].cityCode)
                        } else {
                            this.setData({
                                "tenantInfo.returnProvince": res.data.rtData[0].cityFullName
                            })
                            this.handleGetCityList(res.data.rtData[0].cityCode)
                        }
                        resolve();
                    })
                }
            })
        })
    },
    // 获取地级市
    handleGetCityList(cityCode) {
        http(`/cityController/getCityListByCode.act?cityCode=${cityCode}`)
        .then(res => {
            if (res.data.rtState) {
                this.setData({
                    cityList: res.data.rtData,
                    cityListIndex: 0
                }, () => {
                    const { tenantInfo, cityList } = this.data;
                    if (tenantInfo.returnCity == "") {
                        this.setData({
                            "tenantInfo.returnCity": res.data.rtData[0].cityFullName
                        })
                        this.handleGetCountyList(res.data.rtData[0].cityCode)
                    } else {
                        let index = cityList.findIndex(item => item.cityFullName == tenantInfo.returnCity);
                        this.setData({
                            cityListIndex: index
                        });
                        this.handleGetCountyList(cityList[index].cityCode)
                    }
                })
            }
        })
    },
    handleGetCountyList(cityCode) {
        http(`/cityController/getCountyListByCode.act?cityCode=${cityCode}`)
        .then(res => {
            if (res.data.rtState) {
                this.setData({
                    countyList: res.data.rtData,
                    countyListIndex: 0
                }, () => {
                    const { tenantInfo, countyList } = this.data;
                    if (tenantInfo.returnCounty != "") {
                        let index = countyList.findIndex(item => item.cityFullName == tenantInfo.returnCounty);
                        this.setData({
                            countyListIndex: index
                        })
                    } else {
                        this.setData({
                            "tenantInfo.returnCounty": res.data.rtData.length ? res.data.rtData[0].cityFullName : ''
                        })
                    }
                })
            }
        })
    },
    bindPickerChangeProvince(e) {
        this.setData({
            provinceListIndex: e.detail.value,
            "tenantInfo.returnProvince": this.data.provinceList[e.detail.value].cityFullName,
            countyList: [],
            countyListIndex: 0,
            countyList: [],
            countyListIndex: 0,
            "tenantInfo.returnCity": "",
            "tenantInfo.returnCounty": ""
        }, () => {
            this.handleGetCityList(this.data.provinceList[e.detail.value].cityCode)
        })
    },
    bindPickerChangeCityList(e) {
        this.setData({
            cityListIndex: e.detail.value,
            "tenantInfo.returnCity": this.data.cityList[e.detail.value].cityFullName,
            countyList: [],
            countyListIndex: 0,
            "tenantInfo.returnCounty": ""
        }, () => {
            this.handleGetCountyList(this.data.cityList[e.detail.value].cityCode)
        })
    },
    bindPickerChangeCountyList(e) {
        this.setData({
            countyListIndex: e.detail.value,
            "tenantInfo.returnCounty": this.data.countyList[e.detail.value].cityFullName
        })
    },
    // 获取区列表
    handleGetAreaList() {
        return new Promise((resolve, reject) => {
            http("/areaInfoController/getAreaList.act")
            .then(res => {
                if (res.data.rtState) {
                    this.setData({
                        areas: [{ "areaName": "请选择区" }].concat(res.data.rtData)
                    }, () => {
                        if (this.data.tenantInfo.area != "") {
                            this.handleGetStreetList(this.data.tenantInfo.area)
                        }
                        resolve();
                    })
                }
            })
        })
    },
    // 获取乡镇/街道
    handleGetStreetList(areaName) {
        http("/areaInfoController/getStreetList.act?areaName=" + areaName)
        .then(res => {
            if (res.data.rtState) {
                this.setData({
                    streetName: [{ "streetName": "请选择乡镇/街道" }].concat(res.data.rtData)
                }, () => {
                    if (this.data.tenantInfo.street != '') {
                        this.setData({
                            streetNameIndex: this.data.streetName.findIndex(item => item.streetName == this.data.tenantInfo.street)
                        })
                        this.handleGetCommunityList(this.data.tenantInfo.area, this.data.tenantInfo.street)
                    }
                })
            }
        })
    },
    // 获取存列表
    handleGetCommunityList(areaName, streetName) {
        http(`/areaInfoController/getCommunityList.act?areaName=${areaName}&streetName=${streetName}`)
            .then(res => {
                if (res.data.rtState) {
                    this.setData({
                        communityName: [{ "communityName": "请选择村" }].concat(res.data.rtData)
                    }, () => {
                        if (this.data.tenantInfo.community != '') {
                            this.setData({
                                communityNameIndex: this.data.communityName.findIndex(item => item.communityName == this.data.tenantInfo.community)
                            })
                        }
                    })
                }
            })
    },
    radioChange(e) {
        let value = e.detail.value;
        this.setData({
            "tenantInfo.inStatus": value
        })
        let { pickDisabled, pickDisabled1, pickDisabled2, items3, items4, items5, items6 } = this.data;
        items3.forEach(item => {
            item['checked'] = false;
        });
        items4.forEach(item => {
            item['checked'] = false;
        })
        items5.forEach(item => {
            item['checked'] = false;
        })
        items6.forEach(item => {
            item['checked'] = false;
        });
        this.setData({
            items3, items4, items5, items6
        })
        if (value == '未离京') {
            this.setData({
                pickDisabled: true,
                pickDisabled1: true,
                pickDisabled2: true,
                'tenantInfo.leaveDate': "",
                "tenantInfo.returnDate": "",
                "tenantInfo.expectReturnDate": "",
                "tenantInfo.relation": "",
                "tenantInfo.returnTraffic": "",
                "tenantInfo.divideType": "",
                "tenantInfo.isSingleRoom": ""
            })
        } else if (value == '离京未返京') {
            this.setData({
                pickDisabled: false,
                pickDisabled1: true,
                pickDisabled2: false,
                'tenantInfo.leaveDate': "",
                "tenantInfo.returnDate": "",
                "tenantInfo.relation": "",
                "tenantInfo.returnTraffic": "",
                "tenantInfo.divideType": "",
                "tenantInfo.isSingleRoom": ""
            })
        } else {
            this.setData({
                pickDisabled: false,
                pickDisabled1: false,
                pickDisabled2: true
            })
        }
    },
    bindDateChange(e) {
        this.setData({
            "tenantInfo.leaveDate": e.detail.value
        })
    },
    bindDateChange1(e) {
        this.setData({
            "tenantInfo.returnDate": e.detail.value
        });
    },
    bindDateChange2(e) {
        this.setData({
            "tenantInfo.expectReturnDate": e.detail.value
        })
    },
    // 选择在京居住地址 区域选择
    bindPickerChange: function (e) {
        this.setData({
            areasIndex: e.detail.value,
            streetName: [],
            streetNameIndex: "",
            "tenantInfo.street": "",
            communityName: [],
            communityNameIndex: 0,
            "tenantInfo.community": ""
        }, () => {
            this.setData({
                "tenantInfo.area": this.data.areas[this.data.areasIndex].areaName
            });
            this.handleGetStreetList(this.data.areas[this.data.areasIndex].areaName)
        })
    },
    bindPickerChangeStreetName(e) {
        this.setData({
            streetNameIndex: e.detail.value,
            communityName: [],
            communityNameIndex: 0,
            "tenantInfo.community": ""
        }, () => {
            this.setData({
                "tenantInfo.street": this.data.streetName[this.data.streetNameIndex].streetName
            });
            this.handleGetCommunityList(this.data.streetName[this.data.streetNameIndex].areaName, this.data.streetName[this.data.streetNameIndex].streetName)
        })
    },
    bindPickerChangeCommunityName(e) {
        this.setData({
            communityNameIndex: e.detail.value
        }, () => {
            this.setData({
                "tenantInfo.community": this.data.communityName[e.detail.value].communityName
            })
        })
    },
    // 个人信息性别
    radioChangeSex(e) {
        this.setData({
            'tenantInfo.sex': e.detail.value
        })
    },
    // 个人证件类型
    radioChangeIdType(e) {
        this.setData({
            "tenantInfo.idType": e.detail.value
        })
    },
    // 与疫情有关
    radioChangeRelation(e) {
        this.setData({
            "tenantInfo.relation": e.detail.value
        })
    },
    radioChangeReturnTraffic(e) {
        this.setData({
            "tenantInfo.returnTraffic": e.detail.value
        })
    },
    radioChangeDivideType(e) {
        this.setData({
            "tenantInfo.divideType": e.detail.value
        })
    },
    radioChangeIsSingleRoom(e) {
        this.setData({
            "tenantInfo.isSingleRoom": e.detail.value
        })
    },
    formSubmit: function (e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        let { tenantInfo } = this.data;
        let objData = e.detail.value;
        // let params = e.detail.value;
        // console.log(params)
        if (!this.WxValidate.checkForm(objData)) {
            //表单元素验证不通过，此处给出相应提示
            let error = this.WxValidate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: "none",
                duration: 2000,
            })
            return false;
        }



        if (tenantInfo.inStatus == "" || tenantInfo.inStatus == null) {
            wx.showToast({
                title: '请选择在京状态',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (tenantInfo.inStatus == '离京未返京') {
            if (tenantInfo.leaveDate == "" || tenantInfo.leaveDate == null) {
                wx.showToast({
                    title: '请选择离京日期',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (tenantInfo.expectReturnDate == "" || tenantInfo.expectReturnDate == null) {
                wx.showToast({
                    title: '请选择预计返京日期',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }
        if (tenantInfo.inStatus == '离京已返京') {
            if (tenantInfo.leaveDate == "" || tenantInfo.leaveDate == null) {
                wx.showToast({
                    title: '请选择离京日期',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (tenantInfo.returnDate == "" || tenantInfo.returnDate == null) {
                wx.showToast({
                    title: '请选择返京日期',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }
        // 个人姓名
        if (objData.userName == "" || objData.userName == null) {
            wx.showToast({
                title: '请填写个人姓名',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 个人信息性别
        if (tenantInfo.sex == "" || tenantInfo.sex == null) {
            wx.showToast({
                title: '请选择个人性别',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 个人信息手机号
        if (objData.mobile == "" || objData.mobile == null) {
            wx.showToast({
                title: '请填写个人手机号',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 个人证件类型
        if (tenantInfo.idType == "" || tenantInfo.idType == null) {
            wx.showToast({
                title: '请选择个人证件类型',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 个人证件号
        if (objData.idNumber == '' || objData.idNumber == null) {
            wx.showToast({
                title: '请填写个人证件号',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        if (tenantInfo.idType == "二代身份证") {
            if (!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(objData.idNumber))) {
                wx.showToast({
                    title: '个人信息二代身份证不正确',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }
        // 个人从事工作
        if (objData.workName == "" || objData.workName == null) {
            wx.showToast({
                title: '请填写个人从事工作',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 个人工作单位
        if (objData.workCompany == "" || objData.workCompany == null) {
            wx.showToast({
                title: '请填写个人工作单位',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        // 在京居住地址信息验证
        if (tenantInfo.area == "" || tenantInfo.area == null || tenantInfo.area == "请选择区") {
            wx.showToast({
                title: '请选择在京居住区',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (tenantInfo.street == "" || tenantInfo.street == null || tenantInfo.street == "请选择乡镇/街道") {
            wx.showToast({
                title: '请选择在京居住乡镇/街道',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (tenantInfo.community == "" || tenantInfo.community == null || tenantInfo.community == "请选择村") {
            wx.showToast({
                title: '请选择在京居住区村',
                icon: 'none',
                duration: 2000
            });
            return false;
        }  
        // 门牌号
        if (objData.detailAddress == '' || objData.detailAddress == null) {
            wx.showToast({
                title: '请填写在京居住地址门牌号',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (tenantInfo.inStatus != "未离京") {
            if (objData.returnStreet == "" || objData.returnStreet == null) {
                wx.showToast({
                    title: '请填写返京前乡镇/街道',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (objData.returnDetailAddress == "" || objData.returnDetailAddress == null) {
                wx.showToast({
                    title: '请填写返京前具体地址',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }
        const { disabledNoBjMate, disabledNoBjChild, disabledNoBjParent } = this.data; 
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!disabledNoBjMate) {
            if (objData.spouseName == '' || objData.spouseName == null) {
                wx.showToast({
                    title: '请填写配偶姓名',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (objData.spouseMobile == "" || objData.spouseMobile == null) {
                wx.showToast({
                    title: '请填写配偶手机号',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (objData.spouseIdNumber == "" || objData.spouseIdNumber == null) {
                wx.showToast({
                    title: '请填写配偶二代身份证号',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (reg.test(objData.spouseIdNumber) === false) {
                wx.showToast({
                    title: '配偶身份证号不正确',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }
        if (!disabledNoBjChild) {
            if (objData.childrenNames == '' || objData.childrenNames == null) {
                wx.showToast({
                    title: '请填写子女姓名',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (objData.childrenIdNumbers == "" || objData.childrenIdNumbers == null) {
                wx.showToast({
                    title: '请填写子女二代身份证号',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            let chilrenIdNumbers = objData.chilrenIdNumbers;
            let newStr = chilrenIdNumbers.replace(/，/g, ',');
            let arr = newStr.split(",");
            try {
                arr.forEach(item => {
                    if (reg.test(item) === false) {
                        wx.showToast({
                            title: '子女身份证号不正确',
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
        if (!disabledNoBjParent) {
            if (objData.parentNames == '' || objData.parentNames == null) {
                wx.showToast({
                    title: '请填写父母姓名',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (objData.parentIdNumbers == "" || objData.parentIdNumbers == null) {
                wx.showToast({
                    title: '请填写父母二代身份证号',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            let parentIdNumbers = objData.parentIdNumbers;
            let newStr1 = parentIdNumbers.replace(/，/g, ',');
            let arr1 = newStr1.split(",");
            try {
                arr1.forEach(item => {
                    if (reg.test(item) === false) {
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
        // 房东信息
        if (objData.landlordName == "" || objData.landlordName == null) {
            wx.showToast({
                title: '请填写房东姓名',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (objData.landlordMobile == "" || objData.landlordMobile == null) {
            wx.showToast({
                title: '请填写房东手机号',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (tenantInfo.inStatus == '离京已返京') {
            if (tenantInfo.relation == "" || tenantInfo.relation == null) {
                wx.showToast({
                    title: '请选择与疫情关系',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (tenantInfo.returnTraffic == "" || tenantInfo.returnTraffic == null) {
                wx.showToast({
                    title: '请选择返京交通方式',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (tenantInfo.divideType == "" || tenantInfo.divideType == null) {
                wx.showToast({
                    title: '请选择隔离观察方式',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            if (tenantInfo.isSingleRoom == "" || tenantInfo.isSingleRoom == null) {
                wx.showToast({
                    title: '请选择是否单人单间',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        }
        for (let key in tenantInfo) {
            if (objData.hasOwnProperty(key)) {
                tenantInfo[key] = objData[key];
            } else {
                tenantInfo[key] = tenantInfo[key];
            }
        }
        this.setData({
            tenantInfo
        });
        http(`/investigationController/addTenantInfo.act`, Object.assign({}, this.data.tenantInfo, { 'openid': appInst.globalData.openId }))
            .then(res => {
                if (res.data.rtState) {
                    wx.showToast({
                        title: "保存成功",
                        icon: "success",
                        duration: 2000,
                        success() {
                            setTimeout(()=>{
                                wx.navigateBack();
                            },2000)
                        }
                    })
                }
            })
    },
    formReset: function () {
        console.log('form发生了reset事件')
    }
})
