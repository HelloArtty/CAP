
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import User
from ..PasswordManagement import MatchingPassword

import jwt, datetime
import environ

env = environ.Env()


@api_view(['GET','POST'])
def login(req):
    if req.method == 'POST':
        try:
            email = req.data['email']
            password = req.data['password']  
            user = User.objects.filter(email=email).first() #first object in the database that match
            
            #check if email exists
            if user == None:
                return Response(data={'message':'User Not Found'}, status=status.HTTP_400_BAD_REQUEST)
                
            #check if password is correct
            if not MatchingPassword(password,user.password):
                return Response(data={'message':'Incorrect Password'}, status=status.HTTP_400_BAD_REQUEST)
            
            #generate token using            
            payload = {
                'id' : user.userID,
                'exp' : datetime.datetime.now() + datetime.timedelta(minutes=60),
                'iat' : datetime.datetime.now()
            }
            token = jwt.encode(payload, env('jwt_secret') , algorithm='HS256')
        
            response = Response()
            response.set_cookie(key='token', value=token, httponly=True)
            
        except Exception as error:
            return Response(data={'message': "Python error : "+ str(error) }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(data={'message':'Log in successfully'}, status=status.HTTP_200_OK)
    
    return Response(data={'message':'Status not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

