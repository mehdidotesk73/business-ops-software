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
    

class Task(models.Model):
    name = models.CharField(max_length=200)
    labor_hours = models.FloatField()
    description = models.CharField(max_length=500)
    materials = models.ManyToManyField('Material', through='TaskMaterial')

    def __str__(self):
        return self.name


class Material(models.Model):
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=10)
    unit_price = models.FloatField()
    description = models.CharField(max_length=500)

    def __str__(self):
        return self.name


class TaskMaterial(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_materials')
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='material_tasks')
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.task.name} - {self.material.name} ({self.quantity})"
