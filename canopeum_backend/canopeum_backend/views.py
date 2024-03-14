from rest_framework.response import Response
from rest_framework.views import APIView

class APIData(APIView):
    def get(self, request):
        data = {'example': 'data'}
        return Response(data)