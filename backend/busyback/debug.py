from .models import *

def print_bubble_tree(bubble, indent):
    print('  ' * indent + str(bubble.location) + ':' + str(bubble.content))
    for child in bubble.child_bubbles.all():
        print_bubble_tree(child, indent + 1)

