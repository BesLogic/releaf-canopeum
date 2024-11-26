# This should preferably go in a test folder. But we only have a single test for now
# Tests are auto-discovered as long as they're named test*.py
from io import StringIO

from django.core.management import call_command
from django.test import TestCase as DBTestCase


class PendingMigrationsTests(DBTestCase):
    def test_no_pending_migrations(self):
        out = StringIO()
        try:
            # https://docs.djangoproject.com/en/5.1/ref/django-admin/#cmdoption-makemigrations-check
            call_command(
                "makemigrations",
                "--check",
                stdout=out,
                stderr=StringIO(),
            )
        except SystemExit:
            raise AssertionError(
                "Pending migrations:\n"
                + out.getvalue()
                + "\nPlease run `uv run manage.py makemigrations`"
            ) from None
