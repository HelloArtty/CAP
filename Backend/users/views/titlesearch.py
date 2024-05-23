from users.models import Post
from users.serializers import PostSerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def search_posts(req):
    search = req.query_params.get('search',None)
    if req.method == 'GET':
        posts = Post.objects.select_related('categoryID', 'placeID', 'adminID').filter(title__icontains = search)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

