///<reference path="pager.d.ts" />

class Pager implements AjaxPager {

    pagination(container:string | HTMLElement, pageIndex:number, total:number,
               pageSize:number, func:any, href:any, config:Object):void {
        var totalPage:number = total;

        if (pageSize && typeof (pageSize) === "number" && pageSize > 0) {
            totalPage = Math.floor(total / pageSize);
            if (total % pageSize > 0) totalPage++;
        }

        this.doAjaxPager(container, pageIndex, totalPage, func, href, config);
    }

    private doAjaxPager(container, curPage, totalPage, func, href, config) {
        var divPager = typeof (container) == "string" ? document.getElementById(container) : container;
        if (!divPager || !divPager.tagName) return;
        divPager.innerHTML = "";
        if (totalPage < 2)
            return;
        config = config || {};
        var clientId = new Date().getMilliseconds().toString();
        if (divPager.id)
            clientId = divPager.id;
        var buildObj = function BuildIndex() {
            if (curPage > totalPage)
                curPage = Number(totalPage);
            else if (curPage <= 0)
                curPage = 1;

            //first && prev

            var a = document.createElement("a");
            divPager.appendChild(a);
            a.className = 'page_list';
            a.innerHTML = config['prevText']||'上一页';
            if(curPage!=1){
                if (href) {
                    a.href = href.replace(/\{0\}/gi, (Number(curPage)-1).toString());
                }
                if (func) {
                    a.onclick = function () {
                        func(curPage-1);
                    }
                }
            }
            else{
                a.className = 'page_disable';
            }

            if (totalPage <= 10) {
                for (var i = 1; i <= totalPage; i++) {
                    if (i == curPage) {
                        var a = document.createElement("a");
                        divPager.appendChild(a);
                        a.className = 'page_num active';
                        a.innerHTML = i.toString();
                    }
                    else {
                        var a = document.createElement("a");
                        a.className = 'page_num';
                        divPager.appendChild(a);
                        a.innerHTML = i.toString();
                        a.setAttribute('pager', i.toString());
                        if (href) {
                            a.href = href.replace(/\{0\}/gi, i.toString());
                        }
                        if (func) {
                            a.onclick = function () {
                                func(parseInt(this.getAttribute('pager')));
                            }
                        }
                    }
                }
            }
            else {
                if (1 == curPage) {
                    var a = document.createElement("a");
                    divPager.appendChild(a);
                    a.className = 'page_num active';
                    a.innerHTML = "1";
                }
                else {
                    var a = document.createElement("a");
                    a.className = 'page_num';
                    divPager.appendChild(a);
                    a.innerHTML = "1";
                    a.setAttribute('pager', "1");
                    if (href) {
                        a.href = href.replace(/\{0\}/gi, "1");
                    }
                    if (func) {
                        a.onclick = function () {
                            func(parseInt(this.getAttribute('pager')));
                        }
                    }
                }

                if (curPage <= 5) {
                    for (var i = 2; i <= 9; i++) {
                        if (i == curPage) {
                            var a = document.createElement("a");
                            divPager.appendChild(a);
                            a.className = 'page_num active';
                            a.innerHTML = i.toString();
                        } else {
                            var a = document.createElement("a");
                            a.className = 'page_num';
                            divPager.appendChild(a);
                            a.innerHTML = i.toString();
                            a.setAttribute('pager', i.toString());
                            if (href) {
                                a.href = href.replace(/\{0\}/gi, i.toString());
                            }
                            if (func) {
                                a.onclick = function () {
                                    func(parseInt(this.getAttribute('pager')));
                                }
                            }
                        }
                    }
                    var _tab = document.createElement("span");
                    _tab.innerHTML = "…";
                    divPager.appendChild(_tab);
                }
                else if (curPage < totalPage - 5) {
                    var _tab = document.createElement("span");
                    _tab.innerHTML = "…";
                    divPager.appendChild(_tab);
                    //1-9，再最后一页
                    for (var i = curPage - 3; i <= Number(curPage) + 4; i++) {
                        if (i == curPage) {
                            var a = document.createElement("a");
                            divPager.appendChild(a);
                            a.className = 'page_num active';
                            a.innerHTML = i.toString();
                        } else {
                            var a = document.createElement("a");
                            a.className = 'page_num';
                            divPager.appendChild(a);
                            a.innerHTML = i.toString();
                            a.setAttribute('pager', i.toString());
                            if (href) {
                                a.href = href.replace(/\{0\}/gi, i.toString());
                            }
                            if (func) {
                                a.onclick = function () {
                                    func(parseInt(this.getAttribute('pager')));
                                }
                            }
                        }
                    }
                    _tab = document.createElement("span");
                    _tab.innerHTML = "…";
                    divPager.appendChild(_tab);
                }
                else {
                    var _tab = document.createElement("span");
                    _tab.innerHTML = "…";
                    divPager.appendChild(_tab);
                    //1-9，再最后一页
                    for (var i = totalPage - 8; i <= totalPage - 1; i++) {
                        if (i == curPage) {
                            var a = document.createElement("a");
                            divPager.appendChild(a);
                            a.className = 'page_num active';
                            a.innerHTML = i.toString();
                        } else {
                            var a = document.createElement("a");
                            a.className = 'page_num';
                            divPager.appendChild(a);
                            a.innerHTML = i.toString();
                            a.setAttribute('pager', i.toString());
                            if (href) {
                                a.href = href.replace(/\{0\}/gi, i.toString());
                            }
                            if (func) {
                                a.onclick = function () {
                                    func(parseInt(this.getAttribute('pager')));
                                }
                            }
                        }
                    }
                }
                if (totalPage == curPage) {
                    var a = document.createElement("a");
                    divPager.appendChild(a);
                    a.className = 'page_num active';
                    a.innerHTML = totalPage;
                } else {
                    var a = document.createElement("a");
                    a.className = 'page_num';
                    divPager.appendChild(a);
                    a.innerHTML = totalPage.toString();
                    a.setAttribute('pager', totalPage.toString());
                    if (href) {
                        a.href = href.replace(/\{0\}/gi, totalPage.toString());
                    }
                    if (func) {
                        a.onclick = function () {
                            func(parseInt(this.getAttribute('pager')));
                        }
                    }
                }
            }

            //first && prev
             var a = document.createElement("a");
             divPager.appendChild(a);
             a.className = 'page_list';
             a.innerHTML = config['nextText']||'下一页';
             if(curPage!=totalPage){
                 if (href) {
                     a.href = href.replace(/\{0\}/gi, (Number(curPage)+1).toString());
                 }
                 if (func) {
                     a.onclick = function () {
                         func(curPage+1);
                     }
                 }
             }
             else{
                 a.className = 'page_disable';
             }
        }

        buildObj.apply(this, arguments);
        return false;
    }
}

export = new Pager();