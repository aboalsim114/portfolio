from rest_framework import serializers
from .models import Article,Commentaires , User
from . import models



class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'




class CommenaitresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commentaires
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'