from django.db import models

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
