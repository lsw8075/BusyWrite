from .models import *
from .errors import *
from functools import wraps
from .operation_no import Operation
from django.core.cache import cache
from functools import wraps
import json

def key_rlat(did):
    return 'Rlat' + str(did)

def update_doc(func):
    ''' Decorator for functions updating document content '''
    ''' commits new version for each update '''
    ''' It must be under operation decorator '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        rid_version = args[0]
        document = kwargs['document']
        result = func(*args, **kwargs)
        operation = result[0]
        result = result[1]
        new_version_no = commit_version(document, args)
        return (new_version_no, result)
    return wrapper

# version no 
def get_latest_version_rid(did):
    return 0
    

def commit_version(document, args):
    args = json.dumps(args)
    VersionDelta.objects.create(document=document, args=args)
    return 0
    
def check_too_old(did):
    latest_rid = get_latest_version_no(did)
