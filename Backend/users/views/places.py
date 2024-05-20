from django.http import JsonResponse
from users.models import Place
from users.serializers import PlaceSerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status


#-------------------------------------- place
@api_view(['GET', 'POST'])
def places_list(request):
    
    if request.method == 'GET':
        places = Place.objects.all()
        serializer = PlaceSerializer(places, many=True)
        return JsonResponse({"places":serializer.data}, safe=False)
    elif request.method == 'POST':
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'PUT', 'DELETE'])
def place_by_id(request, id):
    
    try:
        place = Place.objects.get(pk=id)
    except Place.DoesNotExist:
        return Response("Place ID not found", status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PlaceSerializer(place)
        return JsonResponse(serializer.data)
    
    elif request.method == 'PUT':
        serializer = PlaceSerializer(place, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        place.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
