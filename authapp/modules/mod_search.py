from flask import session
from utils.authutil import * 
from utils.commons import *  
from utils.mysqldb import *

def listall(request):
    data = {}
    data = {
        'roles' : get_role_list('', 1, 1000)
    }
    return data

def service(request):
    data = {}
    keyword = canonical_form(get_arg(request, 'keyword'))
    page = get_arg(request, 'page', default=0)
    size = get_arg(request, 'size', default=10)
    data = {
        'keyword' : keyword,
        'roles' : get_role_list(keyword, page, size)
    }
    return data

def get_role_list(keyword, page, size):
    query = "%"+keyword+"%" 
    offset = size * (page - 1)
    offset = offset if offset > 0 else 0
    roles = AuthRole.query.filter(AuthRole.role_name.like(query)).offset(offset).limit(size).all()
    return roles
