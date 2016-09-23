import sys
sys.path.append('../')

from modules.mod_authenticate import *

def test_authenticate():
	user_name = 'juntaoduan'
	db_name = 'dw'
	table_name = 'mock_table'
	operation = 'write'
	res, msg = authenticate(user_name, db_name, table_name, operation)
	print res,msg

if __name__ == '__main__':
	test_authenticate()
	print '--------------------------------'
	print 'ALL TEST PASS'
