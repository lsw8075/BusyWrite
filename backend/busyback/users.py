from .models import *
from errors import UserDoesNotExistError

def do_fetch_user(user_id: int):
    '''Fetch one user with given id'''
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise UserDoesNotExistError(user_id)
    return user

