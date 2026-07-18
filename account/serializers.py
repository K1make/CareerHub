from rest_framework import serializers
from .models import User, Vacancy, Application
from django.contrib.auth import authenticate
import re

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'name', 'university', 'student_id', 'about', 'skills', 'education_info', 'diploma_file', 'resume_file', 'phone', 'github_url', 'avatar', 'specialization', 'city', 'contact_sharing_enabled', 'industry', 'company_size', 'website', 'experience', 'projects', 'test_results', 'profile_completed')

    def get_name(self, obj):
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username

    def validate_projects(self, value):
        for project in value:
            if not all(str(project.get(field, '')).strip() for field in ('name', 'desc')) or not project.get('tech'):
                raise serializers.ValidationError('Для каждого проекта обязательны название, описание и стек технологий.')
        return value

    def validate_experience(self, value):
        for item in value:
            if item and (not item.get('company') or not item.get('role') or not item.get('start_date')):
                raise serializers.ValidationError('У опыта работы обязательны компания, должность и дата начала.')
        return value

    def validate_resume_file(self, value):
        allowed_extensions = ('.pdf', '.doc', '.docx')
        if value and not value.name.lower().endswith(allowed_extensions):
            raise serializers.ValidationError('Загрузите резюме в формате PDF, DOC или DOCX.')
        if value and value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError('Размер резюме не должен превышать 10 МБ.')
        return value


class PublicCandidateSerializer(serializers.ModelSerializer):
    """Safe candidate representation for companies: never exposes contacts or documents."""
    name = serializers.SerializerMethodField()
    contacts_available = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'role', 'university', 'city', 'about', 'skills', 'avatar', 'specialization', 'experience', 'projects', 'test_results', 'contacts_available')

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

    def get_contacts_available(self, obj):
        return obj.contact_sharing_enabled


class CandidateContactsSerializer(serializers.ModelSerializer):
    """Contact details are only returned after explicit candidate consent."""

    class Meta:
        model = User
        fields = ('email', 'phone', 'github_url')


class PublicCompanySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'about', 'avatar')

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'name', 'student_id', 'university')
        extra_kwargs = {
            'username': {'required': False},
            'password': {'write_only': True},
        }

    @staticmethod
    def _make_username(email):
        """Build a valid, unique username when the client only provides email."""
        base = re.sub(r'[^\w.@+-]', '-', email.split('@', 1)[0]).strip('-') or 'user'
        base = base[:140]
        username = base
        suffix = 1
        while User.objects.filter(username=username).exists():
            suffix_text = f'-{suffix}'
            username = f'{base[:150 - len(suffix_text)]}{suffix_text}'
            suffix += 1
        return username

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        username = validated_data.pop('username', None) or self._make_username(validated_data.get('email', ''))
        parts = name.split(' ', 1)
        first_name = parts[0] if len(parts) > 0 else ''
        last_name = parts[1] if len(parts) > 1 else ''
        
        user = User.objects.create_user(
            username=username,
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'student'),
            first_name=first_name,
            last_name=last_name,
            is_student=validated_data.get('role') == 'student',
            student_id=validated_data.get('student_id', ''),
            university=validated_data.get('university', '')
        )
        return user

class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = '__all__'
        read_only_fields = ('company', 'created_at')

class VacancyWithCompanySerializer(serializers.ModelSerializer):
    """Vacancy with embedded company info — used for public vacancy listing."""
    company = PublicCompanySerializer(read_only=True)

    class Meta:
        model = Vacancy
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    candidate = PublicCandidateSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ('id', 'vacancy', 'candidate', 'status', 'created_at')
        read_only_fields = ('vacancy', 'candidate', 'created_at')
