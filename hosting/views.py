from django.db import transaction
from django.db.models import Avg, Sum, Q
from django.shortcuts import render, get_object_or_404, redirect
from django.core.cache import cache
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.hashers import make_password, check_password
from .cart import Cart

from .forms import (
    RegisterForm,
    LoginForm,
    TariffForm,
    ContactRequestForm,
)

from .models import (
    Tariff,
    Server,
    User,
    Order,
    ContactRequest,
    TariffFeatureAssignment,
    Image,
)

def handle_contact_request(request, redirect_name):
    user = get_current_user(request)

    if request.method == "POST":
        form = ContactRequestForm(request.POST)

        if form.is_valid():
            contact_request = form.save(commit=False)
            contact_request.user = user
            contact_request.save()

            return redirect(redirect_name)
    else:
        initial = {}

        if user:
            initial = {
                "name": user.name,
                "email": user.email,
            }

        form = ContactRequestForm(initial=initial)

    return form

def home(request):
    contact_form = handle_contact_request(request, "home")

    cart = Cart(request)

    recommended_tariffs = Tariff.active.filter(
        is_recommended=True
    )[:3]

    stats = {
        "users_count": User.objects.count(),
        "servers_count": Server.objects.count(),
        "active_tariffs_count": Tariff.objects.filter(is_active=True).count(),
        "orders_count": Order.objects.count(),
        "avg_price": Tariff.objects.aggregate(
            avg_price=Avg("price_monthly")
        )["avg_price"],
        "total_balance": User.objects.aggregate(
            total_balance=Sum("balance")
        )["total_balance"],
    }

    context = {
        "recommended_tariffs": recommended_tariffs,
        "stats": stats,
        "cart": cart,
        "contact_form": contact_form,
    }

    return render(request, "hosting/index.html", context)

def pricing(request):
    cart = Cart(request)

    tariffs_list = cache.get("active_tariffs")

    if tariffs_list is None:
        tariffs_list = list(
            Tariff.active.all()
        )
        cache.set(
            "active_tariffs",
            tariffs_list,
            300
        )

    paginator = Paginator(tariffs_list, 6)

    page_number = request.GET.get("page")

    try:
        tariffs = paginator.page(page_number)
    except PageNotAnInteger:
        tariffs = paginator.page(1)
    except EmptyPage:
        tariffs = paginator.page(paginator.num_pages)

    return render(request, "hosting/pricing.html", {
        "tariffs": tariffs,
        "cart": cart,
    })

def tariff_detail(request, tariff_id):
    cart = Cart(request)
    tariff = get_object_or_404(
        Tariff.objects.prefetch_related("features", "images"),
        id=tariff_id,
        is_active=True
    )

    return render(
        request, "hosting/tariff_detail.html",{
            "tariff": tariff,
            "cart": cart,
            }
    )

def tariff_create(request):
    if not admin_required(request):
        return redirect("pricing")

    user = get_current_user(request)

    if request.method == "POST":
        form = TariffForm(request.POST, request.FILES)

        if form.is_valid():
            tariff = form.save(commit=False)

            tariff.created_by = user
            tariff.updated_by = user

            tariff.save()
            tariff.images.set(form.cleaned_data["images"])
            new_image = form.cleaned_data.get("new_image")

            if new_image:
                image = Image.objects.create(
                    image_file=new_image,
                    image_type="tariff",
                    uploaded_by=user,
                )
                image.alt_text = f"Изображение тарифа {image.id}"
                image.save(update_fields=["alt_text"])
                tariff.images.add(image)

            for feature in form.cleaned_data["features"]:
                TariffFeatureAssignment.objects.create(
                    tariff=tariff,
                    feature=feature
                )

            cache.delete("active_tariffs")

            return redirect(tariff.get_absolute_url())
    else:
        form = TariffForm()

    return render(
        request,
        "hosting/tariff_form.html",
        {
            "form": form,
            "title": "Создание тарифа",
        }
    )

def tariff_edit(request, tariff_id):
    if not admin_required(request):
        return redirect("pricing")

    user = get_current_user(request)

    tariff = get_object_or_404(Tariff, id=tariff_id)

    if request.method == "POST":
        form = TariffForm(request.POST, request.FILES, instance=tariff)

        if form.is_valid():
            tariff = form.save(commit=False)

            tariff.updated_by = user

            tariff.save()
            tariff.images.set(form.cleaned_data["images"])
            new_image = form.cleaned_data.get("new_image")
            if new_image:
                image = Image.objects.create(
                    image_file=new_image,
                    image_type="tariff",
                    uploaded_by=user,
                )
                image.alt_text = f"Изображение тарифа {image.id}"
                image.save(update_fields=["alt_text"])
                tariff.images.add(image)

            tariff.feature_assignments.all().delete()

            for feature in form.cleaned_data["features"]:
                TariffFeatureAssignment.objects.create(
                    tariff=tariff,
                    feature=feature
                )

            cache.delete("active_tariffs")

            return redirect(tariff.get_absolute_url())
    else:
        form = TariffForm(instance=tariff)

    return render(
        request,
        "hosting/tariff_form.html",
        {
            "form": form,
            "title": "Редактирование тарифа",
            "tariff": tariff,
        }
    )

def tariff_delete(request, tariff_id):
    if not admin_required(request):
        return redirect("pricing")

    tariff = get_object_or_404(Tariff, id=tariff_id)

    if request.method == "POST":
        tariff.delete()
        cache.delete("active_tariffs")
        return redirect("pricing")

    return render(
        request,
        "hosting/tariff_confirm_delete.html",
        {
            "tariff": tariff,
        },
    )

def cart_detail(request):
    cart = Cart(request)
    user = get_current_user(request)
    order_created = request.session.pop("order_created", False)

    return render(
        request,
        "hosting/cart.html",
        {
            "cart": cart,
            "user": user,
            "order_created": order_created,
        },
    )

def cart_add(request, tariff_id):
    cart = Cart(request)

    tariff = get_object_or_404(
        Tariff,
        id=tariff_id,
        is_active=True,
    )

    cart.add(tariff)

    return redirect("cart_detail")


def cart_decrease(request, tariff_id):
    cart = Cart(request)

    tariff = get_object_or_404(
        Tariff,
        id=tariff_id,
    )

    cart.decrease(tariff)

    return redirect("cart_detail")


def cart_remove(request, tariff_id):
    cart = Cart(request)

    tariff = get_object_or_404(
        Tariff,
        id=tariff_id,
    )

    cart.remove(tariff)

    return redirect("cart_detail")

def cart_checkout(request):
    if not request.session.get("user_id"):
        return redirect("login")

    cart = Cart(request)
    items = list(cart)

    if not items:
        return redirect("cart_detail")

    user = get_current_user(request)

    with transaction.atomic():
        for item in items:
            Order.objects.create(
                user=user,
                tariff=item["tariff"],
                quantity=item["quantity"],
                total_price=item["total_price"],
                status="new",
            )

        cart.clear()

    request.session["order_created"] = True

    return redirect("my_orders")

def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            user = form.save()

            request.session["user_id"] = user.id
            request.session["user_name"] = user.name

            return redirect("home")
    else:
        form = RegisterForm()

    return render(
        request,
        "hosting/register.html",
        {
            "form": form,
        }
    )

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            try:
                user = User.objects.get(email=email)

                if check_password(password, user.password_hash):
                    request.session["user_id"] = user.id
                    request.session["user_name"] = user.name

                    return redirect("home")

                form.add_error(
                    "password",
                    "Неверный пароль."
                )

            except User.DoesNotExist:
                form.add_error(
                    "email",
                    "Пользователь не найден."
                )
    else:
        form = LoginForm()

    return render(
        request,
        "hosting/login.html",
        {
            "form": form,
        }
    )

def logout_view(request):
    request.session.flush()

    return redirect("home")

def get_current_user(request):
    user_id = request.session.get("user_id")

    if not user_id:
        return None

    try:
        return User.objects.select_related("role").get(id=user_id)
    except User.DoesNotExist:
        return None


def admin_required(request):
    user = get_current_user(request)

    return bool(
        user and
        user.role and
        user.role.name == "admin"
    )

def account(request):
    user = get_current_user(request)

    if not user:
        return redirect("login")

    orders = (
        Order.objects
        .filter(user=user)
        .select_related("tariff", "server")
        .order_by("-created_at")
    )

    servers = (
        Server.objects
        .filter(user=user)
        .select_related("tariff", "status")
        .order_by("-created_at")
    )

    contact_requests = (
        ContactRequest.objects
        .filter(user=user)
        .order_by("-created_at")
    )

    return render(
        request,
        "hosting/account.html",
        {
            "user": user,
            "orders": orders,
            "servers": servers,
            "contact_requests": contact_requests,
            "cart": Cart(request),
        },
    )


def my_orders(request):
    user = get_current_user(request)

    if not user:
        return redirect("login")

    orders = (
        Order.objects
        .filter(user=user)
        .select_related("tariff", "server")
        .order_by("-created_at")
    )

    return render(
        request,
        "hosting/orders.html",
        {
            "user": user,
            "orders": orders,
            "cart": Cart(request),
        },
    )


def my_servers(request):
    user = get_current_user(request)

    if not user:
        return redirect("login")

    servers = (
        Server.objects
        .filter(user=user)
        .select_related("tariff", "status")
        .order_by("-created_at")
    )

    return render(
        request,
        "hosting/servers.html",
        {
            "user": user,
            "servers": servers,
            "cart": Cart(request),
        },
    )


def my_requests(request):
    user = get_current_user(request)

    if not user:
        return redirect("login")

    contact_requests = (
        ContactRequest.objects
        .filter(user=user)
        .order_by("-created_at")
    )

    return render(
        request,
        "hosting/requests.html",
        {
            "user": user,
            "contact_requests": contact_requests,
            "cart": Cart(request),
        },
    )

def support(request):
    contact_form = handle_contact_request(request, "support")

    return render(
        request,
        "hosting/support.html",
        {
            "contact_form": contact_form,
            "cart": Cart(request),
        },
    )