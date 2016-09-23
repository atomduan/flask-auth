from flask import session
from utils import commons  
from utils import authutil  
from utils.mysqldb import * 

import json


def service_multi(request):
	#json_str = commons.get_arg(request, 'request', default=None)
	#print '<<<<<<<<'+str(json_str)
	#if json_str == None:
	#	return authutil.gen_json_resp({}, code=1, msg='request is empty')
	#jst = json.loads(str(json_str))
	jst = request.json
	items = jst['items']	
	for it in items:
		try:
			user_name = it['un']
			db_name = it['dn']
			table_name = it['tn']
			operation = it['op']
			ret, msg = authenticate(user_name, db_name, table_name, operation)
			code = 0 if ret == True else 1
			resp = authutil.gen_json_resp({}, code=code, msg=msg)
			it['resp'] = resp
		except Exception, msg:
			pass
	return authutil.gen_json_resp(jst, code=0, msg='SUCCESS')


def service(request):
	user_name = request.args.get('un')
	db_name = request.args.get('dn')
	table_name = request.args.get('tn')
	operation = request.args.get('op')
	
	ret, msg = authenticate(user_name, db_name, table_name, operation)
	code = 0 if ret == True else 1
	return authutil.gen_json_resp({}, code=code, msg=msg)


def authenticate(user_name, db_name, table_name, operation):
	if db_name == None or len(db_name) == 0:
		return False, 'DB_Name can not be empty'
	if table_name == None or len(table_name) == 0:
		return False, 'Table_Name can not be empty'
	operation = authutil.canonical_form(operation)
	resource = authutil.canonical_form(db_name+'.'+table_name)
	if resource.find('*') >= 0:
		return False, 'Resource can not contain *'
	role = AuthRole.query.filter_by(
			role_name=user_name,role_type=authutil.LEAF_NODE).first()
	if role == None:
		return False, 'There is no role for user ['+user_name+']'
	#Initialize recursive principal check
	role_id = role.id
	auth_ctx = {}	
	auth_ctx['role_path'] = ''
	auth_ctx['resource'] = db_name+'.'+table_name
	auth_ctx['operation'] = operation
	auth_ctx['steps'] = 0
	return do_authenticate(role_id, authutil.LEAF_NODE, auth_ctx)


def do_authenticate(role_id, role_type, ctx):
	print ctx
	if role_id == None:
		return False, 'Principal exhausted, Terminate'
	else:
		print 'Enter do_authenticate role_id is :' + str(role_id)
	operation = ctx['operation']
	resource = ctx['resource']
	role_path = ctx['role_path']
	steps = ctx['steps']
	#Check step depth
	if steps > 2:
		return False, 'There is no neighbor principal for role_path['+role_path+']'
	#Check role exsitence
	role = AuthRole.query.filter_by(id=role_id,role_type=role_type).first()
	print '<<<<<<' + str(role.parent_id)
	if role == None:
		if role_type == authutil.LEAF_NODE:
			return False, 'There is no role for user ['+user_name+']'
		else:
			return False, 'No principal suit for current request'
	if role.role_name == None or len(role.role_name) == 0:
		return False, 'Error : Role name is empty for role_id:['+role_id+']'
	#Principal validation
	valid_result, hp= principle_validate(role, operation, resource, role_path)
	if valid_result == False:
		#update role context
		#prepend role name to role path
		if ctx['role_path'] == '':
			ctx['role_path'] = role.role_name
		else:
			ctx['role_path'] = role.role_name+'.'+role_path
		#update steps
		ctx['steps'] = steps + 1
		return do_authenticate(role.parent_id, authutil.BRANCH_NODE, ctx)
	else:
		return True, 'Principal HITED on role_path['+role_path+'] hited_pcp id is ['+str(hp.id)+']' 


def principle_validate(role, operation, resource, role_path):
	print 'PRINCIPLE_VALIDATE enter '
	principals = AuthPrincipal.query.filter_by(
			role_id=role.id, principal_status=authutil.PRINCIPAL_ACTIVE).all()
	if principals == None:
		return False, None
	else:
		operation = authutil.canonical_form(operation)
		resource = authutil.canonical_form(resource)
		role_path = authutil.canonical_form(role_path)
		if role.role_type == authutil.LEAF_NODE:
			for p in principals:
				if validate_principle_on_leaf(p, operation, resource, role_path):	
					return True, p
		else:
			for p in principals:
				if validate_principle_on_branch(p, operation, resource, role_path):	
					return True, p
	return False, None

def validate_principle_on_leaf(principal, operation, resource, role_path):
	print 'USER LEAF SKIP ROLE PRINCIPLE VALIDATE PRINCIPAL ID:['+str(principal.id)+']'
	if authutil.operation_principal_match(
			authutil.canonical_form(principal.operation_principal), operation):
		if authutil.resource_principal_match(
				authutil.canonical_form(principal.resource_principal), resource):
			return True
	return False


def validate_principle_on_branch(principal, operation, resource, role_path):
	print 'BRANCH ROLE PRINCIPLE VALIDATE PRINCIPAL ID:['+str(principal.id)+']'
	if authutil.operation_principal_match(
			authutil.canonical_form(principal.operation_principal), operation):
		if authutil.resource_principal_match(
				authutil.canonical_form(principal.resource_principal), resource):
			if authutil.role_principal_match(
					authutil.canonical_form(principal.role_principal), role_path):	
				return True
	return False
