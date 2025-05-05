from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def driver_login(request):
    return render(request, 'driver-login.html')

def driver_forgot_password(request):
    return render(request, 'driver-forgot-password.html')


def parent_login(request):
    return render(request, 'parent-login.html')

def student_login(request):
    return render(request, 'student-login.html')
