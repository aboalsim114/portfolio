from django.urls import path,include
from .views import ArticleViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('', ArticleViewSet, basename='article')



urlpatterns = [
    path('api/', include(router.urls)),
    
]


