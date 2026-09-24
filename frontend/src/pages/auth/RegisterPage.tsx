import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "@/api/auth";

import "./Auth.css";

function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await register({
                name,
                email,
                password,
                password_confirm: passwordConfirm,
            });

            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Не удалось зарегистрироваться.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="container">
                <div className="auth-card">

                    <h1>Регистрация</h1>

                    {error && (
                        <div className="form-errors">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-field">
                            <label htmlFor="name">
                                Имя
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">
                                Пароль
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password-confirm">
                                Подтверждение пароля
                            </label>

                            <input
                                id="password-confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={(event) =>
                                    setPasswordConfirm(event.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Регистрация..."
                                : "Зарегистрироваться"}
                        </button>

                    </form>

                    <p>
                        Уже есть аккаунт?{" "}
                        <Link to="/login">
                            Войти
                        </Link>
                    </p>

                </div>
            </div>
        </main>
    );
}

export default RegisterPage;