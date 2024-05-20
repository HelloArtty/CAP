from .views import *
from django.urls import path

urlpatterns = [
    
    path('', index),
    
    path('sign-up', signup),
    path('log-in', login),
    path('log-out', logout),
    
    path('users', users_list),
    path('users/<int:id>', user_by_id),
    
    path('categories', categories_list),
    path('categories/<int:id>', category_by_id),
    
    path('places', places_list),
    path('places/<int:id>', place_by_id),
    
    path('posts', posts_list),
    path('posts/<int:id>', post_by_id),
    path('posts-category/<int:cate_id>', posts_by_category),
    path('posts-img', posts_by_img),
    
    
    
]
