define(["require", "exports", '../pager'], function (require, exports, pager) {
    "use strict";
    var TableList = (function () {
        function TableList() {
            this.recordCount = 10;
            this.pageSize = 10;
            this.pageNo = 1;
            this.db_id = '';
            this.status = 1;
            this.name = '';
            this.pagerHref = 'tables?db_id={db_id}&pageSize=' + this.pageSize
                + '&pageNo={0}&name={name}';
            console.log(' page loaded...');
        }
        TableList.prototype.init = function (name, db_id, pageNo, totalCount) {
            if (totalCount)
                this.recordCount = totalCount;
            if (pageNo)
                this.pageNo = pageNo;
            if (name && name.length > 0) {
                this.name = name;
                //if((name.length)>0)
                $('#input_table_name').val(name);
            }
            if (db_id)
                this.db_id = db_id;
            pager.pagination('div_page', this.pageNo, this.recordCount, this.pageSize, null, this.getRealHref(), null);
            this.bindEvent();
        };
        /**
         * get real pager href
         * @returns {string}
         */
        TableList.prototype.getRealHref = function () {
            return this.pagerHref.replace(/\{name\}/gi, (this.name || '')).
                replace(/\{db_id\}/gi, this.db_id);
        };
        TableList.prototype.bindEvent = function () {
            var _this = this;
            $('#q_tablelist').bind('click', function (event) {
                var searchname = $('#input_table_name').val().toString().trim();
                console.log('search name :' + searchname);
                _this.name = searchname;
                _this.pagerHref = 'tables?db_id={db_id}&name={name}';
                var url = _this.getRealHref();
                console.log("go to :" + url);
                location.href = url;
                //alert('hello');
            });
            $('#reset_name').bind('click', function (event) {
                _this.name = null;
                _this.pagerHref = 'tables?db_id={db_id}';
                var url = _this.getRealHref();
                location.href = url;
            });
        };
        return TableList;
    }());
    return new TableList();
});
