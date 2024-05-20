
from users.models import Category
from users.serializers import CategorySerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status

#-------------------------------------- catergory
@api_view(['GET', 'POST'])
def categories_list(request):

    if request.method == 'GET':
        category = Category.objects.all()

        serializer = CategorySerializer(category, many=True)
        return Response({"category":serializer.data}, safe=False)
    
    #POST a new category
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def category_by_id(request, id):
    
    try:
        category = Category.objects.get(pk=id)
    except Category.DoesNotExist:
        return Response("Category ID not found", status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
