from rest_framework import serializers
from .models import *

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
        
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        categoryID = CategorySerializer()
        placeID = PlaceSerializer()
        adminID = AdminSerializer()
        model = Post
        fields = ['postID','title','categoryID','placeID','adminID','itemDetail','placeDetail','image','datePost']
    
class PostCategorySerializer(serializers.ModelSerializer):
    categoryID = CategorySerializer()
    class Meta:
        model = Post
        fields = ['postID','title','categoryID','placeID','adminID','itemDetail','placeDetail','image','datePost']
        
# class UserRequestSerializer(serializers.ModelSerializer):   
#     class Meta:
#         model = Request
#         fields = '__all__'  
        
class SignUpSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class LogInSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = '__all__'
        

        

        
