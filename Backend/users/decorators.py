import jwt
import environ

from rest_framework.response import Response
from rest_framework import status

from users.models import User,Admin

def allowed_users(allowed_roles=[]):   
    def decorator(view_func):
        def wrapper_func(request,*args, **kwargs):

            try:
                env = environ.Env()
                token = request.COOKIES.get('token')
                # check if user is login
                if token == None:
                    Response(data={'Log in is required'}, status=status.HTTP_401_UNAUTHORIZED)
                    
                # Decode the token (with leeway to allow for clock skew)
                payload = jwt.decode(token, env('JWT_SECRET'), algorithms=['HS256'], leeway=60)

                group = []

                if Admin.objects.filter(adminID=payload['id']).exists():
                    group = 'admin' # == admin
                elif User.objects.filter(userID=payload['id']).exists():
                    group = 'user' # == user
                
                if group in allowed_roles:
                    return view_func(request, *args, **kwargs)
                else:
                    return Response(data={'message':'You are not authorized to access this page'}, status=status.HTTP_401_UNAUTHORIZED)
            
            except jwt.ExpiredSignatureError:
                return Response(data={'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError as error:
                return Response(data={'error': f'Invalid token: {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as error:
                return Response(data={'error': f'Error at @allowed_user: {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)
    
        return wrapper_func
    return decorator
