from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET','POST'])
def logout(req):
    if req.method == 'POST':
        try:
            response = Response()
            response.delete_cookie('token')
            response.data = {'message':'Log out successfully'}
            response.status = status.HTTP_200_OK
            
        except Exception as error:
            response.data = {'message':str(e) for e in error}
            response.status = status.HTTP_400_BAD_REQUEST
            return response

        return response
    
    return Response(data={'message':'Status not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    