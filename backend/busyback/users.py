from .models import *
from .errors import UserDoesNotExistError
from django.db import transaction
from django.forms.models import model_to_dict


def user_to_dict(user):
    return {'id': user.id, 'email': user.email}

@transaction.atomic
def do_fetch_user(user_id: int):
    return user_to_dict(fetch_user(user_id))

def fetch_user(user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise UserDoesNotExistError(user_id)
    return user
