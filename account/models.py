from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('jobseeker', 'Job Seeker'),
        ('company', 'Company'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    # Common fields
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    # Student fields
    is_student = models.BooleanField(default=False)
    student_id = models.CharField(max_length=100, blank=True, null=True)
    university = models.CharField(max_length=255, blank=True, null=True)

    # Profile fields
    about = models.TextField(blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    education_info = models.TextField(blank=True, null=True)
    diploma_file = models.FileField(upload_to='diplomas/', blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    specialization = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=120, blank=True, null=True)
    contact_sharing_enabled = models.BooleanField(default=False)

    # Company profile fields
    industry = models.CharField(max_length=120, blank=True, null=True)
    company_size = models.CharField(max_length=80, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    experience = models.JSONField(default=list, blank=True)  # [{company, role, start_date, end_date, is_current, desc}]
    projects = models.JSONField(default=list, blank=True)    # [{name, desc, tech:[]}]
    test_results = models.JSONField(default=list, blank=True) # [{tech, level, score, date}]
    profile_completed = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    # Add related_name to avoid clashes with default User model
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="custom_user_groups",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_permissions",
        related_query_name="user",
    )

class Vacancy(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vacancies')
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=50)
    description = models.TextField()
    requirements = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class VacancyView(models.Model):
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vacancy_views')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=('vacancy', 'viewer'), name='unique_vacancy_viewer')]


class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Новый'),
        ('reviewing', 'На рассмотрении'),
        ('rejected', 'Отклонён'),
        ('hired', 'Нанят'),
    )
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=('vacancy', 'candidate'), name='unique_vacancy_application')]
