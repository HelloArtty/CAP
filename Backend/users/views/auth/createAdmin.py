
from users.serializers import CreateAdminSerializer
from users.models import Admin

from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..PasswordManagement import CheckPasswordStrength,HashingPassword

import jwt, time
import environ

env = environ.Env()


@api_view(['GET','POST'])
def createAdmin(req):

    if req.method == 'POST':

        try:
            validate_email(req.data['email']) # valide email format
        except ValidationError as error:
            return Response(data={'message':str(error)}, status=status.HTTP_400_BAD_REQUEST) #str(error) for error in e -> convert list to string
        
        adminIsExisted = Admin.objects.filter(email=req.data['email']).exists() #check if email already exists
        if adminIsExisted:
            return Response(data={'message':'This Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        telIsExisted = Admin.objects.filter(tel=req.data['tel']).exists() #check if telephone already exists
        if telIsExisted:
            return Response(data={'message':'This Telephone number already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        message = CheckPasswordStrength(req.data['password']) #checking password strength
        if message != "":
            return Response(data={'message':message}, status=status.HTTP_400_BAD_REQUEST)
        if req.data['password'] != req.data['confirmPassword']:
            return Response(data={'message':'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        
        req.data['password'] = HashingPassword(req.data['password']) #hashing password
        
        serializer = CreateAdminSerializer(data=req.data)
        if serializer.is_valid(): 
            try:
                serializer.save()
                
                admin = Admin.objects.get(email=req.data['email'])          
                current_time = time.time()  # Current time in UTC
                payload = {
                    'id': admin.adminID,
                    'exp': current_time + 3600,  # Expiration time (1 hour from now)
                    'iat': current_time  # Issued at time
                }
            
                token = jwt.encode(payload, env('jwt_secret') , algorithm='HS256')#generate token  
                response = Response()
                response.set_cookie(key='token', value=token, httponly=True)
                response.data = {'message':'Admin created successfully'}
                response.status = status.HTTP_201_CREATED
                
            except Exception as error:
                return Response(data={'message':str(error)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST) # if serializer is not valid

        return response # everything is ok so far
    return Response(data={'message':'Status not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        