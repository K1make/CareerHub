from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('account', '0003_user_city_and_contact_sharing')]

    operations = [
        migrations.AddField(model_name='user', name='resume_file', field=models.FileField(blank=True, null=True, upload_to='resumes/')),
    ]
