import app = require('../app');
import pager = require('../pager');

class HostList {
    recordCount:number = 10;
    pageSize:number = 10;
    pageNo:number = 1;
    status:number = 1;
    name:string = '';
    adress:string = '';
    pagerHref:string = '/hosts?name={name}&pageSize=' + this.pageSize
        + '&pageNo={0}&status={status}&adress={adress}';


    constructor() {
        console.log(' home page loaded...');
    }

     init(name?:string, adress?:string, pageNo?:number, totalCount?:number) {
        if (totalCount)
            this.recordCount = totalCount;
        if (pageNo)
            this.pageNo = pageNo;
        if (name && name.length>0) {
            this.name = name;
            $('#input_host_name').val(name);
        }
        if (adress && adress.length>0 ){
            this.adress = adress;
            $('#input_adress_name').val(name);
        }

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
        replace(/\{adress\}/gi, (this.adress || ''));
    }

    private bindEvent() {
        $('#q_tablelist').bind('click', event=> {
            var searchname =   $('#input_host_name').val().toString().trim();
            var search_adress =   $('#input_adress_name').val().toString().trim();
            console.log('search name :' + searchname);
            this.name = searchname;
            this.adress = search_adress;
            this.pagerHref = '/hosts?adress={adress}&name={name}';
            var url:string = this.getRealHref();
            console.log("go to :" + url)
            location.href = url;
        });

        $('#reset_name').bind('click', event=> {
            this.name = null;
            this.pagerHref = '/hosts';
            var url:string = this.getRealHref();
            location.href = '/hosts';
        });

    }


}

export = new HostList();