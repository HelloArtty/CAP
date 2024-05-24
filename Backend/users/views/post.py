import cloudinary
import cloudinary.uploader
import environ
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.decorators import allowed_users
from users.models import Post
from users.serializers import PostJoinSerializer, PostSerializer

env = environ.Env()

#-------------------------------------- item

@api_view(['GET', 'POST'])
def posts_list(req):
    
    if req.method == 'GET':
        posts_query = Post.objects.select_related('categoryID', 'placeID', 'adminID').all()
        serializer = PostJoinSerializer(posts_query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'POST':
        # get full image url
        upload_result = cloudinary.uploader.upload(req.FILES['image']) # if get as json,  use -> req.data['image']
        img_path = upload_result['secure_url']
        req.data['image'] = img_path
        
        serializer = PostSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@allowed_users(allowed_roles=['user','admin'])
def get_post_by_id(req):
    
    try:
        id = req.query_params.get('id',None)
        post_query = Post.objects.get(pk=id)

    except Post.DoesNotExist:
        return Response("Post ID not found", status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = PostJoinSerializer(post_query)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['PUT', 'DELETE'])
@allowed_users(allowed_roles=['admin'])
def update_delete_post_by_id(req):
    
    try:
        id = req.query_params.get('id',None)
        post_query = Post.objects.get(pk=id)

    except Post.DoesNotExist:
        return Response("Post ID not found", status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'PUT':
        
        # delete old image from cloudinary
        imgPublicID = post_query.image.split('/')[-1].split('.')[0]
        cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload")

        # get full image url
        upload_result = cloudinary.uploader.upload(req.FILES['image'])
        img_path = upload_result['secure_url']
        req.data['image'] = img_path
        
        serializer = PostSerializer(post_query, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif req.method == 'DELETE':
        # delete item image from cloudinary
        serializer = PostSerializer(post_query)
        imgPublicID = serializer.data['image'].split('/')[-1].split('.')[0]
        cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload")
        
        # delete item from database
        post_query.delete()
        return Response(data="Item deleted.",status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)



@api_view(['GET'])
def posts_by_category(req):
    try:
        cate_id = req.query_params.get('cate_id',None)
        posts_query = Post.objects.select_related('categoryID', 'placeID', 'adminID').filter(categoryID=cate_id)
    except Post.DoesNotExist:
        return Response("None of the posts found in the Category", status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = PostJoinSerializer(posts_query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def posts_filter(req):
    try:
        search = req.query_params.get('search',None)
        cate_id = req.query_params.get('cate_id',None)
        place_id = req.query_params.get('place_id',None)
        asc = req.query_params.get('asc',None)

        posts_query = Post.objects.select_related('categoryID', 'placeID', 'adminID').all()

        if search:
            posts_query = posts_query.filter(title__icontains=search)
        if cate_id:
            posts_query = posts_query.filter(categoryID=cate_id)
        
        if place_id:
            posts_query = posts_query.filter(placeID=place_id)
            
        if asc:
            posts_query = posts_query.order_by('datePost__date','datePost__hour', 'datePost__minute')
        else: 
            posts_query = posts_query.order_by('-datePost__date','-datePost__hour', '-datePost__minute')

        # check if no posts found
        if not posts_query.count():
            return Response("None of the posts found in the Category", status=status.HTTP_200_OK)
        
    except Post.DoesNotExist:
        return Response("None of the posts found in the Category", status=status.HTTP_200_OK)
    
    if req.method == 'GET':
        serializer = PostJoinSerializer(posts_query, many=True)
        return Response(data ={serializer.data}, status=status.HTTP_200_OK)
    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


from users.Model import callModel


@api_view(['GET','POST'])
def posts_by_img(req):
    
    if req.method == 'POST':
        print("post_by_img_func")
        try:
            #upload image to cloudinary
            upload_result = cloudinary.uploader.upload(req.FILES['file'], public_id = 'temp_img')
            img_path = upload_result['secure_url']
            
            # call model -> predict and get category
            cate_id = callModel.predict(img_path) #pass image path to yolov5 model

            cate_id = None if cate_id is None else int(cate_id)
            #delete temp image from cloudinary
            imgPublicID = 'temp_img'
            cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload")
        except Exception as error:
                return Response(data={'Error at post_by_img':str(error)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={"cate_id":cate_id}, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

