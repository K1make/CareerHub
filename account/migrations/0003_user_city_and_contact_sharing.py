from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('account', '0002_profile_privacy_and_vacancy_status')]

    operations = [
        migrations.AddField(model_name='user', name='city', field=models.CharField(blank=True, max_length=120, null=True)),
        migrations.AddField(model_name='user', name='contact_sharing_enabled', field=models.BooleanField(default=False)),
    ]
