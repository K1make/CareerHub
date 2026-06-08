from rest_framework import serializers
from .models import User, Vacancy
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'name', 'university', 'student_id')

    def get_name(self, obj):
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'name', 'student_id', 'university')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        parts = name.split(' ', 1)
        first_name = parts[0] if len(parts) > 0 else ''
        last_name = parts[1] if len(parts) > 1 else ''
        
        user = User.objects.create_user(
            username=validated_data['username'],
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
    company = UserSerializer(read_only=True)

    class Meta:
        model = Vacancy
        fields = '__all__'
