from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Candidate
from .serializers import CandidateSerializer

# Create your views here.
class CandidatesViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer