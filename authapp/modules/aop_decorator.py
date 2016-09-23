import traceback
from functools import wraps

from flask import request, redirect, url_for, session

from utils.commons import *


def interceptor(login_required=False):
	def decorator(func):
		@wraps(func)
		def decorated_function(*args, **kwargs):

			''' returns (need_redirect, redirect_uri) '''
			def preprocess():
				if login_required:
					userinfo = session.get('userinfo')
					if userinfo is None or len(userinfo)==0:
						print "redirect login"
						return True,redirect(url_for('login'))
				return False,None
		
			def postprocess(res):
				return False,redirect(url_for('login'))

			def check_redirect_fmt(need_redirect, uri):
				if not uri or uri is None:
					raise Exception,'uri can not empty'
				''' the request uri should not be the same
					with the redirect dest
				'''
				src_uri=request.path.strip()
				if src_uri is uri:
					raise Exception,'the req uri is equal to dest'

			''' 
				Main stream of interceptor logics begin
			'''
			try :
				need_redirect_pre,uri_pre = preprocess()
				'''redirect process for preprocess'''
				if need_redirect_pre is True:
					check_redirect_fmt(need_redirect_pre,uri_pre)
					return uri_pre
				'''actual wrapped func invokation'''
				res = func(*args, **kwargs)
				need_redirect_post,uri_post = postprocess(res)
				'''redirect process for postprocess'''
				if need_redirect_post is True:
					check_redirect_fmt(need_redirect_post,uri_post)
					return uri_post
				'''if all ok, return inner result'''
				return res
			except Exception,ex:
				traceback.print_exc()
				return redirect(url_for('error', msg=ex, url=redirect_url()))


		return decorated_function
	return decorator
