from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('account', '0001_initial')]

    operations = [
        migrations.AddField(model_name='user', name='avatar', field=models.ImageField(blank=True, null=True, upload_to='avatars/')),
        migrations.AddField(model_name='user', name='specialization', field=models.CharField(blank=True, max_length=255, null=True)),
        migrations.AddField(model_name='vacancy', name='is_active', field=models.BooleanField(default=True)),
    ]
