from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('account', '0004_user_resume_file')]

    operations = [
        migrations.AddField(model_name='user', name='company_size', field=models.CharField(blank=True, max_length=80, null=True)),
        migrations.AddField(model_name='user', name='industry', field=models.CharField(blank=True, max_length=120, null=True)),
        migrations.AddField(model_name='user', name='website', field=models.URLField(blank=True, null=True)),
    ]
