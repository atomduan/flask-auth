from utils import mysqldb 
from flask import session

def service(request):
    model = {}
    userinfo = session.get('userinfo')
    if userinfo is not None:
        session['userinfo'] = None
    return model
