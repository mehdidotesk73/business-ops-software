from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from .serializers import (
    UserSerializer,
    EmployeeProfileSerializer,
    ClientProfileSerializer,
    MaterialSerializer,
    TaskSerializer,
    ProjectSerializer,
    TaskMaterialSerializer,
    ProjectTaskSerializer,
    ProjectMaterialSerializer,
    EmployeeTaskRatingSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import (
    EmployeeProfile,
    ClientProfile,
    Material,
    Task,
    Project,
    TaskMaterial,
    ProjectTask,
    ProjectMaterial,
    EmployeeTaskRating,
)
from rest_framework import viewsets
from django.contrib.auth.models import User
import pandas as pd
from io import StringIO
from .signals import create_task_employee_ratings


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        return Response(
            "Users must be created through /api/user/register.",
            status=status.HTTP_400_BAD_REQUEST,
        )


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    def create(self, request):
        user_id = request.data.get("user")
        hourly_rate = request.data.get("hourly_rate")
        phone_number = request.data.get("phone_number")
        overall_rating = request.data.get("overall_rating")

        # Fetch the user instance
        user = User.objects.get(pk=user_id)
        employee_profile, created = EmployeeProfile.objects.update_or_create(
            user=user,
            defaults={
                "hourly_rate": hourly_rate,
                "phone_number": phone_number,
                "overall_rating": overall_rating,
            },
        )

        serializer = self.get_serializer(employee_profile)
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

    def destroy(self, request):
        user = request.query_params.get("user")
        employee_profile = EmployeeProfile.objects.filter(user=user)
        if employee_profile.exists():
            employee_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )

    @action(detail=False, methods=["get", "delete"], url_path="by-user")
    def manage_by_user(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the user instance
        user = User.objects.get(pk=user_id)
        employee_profile = EmployeeProfile.objects.filter(user=user).first()

        if employee_profile:
            if request.method == "GET":
                serializer = self.get_serializer(employee_profile)
                return Response(serializer.data)
            if request.method == "DELETE":
                employee_profile.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class EmployeeTaskViewSet(viewsets.ModelViewSet):
    queryset = EmployeeTaskRating.objects.all()
    serializer_class = EmployeeTaskRatingSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="by-employee")
    def get_by_employee(self, request):
        employee_id = request.query_params.get("employee_id")
        if not employee_id:
            return Response(
                {"detail": "employee_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the employee instance
        try:
            employee = EmployeeProfile.objects.get(pk=employee_id)
        except EmployeeProfile.DoesNotExist:
            return Response(
                {"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND
            )
        employee_task_ratings = EmployeeTaskRating.objects.filter(
            employee=employee
        ).all()

        if employee_task_ratings:
            serializer = self.get_serializer(employee_task_ratings, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["put"], url_path="by-employee-and-task")
    def update_by_employee_and_task(self, request):
        employee_id = request.data.get("employee_id")
        task_id = request.data.get("task_id")
        rating = request.data.get("rating")
        print(f"employee_id is {employee_id}, task_id is {task_id}, rating is {rating}")
        if not employee_id:
            return Response(
                {"detail": "employee_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not task_id:
            return Response(
                {"detail": "task_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not rating:
            return Response(
                {"detail": "rating is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the employee instance
        try:
            employee_task_rating = EmployeeTaskRating.objects.filter(
                employee=employee_id, task=task_id
            ).first()
            print(f"employee_task_rating is {employee_task_rating}")
        except EmployeeTaskRating.DoesNotExist:
            return Response(
                {"detail": "Employee-Task-Rating not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            employee_task_rating, data={"rating": rating}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer

    def create(self, request):
        user_id = request.data.get("user")
        phone_number = request.data.get("phone_number")

        # Fetch the user instance
        user = User.objects.get(pk=user_id)

        client_profile, created = ClientProfile.objects.update_or_create(
            user=user, defaults={"phone_number": phone_number}
        )

        serializer = self.get_serializer(client_profile)
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

    def destroy(self, request):
        user = request.query_params.get("user")
        client_profile = ClientProfile.objects.filter(user=user)
        if client_profile.exists():
            client_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."}
            )

    @action(detail=False, methods=["get", "delete"], url_path="by-user")
    def manage_by_user(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the user instance
        user = User.objects.get(pk=user_id)
        client_profile = ClientProfile.objects.filter(user=user).first()

        if client_profile:
            if request.method == "GET":
                serializer = self.get_serializer(client_profile)
                return Response(serializer.data)
            if request.method == "DELETE":
                client_profile.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


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
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"], url_path="assign-coordinator")
    def assign_coordinator(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get("coordinator")

        if not user_id:
            return Response(
                {"detail": "Employee is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        project.coordinator = user
        project.save()

        return Response(
            {"detail": "Coordinator assigned successfully."}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], url_path="unassign-coordinator")
    def unassign_coordinator(self, request, pk=None):
        project = self.get_object()

        project.coordinator = None
        project.save()

        return Response(
            {"detail": "Coordinator unassigned successfully."},
            status=status.HTTP_200_OK,
        )

    def project_input_report(self, project):
        serializer = self.get_serializer(project)
        project_input_report = serializer.data
        employee_profile = get_object_or_404(
            EmployeeProfile, user=project.coordinator.id
        )
        employee_profile = EmployeeProfileSerializer(employee_profile).data
        all_project_materials = serializer.get_all_materials(project)

        project_input_report["employee"] = employee_profile
        project_input_report["all_materials"] = all_project_materials

        return project_input_report

    def get_labor_hours(self, project):
        serializer = self.get_serializer(project)
        labor_hours = 0
        tasks = serializer.get_tasks(project)
        for task in tasks:
            labor_hours += task["labor_hours"] * task["quantity"]

        print(f"Labor Hours: {labor_hours}")
        return labor_hours

    def get_hourly_rate(self, project):
        serializer = self.get_serializer(project)
        coordinator = serializer.get_coordinator(project)
        print(f"Coordinator: {coordinator}")

        employee_profile = get_object_or_404(EmployeeProfile, user=coordinator["id"])
        print(f"Employee: {employee_profile}")

        hourly_rate = float(employee_profile.hourly_rate)
        print(f"Hourly Rate: {hourly_rate}")
        return hourly_rate

    def get_material_cost(self, project):
        serializer = self.get_serializer(project)
        material_cost = 0

        # Calculate cost for all materials, both direct materials and indirect materials through tasks
        materials = serializer.get_all_materials(project)
        for material in materials:
            material_cost += material["unit_price"] * material["quantity"]

        return material_cost

    def project_cost_report(self, project, commute_time, contingency):
        project_hourly_rate = self.get_hourly_rate(project)
        project_labor_hours = self.get_labor_hours(project) + commute_time
        project_labor_cost = round(project_hourly_rate * project_labor_hours, 2)
        project_material_cost = round(self.get_material_cost(project), 2)
        project_cost = project_labor_cost + project_material_cost
        contingency_cost = round(contingency * project_cost, 2)
        expected_project_cost = project_cost + contingency_cost

        project_cost_report = {
            "project_labor_hours": project_labor_hours,
            "project_hourly_rate": project_hourly_rate,
            "project_labor_cost": project_labor_cost,
            "project_material_cost": project_material_cost,
            "project_cost": project_cost,
            "contingency_cost": contingency_cost,
            "expected_project_cost": expected_project_cost,
        }

        return project_cost_report

    def project_profit_report(self, project, expected_cost):
        # returns a profit percentage based on project site location
        # The current implementation is a linear interpolation between 10%-20% profit margin based on median zipcode
        # income.
        zipcode_data = pd.DataFrame(columns=["zipcode", "median_income"])
        zipcodes = [
            89138,
            89135,
            89179,
            89158,
            89131,
            89141,
            89124,
            89166,
            89178,
            89144,
            89149,
            89139,
            89143,
            89148,
            89129,
            89113,
            89130,
            89123,
            89134,
            89183,
            89161,
            89120,
            89147,
            89117,
            89145,
            89128,
            89118,
            89156,
            89142,
            89146,
            89108,
            89122,
            89107,
            89110,
            89121,
            89109,
            89104,
            89115,
            89103,
            89102,
            89119,
            89169,
        ]
        median_incomes = [
            157170,
            113377,
            110356,
            110039,
            109956,
            105993,
            104830,
            101276,
            101256,
            101000,
            96454,
            93003,
            92575,
            92362,
            87620,
            85504,
            81584,
            78195,
            76500,
            76488,
            73333,
            68934,
            68251,
            68206,
            67308,
            66534,
            65929,
            61856,
            60245,
            57581,
            55935,
            55216,
            50876,
            50802,
            50757,
            49818,
            48355,
            47189,
            46139,
            45724,
            44939,
            37200,
        ]
        for zipcode, median_income in zip(zipcodes, median_incomes):
            zipcode_data.loc[len(zipcode_data)] = {
                "zipcode": str(zipcode),
                "median_income": median_income,
            }
        max_median_income = zipcode_data["median_income"].max()
        min_median_income = zipcode_data["median_income"].min()
        max_profit = 0.5
        min_profit = 0.15
        zipcode_data["profit_margin"] = (max_profit - min_profit) / (
            max_median_income - min_median_income
        ) * (zipcode_data["median_income"] - min_median_income) + min_profit

        if (
            project.zipcode in zipcode_data["zipcode"].values
        ):  # linear interpolate if zipcode found
            profit_margin = zipcode_data["profit_margin"][
                zipcode_data["zipcode"] == project.zipcode
            ].iloc[0]
        else:  # average profit if zipcode not found
            profit_margin = (min_profit + max_profit) / 2
        profit_margin = round(profit_margin, 3)
        expected_profit = round(profit_margin * expected_cost, 2)

        project_profit_report = {
            "zipcode": project.zipcode,
            "profit_margin": profit_margin,
            "expected_profit": expected_profit,
        }

        return project_profit_report

    @action(detail=True, methods=["post"], url_path="report")
    def report(self, request, pk=None):
        project = self.get_object()
        try:
            commute_time = float(request.data.get("commuteTime", 0))
        except ValueError:
            commute_time = 0

        try:
            contingency = float(request.data.get("contingency", project.contingency))
        except ValueError:
            contingency = 0

        input_report = self.project_input_report(project)
        cost_report = self.project_cost_report(
            project=project, commute_time=commute_time, contingency=contingency
        )
        profit_report = self.project_profit_report(
            project=project, expected_cost=cost_report["expected_project_cost"]
        )

        response_json = {
            "input_report": input_report,
            "cost_report": cost_report,
            "profit_report": profit_report,
        }

        return Response(
            response_json,
            status=status.HTTP_200_OK,
        )


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=False, methods=["post"], url_path="batch-create")
    @transaction.atomic
    def batch_create(self, request, pk=None):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        # Read the CSV file into a pandas DataFrame
        file_data = file.read().decode("utf-8")
        csv_data = StringIO(file_data)
        try:
            df = pd.read_csv(csv_data, header=None)
        except Exception as e:
            return Response(
                {"error": f"Problem reading file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tasks = []
        task_materials = []
        for index, row in df.iterrows():
            task = Task(
                name=row[0],
                labor_hours=row[1],
                description=row[2],
            )
            tasks.append(task)
            task_material_names = row[3].split(";")
            for task_material_name in task_material_names:
                material = Material.objects.filter(name=task_material_name).first()
                if material == None:
                    return Response(
                        {
                            "error": f'Error reading file. Material "{task_material_name}" in task "{task.name}" not found.'
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                task_materials.append(
                    TaskMaterial(task=task, material=material, quantity=1)
                )

        try:
            with transaction.atomic():
                Task.objects.bulk_create(tasks)
                TaskMaterial.objects.bulk_create(task_materials)
        except Exception as e:
            return Response(
                {
                    "error": f"Unable to create tasks or link materials to tasks: {str(e)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        for task in tasks:
            create_task_employee_ratings(Task, task, created=True)

        return Response(
            {"message": "File uploaded successfully"}, status=status.HTTP_200_OK
        )


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

    @action(detail=False, methods=["post"], url_path="batch-create")
    def batch_create(self, request, pk=None):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        # Read the CSV file into a pandas DataFrame
        file_data = file.read().decode("utf-8")
        csv_data = StringIO(file_data)
        try:
            df = pd.read_csv(csv_data, header=None)
        except:
            return Response(
                {"error": "Problem reading file"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create a list of Material instances from the DataFrame
        materials = [
            Material(
                name=row[0],
                unit=row[1],
                unit_price=row[2],
                description=row[3],
            )
            for index, row in df.iterrows()
        ]
        try:
            Material.objects.bulk_create(materials)
        except:
            return Response(
                {"error": "Unable to create materials"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "File uploaded successfully"}, status=status.HTTP_200_OK
        )


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UpdateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RetrieveUpdateUserView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
