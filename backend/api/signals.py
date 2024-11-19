from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EmployeeProfile, Task, EmployeeTaskRating


# Define the signal for EmployeeProfile creation
@receiver(post_save, sender=EmployeeProfile)
def create_employee_task_ratings(sender, instance, created, **kwargs):
    if created:
        tasks = Task.objects.all()
        for task in tasks:
            EmployeeTaskRating.objects.create(
                employee=instance, task=task, rating=instance.overall_rating
            )


# Define the signal for Task creation
@receiver(post_save, sender=Task)
def create_task_employee_ratings(sender, instance, created, **kwargs):
    if created:
        employees = EmployeeProfile.objects.all()
        for employee in employees:
            EmployeeTaskRating.objects.create(
                employee=employee, task=instance, rating=employee.overall_rating
            )
