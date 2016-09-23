import app = require('../app');
import pager = require('../pager');

class FieldList {
    recordCount:number = 10;
    pageSize:number = 10;
    pageNo:number = 1;
    table_id:string = '';
    status:number = 1;
    name:string = '';
    pagerHref:string = '/fileds?table_id={table_id}&pageSize=' + this.pageSize
        + '&pageNo={0}&name={name}';

    constructor() {
        console.log(' filed loaded...');
    }

    init(name?:string, table_id?:string, pageNo?:number, totalCount?:number) {

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
        replace(/\{table_id\}/gi, this.table_id);
    }

    private bindEvent() {
        $('#q_tablelist').bind('click', event=> {
            var searchname = $('#input_table_name').val().toString().trim();
            console.log('search name :' + searchname);
            this.name = searchname;
            this.pagerHref = '/fileds?table_id={table_id}&name={name}';
            var url:string = this.getRealHref();
            console.log("go to :" + url)
            location.href = url;
            //alert('hello');
        });

        $('#reset_name').bind('click', event=> {
            this.name = null;
            this.pagerHref = '/fileds?table_id={table_id}';
            var url:string = this.getRealHref();
            location.href = url;
        });
    }
}

export = new FieldList();