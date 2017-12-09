from .models import *
from .errors import *
from functools import wraps
from .operation_no import Operation
from django.core.cache import cache
from functools import wraps
import json

def update_doc(func):
    ''' Decorator for functions updating document content '''
    ''' commits new version for each update '''
    ''' It must be under operation decorator '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        rid_version = args[0]
        did = args[2]
        result = func(*args, **kwargs)
        new_version_no = commit_version(did, args)
        return (new_version_no, result)
    return wrapper


# version no 
def get_latest_version_no(did):
    return 0

def commit_version(did, args):
    args = json.dumps(args)
    return 0
    
def check_too_old(did):
    latest_rid = get_latest_version_no(did)
