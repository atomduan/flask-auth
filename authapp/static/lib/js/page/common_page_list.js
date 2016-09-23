define(["require", "exports", '../pager'], function (require, exports, pager) {
    "use strict";
    var CommonPageList = (function () {
        function CommonPageList() {
            this.recordCount = 10;
            this.pageSize = 10;
            this.pageNo = 1;
            this.pagerHref = '';
            console.log(' common page  loaded...');
        }
        CommonPageList.prototype.getRealHref = function () {
            return this.pagerHref;
        };
        CommonPageList.prototype.init = function (pageNo, pageSize, totalCount) {
            if (totalCount)
                this.recordCount = totalCount;
            if (pageSize)
                this.pageSize = pageSize;
            if (pageNo)
                this.pageNo = pageNo;
            pager.pagination('div_page', this.pageNo, this.recordCount, this.pageSize, null, this.getRealHref(), null);
        };
        return CommonPageList;
    }());
    return new CommonPageList();
});
