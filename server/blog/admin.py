from django.contrib import admin
from .models import Article,Commentaires,User,Likes
# Register your models here.

admin.site.register(Article)
admin.site.register(Commentaires)
admin.site.register(User)
admin.site.register(Likes)



