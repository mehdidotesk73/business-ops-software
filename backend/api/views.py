from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from .serializers import (
    UserSerializer,
    NoteSerializer,
    EmployeeProfileSerializer,
    ClientProfileSerializer,
    MaterialSerializer,
    TaskSerializer,
    ProjectSerializer,
    TaskMaterialSerializer,
    ProjectTaskSerializer,
    ProjectMaterialSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import (
    Note,
    EmployeeProfile,
    ClientProfile,
    Material,
    Task,
    Project,
    TaskMaterial,
    ProjectTask,
    ProjectMaterial,
)
from rest_framework import viewsets
from django.contrib.auth.models import User


class AnalyzeProject(APIView):
    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        coordinator = get_object_or_404(User, id=project.coordinator)
        zipcode = project.zipcode

        if number1 is None or number2 is None:
            return Response(
                {"error": "Both numbers are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            number1 = float(number1)
            number2 = float(number2)
        except ValueError:
            return Response(
                {"error": "Invalid numbers"}, status=status.HTTP_400_BAD_REQUEST
            )

        result = {
            "addition": number1 + number2,
            "subtraction": number1 - number2,
            "multiplication": number1 * number2,
            "division": number1 / number2 if number2 != 0 else "undefined",
        }

        return Response(result, status=status.HTTP_200_OK)


class MathOperationsView(APIView):
    def post(self, request):
        number1 = request.data.get("number1")
        number2 = request.data.get("number2")

        if number1 is None or number2 is None:
            return Response(
                {"error": "Both numbers are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            number1 = float(number1)
            number2 = float(number2)
        except ValueError:
            return Response(
                {"error": "Invalid numbers"}, status=status.HTTP_400_BAD_REQUEST
            )

        result = {
            "addition": number1 + number2,
            "subtraction": number1 - number2,
            "multiplication": number1 * number2,
            "division": number1 / number2 if number2 != 0 else "undefined",
        }

        return Response(result, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        return Response(
            "Users must be created through registeration.",
            status=status.HTTP_400_BAD_REQUEST,
        )


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    def create(self, request):
        user_id = request.data.get("user")
        hourly_rate = request.data.get("hourly_rate")
        phone_number = request.data.get("phone_number")

        # Fetch the user instance
        user = User.objects.get(pk=user_id)

        employee_profile, created = EmployeeProfile.objects.update_or_create(
            user=user,
            defaults={"hourly_rate": hourly_rate, "phone_number": phone_number},
        )

        serializer = self.get_serializer(employee_profile)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request):
        user = request.query_params.get("user")
        employee_profile = EmployeeProfile.objects.filter(user=user)
        if employee_profile.exists():
            employee_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )

    @action(detail=False, methods=["get", "delete"], url_path="by-user")
    def manage_by_user(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the user instance
        user = User.objects.get(pk=user_id)
        employee_profile = EmployeeProfile.objects.filter(user=user).first()

        if employee_profile:
            if request.method == "GET":
                serializer = self.get_serializer(employee_profile)
                return Response(serializer.data)
            if request.method == "DELETE":
                employee_profile.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer

    def create(self, request):
        user_id = request.data.get("user")
        phone_number = request.data.get("phone_number")

        # Fetch the user instance
        user = User.objects.get(pk=user_id)

        client_profile, created = ClientProfile.objects.update_or_create(
            user=user, defaults={"phone_number": phone_number}
        )

        serializer = self.get_serializer(client_profile)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request):
        user = request.query_params.get("user")
        client_profile = ClientProfile.objects.filter(user=user)
        if client_profile.exists():
            client_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )

    @action(detail=False, methods=["get", "delete"], url_path="by-user")
    def manage_by_user(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the user instance
        user = User.objects.get(pk=user_id)
        client_profile = ClientProfile.objects.filter(user=user).first()

        if client_profile:
            if request.method == "GET":
                serializer = self.get_serializer(client_profile)
                return Response(serializer.data)
            if request.method == "DELETE":
                client_profile.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        for param, value in self.request.query_params.items():
            if param in ["project", "task", "quantity"] and value is not None:
                queryset = queryset.filter(**{param: value})
        return queryset

    def create(self, request):
        project_id = request.data.get("project")
        task_id = request.data.get("task")
        quantity = request.data.get("quantity")

        project_task, created = ProjectTask.objects.update_or_create(
            project_id=project_id,
            task_id=task_id,
            defaults={"quantity": quantity},
        )

        serializer = self.get_serializer(project_task)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request):
        project_id = request.query_params.get("project")
        task_id = request.query_params.get("task")
        print(project_id)
        print(task_id)

        # Filter and delete all matching TaskMaterial entries
        project_tasks = ProjectTask.objects.filter(
            project_id=project_id, task_id=task_id
        )
        if project_tasks.exists():
            project_tasks.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )


class ProjectMaterialViewSet(viewsets.ModelViewSet):
    queryset = ProjectMaterial.objects.all()
    serializer_class = ProjectMaterialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        for param, value in self.request.query_params.items():
            if param in ["project", "material", "quantity"] and value is not None:
                queryset = queryset.filter(**{param: value})
        return queryset

    def create(self, request):
        project_id = request.data.get("project")
        material_id = request.data.get("material")
        quantity = request.data.get("quantity")

        project_material, created = ProjectMaterial.objects.update_or_create(
            project_id=project_id,
            material_id=material_id,
            defaults={"quantity": quantity},
        )

        serializer = self.get_serializer(project_material)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request):
        project_id = request.query_params.get("project")
        material_id = request.query_params.get("material")
        print(project_id)
        print(material_id)

        # Filter and delete all matching TaskMaterial entries
        project_materials = ProjectMaterial.objects.filter(
            project_id=project_id, material_id=material_id
        )
        if project_materials.exists():
            project_materials.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )


class TaskMaterialViewSet(viewsets.ModelViewSet):
    queryset = TaskMaterial.objects.all()
    serializer_class = TaskMaterialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        for param, value in self.request.query_params.items():
            if param in ["task", "material", "quantity"] and value is not None:
                queryset = queryset.filter(**{param: value})
        return queryset

    def create(self, request):
        task_id = request.data.get("task")
        material_id = request.data.get("material")
        quantity = request.data.get("quantity")

        task_material, created = TaskMaterial.objects.update_or_create(
            task_id=task_id, material_id=material_id, defaults={"quantity": quantity}
        )

        serializer = self.get_serializer(task_material)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request):
        task_id = request.query_params.get("task")
        material_id = request.query_params.get("material")
        print(task_id)
        print(material_id)

        # Filter and delete all matching TaskMaterial entries
        task_materials = TaskMaterial.objects.filter(
            task_id=task_id, material_id=material_id
        )
        if task_materials.exists():
            task_materials.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    # permission_classes = [IsAuthenticated]  # Require authentication

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"], url_path="assign-coordinator")
    def assign_coordinator(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get("coordinator")

        if not user_id:
            return Response(
                {"detail": "Employee is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        project.coordinator = user
        project.save()

        return Response(
            {"detail": "Coordinator assigned successfully."}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], url_path="unassign-coordinator")
    def unassign_coordinator(self, request, pk=None):
        project = self.get_object()

        project.coordinator = None
        project.save()

        return Response(
            {"detail": "Coordinator unassigned successfully."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"], url_path="report")
    def report(self, request, pk=None):
        pass


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.notes.all()
        # return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
        return super().perform_create(serializer)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
