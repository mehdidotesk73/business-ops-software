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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        representation["user"] = UserSerializer(instance.user).data
        if request and request.parser_context["kwargs"].get("pk"):
            if hasattr(instance, "user"):
                representation["user"] = UserSerializer(instance.user).data

        return representation


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
        material_instances = TaskMaterial.objects.filter(task=instance)
        materials = []
        # Loop over them and perform actions
        for material_instance in material_instances:
            material = MaterialSerializer(
                material_instance.material, context=self.context
            ).data
            material["quantity"] = material_instance.quantity
            materials.append(material)
        return materials

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
        if instance.coordinator:
            return UserSerializer(instance.coordinator).data
        else:
            return None

    def get_tasks(self, instance):
        # Serialize tasks
        task_instances = ProjectTask.objects.filter(project=instance)
        tasks = []
        # Loop over them and perform actions
        for task_instance in task_instances:
            task = TaskSerializer(task_instance.task, context=self.context).data
            task["quantity"] = task_instance.quantity
            tasks.append(task)
        return tasks

    def get_materials(self, instance):
        # Serialize materials
        material_instances = ProjectMaterial.objects.filter(project=instance)
        materials = []
        # Loop over them and perform actions
        for material_instance in material_instances:
            material = MaterialSerializer(
                material_instance.material, context=self.context
            ).data
            material["quantity"] = material_instance.quantity
            materials.append(material)
        return materials

    def get_all_materials(self, instance):
        all_materials = {}

        # Direct materials
        project_materials = ProjectMaterial.objects.filter(project=instance)
        for pm in project_materials:
            material = pm.material
            material_data = MaterialSerializer(material).data
            material_data["quantity"] = pm.quantity
            if material.id in all_materials:
                all_materials[material.id]["quantity"] += pm.quantity
            else:
                material_data["quantity"] = pm.quantity
                all_materials[material.id] = material_data

        # Indirect materials through tasks
        project_tasks = ProjectTask.objects.filter(project=instance)
        for pt in project_tasks:
            task_materials = TaskMaterial.objects.filter(task=pt.task)
            for tm in task_materials:
                material = tm.material
                quantity = tm.quantity * pt.quantity
                material_data = MaterialSerializer(material).data
                if material.id in all_materials:
                    all_materials[material.id]["quantity"] += quantity
                else:
                    material_data["quantity"] = quantity
                    all_materials[material.id] = material_data

        return list(all_materials.values())

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
        fields = "__all__"

    def get_material(self, instance):
        # Serialize material
        return MaterialSerializer(instance.material, context=self.context).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        if request and request.parser_context["kwargs"].get("pk"):
            print(self.get_material(instance))
            representation["material"] = self.get_material(instance)

        return representation


class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = "__all__"

    def get_task(self, instance):
        # Serialize material
        return TaskSerializer(instance.task, context=self.context).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        if request and request.parser_context["kwargs"].get("pk"):
            print(self.get_task(instance))
            representation["task"] = self.get_task(instance)

        return representation


class ProjectMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMaterial
        fields = "__all__"

    def get_material(self, instance):
        # Serialize material
        return MaterialSerializer(instance.material, context=self.context).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        if request and request.parser_context["kwargs"].get("pk"):
            print(self.get_material(instance))
            representation["material"] = self.get_material(instance)

        return representation
