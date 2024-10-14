from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Note,
    Material,
    Task,
    Project,
    TaskMaterial,
    ProjectMaterial,
    ProjectTask,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email_address",
            "phone",
            "roles",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class TaskMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskMaterial
        fields = ["task", "material", "quantity"]


class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMaterial
        fields = ["project", "task", "quantity"]


class ProjectMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMaterial
        fields = ["project", "material", "quantity"]
