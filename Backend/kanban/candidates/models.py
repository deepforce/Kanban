from django.db import models
import uuid
# Create your models here.


def upload_path(instance, filename):
    return '/'.join(['resumes', str(instance.name), filename])


class Candidate(models.Model):
    STATUS = [
        ("Applied","Applied"),
        ("Phone Screen","Phone Screen"), 
        ("On site", "On site"),
        ("Offered", "Offered"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]

    id = models.UUIDField(
        primary_key = True, 
        default=uuid.uuid4,
        editable=False)
    name = models.CharField(max_length=50, blank=False)
    education = models.CharField(max_length=50, blank=False)
    contact = models.EmailField(max_length=254, blank=True)
    status = models.CharField(max_length=30, default="Applied", choices=STATUS)
    resume = models.FileField(null=True, blank=True, upload_to=upload_path)