from flask import Flask, request, url_for
from flask_sqlalchemy import SQLAlchemy
import traceback

import sys
import MySQLdb
import md5

reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask('__main__', static_url_path='')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@127.0.0.1/metaplate'
app.config['SECRET_KEY'] = '\xfc\x86\x94\x1e\xb4\xc2\xcb\x93?\x17\x95\x945\xb6\xff<\xa8c\xb5\x04u\xa4\x97\x99'

db = SQLAlchemy(app)

def password_digest(password):
    m = md5.new()
    m.update(password)
    return m.hexdigest()

def get_arg(request, key, default=None):
	arg = default
	if request.method == 'POST':
		if request.form.has_key(key):
			arg = request.form[key]
	else:
		try :
			arg = request.args.get(key)
		except Exception, msg:
			traceback.print_exc()
	return default if arg == None or arg == '' else arg

def redirect_url(default='index'):
	ref = request.referrer
	return ref if ref != None else url_for(default)
