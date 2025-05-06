from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    route_number = models.CharField(max_length=20)
    
    profile_picture = models.ImageField(
        upload_to='students/',  # will be saved under /media/students/
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school_district = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"