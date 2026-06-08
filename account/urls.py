from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, MeView,
    VacancyViewSet, CompanyListView, CandidateListView,
    AllVacanciesView, CompanyProfileView,
)

router = DefaultRouter()
router.register(r'my-vacancies', VacancyViewSet, basename='my-vacancies')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('me/', MeView.as_view(), name='auth_me'),
    path('companies/', CompanyListView.as_view(), name='companies'),
    path('companies/<int:pk>/', CompanyProfileView.as_view(), name='company_profile'),
    path('candidates/', CandidateListView.as_view(), name='candidates'),
    path('vacancies/', AllVacanciesView.as_view(), name='all_vacancies'),
    path('', include(router.urls)),
]
