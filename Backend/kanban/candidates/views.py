from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Candidate
from .serializers import CandidateSerializer

# Create your views here.
class CandidatesViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    def post(self, request, *args, **kwargs):
        name = request.data['name']
        education = request.data['education']
        contact = request.data['contact']
        resume = request.data['file']
        Candidate.objects.create(name=name, education=education, contact=contact, resume=resume)
        return HttpResponse({'message': 'Candidate created'}, status=200)