from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from django.http import HttpResponse
from io import BytesIO
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
import os
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, Vacancy, VacancyView, Application
from .serializers import UserSerializer, RegisterSerializer, VacancySerializer, VacancyWithCompanySerializer, PublicCandidateSerializer, PublicCompanySerializer, CandidateContactsSerializer, ApplicationSerializer

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

class MeView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class MeResumeView(APIView):
    """Generate a candidate's own resume as a PDF without exposing private data to companies."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'company':
            return Response({'detail': 'Резюме доступно только кандидатам.'}, status=status.HTTP_403_FORBIDDEN)

        buffer = BytesIO()
        font_path = os.path.join(os.environ.get('WINDIR', r'C:\\Windows'), 'Fonts', 'arial.ttf')
        font_name = 'Helvetica'
        if os.path.exists(font_path):
            pdfmetrics.registerFont(TTFont('CareerHubArial', font_path))
            font_name = 'CareerHubArial'

        styles = getSampleStyleSheet()
        title = ParagraphStyle('ResumeTitle', parent=styles['Title'], fontName=font_name, fontSize=22, leading=27, textColor=colors.HexColor('#111827'), spaceAfter=4)
        subtitle = ParagraphStyle('ResumeSubtitle', parent=styles['Normal'], fontName=font_name, fontSize=10, leading=15, textColor=colors.HexColor('#4B5563'), spaceAfter=14)
        heading = ParagraphStyle('ResumeHeading', parent=styles['Heading2'], fontName=font_name, fontSize=13, leading=17, textColor=colors.HexColor('#1D4ED8'), spaceBefore=10, spaceAfter=6)
        body = ParagraphStyle('ResumeBody', parent=styles['BodyText'], fontName=font_name, fontSize=10, leading=14, textColor=colors.HexColor('#1F2937'), spaceAfter=5)
        muted = ParagraphStyle('ResumeMuted', parent=body, textColor=colors.HexColor('#6B7280'))

        story = []
        name = escape(f'{user.first_name} {user.last_name}'.strip() or user.username)
        story.append(Paragraph(name, title))
        meta = ' · '.join(filter(None, [user.specialization, user.city, user.university]))
        if meta:
            story.append(Paragraph(escape(meta), subtitle))
        if user.about:
            story.extend([Paragraph('О себе', heading), Paragraph(escape(user.about).replace('\n', '<br/>'), body)])
        if user.skills:
            story.extend([Paragraph('Навыки', heading), Paragraph(escape(', '.join(user.skills)), body)])
        if user.experience:
            story.append(Paragraph('Опыт работы', heading))
            for item in user.experience:
                period = item.get('start_date', '')
                if item.get('is_current'):
                    period += ' - по настоящее время'
                elif item.get('end_date'):
                    period += f" - {item['end_date']}"
                content = f"<b>{escape(item.get('role', ''))}</b> — {escape(item.get('company', ''))}<br/><font color='#6B7280'>{escape(period)}</font>"
                if item.get('desc'):
                    content += f"<br/>{escape(item['desc'])}"
                story.append(KeepTogether(Paragraph(content, body)))
        if user.projects:
            story.append(Paragraph('Проекты', heading))
            for item in user.projects:
                content = f"<b>{escape(item.get('name', ''))}</b><br/>{escape(item.get('desc', ''))}"
                if item.get('tech'):
                    content += f"<br/><font color='#6B7280'>{escape(', '.join(item['tech']))}</font>"
                story.append(KeepTogether(Paragraph(content, body)))
        if user.test_results:
            story.append(Paragraph('Результаты тестов', heading))
            for item in user.test_results:
                story.append(Paragraph(escape(f"{item.get('tech', '')}: {item.get('level', '')}, {item.get('score', '')}%"), muted))

        document = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=18 * mm, bottomMargin=18 * mm, title='CareerHub Resume')
        document.build(story)
        filename = 'careerhub-resume.pdf'
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    def delete(self, request):
        user = request.user
        if not user.resume_file:
            return Response(status=status.HTTP_204_NO_CONTENT)
        user.resume_file.delete(save=False)
        user.resume_file = None
        user.save(update_fields=['resume_file'])
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    serializer_class = PublicCandidateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'company':
            return User.objects.none()
        queryset = User.objects.filter(role__in=['student', 'jobseeker'])
        skills = self.request.query_params.getlist('skill')
        if skills:
            for skill in skills:
                queryset = queryset.filter(skills__contains=[skill])
        return queryset

class AllVacanciesView(generics.ListAPIView):
    """All vacancies from all companies — visible to students/jobseekers."""
    serializer_class = VacancyWithCompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'company':
            return Vacancy.objects.none()
        return Vacancy.objects.filter(is_active=True).select_related('company').order_by('-created_at')


class VacancyDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        vacancy = get_object_or_404(Vacancy.objects.select_related('company'), pk=pk, is_active=True)
        if request.user.role in ('student', 'jobseeker'):
            VacancyView.objects.get_or_create(vacancy=vacancy, viewer=request.user)
        return Response(VacancyWithCompanySerializer(vacancy).data)


class VacancyApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if request.user.role not in ('student', 'jobseeker'):
            return Response({'detail': 'Отклик доступен только кандидатам.'}, status=status.HTTP_403_FORBIDDEN)
        vacancy = get_object_or_404(Vacancy, pk=pk, is_active=True)
        application, created = Application.objects.get_or_create(vacancy=vacancy, candidate=request.user)
        if not created:
            return Response({'detail': 'Вы уже откликнулись на эту вакансию.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


class VacancyApplicationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        vacancy = get_object_or_404(Vacancy, pk=pk, company=request.user)
        return Response(ApplicationSerializer(vacancy.applications.select_related('candidate').order_by('-created_at'), many=True).data)

    def patch(self, request, pk):
        vacancy = get_object_or_404(Vacancy, pk=pk, company=request.user)
        application = get_object_or_404(Application, pk=request.data.get('application_id'), vacancy=vacancy)
        status_value = request.data.get('status')
        if status_value not in dict(Application.STATUS_CHOICES):
            return Response({'detail': 'Некорректный статус отклика.'}, status=status.HTTP_400_BAD_REQUEST)
        application.status = status_value
        application.save(update_fields=['status'])
        return Response(ApplicationSerializer(application).data)

class CompanyProfileView(APIView):
    """Returns public profile of a specific company."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        company = get_object_or_404(User, pk=pk, role='company')
        vacancies = Vacancy.objects.filter(company=company, is_active=True).order_by('-created_at')
        return Response({
            "company": PublicCompanySerializer(company).data,
            "vacancies": VacancySerializer(vacancies, many=True).data,
        })

class CandidateProfileView(generics.RetrieveAPIView):
    """Returns only the candidate fields that companies may use in recruitment."""
    serializer_class = PublicCandidateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'company':
            return User.objects.none()
        return User.objects.filter(role__in=['student', 'jobseeker'])


class CandidateContactsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        if request.user.role != 'company':
            return Response({'detail': 'Доступно только компаниям.'}, status=status.HTTP_403_FORBIDDEN)
        candidate = get_object_or_404(User, pk=pk, role__in=['student', 'jobseeker'])
        if not candidate.contact_sharing_enabled:
            return Response({'detail': 'Кандидат пока не открыл контакты компаниям.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(CandidateContactsSerializer(candidate).data)


class CompanyHiringStatsView(APIView):
    """Aggregate company-owned data only; detailed hiring funnel is a premium module."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'company':
            return Response({'detail': 'Доступно только компаниям.'}, status=status.HTTP_403_FORBIDDEN)
        vacancies = Vacancy.objects.filter(company=request.user)
        views = VacancyView.objects.filter(vacancy__company=request.user)
        applications = Application.objects.filter(vacancy__company=request.user)
        views_count = views.count()
        applications_count = applications.count()
        return Response({
            'active_vacancies': vacancies.filter(is_active=True).count(),
            'passive_vacancies': vacancies.filter(is_active=False).count(),
            'vacancy_views': views_count,
            'applications': applications_count,
            'hired': applications.filter(status='hired').count(),
            'conversion_percent': round((applications_count / views_count) * 100, 1) if views_count else 0,
            'detailed_hiring_analytics_available': True,
            'message': 'Статистика рассчитывается только по вакансиям вашей компании.',
        })
