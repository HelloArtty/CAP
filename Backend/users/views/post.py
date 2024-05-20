from users.models import Post
from users.serializers import PostSerializer ,PostCategorySerializer

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status

import cloudinary.uploader
import cloudinary


#-------------------------------------- item
@api_view(['GET', 'POST'])
def posts_list(req):
    
    if req.method == 'GET':
        posts = Post.objects.select_related().all()
        serializer = PostSerializer(posts, many=True)
        return Response({"posts":serializer.data})
    elif req.method == 'POST':
        serializer = PostSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_req)


@api_view(['GET', 'PUT', 'DELETE'])
def post_by_id(req, id):
    
    try:
        item = Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return Response("Item ID not found", status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = PostSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif req.method == 'PUT':
        serializer = PostSerializer(item, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_req)
    
    elif req.method == 'DELETE':
        # delete item image from cloudinary
        serializer = PostSerializer(item)
        imgPublicID = serializer.data['image'].split('/')[-1].split('.')[0]
        cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload")
        
        # delete item from database
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def posts_by_category(req,cate_id):
    try:
        posts = Post.objects.filter(categoryID=cate_id)
    except Post.DoesNotExist:
        return Response("None of the posts found in the Category", status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = PostCategorySerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


#TODO : save pic to cloud 

from users.Model import callModel

@api_view(['GET','POST'])
def posts_by_img(req):
    
    if req.method == 'POST':
        
        upload_result = cloudinary.uploader.upload(req.FILES['file'], public_id = 'temp_img')
        img_path = upload_result['secure_url']

        try:
            # call model -> predict and get category
            categories = callModel.predict(img_path) #pass image path to yolov5 model
            posts_cate = Post.objects.filter(categoryID=categories.item())
            
            if posts_cate.count() == 0:
                return Response("None of the posts found in the Category", status=status.HTTP_404_NOT_FOUND)
            #delete temp image from cloudinary
            imgPublicID = 'temp_img'
            cloudinary.api.delete_resources(imgPublicID, resource_type="image", type="upload")
        except Exception as error:
                return Response(data={'message':str(e) for e in error}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PostCategorySerializer(posts_cate, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response({"predictions":predictions.tolist(),"scores":scores.tolist(),"categories":categories.tolist(),"category":pred_class.cateName}) 
        
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

