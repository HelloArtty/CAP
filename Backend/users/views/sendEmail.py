import environ
from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

env = environ.Env()

@api_view(['POST'])
def send_email(req):
    try:
        # Get the image file from the request
        image_file = req.FILES['image']
        
        # Create an email message
        email = EmailMessage(
            subject=req.data["subject"],
            body=req.data["body"],
            from_email=req.data['from_email'],
            to=[env('official_email')],
        )

        # Attach the image file
        email.attach(image_file.name, image_file.read(), image_file.content_type)
        # Send the email
        email.send()

    except Exception as error:
        return Response(f"Error at sendEmail:{error}", status=status.HTTP_400_BAD_REQUEST)
    return Response("Email send successfully", status=status.HTTP_200_OK)
