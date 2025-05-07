from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Student, DriverProfile, Route, Stop

# ------------------------ General Views ------------------------

def home(request):
    return render(request, 'home.html')

# ------------------------ Student Views ------------------------

def student_login(request):
    if request.method == "POST":
        route_number = request.POST.get("route_number")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")

        try:
            student = Student.objects.get(
                route_number=route_number,
                first_name__iexact=first_name,
                last_name__iexact=last_name
            )
            request.session['student_id'] = student.id
            return redirect('student_dashboard')
        except Student.DoesNotExist:
            messages.error(request, "Student not found. Please check your details.")
    
    return render(request, 'student-login.html')


def student_dashboard(request):
    student_id = request.session.get('student_id')
    if not student_id:
        return redirect('student_login')
    
    student = get_object_or_404(Student, id=student_id)
    return render(request, 'student-dashboard.html', {'student': student})


def student_logout(request):
    request.session.flush()
    return redirect('student_login')

# ------------------------ Parent Views ------------------------

def parent_login(request):
    if request.method == "POST":
        route_number = request.POST.get("route_number")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")

        try:
            student = Student.objects.get(
                route_number=route_number,
                first_name__iexact=first_name,
                last_name__iexact=last_name
            )
            request.session['parent_student_id'] = student.id
            return redirect('parent_dashboard')  # To be implemented
        except Student.DoesNotExist:
            messages.error(request, "Student not found. Please check details.")
    
    return render(request, 'parent-login.html')

# ------------------------ Driver Views ------------------------

def driver_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('driver_dashboard')
        else:
            messages.error(request, "Invalid email or password.")

    return render(request, 'driver-login.html')


def driver_forgot_password(request):
    return render(request, 'driver-forgot-password.html')


def driver_signup(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        school_district = request.POST.get("school_district")
        email = request.POST.get("email")
        password = request.POST.get("password")

        if User.objects.filter(username=email).exists():
            messages.error(request, "Email already registered.")
            return render(request, 'driver-signup.html')

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        DriverProfile.objects.create(user=user, school_district=school_district)
        login(request, user)

        return redirect('driver_dashboard')

    return render(request, 'driver-signup.html')


@login_required
def driver_routes(request):
    if request.method == "GET":
        routes = Route.objects.filter(driver=request.user)
        return render(request, 'driver_dashboard/routes.html', {'routes': routes})

    if request.method == "POST":
        Route.objects.create(
            driver=request.user,
            route_number=request.POST.get('route_number'),
            route_name=request.POST.get('route_name'),
            start_location=request.POST.get('start_location'),
            end_location=request.POST.get('end_location'),
            description=request.POST.get('description')
        )
        return JsonResponse({"status": "success"})


@csrf_exempt
@login_required
def update_route(request, route_id):
    if request.method == "POST":
        route = get_object_or_404(Route, id=route_id, driver=request.user)
        route.route_number = request.POST.get('route_number')
        route.route_name = request.POST.get('route_name')
        route.start_location = request.POST.get('start_location')
        route.end_location = request.POST.get('end_location')
        route.description = request.POST.get('description')
        route.save()
        return JsonResponse({'status': 'success'})


@csrf_exempt
@login_required
def delete_route(request, route_id):
    if request.method == "POST":
        route = get_object_or_404(Route, id=route_id, driver=request.user)
        route.delete()
        return JsonResponse({'status': 'success'})


@login_required
def driver_students(request):
    return render(request, 'driver_dashboard/students.html')


@csrf_exempt
def get_students(request):
    if request.method == "GET":
        students = Student.objects.all().order_by("id")
        student_data = [{
            "id": s.id,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "route_number": s.route_number,
            "seat_number": s.seat_number,
            "conduct_score": s.conduct_score
        } for s in students]
        return JsonResponse({"students": student_data}, safe=False)


@csrf_exempt
def add_student(request):
    if request.method == "POST":
        data = json.loads(request.body)
        student = Student.objects.create(
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            route_number=data.get("route_number"),
            seat_number=data.get("seat_number")
        )
        return JsonResponse({"message": "Student added successfully", "id": student.id})


@csrf_exempt
def delete_student(request, student_id):
    if request.method == "DELETE":
        student = get_object_or_404(Student, id=student_id)
        student.delete()
        return JsonResponse({"message": "Student deleted"})


@csrf_exempt
def update_student(request, student_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        student = get_object_or_404(Student, id=student_id)
        student.first_name = data.get("first_name", student.first_name)
        student.last_name = data.get("last_name", student.last_name)
        student.route_number = data.get("route_number", student.route_number)
        student.seat_number = data.get("seat_number", student.seat_number)
        student.save()
        return JsonResponse({"message": "Student updated"})


@login_required
def manage_stops(request, route_id):
    route = get_object_or_404(Route, id=route_id, driver=request.user)

    if request.method == "POST":
        Stop.objects.create(
            route=route,
            name=request.POST.get('name'),
            location=request.POST.get('location'),
            pickup_time=request.POST.get('pickup_time'),
            dropoff_time=request.POST.get('dropoff_time')
        )
        return redirect('manage_stops', route_id=route.id)

    stops = route.stops.all()
    return render(request, 'driver_dashboard/stops.html', {
        'route': route,
        'stops': stops
    })


@login_required
def driver_stops(request):
    stops = Stop.objects.all()
    return render(request, 'driver_dashboard/stops.html', {'stops': stops})


# ------------------------ Driver Dashboard Home ------------------------

@login_required
def driver_dashboard_home(request):
    return render(request, 'driver_dashboard/driver-dashboard.html')
