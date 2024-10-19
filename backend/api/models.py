from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title


# User Profiles
class EmployeeProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="employee_profile"
    )
    hourly_rate = models.DecimalField(max_digits=5, decimal_places=2)
    phone_number = models.CharField(max_length=20)


class ClientProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="client_profile"
    )
    phone_number = models.CharField(max_length=255)


# Project Management Models
class Project(models.Model):
    name = models.CharField(max_length=200, unique=True)
    client_name = models.CharField(max_length=50)
    site_location = models.CharField(max_length=200)
    zipcode = models.CharField(max_length=5)
    description = models.CharField(max_length=500)
    contingency = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="projects_created"
    )
    coordinator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects_coordinating",
        null=True,
        blank=True,
    )

    tasks = models.ManyToManyField("Task", through="ProjectTask")
    materials = models.ManyToManyField("Material", through="ProjectMaterial")

    def __str__(self):
        return self.name


class Task(models.Model):
    name = models.CharField(max_length=200, unique=True)
    labor_hours = models.FloatField()
    description = models.CharField(max_length=500)
    materials = models.ManyToManyField("Material", through="TaskMaterial")

    def __str__(self):
        return self.name


class Material(models.Model):
    name = models.CharField(max_length=200, unique=True)
    unit = models.CharField(max_length=20)
    unit_price = models.FloatField()
    description = models.CharField(max_length=500)

    def __str__(self):
        return self.name


class ProjectTask(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_tasks"
    )
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name="task_projects"
    )
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.project.name} - {self.task.name} ({self.quantity})"


class ProjectMaterial(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_materials"
    )
    material = models.ForeignKey(
        Material, on_delete=models.CASCADE, related_name="material_projects"
    )
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.project.name} - {self.material.name} ({self.quantity})"


class TaskMaterial(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name="task_materials"
    )
    material = models.ForeignKey(
        Material, on_delete=models.CASCADE, related_name="material_tasks"
    )
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.task.name} - {self.material.name} ({self.quantity})"
