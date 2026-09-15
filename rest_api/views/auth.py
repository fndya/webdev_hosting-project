from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from hosting.models import User

from rest_api.serializers.user import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        request.session["user_id"] = user.id
        request.session["user_name"] = user.name

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.select_related("role").get(
                email=email
            )
        except User.DoesNotExist:
            return Response(
                {"email": "Пользователь не найден."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(password, user.password_hash):
            return Response(
                {"password": "Неверный пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.session["user_id"] = user.id
        request.session["user_name"] = user.name

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    def post(self, request):
        request.session.flush()

        return Response(
            {"detail": "Выход выполнен успешно."},
            status=status.HTTP_200_OK,
        )


class CurrentUserView(APIView):
    def get(self, request):
        user_id = request.session.get("user_id")

        if not user_id:
            return Response(
                {"detail": "Пользователь не авторизован."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            user = User.objects.select_related("role").get(
                id=user_id
            )
        except User.DoesNotExist:
            request.session.flush()

            return Response(
                {"detail": "Пользователь не авторизован."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK,
        )