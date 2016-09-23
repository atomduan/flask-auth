from flask import session
from utils.authutil import * 
from utils.commons import *  
from utils.mysqldb import *

from sqlalchemy import func, and_


DEFAULT_DEPTH = 6

def service(request):
	data = {}
	role_id = int(canonical_form(str(get_arg(request, 'role_id', default=0))))
	pred_id = int(canonical_form(str(get_arg(request, 'pred_id', default=0))))
	if role_id > 0:
		rolepath = []
		rolepath.extend(get_acestors(role_id))
		rolepath.extend(get_preds(role_id, pred_id))
		data = {
			'principals' : get_principals(role_id),
			'role_path' : rolepath,
			'pred_id' : pred_id if pred_id>0 else role_id,
			'role_id' : role_id,
			'children': get_children(role_id)
		}
		return data
	else:
		raise Exception, "role_id can not empty"

def get_children(role_id):
	roles = None
	if role_id > 0:
		roles = AuthRole.query.filter_by(parent_id=role_id).all()
	else:
		roles = AuthRole.query.filter_by(parent_id=None).all()
	return roles

def get_principals(role_id):
	principals = AuthPrincipal.query.filter(
		and_(AuthPrincipal.principal_status!='2',
			AuthPrincipal.role_id==role_id)).all()
	return principals

def get_preds(role_id, pred_id, depth=DEFAULT_DEPTH):
	res = []
	if role_id == 0 or pred_id == 0: return res
	curr_id = pred_id
	find_parent = False
	for i in range(depth):
		role = AuthRole.query.filter_by(id=curr_id).first()
		if role == None: 
			break
		if role.id == role_id:
			find_parent = True
			break
		res.append(role)
		if role.parent_id == None: 
			break
		curr_id = role.parent_id
	res.reverse()
	return res if find_parent else []

def get_acestors(role_id, depth=DEFAULT_DEPTH):
	res = []
	curr_id = role_id
	for i in range(depth):
		role = AuthRole.query.filter_by(id=curr_id).first()
		if role == None: break
		res.append(role)
		if role.parent_id == None: break
		curr_id = role.parent_id
	res.reverse()
	return res
