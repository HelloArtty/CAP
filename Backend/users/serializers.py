from rest_framework import serializers
from .models import *

import environ
env = environ.Env()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        
class PostJoinSerializer(serializers.ModelSerializer):
    categoryID = CategorySerializer()
    placeID = PlaceSerializer()
    adminID = AdminSerializer()
    class Meta:
        model = Post
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class SignUpSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class CreateAdminSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Admin
        fields = '__all__'

class LogInSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = '__all__'
        

        

        
        
# class UserRequestSerializer(serializers.ModelSerializer):   
#     class Meta:
#         model = Request
#         fields = '__all__'  
        