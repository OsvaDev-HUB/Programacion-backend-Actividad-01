import json
from pathlib import Path

from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods, require_POST


USERS_FILE = Path(settings.BASE_DIR) / 'data' / 'users.json'


def _load_users():
    """Carga los usuarios de demostración sin utilizar el ORM de Django."""
    try:
        with USERS_FILE.open(encoding='utf-8') as users_file:
            return json.load(users_file)
    except (OSError, json.JSONDecodeError):
        return []


def _find_user(username):
    normalized_username = username.strip().casefold()
    return next(
        (
            user
            for user in _load_users()
            if user.get('username', '').casefold() == normalized_username
        ),
        None,
    )


@never_cache
def home(request):
    return render(request, 'index.html')


@never_cache
@require_http_methods(['GET', 'POST'])
def login_view(request):
    if request.session.get('username'):
        return redirect('dashboard')

    error = None
    username = ''
    next_url = request.POST.get('next') or request.GET.get('next') or reverse('dashboard')

    if not url_has_allowed_host_and_scheme(
        next_url,
        allowed_hosts={request.get_host()},
        require_https=request.is_secure(),
    ):
        next_url = reverse('dashboard')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        user = _find_user(username)

        if user and check_password(password, user.get('password_hash', '')):
            request.session.flush()
            request.session['username'] = user['username']
            return redirect(next_url)

        error = 'El usuario o la contraseña no son correctos.'

    return render(
        request,
        'login.html',
        {'error': error, 'username': username, 'next': next_url},
    )


@never_cache
def dashboard(request):
    username = request.session.get('username')
    user = _find_user(username) if username else None

    if not user:
        request.session.flush()
        return redirect(f"{reverse('login')}?next={reverse('dashboard')}")

    safe_user = {key: value for key, value in user.items() if key != 'password_hash'}
    return render(request, 'dashboard.html', {'player': safe_user})


@require_POST
def logout_view(request):
    request.session.flush()
    return redirect('home')
