#-------------------------------------------------------
#PUBLIC PROPERTIES
LEAF_NODE = 0
BRANCH_NODE = 1

PRINCIPAL_ACTIVE = 0
PRINCIPAL_REVOKED = 1
PRINCIPAL_DELETED = 2


def gen_json_resp(dict_info, code=0, msg='', debug=''):
    resp = {'code':code, 
            'msg':msg, 
            'body':dict_info, 
            'debug':debug}
    return resp


def canonical_form(sample):
    if sample == None:
        return ''
    sample = sample.strip()
    if sample == None or len(sample) == 0:
        return '' 
    sample = sample.replace(' ', '')
    if sample == None or len(sample) == 0:
        return ''
    sample = sample.lower()
    return sample

#-------------------------------------------------------
#Syntax is : 
#    operate_type [, operate_type] ...
#    operate_type: { * | all | read | write } 
OPERATION_DICT = ['*','all','read','write']
def operation_principal_valid(principal):
    if principal == None or len(principal) == 0:
        raise Exception, 'PRINCIPAL can not be empty'
    for op_type in principal.split(','):
        if op_type not in OPERATION_DICT:
            raise Exception, 'unknow OPT_TYPE : '+op_type

def operation_principal_match(principal, operation):
    print 'OPERATION_PRINCIPAL:[' + principal +'] <----> [' + operation + ']'
    principal = principal.strip()
    operation = operation.strip()
    if principal == None or len(principal) == 0:
        return False
    if operation == None or len(operation) == 0:
        return False
    pcp_dict = []
    for op_type in principal.split(','):
        op_type = op_type.strip().lower()    
        #expand * to all
        if op_type == None or len(op_type) == 0:
            continue
        if op_type == '*' or op_type == 'all':
            for p in OPERATION_DICT:
                pcp_dict.append(p)
        else:
            pcp_dict.append(op_type)
    strip_or = operation.replace('|','').strip()
    if strip_or == None or len(strip_or) == 0:
        return False
    ops = []
    for op in operation.split('|'):
        op = op.strip().lower()
        #expand all
        if op == '*' or op == 'all':
            for p in OPERATION_DICT:
                if p != '*' and p != 'all':
                    ops.append(p)
        else:
            ops.append(op)

    for op in ops:
        op = op.strip().lower()
        if op == None or len(op) == 0:
            continue
        if op not in pcp_dict:
            return False
    return True

        
#-------------------------------------------------------
#Syntax is : 
#    resource_level [, resource_level] ...
#    resource_level: { * | *.* | db_name.* | db_name.tbl_name }
def resource_principal_valid(principal):
    principal = principal.strip()
    if principal == None or len(principal) == 0:
        raise Exception, 'PRINCIPAL can not be empty'
    for resource in principal.split(','):
        resource = resource.strip()    
        msg = 'resource:['+resource+']'
        if resource.find('**') >= 0:
            raise Exception, 'PRINCIPAL ERROR: EVAL **, WE DONT ALLOW ** IN RESOURCE PP'
        pcps = resource.split('.')
        for p in pcps:
            if string_sanity_valid(p) == False:
                raise Exception, 'RESOURCE_PRINCIPAL sanity valid fail p ['+p+'] '+msg

def resource_principal_match(principal, resource):
    print 'RESOURCE_PRINCIPAL:[' + principal +'] <----> [' + resource +']'
    principal = principal.strip()
    resource = resource.strip()
    if principal == None or len(principal) == 0:
        return False
    if resource == None or len(resource) == 0:
        return False
    for rp in principal.split(','):
        rp = rp.strip()    
        if resource_level_match(rp, resource):
            return True
    return False

#    resource_level: { * | db_host.db_name.* | db_host.db_name.tbl_name }
def resource_level_match(rp, resource):
    rp = rp.strip()
    resource = resource.strip()
    if rp == None or len(rp) == 0:
        return False
    #WE DONT ALLOW ** IN RESOURCE PP RIGHT NOW
    if rp.find('**') >= 0:
        return False
    if resource == None or len(resource) == 0:
        return False
    if rp == '*': return True
    rs = resource.split('.')
    ps = rp.split('.')
    if len(ps) <= len(rs):
        for i in range(len(ps)):
            #print 'ps:' + ps[i] + ' rs:' + rs[i]
            if not string_match_for_wildcard(ps[i], rs[i]):
                return False
        return True
    return False


#-------------------------------------------------------
#Syntax is:
#    role_path_specification [, role_path_specification] ...
#    role_path_specification: {
#        role_spec[.role_spec] ...
#        | **.role_spec[.role_spec] ...
#    }
#    role_spec {
#        [0-9|a-z|A-Z|-|_]+ | [*][role_spec[*]] ...
#    }
def role_principal_valid(principal):
    principal = principal.strip()
    if principal == None or len(principal) == 0:
        raise Exception, 'PRINCIPAL can not be empty'
    for rpec in principal.split(','):
        rpec = rpec.strip()
        if rpec == '**': 
            raise Exception, 'PRINCIPAL ERROR: eval ** only'
        if rpec.startswith('**.'):
            rpec = rpec[3:]
        for rp in rpec.split('.'):
            if string_sanity_valid(rp) == False:
                raise Exception, 'string sanity check fail rp is ['+rp+']'

def role_principal_match(principal, role_path):
    print 'ROLE_PRINCIPAL:[' + principal +'] <----> [' + role_path + ']'
    principal = principal.strip()
    role_path = role_path.strip()
    if principal == None or len(principal) == 0:
        return False
    if role_path == None or len(role_path) == 0:
        return False
    for pcp in principal.split(','):
        #print 'pcp:' + pcp
        pcp = pcp.strip()
        if role_principal_single(pcp, role_path):
            return True
    return False

def role_principal_single(pcp, role_path):
    pcp = pcp.strip()
    role_path = role_path.strip()
    if pcp == None or len(pcp) == 0:
        return False
    if role_path == None or len(role_path) == 0:
        return False
    need_reverse = False
    if pcp.startswith('**.'):
        need_reverse = True
        pcp = pcp.replace('**.', '*.')
    rps = role_path.split('.')
    pcps = pcp.split('.')
    if need_reverse:
        rps.reverse()
        pcps.reverse()
    if len(pcps) <= len(rps):
        for i in range(len(pcps)):
            if not string_match_for_wildcard(pcps[i], rps[i]):
                return False
        return True
    return False


#-------------------------------------------------------
import re
#    role_spec {
#        [0-9|a-z|A-Z|-|_]+ | [*][role_spec[*]] ...
#    }
EW = '|[0-9a-zA-Z\-\_]*|'
def string_match_for_wildcard(rule, target):
    regex = ''
    #escape [-|_] character
    rule = rule.replace('_', '\_')
    rule = rule.replace('-', '\-')
    #expand *
    rule = rule.replace('*', EW)
    print 'rule:' + rule
    for e in rule.split('|'):
        e = e.strip()
        if e is not None and len(e)    > 0:
            regex = regex + '(' + e + ')'
    #gen match regex compile
    print 'regex:' + regex
    valid = re.compile(r"^"+regex+"$")
    res = valid.match(target)
    return False if res == None else True

#    Must satisfy
#   [0-9|a-z|A-Z|-|_]+ | [*][role_spec[*]] ...    
valid = re.compile(r"^\*?([0-9a-zA-Z\-\_]+\*?)*$")
def string_sanity_valid(line):
    l = line.strip()
    if l == None or len(l) == 0: return False
    res = valid.match(line)
    return False if res == None else True
