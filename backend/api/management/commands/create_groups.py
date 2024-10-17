# yourapp/management/commands/create_groups.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


class Command(BaseCommand):
    help = "Create user groups and assign permissions"

    def handle(self, *args, **kwargs):
        # Create Groups
        admin_group, created = Group.objects.get_or_create(name="admin")
        employee_group, created = Group.objects.get_or_create(name="employee")
        guest_group, created = Group.objects.get_or_create(name="guest")

        # Define Permissions (customize based on your app's permissions)
        admin_permissions = Permission.objects.all()  # Admins get all permissions
        employee_permissions = Permission.objects.filter(
            codename__in=["view_data", "edit_data"]
        )  # Example
        guest_permissions = Permission.objects.filter(codename="view_data")

        # Assign Permissions to Groups
        admin_group.permissions.set(admin_permissions)
        employee_group.permissions.set(employee_permissions)
        guest_group.permissions.set(guest_permissions)

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully created user groups and assigned permissions"
            )
        )
