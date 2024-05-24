
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import User
from ..PasswordManagement import MatchingPassword

import jwt, time
import environ

env = environ.Env()

@api_view(['GET','POST'])
def login(req):
    if req.method == 'POST':
        try:
            email = req.data['email']
            password = req.data['password']  
            user = User.objects.filter(email=email).first() #first object in the database that match
            
            if user == None: #check if email exists
                return Response(data={'message':'User Not Found'}, status=status.HTTP_400_BAD_REQUEST)
                
            
            if not MatchingPassword(password,user.password): #check if password is correct
                return Response(data={'message':'Incorrect Password'}, status=status.HTTP_400_BAD_REQUEST)

            current_time = time.time()  # Current time in UTC
            payload = {
                'id': user.userID,
                'exp': current_time + 3600,  # Expiration time (1 hour from now)
                'iat': current_time  # Issued at time
            }
            
            token = jwt.encode(payload, env('jwt_secret') , algorithm='HS256') #generate token  

            response = Response()
            response.set_cookie(key='token', value=token, httponly=True,secure=True, samesite='None')
            response.data = {'message':'Log in successfully'}
            response.status = status.HTTP_200_OK
            
        except Exception as error:
            return Response(data={'message': "Python error : "+ str(error) }, status=status.HTTP_400_BAD_REQUEST)
        
        return response

    return Response(data={'message':'Status not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

