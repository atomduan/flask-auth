from flask import session
from utils import authutil 
from utils.commons import * 
from utils.mysqldb import *

import json

def operation_validate(principal):
    if principal == None:
        raise Exception, 'Can not fetch Principal'
    current_role = session['userinfo']
    if current_role['role'] != 'admin':
        raise Exception, 'Permission denied'


def delete_principal(request):
    data = {}
    principal_id = int(authutil.canonical_form(str(get_arg(request, 'pid', default=0))))
    if principal_id == 0: raise Exception, "pid can not empty"
    principal = AuthPrincipal.query.filter_by(id=principal_id).first()
    operation_validate(principal)
    principal.principal_status = authutil.PRINCIPAL_DELETED 
    mdb.commit()


def chstatus(request):
    data = {}
    principal_id = int(authutil.canonical_form(str(get_arg(request, 'pid', default=0))))
    operation = authutil.canonical_form(get_arg(request, 'op', default=''))
    if principal_id == 0: raise Exception, "pid can not empty"
    if operation == '': raise Exception, "operation can not empty"
    principal = AuthPrincipal.query.filter_by(id=principal_id).first()
    operation_validate(principal)
    if operation == 'revoke': 
        principal.principal_status = authutil.PRINCIPAL_REVOKED
    if operation == 'activate': 
        principal.principal_status = authutil.PRINCIPAL_ACTIVE
    mdb.commit()


def modify(request):
    data = {}
    json_str = get_arg(request, 'form_json_text', default='')
    jst = json.loads(json_str)
    principal_id = int(jst['principal_id'])
    opt_principal = jst['opt_principal']
    res_principal = jst['res_principal']
    rol_principal = jst['rol_principal']
    if principal_id > 0:
        principal = AuthPrincipal.query.filter_by(id=principal_id).first()
        operation_validate(principal)
        commit_principals(principal, opt_principal, res_principal, rol_principal)
    return data


def authorize(request):
    json_str = get_arg(request, 'authorize_text', default='')
    jst = json.loads(json_str)
    role_id = int(jst['role_id'])
    opt_principal = jst['opt_principal']
    res_principal = jst['res_principal']
    rol_principal = jst['rol_principal']
    principal = AuthPrincipal()
    principal.role_id = str(int(role_id))
    operation_validate(principal)
    commit_principals(principal, opt_principal, res_principal, rol_principal)
    return 'AUTHORIZE SUCCESS'


def commit_principals(principal, operation_principal, resource_principal, role_principal):
    principal.operation_principal = operation_principal_check(operation_principal)
    principal.resource_principal = resource_principal_check(resource_principal)
    """WE DO NOT SET AND CHECK NODE ROLE's ROLE PRINCIPAL"""
    """SINCE WE HAVE ALREADY FOUND IT, USER ROLE NAME as DEFAULT"""
    role = AuthRole.query.filter_by(id=principal.role_id).first()
    if role.role_type == authutil.BRANCH_NODE:
        principal.role_principal = role_principal_check(role_principal)
    else:
        principal.role_principal = ''
    mdb.add(principal).commit()


def operation_principal_check(principal):
    pcp = principal.strip()
    if pcp == '':
        raise Exception, 'OPERATION_PRINCIPAL can not be empty'
    pcp = authutil.canonical_form(pcp)
    authutil.operation_principal_valid(pcp)
    return pcp


def resource_principal_check(principal):
    pcp = principal.strip()
    if pcp == '':
        raise Exception, 'RESOURCE_PRINCIPAL can not be empty'
    pcp = authutil.canonical_form(pcp)
    authutil.resource_principal_valid(pcp)
    return pcp


def role_principal_check(principal):
    pcp = principal.strip()
    if pcp == '':
        raise Exception, 'ROLE_PRINCIPAL can not be empty'
    """role_principal is a role path in this context"""
    pcp = authutil.canonical_form(pcp)
    authutil.role_principal_valid(pcp)
    return pcp 
