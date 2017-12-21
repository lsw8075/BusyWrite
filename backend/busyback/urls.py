from django.conf.urls import url
from busyback import views
from busyback import view_documents
from busyback import view_notes
from channels.routing import route

urlpatterns = [
    url('^signup$', views.signup, name='signup'),
    url('^signin$', views.signin, name='signin'),
    url('^signout$', views.signout, name='signout'),
    url('^token$', views.token, name='token'),
    url('^documentlist$', view_documents.req_document_list, name='req_document_list'),
    url('^document/(?P<document_id>[0-9]+)/?$', view_documents.req_document_detail, name='req_document_detail'),
    url('^document/contributors/(?P<document_id>[0-9]+)$', view_documents.req_document_contributors, name='req_document_contributors'),
    url('^document/acceptinvitation/(?P<salt>[a-zA-Z0-9]+)$', view_documents.req_document_accept_invitation, name='req_document_accept_invitation'),
    url('^(?P<document_id>[0-9]+)/notelist/?$', view_notes.req_note_list, name='req_note_list'),
    url('^(?P<document_id>[0-9]+)/note/(?P<note_id>[0-9]+)/?$', view_notes.req_note_detail, name='req_note_detail'),
]

channel_routing = [
    route("websocket.connect", "busyback.consumers.ws_connect"),
    route("websocket.receive", "busyback.consumers.ws_receive"),
    route("websocket.disconnect", "busyback.consumers.ws_disconnect"),
]
