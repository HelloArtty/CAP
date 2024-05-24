from users.models import Post
from users.serializers import PostSerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def search_posts(req):
    try:
        search = req.query_params.get('search',None)
        posts_query = Post.objects.select_related('categoryID', 'placeID', 'adminID').filter(title__icontains=search)
    except Post.DoesNotExist:
        return Response("No such the post", status=status.HTTP_200_OK)

    serializer = PostSerializer(posts_query, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

