#!/usr/bin/env python
# coding = utf-8
from flask import Flask, request, render_template, jsonify
from flask import redirect, url_for
from modules.aop_decorator import interceptor
from modules.utils.commons import *

from modules import mod_login
from modules import mod_logout
from modules import mod_authenticate
from modules import mod_authorize
from modules import mod_search
from modules import mod_detail
from modules import mod_role


dmsg = 'SUCCESS'


@app.route('/')
@interceptor(login_required = True)
def default():
    return redirect(url_for('index'))

@app.route('/index', methods = ['GET'])
@interceptor(login_required = True)
def index():
	data = mod_search.listall(request)
	return render_template('search.html', data = data)

@app.route('/login', methods = ['GET', 'POST'])
@interceptor(login_required = False)
def login():
    if request.method == 'POST':
        if mod_login.service(request):
	    return redirect(url_for('index'))
        else:
            return render_template('error.html',msg = 'login error')
    else: 
	return render_template('login.html')

@app.route('/logout', methods = ['GET', 'POST'])
@interceptor(login_required = False)
def logout():
    mod_logout.service(request)
    return redirect(url_for('login'))

@app.route('/error', methods = ['GET', 'POST'])
@interceptor(login_required = False)
def error():
    msg = request.args.get('msg')
    url = request.args.get('url')
    return render_template('error.html', 
    		msg = dmsg if msg is None else msg, url = url)

@app.route('/result', methods = ['GET', 'POST'])
@interceptor(login_required = True)
def result():
    msg = request.args.get('msg')
    return render_template('result.html', msg = dmsg if msg is None else msg)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html',msg = e)


####################################################


@app.route('/authorize', methods = ['POST'])
@interceptor(login_required = True)
def authorize():
    ret = mod_authorize.authorize(request)
    return redirect(redirect_url())

@app.route('/api/authenticate', methods = ['GET', 'POST'])
@interceptor(login_required = False)
def authenticate():
    resp = mod_authenticate.service(request)
    return jsonify(resp)

@app.route('/api/authenticate/multi', methods = ['GET', 'POST'])
@interceptor(login_required = False)
def authenticate_multi():
    resp = mod_authenticate.service_multi(request)
    return jsonify(resp)

@app.route('/search', methods = ['GET', 'POST'])
@interceptor(login_required = True)
def search():
    data = mod_search.service(request)
    return render_template('search.html', data = data)

@app.route('/detail', methods = ['GET', 'POST'])
@interceptor(login_required = True)
def detail():
    data = mod_detail.service(request)
    return render_template('detail.html', data = data)

@app.route('/chstatus', methods = ['GET'])
@interceptor(login_required = True)
def chstatus():
    data = mod_authorize.chstatus(request)
    return redirect(redirect_url())

@app.route('/deleteprincipal', methods = ['GET'])
@interceptor(login_required = True)
def delete_principal():
    data = mod_authorize.delete_principal(request)
    return redirect(redirect_url())

@app.route('/modify_principal', methods = ['POST'])
@interceptor(login_required = True)
def modify_principal():
    data = mod_authorize.modify(request)
    return redirect(redirect_url())

@app.route('/addrole', methods = ['GET','POST'])
@interceptor(login_required = True)
def addrole():
    if request.method == 'POST':
        data = mod_role.add_role(request)
        return redirect(url_for('detail', role_id=data['role'].parent_id))
    else:
        data = mod_role.service(request)
        return render_template('addrole.html', data = data)




'''  MAIN ENTRY  '''
if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0", port=int(5002), threaded=True)
