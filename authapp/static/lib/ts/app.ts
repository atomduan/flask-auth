///<reference path="require.d.ts" />
///<reference path="jquery.d.ts" />

interface AppDefine {
    appName:string;
    version:string;
}

class App implements AppDefine {
    appName:string;
    version:string;
    toastElement:HTMLElement;
    confirmElement:HTMLElement;

    constructor(appName:string, version:string) {
        this.appName = appName;
        this.version = version;
    }

    println() {
        console.log(this.appName, this.version, new Date());
    }

    alert(msg:string, func?:Function) {
        var self = this;
        if (!this.toastElement) {
            this.toastElement = document.createElement('div');
            this.toastElement.className = 'dialog';
            $(this.toastElement).html('<div class="dialog-title">\
                    <div class="pull-left">提示</div>\
                    <div class="pull-right close x-icon"></div>\
                    <div class="clearfix"></div>\
                </div>\
                <div class="dialog-body">\
                    <div class="message text-center"></div>\
                    <div class="text-center margin-top-10">\
                        <a class="btn btn-yellow">好的</a>\
                    </div>\
                </div>');

            document.body.appendChild(this.toastElement);

            $(this.toastElement).find('.close').get(0).onclick = function () {
                $(self.toastElement).fadeOut();

                if (func)
                    func();
            }

            $(this.toastElement).find('.btn').get(0).onclick = function () {
                $(self.toastElement).fadeOut();

                if (func)
                    func();
            };
        }
        else {
            $(this.toastElement).hide();
            $(this.toastElement).css('left', -222222).css('top', -222222);

            $(this.toastElement).find('.close').get(0).onclick = function () {
                $(self.toastElement).fadeOut();

                if (func)
                    func();
            }

            $(this.toastElement).find('.btn').get(0).onclick = function () {
                $(self.toastElement).fadeOut();

                if (func)
                    func();
            };
        }
        var div = $(this.toastElement);
        div.find('.message').html(msg);
        var h = div.outerHeight();
        var w = div.outerWidth();
        var winH = $(window).height();
        var winW = $(window).width();
        if (h > winH) {
            div.height(winH);
            h = winH;
        }
        div.css('left', Math.floor((winW - w) / 2)).css('top', Math.floor((winH - h) / 2));
        div.fadeIn();
    }

    confirm(msg:string, yesFunc?:Function, noFunc?:Function) {
        if (!this.confirmElement) {
            this.confirmElement = document.createElement('div');
            this.confirmElement.className = 'dialog';
            $(this.confirmElement).html('<div class="dialog-title">\
                    <div class="pull-left">确认</div>\
                    <div class="clearfix"></div>\
                </div>\
                <div class="dialog-body">\
                    <div class="message"></div>\
                    <div class="text-right margin-top-10">\
                        <a class="btn btn-gray">取消</a>\
                        <a class="btn btn-yellow">确定</a>\
                    </div>\
                </div>');

            document.body.appendChild(this.confirmElement);
        }
        else {
            $(this.confirmElement).hide();
            $(this.confirmElement).css('left', -222222).css('top', -222222);
        }
        var div = $(this.confirmElement);
        div.find('.message').html(msg);
        var h = div.outerHeight();
        var w = div.outerWidth();
        var winH = $(window).height();
        var winW = $(window).width();
        if (h > winH) {
            div.height(winH);
            h = winH;
        }
        div.css('left', Math.floor((winW - w) / 2)).css('top', Math.floor((winH - h) / 2));
        div.fadeIn();

        $(this.confirmElement).find('.btn-gray').get(0).onclick = event=> {
            $(this.confirmElement).fadeOut();

            if (noFunc) {
                noFunc();
            }
        };

        $(this.confirmElement).find('.btn-yellow').get(0).onclick = event=> {
            $(this.confirmElement).fadeOut();

            if (yesFunc) {
                yesFunc();
            }
        };
    }

    confirm2(msg:string, func?:Function) {
        var self = this;
        if (!this.toastElement) {
            this.toastElement = document.createElement('div');
            this.toastElement.className = 'dialog';
            $(this.toastElement).html('<div class="dialog-title">\
                    <div class="pull-left">提示</div>\
                     <div class="pull-right close x-icon"></div>\
                    <div class="clearfix"></div>\
                </div>\
                <div class="dialog-body">\
                    <div class="message text-center"></div>\
                    <div class="text-center margin-top-10">\
                        <a class="btn btn-yellow">确定</a>\
                    </div>\
                </div>');

            document.body.appendChild(this.toastElement);

            $(this.toastElement).find('.close').get(0).onclick = function () {
                $(self.toastElement).fadeOut();
            }

            $(this.toastElement).find('.btn').get(0).onclick = function () {
                $(self.toastElement).fadeOut();

                if (func)
                    func();
            };
        }
        else {
            $(this.toastElement).hide();
            $(this.toastElement).css('left', -222222).css('top', -222222);

            $(this.toastElement).find('.close').get(0).onclick = function () {
                $(self.toastElement).fadeOut();
            }

            $(this.toastElement).find('.btn').get(0).onclick = function () {
                $(self.toastElement).fadeOut();

                if (func)
                    func();
            };
        }
        var div = $(this.toastElement);
        div.find('.message').html(msg);
        var h = div.outerHeight();
        var w = div.outerWidth();
        var winH = $(window).height();
        var winW = $(window).width();
        if (h > winH) {
            div.height(winH);
            h = winH;
        }
        div.css('left', Math.floor((winW - w) / 2)).css('top', Math.floor((winH - h) / 2));
        div.fadeIn();
    }

    validateNumber(str:string):boolean {
        if (!(str).match(/^\d+(\.\d+)?$/))
            return false;
        return true;
    }

    validateMobile(str:string):boolean {
        if (!(str).match(/^[1][3|4|5|7|8][0-9]{9}$/))
            return false;
        return true;
    }

    validateLoginName(str:string):boolean {
        if (!(str).match(/^[a-zA-Z_][0-9a-zA-Z_]{3,15}$/))
            return false;
        return true;
    }

    validateEmail(str:string):boolean {
        if (!str || !str.length) return false;
        if (!('' + str).match(/[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+/)) return false;
        return true;
    }

    /**
     * set cookie, non-comment use
     *
     * @method setCookie, non-comment use, please use setLocalStorage instead
     * @param {String} name
     * @param {String} value
     * @param {Int} day
     */
    setCookie(name, value, day?) {
        var Days = day || 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
    }

    /**
     * get cookie, non-comment use
     *
     * @method getCookie, non-comment use, please use getLocalStorage instead
     * @param {String} name
     * @returns {String}
     */
    getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null)
            return decodeURIComponent(arr[2]);
        return null;
    }

    /**
     * check if the browser support local storage
     *
     * @returns {boolean}
     */
    isLocalStorageSupported():boolean {
        if (typeof (window.localStorage) == "undefined") return false;
        var testKey = 'test', storage = window.sessionStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    /**
     * get local storage, which use html5 local storage first; if down-level browser, it will use cookie
     *
     * @method getLocalStorage
     * @param {String} name
     * @returns {*}
     */
    getLocalStorage(name) {
        if (!this.isLocalStorageSupported())
            return this.getCookie(name);
        return window.localStorage.getItem(name);
    }

    /**
     * set local storage, which use html5 local storage first; if down-level browser, it will use cookie
     *
     * @method setLocalStorage
     * @param {String} name
     * @param {Object} value
     */
    setLocalStorage(name, value) {
        if (!this.isLocalStorageSupported())
            this.setCookie(name, value);
        else
            window.localStorage.setItem(name, value);
    }

    /**
     * remove local storage
     *
     * @method removeLocalStorage
     * @param {String} name
     * @param {Object} value
     */
    removeLocalStorage(name) {
        if (!this.isLocalStorageSupported())
            this.setCookie(name, '');
        else
            window.localStorage.removeItem(name);
    }

    getURLParameter(name, win?:any):string {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return '';
    }

    validateIdNumber(str:string):boolean {
        var num = str.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            return false;
        }
        //验证前2位，城市符合
        var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        if (aCity[parseInt(num.substr(0, 2))] == null) {
            return false;
        }

        //下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
            re = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
            var arrSplit = num.match(re);  //检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //alert('身份证号的出生日期不对！');
                return false;
            } else {
                //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += parseInt(num.substr(i, 1)) * arrInt[i];
                }
                num += arrCh[nTemp % 11];

                return true;
            }
        }
        if (len == 18) {

            re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            var arrSplit = num.match(re);  //检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //alert('身份证号的出生日期不对！');
                return false;
            }
            else { //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += parseInt(num.substr(i, 1)) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    //alert('18位身份证号的校验码不正确！');
                    return false;
                }

                return true;
            }
        }

        return false;
    }

}

export = new App('meta_data', '1.0');