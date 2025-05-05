from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('driver-login/', views.driver_login, name='driver_login'),
    path('forgot-password/', views.driver_forgot_password, name='driver_forgot_password'),
    path('parent-login/', views.parent_login, name='parent_login'),
    path('student-login/', views.student_login, name='student_login'),
]
