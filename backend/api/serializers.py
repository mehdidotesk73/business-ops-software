from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Note,
    EmployeeProfile,
    ClientProfile,
    Material,
    Task,
    Project,
    TaskMaterial,
    ProjectMaterial,
    ProjectTask,
)


from rest_framework import serializers
from django.contrib.auth.models import User


class EmployeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeProfile
        fields = "__all__"


class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        representation["name"] = instance.first_name + " " + instance.last_name
        if request and request.parser_context["kwargs"].get("pk"):
            if hasattr(instance, "employee_profile"):
                representation["employee_profile"] = EmployeeProfileSerializer(
                    instance.employee_profile
                ).data
                representation["employee_profile"]["name"] = "Employee"
            if hasattr(instance, "client_profile"):
                representation["client_profile"] = ClientProfileSerializer(
                    instance.client_profile
                ).data
                representation["client_profile"]["name"] = "Client"

        return representation


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

    def get_materials(self, instance):
        # Serialize materials
        return MaterialSerializer(instance.materials.all(), many=True).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)
        if request and request.parser_context["kwargs"].get("pk"):
            representation["materials"] = self.get_materials(instance)

        return representation


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = "__all__"
        extra_kwargs = {"creator": {"read_only": True}}

    def get_creator(self, instance):
        return UserSerializer(instance.creator).data

    def get_coordinator(self, instance):
        return UserSerializer(instance.coordinator).data

    def get_tasks(self, instance):
        # Serialize tasks
        return TaskSerializer(
            instance.tasks.all(), many=True, context=self.context
        ).data

    def get_materials(self, instance):
        # Serialize materials
        return MaterialSerializer(
            instance.materials.all(), many=True, context=self.context
        ).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        representation["creator"] = self.get_creator(instance)
        # representation["creator_name"] = self.get_creator(instance)["name"]
        representation["coordinator"] = self.get_coordinator(instance)
        # representation["coordinator_name"] = self.get_coordinator(instance)["name"]
        if request and request.parser_context["kwargs"].get("pk"):
            representation["tasks"] = self.get_tasks(instance)
            representation["materials"] = self.get_materials(instance)

        return representation


class TaskMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskMaterial
        fields = ["task", "material", "quantity"]


class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ["project", "task", "quantity"]


class ProjectMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMaterial
        fields = ["project", "material", "quantity"]
