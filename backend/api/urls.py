from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router_materials = DefaultRouter()
router_materials.register(r"materials", views.MaterialViewSet)

router_tasks = DefaultRouter()
router_tasks.register(r"tasks", views.TaskViewSet)

router_projects = DefaultRouter()
router_projects.register(r"projects", views.ProjectViewSet)

router_task_materials = DefaultRouter()
router_task_materials.register(r"task-materials", views.TaskMaterialViewSet)

router_project_tasks = DefaultRouter()
router_project_tasks.register(r"project-tasks", views.ProjectTaskViewSet)

router_project_materials = DefaultRouter()
router_project_materials.register(r"project-materials", views.ProjectMaterialViewSet)

router_users = DefaultRouter()
router_users.register(r"users", views.UserViewSet)

router_employees = DefaultRouter()
router_employees.register(r"employees", views.EmployeeProfileViewSet)

router_employee_ratings = DefaultRouter()
router_employee_ratings.register(r"employee-ratings", views.EmployeeTaskViewSet)

router_clients = DefaultRouter()
router_clients.register(r"clients", views.ClientProfileViewSet)

urlpatterns = [
    path("", include(router_materials.urls)),
    path("", include(router_tasks.urls)),
    path("", include(router_projects.urls)),
    path("", include(router_task_materials.urls)),
    path("", include(router_project_tasks.urls)),
    path("", include(router_project_materials.urls)),
    path("", include(router_users.urls)),
    path("", include(router_employees.urls)),
    path("", include(router_clients.urls)),
    path("", include(router_employee_ratings.urls)),
]
