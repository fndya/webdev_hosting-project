from django import forms
from django.contrib.auth.hashers import make_password
from .models import User, Role, Tariff

class RegisterForm(forms.ModelForm):
    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput()
    )

    password_confirm = forms.CharField(
        label="Повторите пароль",
        widget=forms.PasswordInput()
    )

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "password",
            "password_confirm",
        )

    def clean_email(self):
        email = self.cleaned_data["email"]

        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                "Пользователь с таким email уже существует."
            )

        return email

    def clean(self):
        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")

        if password and password_confirm and password != password_confirm:
            self.add_error(
                "password_confirm",
                "Пароли не совпадают."
            )

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)

        user.password_hash = make_password(
            self.cleaned_data["password"]
        )

        user.role = Role.objects.get(
            name="user"
        )

        if commit:
            user.save()

        return user


class LoginForm(forms.Form):
    email = forms.EmailField(
        label="Email"
    )

    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput()
    )

class TariffForm(forms.ModelForm):
    new_image = forms.ImageField(
        label="Добавить новое изображение",
        required=False,
    )
    class Meta:
        model = Tariff
        fields = (
            "title",
            "description",
            "cpu_cores",
            "ram_gb",
            "storage_gb",
            "traffic",
            "price_monthly",
            "is_recommended",
            "is_active",
            "features",
            "images",
        )

        widgets = {
            "title": forms.TextInput(
                attrs={
                    "placeholder": "Название тарифа",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "rows": 5,
                    "placeholder": "Описание тарифа",
                }
            ),
            "cpu_cores": forms.NumberInput(
                attrs={
                    "min": 1,
                }
            ),
            "ram_gb": forms.NumberInput(
                attrs={
                    "min": 1,
                }
            ),
            "storage_gb": forms.NumberInput(
                attrs={
                    "min": 1,
                }
            ),
            "traffic": forms.TextInput(
                attrs={
                    "placeholder": "Например, 500 ГБ",
                }
            ),
            "price_monthly": forms.NumberInput(
                attrs={
                    "step": "0.01",
                    "min": 0,
                }
            ),
            "features": forms.SelectMultiple(
                attrs={
                    "size": 6,
                }
            ),
            "images": forms.SelectMultiple(
                attrs={
                    "size": 6,
                }
            ),
        }