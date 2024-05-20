
from users.serializers import SignUpSerializer

from users.models import User

from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..PasswordManagement import CheckPasswordStrength,HashingPassword

from users.models import User
import jwt, datetime
import environ

env = environ.Env()


@api_view(['GET','POST'])
def signup(req):
    
    '''users = User.objects.all() # Entry.objects.all() = query all data from the Entry table in database'''

    if req.method == 'POST':

        # valide email format
        try:
            validate_email(req.data['email'])
        except ValidationError as error:
            return Response(data={'message':str(e) for e in error}, status=status.HTTP_400_BAD_REQUEST) #str(error) for error in e -> convert list to string
        
        #check if email already exists
        usersIsExisted = User.objects.filter(email=req.data['email']).exists()
        if usersIsExisted:
            return Response(data={'message':'This Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        #check if telephone already exists
        telIsExisted = User.objects.filter(tel=req.data['tel']).exists()
        if telIsExisted:
            return Response(data={'message':'This Telephone number already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        #checking password strength
        message = CheckPasswordStrength(req.data['password'])
        if message != "":
            return Response(data={'message':message}, status=status.HTTP_400_BAD_REQUEST)
        if req.data['password'] != req.data['confirmPassword']:
            return Response(data={'message':'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        
        #hashing password
        req.data['password'] = HashingPassword(req.data['password'])
        
        #save user after hashing password
        serializer = SignUpSerializer(data=req.data)
        if serializer.is_valid():
            try:
                serializer.save()
                
                #generate token using  
                user = User.objects.get(email=req.data['email'])          
                payload = {
                    'id' : user.userID,
                    'exp' : datetime.datetime.now() + datetime.timedelta(minutes=60),
                    'iat' : datetime.datetime.now()
                }
                token = jwt.encode(payload, env('jwt_secret') , algorithm='HS256')
                response = Response()
                response.set_cookie(key='token', value=token, httponly=True)
                
                
            except Exception as error:
                return Response(data={'message':str(e) for e in error}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # if serializer is not valid
            return Response(data={'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # everything is ok so far
        return Response(data={'message':'User created successfully'}, status=status.HTTP_201_CREATED)
        
    return Response(data={'message':'Status not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        