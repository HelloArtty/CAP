from django.core.mail import BadHeaderError, send_mail

from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
def send_email(req):
    recipient = req.data("admin_email")
    subject = req.data("subject")
    message = req.data("message")
    from_email = req.data("from_email",)
    
    if subject and message and from_email:
        try:
            
            send_mail(subject, message, from_email, [recipient]) # send_mail(subject, message, from_email, recipient_list)
        except BadHeaderError:
            return Response("Invalid header found.", status=status.HTTP_400_BAD_REQUEST)
        return Response("Request send", status=status.HTTP_200_OK)
