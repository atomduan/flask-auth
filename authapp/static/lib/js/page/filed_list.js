define(["require", "exports", '../pager'], function (require, exports, pager) {
    "use strict";
    var FieldList = (function () {
        function FieldList() {
            this.recordCount = 10;
            this.pageSize = 10;
            this.pageNo = 1;
            this.table_id = '';
            this.status = 1;
            this.name = '';
            this.pagerHref = '/fileds?table_id={table_id}&pageSize=' + this.pageSize
                + '&pageNo={0}&name={name}';
            console.log(' filed loaded...');
        }
        FieldList.prototype.init = function (name, table_id, pageNo, totalCount) {
            if (totalCount)
                this.recordCount = totalCount;
            if (pageNo)
                this.pageNo = pageNo;
            if (name && name.length > 0) {
                this.name = name;
                //if((name.length)>0)
                $('#input_table_name').val(name);
            }
            if (table_id)
                this.table_id = table_id;
            pager.pagination('div_page', this.pageNo, this.recordCount, this.pageSize, null, this.getRealHref(), null);
            this.bindEvent();
        };
        /**
         * get real pager href
         * @returns {string}
         */
        FieldList.prototype.getRealHref = function () {
            return this.pagerHref.replace(/\{name\}/gi, (this.name || '')).
                replace(/\{table_id\}/gi, this.table_id);
        };
        FieldList.prototype.bindEvent = function () {
            var _this = this;
            $('#q_tablelist').bind('click', function (event) {
                var searchname = $('#input_table_name').val().toString().trim();
                console.log('search name :' + searchname);
                _this.name = searchname;
                _this.pagerHref = '/fileds?table_id={table_id}&name={name}';
                var url = _this.getRealHref();
                console.log("go to :" + url);
                location.href = url;
                //alert('hello');
            });
            $('#reset_name').bind('click', function (event) {
                _this.name = null;
                _this.pagerHref = '/fileds?table_id={table_id}';
                var url = _this.getRealHref();
                location.href = url;
            });
        };
        return FieldList;
    }());
    return new FieldList();
});
