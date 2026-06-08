from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, Vacancy
from .serializers import UserSerializer, RegisterSerializer, VacancySerializer, VacancyWithCompanySerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'email' in data and 'username' not in data:
            data['username'] = data['email'].split('@')[0]
            
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "user": UserSerializer(user).data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                })
        except User.DoesNotExist:
            pass
            
        return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)

class MeView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class VacancyViewSet(viewsets.ModelViewSet):
    serializer_class = VacancySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vacancy.objects.filter(company=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(company=self.request.user)

class CompanyListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(role='company')

class CandidateListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(role__in=['student', 'jobseeker'])

class AllVacanciesView(generics.ListAPIView):
    """All vacancies from all companies — visible to students/jobseekers."""
    serializer_class = VacancyWithCompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vacancy.objects.select_related('company').order_by('-created_at')

class CompanyProfileView(APIView):
    """Returns public profile of a specific company."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        company = get_object_or_404(User, pk=pk, role='company')
        vacancies = Vacancy.objects.filter(company=company).order_by('-created_at')
        return Response({
            "company": UserSerializer(company).data,
            "vacancies": VacancySerializer(vacancies, many=True).data,
        })
