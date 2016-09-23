from utils import mysqldb 
from flask import session
from utils import commons  

def service(request):
	name = request.form['name']
	password = commons.password_digest(request.form['password'])
	user = mysqldb.User.query.filter_by(name=name,password=password).first()
	if user is not None:
		session['userinfo'] = {
				'name':user.name, 
				'id':user.id, 
				'role':user.role}
		return True
	else:
		return False
