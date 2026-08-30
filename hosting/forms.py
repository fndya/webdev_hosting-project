from django import forms

from .models import User, Role


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

        user.role = Role.objects.get_or_create(
            name="Пользователь"
        )[0]

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