from .models import *

def print_bubble_tree(bubble, indent):
    print('  ' * indent + str(bubble.location) + ':' + str(bubble.content))
    for child in bubble.child_bubbles.all():
        print_bubble_tree(child, indent + 1)

def print_suggests(bubble):
    print()
    print('Normal: ' + str(bubble.content), end=' voters: ')
    for voter in bubble.voters.all():
        print(voter.id, end=' ')
    print()
    for suggest in bubble.suggest_bubbles.all():
        print('  Suggest: ' + str(suggest.content), end=' voters: ')
        for voter in suggest.voters.all():
            print(voter.id, end=' ')
        print()

def print_comments(bubble):
    print('print comments')
    print('Bubble: ' + str(bubble.content) + ' ' + str(bubble.next_comment_order) + ' comments: ')
    for comment in bubble.comments.all():
        print('  ' + str(comment.order) + ': ' + comment.content)
