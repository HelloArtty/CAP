from .views import *
from django.urls import path

urlpatterns = [
    
    path('', index),
    
    # auth
    
    path('sign-up', signup),
    path('log-in', login),
    path('log-out', logout),
    path('verify-token', verifyToken),

    
    # user
    path('users', users_list),
    path('users/<int:id>', user_by_id),
    
    # category
    path('categories', categories_list),
    path('categories/<int:id>', category_by_id),
    
    # place
    path('places', places_list),
    path('places/<int:id>', place_by_id),
    
    #post
    path('posts', posts_list),
    path('posts-add', add_post),
    path('posts-id-get', get_post_by_id),
    path('posts-id-mod',update_delete_post_by_id),
    path('posts-category', posts_by_category),
    path('posts-filter', posts_filter),
    path('posts-img', posts_by_img),
    path('send-email', send_email),
    
]
