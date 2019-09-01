from flask import session
from utils.authutil import * 
from utils.commons import *  
from utils.mysqldb import *

from sqlalchemy import func, and_


DEFAULT_DEPTH = 6

def service(request):
    data = {}
    role_id = int(canonical_form(str(get_arg(request, 'role_id', default=0))))
    if role_id > 0:
        data = {
            'role' : get_role(role_id)
        }
    else:
        raise Exception, "role_id can not empty"
    return data

def add_role(request):
    data = {}
    parent_id = int(canonical_form(str(get_arg(request, 'parent_id', default=0))))
    role_type = int(canonical_form(str(get_arg(request, 'role_type', default=0))))
    role_name = str(get_arg(request, 'role_name', default=0))
    if get_role_by_name(role_name) == None:
        role = AuthRole()    
        role.parent_id = parent_id
        role.role_type = role_type
        role.role_name = role_name
        mdb.add(role).commit()
        data = {
            'role' : role,
        }
    else:
        raise Exception, "Already has role name ["+role_name+"]"
    return data

def get_role_by_name(role_name):
    return AuthRole.query.filter_by(role_name=role_name).first()


def get_role(role_id):
    role = None
    if role_id > 0:
        role = AuthRole.query.filter_by(id=role_id).first()
    else:
        role = AuthRole.query.filter_by(id=None).first()
    return role
