# Django imports
from django.shortcuts import render
from django.contrib.auth import authenticate

# DRF imports
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

# Local imports
from .models import Article, Commentaires, User
from .serializers import ArticleSerializer, CommenaitresSerializer, UserSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Article operations.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    @action(detail=True, methods=['DELETE'])
    def delete_article(self, request, pk=None):
        """
        Delete a specific article.
        """
        article = self.get_object()
        article.delete()
        return Response({"message": "Article deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class CommentairesViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Commentaires operations.
    """
    queryset = Commentaires.objects.all()
    serializer_class = CommenaitresSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling User operations.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['POST'])
    def login(self, request):
   
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request=request, username=username, password=password)
        if user:
            if user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key})
            else:
                return Response({'error': 'User account is deactivated.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)



    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
