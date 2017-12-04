from .models import *
from .errors import UserDoesNotExistError
from django.db import transaction

@transaction.atomic
def do_fetch_user(user_id: int):
    return fetch_user(user_id)

def fetch_user(user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise UserDoesNotExistError(user_id)
    return user
