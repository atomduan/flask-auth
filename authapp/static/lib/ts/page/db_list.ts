import app = require('../app');
import pager = require('../pager');

class DbList {
    recordCount:number = 10;
    pageSize:number = 10;
    pageNo:number = 1;
    hostid:string = '';
    status:number = 1;
    name:string = '';
    pagerHref:string = '/dblist?hostid={hostid}&pageSize=' + this.pageSize
        + '&pageNo={0}&name={name}';

    constructor() {
        console.log(' page loaded...');
    }

    init(name?:string, hostid?:string, pageNo?:number, totalCount?:number) {
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
        pager.pagination('div_page', this.pageNo, this.recordCount,
            this.pageSize, null, this.getRealHref(), null);
        this.bindEvent();
    }

    /**
     * get real pager href
     * @returns {string}
     */
    private getRealHref():string {
        return this.pagerHref.replace(/\{name\}/gi,
            (this.name || '')).
        replace(/\{hostid\}/gi, this.hostid);
    }

    private bindEvent() {
        $('#q_tablelist').bind('click', event=> {
            var searchname = $('#input_table_name').val().toString().trim();
            console.log('search name :' + searchname);
            this.name = searchname;
            this.pagerHref = '/dblist?hostid={hostid}&name={name}';
            var url:string = this.getRealHref();
            console.log("go to :" + url)
            location.href = url;
        });
        $('#reset_name').bind('click', event=> {
            this.name = null;
            this.pagerHref = '/dblist?hostid={hostid}';
            var url:string = this.getRealHref();
            location.href = url;
        });
    }
}

export = new DbList();