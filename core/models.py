from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    route_number = models.CharField(max_length=20)
    seat_number = models.CharField(max_length=10, blank=True, null=True)  # NEW: for assigning seats
    conduct_score = models.PositiveIntegerField(default=100)  # NEW: default conduct score
    profile_picture = models.ImageField(
        upload_to='students/',
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

class Route(models.Model):
    driver = models.ForeignKey(User, on_delete=models.CASCADE)
    route_number = models.CharField(max_length=50)
    route_name = models.CharField(max_length=100)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.route_number} - {self.route_name}"

class Stop(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='stops')
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    pickup_time = models.TimeField()
    dropoff_time = models.TimeField()

    def __str__(self):
        return f"{self.name} ({self.pickup_time} - {self.dropoff_time})"
