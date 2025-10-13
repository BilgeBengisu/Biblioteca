from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers_auth import IdentifierTokenSerializer


class IdentifierTokenObtainView(APIView):
    permission_classes = []  # allow any
    authentication_classes = []  # no auth required

    def post(self, request, *args, **kwargs):
        serializer = IdentifierTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        tokens = serializer.create(serializer.validated_data)
        return Response(tokens, status=status.HTTP_200_OK)
