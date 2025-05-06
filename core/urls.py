from django.urls import path
from . import views

urlpatterns = [
    # General
    path('', views.home, name='home'),

    # Driver
    path('driver-login/', views.driver_login, name='driver_login'),
    path('driver-signup/', views.driver_signup, name='driver_signup'),
    path('forgot-password/', views.driver_forgot_password, name='driver_forgot_password'),

    # Student
    path('student-login/', views.student_login, name='student_login'),
    path('student-dashboard/', views.student_dashboard, name='student_dashboard'),
    path('student-logout/', views.student_logout, name='student_logout'),

    # Parent
    path('parent-login/', views.parent_login, name='parent_login'),

    # Driver Dashboard
    path('driver/routes/', views.driver_routes, name='driver_routes'),
    path('driver/students/', views.driver_students, name='driver_students'),

    # Student API Endpoints
    path('api/students/', views.get_students, name='get_students'),
    path('api/students/add/', views.add_student, name='add_student'),
    path('api/students/<int:student_id>/delete/', views.delete_student, name='delete_student'),
    path('api/students/<int:student_id>/update/', views.update_student, name='update_student'),
]
