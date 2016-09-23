from commons import db

class MDB(object):
	def __init__(self, db):
		self.db = db

	def add(self, entity):
	    self.db.session.add(entity)
	    return self
	
	def commit(self):
	    self.db.session.commit()
	    return self

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), unique=True)
	password = db.Column(db.String(256))
	role = db.Column(db.String(64), default='normal')

class AuthPrincipal(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	role_id = db.Column(db.Integer)
	operation_principal = db.Column(db.String(2048))
	resource_principal = db.Column(db.String(2048))
	role_principal = db.Column(db.String(2048))
	principal_status = db.Column(db.Integer, default=0)

class AuthRole(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	role_type = db.Column(db.Integer) 
	role_name = db.Column(db.String(256)) 
	parent_id = db.Column(db.Integer) 

mdb = MDB(db)
