#!/usr/bin/python

import json

request = {}
request['items'] = [
        {'un':'juntaoduan','dn':'dw','tn':'foo','op':'write'},
        {'un':'honglei','dn':'dm','tn':'bar','op':'all'}
    ]

print json.dumps(request)


if __name__ == '__main__':
    js = '{"items": [{"dn": "dw", "tn": "foo", "un": "juntaoduan", "op": "write"}, {"dn": "dm", "tn": "bar", "un": "honglei", "op": "all"}]}'
    json.loads(js)

