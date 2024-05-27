import cloudinary
import cloudinary.uploader
import environ
import jwt

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import Post,User
from users.serializers import PostJoinSerializer, PostSerializer

from users.decorators import allowed_users

env = environ.Env()


# post CRUD ------------------------------------------------------------------------- 
@api_view(['GET'])
@allowed_users(allowed_roles=['user','admin'])
def posts_list(req):
    try:
        posts_query = Post.objects.select_related('categoryID', 'placeID', 'adminID').all()
        serializer = PostJoinSerializer(posts_query, many=True)
    except Exception as error:
        return Response(data={'Error at posts_list':str(error)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@allowed_users(allowed_roles=['admin'])
def add_post(req):
    try:
        # get full image url
        upload_result = cloudinary.uploader.upload(req.FILES['image']) # if get as json,  use -> req.data['image']
        img_path = upload_result['secure_url']
        req.data['image'] = img_path
        
        # get adminID from token
        env = environ.Env()
        token = req.COOKIES.get('token')
        payload = jwt.decode(token, env('JWT_SECRET'), algorithms=['HS256'], leeway=60)
        user = User.objects.filter(userID=payload['id']).first
        req.data['adminID'] = user.userID
        
        serializer = PostSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
    except Exception as error:
        return Response(data={'Error at add_post':str(error)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

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
        imgPublicID = post_query.image.split('/')[-1].split('.')[0] 
        cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload") # delete old image from cloudinary
        
        upload_result = cloudinary.uploader.upload(req.FILES['image'])
        img_path = upload_result['secure_url'] # get full image url
        req.data['image'] = img_path
        
        serializer = PostSerializer(post_query, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif req.method == 'DELETE':
        
        serializer = PostSerializer(post_query)
        imgPublicID = serializer.data['image'].split('/')[-1].split('.')[0]
        cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload") # delete item image from cloudinary
        
        post_query.delete()  # delete item from database
        return Response(data="Item deleted.",status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


# search ------------------------------------------------------------------------- 
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
@allowed_users(allowed_roles=['user','admin'])
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

        if not posts_query.count(): # check if no posts found
            return Response("None of the posts found in the Category", status=status.HTTP_200_OK)  
        
        serializer = PostJoinSerializer(posts_query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Post.DoesNotExist:
        return Response("None of the posts found in the Category", status=status.HTTP_200_OK)
    
    except Exception as error:
        return Response(data={'Error at posts_filter':str(error)}, status=status.HTTP_400_BAD_REQUEST)


from users.Model import callModel


@api_view(['GET','POST'])
def posts_by_img(req):
    
    if req.method == 'POST':
        print("post_by_img_func")
        try:
            
            upload_result = cloudinary.uploader.upload(req.FILES['file'], public_id = 'temp_img') #upload image to cloudinary
            img_path = upload_result['secure_url']
            
            cate_id = callModel.predict(img_path) #pass image path to yolov5 model

            cate_id = None if cate_id is None else int(cate_id) # if model cannot capture any object, return None
            
            imgPublicID = 'temp_img'
            cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload") #delete temp image from cloudinary
        except Exception as error:
                return Response(data={'Error at post_by_img':str(error)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={"cate_id":cate_id}, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

