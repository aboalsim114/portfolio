from django.db import models



class Article(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images', blank=True, null=True)
    

    def __str__(self) :
        return self.title


