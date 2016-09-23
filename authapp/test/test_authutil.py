import sys
sys.path.append('../')

from modules.utils.authutil import *

def ept(f, arg):
	try:
		f(arg)
		return True 
	except Exception, msg:
		print msg
		return False

def test_canonical_form():
	assert canonical_form(' ') == ''	
	assert canonical_form('a ') == 'a'	
	assert canonical_form('a b') == 'ab'	
	assert canonical_form('A b') == 'ab'	
	assert canonical_form('A B ') == 'ab'	
	assert canonical_form(None) == ''	
	assert canonical_form('     asb b ') == 'asbb'	


def test_operation_principal_valid():
	assert not ept(operation_principal_valid, '')
	assert not ept(operation_principal_valid, ' ')
	assert not ept(operation_principal_valid, ',')
	assert ept(operation_principal_valid, '*')
	assert not ept(operation_principal_valid, ' *')
	assert ept(operation_principal_valid, 'all,read')
	assert not ept(operation_principal_valid, 'all,,read')
	assert ept(operation_principal_valid, 'all,write,read')
	assert not ept(operation_principal_valid, ' *, all,write,read  ')
	assert ept(operation_principal_valid, '*,all,write,read')
	assert ept(operation_principal_valid, 'write')
	assert ept(operation_principal_valid, 'read')
	assert ept(operation_principal_valid, 'all')

def test_resource_principal_valid():
	assert not ept(resource_principal_valid, '')
	assert not ept(resource_principal_valid, ' ')
	assert not ept(resource_principal_valid, ',')
	assert not ept(resource_principal_valid, ', ')
	assert ept(resource_principal_valid, '*')
	assert ept(resource_principal_valid, '*.*')
	assert not ept(resource_principal_valid, '***.*')
	assert not ept(resource_principal_valid, '**.*')
	assert not ept(resource_principal_valid, '**')
	assert not ept(resource_principal_valid, 'a.**')
	assert not ept(resource_principal_valid, '**.a')
	assert not ept(resource_principal_valid, 'a.**.*')
	assert not ept(resource_principal_valid, 'a.a**b.*')
	assert ept(resource_principal_valid, 'a.*a*b*.*')
	assert ept(resource_principal_valid, 'a.*a00*b*.*')

def test_role_principal_valid():
	assert not ept(role_principal_valid, '')
	assert not ept(role_principal_valid, ' ')
	assert not ept(role_principal_valid, ',')
	assert not ept(role_principal_valid, ',,,,')
	assert ept(role_principal_valid, 'abc')
	assert ept(role_principal_valid, 'abc.*.djt')
	assert ept(role_principal_valid, '**.a.*a00*b*.*')
	assert ept(role_principal_valid, '**.djt')
	assert ept(role_principal_valid, '**.a.*')
	assert ept(role_principal_valid, '**.a.*.a')
	assert ept(role_principal_valid, '**.a.*.a,*.abc')
	assert not ept(role_principal_valid, '**.a.*.a,**')
	assert not ept(role_principal_valid, '*.**.a.*a00*b*.*')
	assert not ept(role_principal_valid, '*.**..*a00*b*.*')

def test_operation_principal_match():
	assert not operation_principal_match('','')
	assert not operation_principal_match('','  ')
	assert not operation_principal_match(' ','  ')
	assert not operation_principal_match(',','|')
	assert operation_principal_match('*','all')
	assert operation_principal_match('read,write','all')
	assert operation_principal_match('read,write','*')
	assert not operation_principal_match('write','*')
	assert not operation_principal_match('write','all')
	assert not operation_principal_match(',,,*','')
	assert not operation_principal_match(',,,*',' ')
	assert operation_principal_match(',,,*','|write|||')
	assert not operation_principal_match(',,,read','|write|||')
	assert not operation_principal_match(',,,read','||||')
	assert not operation_principal_match(',,,read','| |||  ')
	assert operation_principal_match(',,,all','| ||| read ')
	assert operation_principal_match('all','read')
	assert operation_principal_match('all','write')
	assert operation_principal_match('*','read')
	assert operation_principal_match('*','write')
	assert operation_principal_match('*','all')
	assert operation_principal_match('*','all')
	assert operation_principal_match('read,write','write|read')
	assert operation_principal_match('read,write','WRITE|READ')
	assert operation_principal_match('read,write','write|READ')
	assert operation_principal_match('read,write','read')
	assert operation_principal_match('  read,,,  ,write','  read  |write')
	assert operation_principal_match('  READ,,,  ,WRITE','  read  |write')
	"""this role is pending"""
	assert operation_principal_match('  READ,//,,  ,WRITE','  read  |write')
	assert operation_principal_match('read,write','write')
	assert operation_principal_match('rEAd,WRIte','write')
	assert operation_principal_match(',,,all','| ||| read ')
	assert operation_principal_match(',*,,ALL','| ||| rEAd ')

def test_resource_principal_match():
	assert not resource_principal_match('', '')
	assert not resource_principal_match('   ', ' ')
	assert not resource_principal_match(',,,', '')
	assert not resource_principal_match('', ',')
	assert not resource_principal_match('*', '')
	assert not resource_principal_match('**', 'ab')
	assert resource_principal_match('*', 'a.b')
	assert resource_principal_match('      *', 'a.b')
	assert resource_principal_match(',,,,,      *', 'a.b')
	assert not resource_principal_match('*.*', 'b')
	assert resource_principal_match('*', 'b.a')
	assert resource_principal_match('*', 'b')
	assert resource_principal_match('*.*', 'b.a')
	assert resource_principal_match('*.a', 'b.a')
	assert resource_principal_match('*.a', '.a')
	assert not resource_principal_match('*-.a', 'b.a')
	assert resource_principal_match('a*.a', 'a.a')
	assert resource_principal_match('*.a*.a', 'b.a.a')
	assert not resource_principal_match('*.a*.a', 'b._a_.a')
	assert resource_principal_match('*.a*.*a', 'b.a_.a')
	assert resource_principal_match('*.a*.*a', '.a_.a')
	assert resource_principal_match('*.a*.a, *.*a*.*', 'b._a_.a')
	assert resource_principal_match('*.a*.a, *.*a*', 'b._a_.a')
	assert not resource_principal_match('*.a*.a, *.*a*.*', 'b._a_')
	assert resource_principal_match('*.a*.a, *.*a*.-_*---', 'b._a_.-__---')
	assert resource_principal_match('*.a*.a, *.*a*.-_*---', 'b._a_.-_kkkk---')
	assert resource_principal_match('*.a*.a,    *.*a*.-_*--, ', 'b._a_.-_kkkk---')
	assert resource_principal_match('*.a*.a,    *.*a*.-_*--, ', '  b._a_.-_kkkk---')
	assert resource_principal_match('*.a*.a,    *.*a*.-_*--, ', '  b._a_.-_kkk--   ')
	assert resource_principal_match('*.a*.a,    *.*a*.-_*--, ', '  b._a_.-_kk123k--   ')
	assert not resource_principal_match('*.a*.a,    *.*a*.-_*--k, ', 'b._a_.-_kkkk---')

def test_role_principal_match():
	assert not role_principal_match('','')
	assert not role_principal_match('  ','')
	assert not role_principal_match('  ',' ')
	assert not role_principal_match(',','')
	assert role_principal_match('*.ab.*.*c','A.ab.c.cc ')
	assert not role_principal_match('*.ab.*.*c','A.AB.c.cc ')
	assert role_principal_match('**.ab.*.*c','1.2.3.a.bb.c.A.ab.c_--b.cc ')
	assert not role_principal_match('**.ab.*.*c','1.2.3.a.bb.c.A.ab.c_--b .cc ')
	assert not role_principal_match('**.ab.*.*c','1.2.3.a.bb.c.A.ab.c_--b   .c  a ')
	assert role_principal_match('**.ab.*.*c,**.ab.*.*a','1.2.3.a.bb.c.A.ab.c_--b.ca ')
	assert role_principal_match('  ,, , ,,**.ab.*.*c,**.ab.*.*a','1.2.3.a.bb.c.A.ab.c_--b.ca ')



if __name__ == '__main__':
	test_canonical_form()
	test_operation_principal_valid()
	test_resource_principal_valid()
	test_role_principal_valid()
	test_operation_principal_match()
	test_resource_principal_match()
	test_role_principal_match()
	print '--------------------------------'
	print 'ALL TEST PASS'
