from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from .serializers import (
    UserSerializer,
    NoteSerializer,
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
    Material,
    Task,
    Project,
    TaskMaterial,
    ProjectTask,
    ProjectMaterial,
)


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
        print("*** Create method is being called ***")
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
        print("*** Performing create ***")
        print(f"user is {self.request.user} and type is {type(self.request.user)}")
        serializer.save(creator=self.request.user)

    def retrieve(self, request, pk=None):
        project = self.get_object()
        creator_name = f"{project.creator.first_name} {project.creator.last_name}"
        data = {
            "project": ProjectSerializer(project).data,
            "materials": [],
            "tasks": [],
        }
        data["project"]["creator"] = creator_name

        return Response(data)

    def retrieve(self, request, pk=None):
        project = self.get_object()
        creator_name = f"{project.creator.first_name} {project.creator.last_name}"
        project_tasks = ProjectTask.objects.filter(project=project)
        project_materials = ProjectMaterial.objects.filter(project=project)

        tasks_with_quantity = [
            {
                **TaskSerializer(task.task).data,
                "quantity": task.quantity,
            }
            for task in project_tasks
        ]

        materials_with_quantity = [
            {
                **MaterialSerializer(material.material).data,
                "quantity": material.quantity,
            }
            for material in project_materials
        ]

        data = {
            "project": ProjectSerializer(project).data,
            "tasks": tasks_with_quantity,
            "materials": materials_with_quantity,
        }
        data["project"]["creator"] = creator_name

        return Response(data)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def retrieve(self, request, pk=None):
        task = self.get_object()
        task_materials = TaskMaterial.objects.filter(task=task)

        materials_with_quantity = [
            {
                **MaterialSerializer(material.material).data,
                "quantity": material.quantity,
            }
            for material in task_materials
        ]

        data = {"task": TaskSerializer(task).data, "materials": materials_with_quantity}

        return Response(data)


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
