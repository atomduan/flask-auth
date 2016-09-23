interface AjaxPager {
    pagination(container:string|HTMLElement, pageIndex:number, total:number, pageSize:number, func?:any, href?:any, config?:Object) : void;
}