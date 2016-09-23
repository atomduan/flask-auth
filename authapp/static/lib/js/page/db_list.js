define(["require", "exports", '../pager'], function (require, exports, pager) {
    "use strict";
    var DbList = (function () {
        function DbList() {
            this.recordCount = 10;
            this.pageSize = 10;
            this.pageNo = 1;
            this.hostid = '';
            this.status = 1;
            this.name = '';
            this.pagerHref = '/dblist?hostid={hostid}&pageSize=' + this.pageSize
                + '&pageNo={0}&name={name}';
            console.log(' page loaded...');
        }
        DbList.prototype.init = function (name, hostid, pageNo, totalCount) {
            if (totalCount)
                this.recordCount = totalCount;
            if (pageNo)
                this.pageNo = pageNo;
            if (name && name.length > 0) {
                this.name = name;
                $('#input_table_name').val(name);
            }
            if (hostid)
                this.hostid = hostid;
            pager.pagination('div_page', this.pageNo, this.recordCount, this.pageSize, null, this.getRealHref(), null);
            this.bindEvent();
        };
        /**
         * get real pager href
         * @returns {string}
         */
        DbList.prototype.getRealHref = function () {
            return this.pagerHref.replace(/\{name\}/gi, (this.name || '')).
                replace(/\{hostid\}/gi, this.hostid);
        };
        DbList.prototype.bindEvent = function () {
            var _this = this;
            $('#q_tablelist').bind('click', function (event) {
                var searchname = $('#input_table_name').val().toString().trim();
                console.log('search name :' + searchname);
                _this.name = searchname;
                _this.pagerHref = '/dblist?hostid={hostid}&name={name}';
                var url = _this.getRealHref();
                console.log("go to :" + url);
                location.href = url;
            });
            $('#reset_name').bind('click', function (event) {
                _this.name = null;
                _this.pagerHref = '/dblist?hostid={hostid}';
                var url = _this.getRealHref();
                location.href = url;
            });
        };
        return DbList;
    }());
    return new DbList();
});
