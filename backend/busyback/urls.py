from django.conf.urls import url
from busyback import views
from busyback import view_documents
from channels.routing import route

urlpatterns = [
    url('^signup$', views.signup, name='signup'),
    url('^signin$', views.signin, name='signin'),
    url('^signout$', views.signout, name='signout'),
    url('^token$', views.token, name='token'),
    url('^documentlist$', view_documents.req_document_list, name='req_document_list'),
    url('^document/(?P<document_id>[0-9]+)/?$', view_documents.req_document_detail, name='req_document_detail')
]

channel_routing = [
    route("websocket.connect", "busyback.consumers.ws_connect"),
    route("websocket.receive", "busyback.consumers.ws_receive"),
    route("websocket.disconnect", "busyback.consumers.ws_disconnect"),
]
