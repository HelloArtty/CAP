from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Place)
# admin.site.register(Request)
admin.site.register(Admin)
admin.site.register(Post)