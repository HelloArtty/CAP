from users.models import Admin
from users.serializers import AdminSerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status

#-------------------------------------- users
@api_view(['GET', 'POST'])
def admins_list(request):
    try:
        #GET all users
        if request.method == 'GET':
            #get all user from .model
            admins = Admin.objects.all()   
            #serialize them
            serializer = AdminSerializer(admins, many=True)
            #return json
            return Response(serializer.data)
    except Exception as error:
        return Response(data={'message': "Python error : "+ str(error) }, status=status.HTTP_400_BAD_REQUEST)
    

    