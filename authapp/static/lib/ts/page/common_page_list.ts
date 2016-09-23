import app = require('../app');
import pager = require('../pager');

class CommonPageList {
    recordCount:number = 10;
    pageSize:number = 10;
    pageNo:number = 1;
    pagerHref:string = '';

    constructor() {
        console.log(' common page  loaded...');
    }

    private getRealHref():string {
        return this.pagerHref;
    }

    init(pageNo?:number, pageSize?:number, totalCount?:number) {
        if (totalCount)
            this.recordCount = totalCount;

        if (pageSize)
            this.pageSize = pageSize;

        if (pageNo)
            this.pageNo = pageNo;
        pager.pagination('div_page', this.pageNo, this.recordCount,
            this.pageSize, null, this.getRealHref(), null);

    }

}

export = new CommonPageList();