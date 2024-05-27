import jwt
import environ

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import User,Admin

@api_view(['GET'])
def verifyToken(req):
        
    try:
        env = environ.Env()
        token = req.COOKIES.get('token')
        # check if user is login
        print("token",token)
        if token == None:
            return Response(data={'message':'User not Login'}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Decode the token (with leeway to allow for clock skew)
        payload = jwt.decode(token, env('JWT_SECRET'), algorithms=['HS256'], leeway=60)

        user = User.objects.filter(userID=payload['id']).first()
        print("isAdmin :",user.isAdmin)
        print("isAdmin :",user.name)
        if user.isAdmin:
            return Response(data={'message':'user'}, status=status.HTTP_200_OK)
        else:
            return Response(data={'message':'admin'}, status=status.HTTP_200_OK)
        
    except jwt.ExpiredSignatureError:
        return Response(data={'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError as error:
        return Response(data={'error': f'Invalid token: {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as error:
        return Response(data={'error': f'Error at @allowed_user: {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)
