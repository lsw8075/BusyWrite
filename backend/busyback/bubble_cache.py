from .models import *
from django.core.cache import cache

def key_blh(bubble_id):
    return 'Block' + str(bubble_id)

def key_bcon(bubble_id):
    return 'Bcon' + str(bubble_id)

def key_bdel(bubble_id):
    return 'Bdel' + str(bubble_id)

def load_bubble_to_cache(bubble, del_flag=False):
    with cache.lock("bubblelock" + str(bubble.id)):
        cache.set(key_blh(bubble.id), str(bubble.edit_lock_holder.id), timeout=None)
        cache.set(key_bcon(bubble.id), bubble.content, timeout=None)
        cache.set(key_bdel(bubble.id), str(del_flag), timeout=None)
    
def update_bubble_on_cache(user_id, bubble_id, content):
    with cache.lock("bubblelock" + str(bubble_id)):
        editor = cache.get(key_blh(bubble_id))
        if editor is None or editor != str(user_id):
            return False
        cache.set(key_bcon(bubble_id), content, timeout=None)
        return True
 
def unload_bubble_from_cache(user_id, bubble_id):
    with cache.lock("bubblelock" + str(bubble_id)):
        editor = cache.get(key_blh(bubble_id))
        if editor is None or editor != str(user_id):
            return None
        del_flag = cache.get(key_bdel(bubble_id))
        if del_flag is None:
            return None
        content = cache.get(key_bcon(bubble_id))
        if content is None:
            return None
        return (del_flag, content)
