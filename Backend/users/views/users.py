
from users.models import User
from users.serializers import UserSerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status

#-------------------------------------- users
@api_view(['GET', 'POST'])
def users_list(request):

    #GET all users
    if request.method == 'GET':
        #get all user from .model
        users = User.objects.all()   
        #serialize them
        serializer = UserSerializer(users, many=True)
        #return json
        return Response({"users":serializer.data})
    #POST a new user
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data={'message':'User created successfully','info':serializer.data}, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def user_by_id(request, id):
    
    #find user by id
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response(data={'message':"User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    #Get a user by id
    if request.method == 'GET':
        serializer = UserSerializer(user,many=False)
        return Response(serializer.data)
    
    #Update a user by id
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(data={'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    #Delete a user by id
    elif request.method == 'DELETE':
        user.delete()
        return Response(data={'message':'User deleted successfully'},status=status.HTTP_204_NO_CONTENT)
    
    return Response(data={'message':'Method Not Allowed'},status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def user_by_token(request, token):
    
    #find user by token
    try:
        user = User.objects.get(token=token)
    except User.DoesNotExist:
        return Response(data={'message':"User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    #Get a user by token
    if request.method == 'GET':
        serializer = UserSerializer(user,many=False)
        return Response(serializer.data)
    
    return Response(data={'message':'Method Not Allowed'},status=status.HTTP_405_METHOD_NOT_ALLOWED)