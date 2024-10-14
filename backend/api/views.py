from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
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


class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer


class ProjectMaterialViewSet(viewsets.ModelViewSet):
    queryset = ProjectMaterial.objects.all()
    serializer_class = ProjectMaterialSerializer


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


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


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
