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
                print("token",token)
                if token == None:
                    return Response(data={'message':'Log in is required'}, status=status.HTTP_401_UNAUTHORIZED)
                    
                # Decode the token (with leeway to allow for clock skew)
                payload = jwt.decode(token, env('JWT_SECRET'), algorithms=['HS256'], leeway=60)

                user = User.objects.filter(userID=payload['id']).first()
                print("isAdmin :",user.isAdmin)
                print("isAdmin :",user.name)
                if user.isAdmin:
                    group = 'admin' # == admin
                    print("ADMIN")
                else:
                    group = 'user' # == user
                    print("USER")
                
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

# not use yet
def is_login(view_func):
    def wrapper_func(request,*args, **kwargs):

        try:
            env = environ.Env()
            token = request.COOKIES.get('token')
            
            if token == None: # check if user is login
                return view_func(request, *args, **kwargs) #if not login, return log in funtion
                
            # Decode the token (with leeway to allow for clock skew)
            payload = jwt.decode(token, env('JWT_SECRET'), algorithms=['HS256'], leeway=60)

            isAdmin = Admin.objects.filter(adminID=payload['id']).exists()
            isUser = User.objects.filter(userID=payload['id']).exists()
            if isAdmin or isUser:
                return view_func(token,request, *args, **kwargs)
            else:
                return Response(data={'message':'Invalid token'}, status=status.HTTP_404_NOT_FOUND)

        except jwt.ExpiredSignatureError:
            return Response(data={'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError as error:
            return Response(data={'error': f'Invalid token: {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response(data={'error': f'Error at @is_login: {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)

    return wrapper_func