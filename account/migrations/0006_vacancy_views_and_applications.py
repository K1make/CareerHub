from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [('account', '0005_company_profile_fields')]

    operations = [
        migrations.CreateModel(
            name='VacancyView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('vacancy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='views', to='account.vacancy')),
                ('viewer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vacancy_views', to='account.user')),
            ],
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Новый'), ('reviewing', 'На рассмотрении'), ('rejected', 'Отклонён'), ('hired', 'Нанят')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='account.user')),
                ('vacancy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='account.vacancy')),
            ],
        ),
        migrations.AddConstraint(model_name='vacancyview', constraint=models.UniqueConstraint(fields=('vacancy', 'viewer'), name='unique_vacancy_viewer')),
        migrations.AddConstraint(model_name='application', constraint=models.UniqueConstraint(fields=('vacancy', 'candidate'), name='unique_vacancy_application')),
    ]
