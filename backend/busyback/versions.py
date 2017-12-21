from .models import *
from .errors import *
from functools import wraps
from .operation_no import Operation
from django.core.cache import cache
from functools import wraps
import json

def check_updatable(rversion, bubble):
    return

def check_updatable_with_siblings(rversion, parent, location):
    return

def check_updatable_with_descendants(rversion, bubble):
    return

def update_doc(func):
    ''' Decorator for functions updating document content '''
    ''' commits new version for each update '''
    ''' It must be under operation decorator '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        rid_version = args[0]
        document = kwargs['document']
        result = func(*args, **kwargs)
        result = result[1]
        return (0, result)
    return wrapper

# version no 
def get_latest_version_rid(did):
    return 0
