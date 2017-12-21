from .models import *
from .errors import *
from functools import wraps
from .operation_no import Operation
from django.core.cache import cache
from functools import wraps
import json

# versions
# when int n>=0 indicates version no,
# initial version is n=0 and
# write delta of n and n+1 to versiondelta[n]

def key_rlat(did):
    return 'Rlat' + str(did)

def key_rver(did, rid):
    return 'Rver' + str(did) + ':' + str(rid)

def iterate_version_on_cache(did, rversion):
    lockname = 'Vlock' + str(did)
    latest_version_no = cache.get(key_rlat(did))
    for rid in range(rversion, latest_version_no):
        with cache.lock(lockname):
            version = cache.get(key_rver(did, rid))

def save_version_on_cache(did, versionstr):
    lockname = 'Vlock' + str(did)
    keylat = key_rlat(did)
    with cache.lock(lockname):
        latest_version_no = cache.get(keylat)

# TODO : load commits

def get_depth1(bubble):
    ''' get depth-1 bubble '''
    pass

def generate_commits(rversion):
    ''' load comm'''
    yield 

def check_updatableset(rversion, bubbleset):
    unioned = set()
    for version in iterate_versions(rversion):
        unioned |= version.bubbleset
    if not isdisjoint(unioned, bubbleset):
        raise OutdatedRequestError()
        
def check_updatable(rversion, bubble):
    return
    ''' Check bubble is editable based on rversion '''
    check_updatableset(rversion, set(bubble.id))

def check_updatable_with_siblings(rversion, parent, location):
    return
    ''' Check parent's children(with >= location) are editable based on rversion '''
    ids = set()
    for child in parent.child_bubbles.all():
        if child.location >= location:
            ids.add(child.id)

    check_updatableset(rversion, ids)

def updatable_helper(bubble):
    ids = set(bubble.id)
    for child in parent.child_bubbles.all():
        ids |= updatable_helper(child)
    return ids

def check_updatable_with_descendants(rversion, bubble):
    return
    ''' Check bubble and its descendants are editable based on rversion '''
    check_updatableset(rversion, updatable_helper(bubble))

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
        #bubbleset = get_involved_bubbles_by_operation(result, *args, **kwargs)
        #set_string = json.dumps(bubbleset)
        #new_version_no = commit_version(document, set_string)
        return (0, result)
    return wrapper

# version no 
def get_latest_version_rid(did):
    return 0
    

def commit_version(document, args):
    args = json.dumps(args)
    return 0
    
def check_too_old(did):
    latest_rid = get_latest_version_no(did)

def load_commits(rversion):
    return 

def get_involved_bubbbles_by_operation(self):
    return
