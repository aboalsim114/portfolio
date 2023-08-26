from django.urls import path,include
from .views import ArticleViewSet,CommentairesViewSet,UserViewSet,LikesViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register('articles', ArticleViewSet, basename='article')
router.register("commentaires", CommentairesViewSet, basename='commentaire')
router.register("users", UserViewSet, basename='user')
router.register("likes", LikesViewSet, basename='like')

urlpatterns = [
    path('api/', include(router.urls)),
    

]


