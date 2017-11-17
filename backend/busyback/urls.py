from django.conf.urls import url
from busyback import views
from channels.routing import route

urlpatterns = [
    url('^signup$', views.signup, name='signup'),
    url('^signin$', views.signin, name='signin'),
    url('^signout$', views.signout, name='signout'),
    url('^token$', views.token, name='token'),
]

channel_routing = [
    route("websocket.connect", "busyback.consumers.ws_connect"),
    route("websocket.receive", "busyback.consumers.ws_receive"),
    route("websocket.disconnect", "busyback.consumers.ws_disconnect"),
]
