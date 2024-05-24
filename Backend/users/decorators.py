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
                if not token:
                    Response(data={'Log in is required'}, status=status.HTTP_401_UNAUTHORIZED)
                # decode the token
                payload = jwt.decode(token, env('jwt_secret'), algorithms=['HS256'])

                group = []
                if Admin.objects.get(adminID=payload['id']).exists():
                    group = 'admin'
                elif User.objects.get(userID=payload['id']).exists():
                    group = 'user' # == user
                
                if group in allowed_roles:
                    return view_func(request, *args, **kwargs)
                else:
                    return Response(data={'message':'You are not authorized to access this page'}, status=status.HTTP_401_UNAUTHORIZED)
            
            except Exception as error:
                return Response(data={'Error at @required_login: ':str(error)}, status=status.HTTP_400_BAD_REQUEST)
    
        return wrapper_func
    return decorator

def required_login(view_func):
    def wrapper_func(request,*args, **kwargs):
        env = environ.Env()
        token = request.COOKIES.get('token')
        # check if user is login
        if not token:
            isAdmin = None # == user not login
            return view_func(isAdmin,request, *args, **kwargs)
        
        try:
            # decode the token
            payload = jwt.decode(token, env('jwt_secret'), algorithms=['HS256'])
            admin = Admin.objects.get(adminID=payload['id']).exists()
            user = User.objects.get(userID=payload['id']).first()
            
            if admin:
                isAdmin = True # == admin
            elif user:
                isAdmin = False # == user
            else:
                isAdmin = None # == user not login
            
        except jwt.ExpiredSignatureError as error:
            return Response(data={'Error at @required_login: ':str(e) for e in error}, status=status.HTTP_401_UNAUTHORIZED)
    
        return view_func(isAdmin,request, *args, **kwargs)
    return wrapper_func


# check if user is already login
def is_login(view_func):
    @wraps(view_func)
    def wrapper_func(request,*args, **kwargs):
        env = environ.Env()
        token = request.COOKIES.get('token')
        
        if token :
            return view_func(request, *args, **kwargs)

        else:
            return Response(data={'message':'User is Anonymus'}, status=status.HTTP_200_OK)
        
        return Response(data={'message':'User is Authorized'}, status=status.HTTP_200_OK) # redirect to home page if user is already login
    
    return wrapper_func
    
# admin_only
def admin_only(view_func):
    @wraps(view_func)
    def wrapper_func(request,*args, **kwargs):        
        env = environ.Env()
        token = request.COOKIES.get('token')
        
        if not token:
            return Response(data={'message':'Account unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            # decode the token
            payload = jwt.decode(token, env('jwt_secret'), algorithms=['HS256'])
            admin = Admin.objects.get(adminID=payload['id']).first()
            
            # check if this ID exist in admin table
            if admin != None:
                request.admin = admin
            else:
                return Response(data={'message':'Please Login!'}, status=status.HTTP_401_UNAUTHORIZED)
            
            
        except jwt.ExpiredSignatureError as error:
            return Response(data={'message':str(e) for e in error}, status=status.HTTP_401_UNAUTHORIZED)
        
        return view_func(request, *args, **kwargs)
    
    return wrapper_func