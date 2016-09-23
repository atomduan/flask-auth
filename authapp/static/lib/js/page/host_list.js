define(["require", "exports", '../pager'], function (require, exports, pager) {
    "use strict";
    var HostList = (function () {
        function HostList() {
            this.recordCount = 10;
            this.pageSize = 10;
            this.pageNo = 1;
            this.status = 1;
            this.name = '';
            this.adress = '';
            this.pagerHref = '/hosts?name={name}&pageSize=' + this.pageSize
                + '&pageNo={0}&status={status}&adress={adress}';
            console.log(' home page loaded...');
        }
        HostList.prototype.init = function (name, adress, pageNo, totalCount) {
            if (totalCount)
                this.recordCount = totalCount;
            if (pageNo)
                this.pageNo = pageNo;
            if (name && name.length > 0) {
                this.name = name;
                $('#input_host_name').val(name);
            }
            if (adress && adress.length > 0) {
                this.adress = adress;
                $('#input_adress_name').val(name);
            }
            pager.pagination('div_page', this.pageNo, this.recordCount, this.pageSize, null, this.getRealHref(), null);
            this.bindEvent();
        };
        /**
          * get real pager href
          * @returns {string}
          */
        HostList.prototype.getRealHref = function () {
            return this.pagerHref.replace(/\{name\}/gi, (this.name || '')).
                replace(/\{adress\}/gi, (this.adress || ''));
        };
        HostList.prototype.bindEvent = function () {
            var _this = this;
            $('#q_tablelist').bind('click', function (event) {
                var searchname = $('#input_host_name').val().toString().trim();
                var search_adress = $('#input_adress_name').val().toString().trim();
                console.log('search name :' + searchname);
                _this.name = searchname;
                _this.adress = search_adress;
                _this.pagerHref = '/hosts?adress={adress}&name={name}';
                var url = _this.getRealHref();
                console.log("go to :" + url);
                location.href = url;
            });
            $('#reset_name').bind('click', function (event) {
                _this.name = null;
                _this.pagerHref = '/hosts';
                var url = _this.getRealHref();
                location.href = '/hosts';
            });
        };
        return HostList;
    }());
    return new HostList();
});
