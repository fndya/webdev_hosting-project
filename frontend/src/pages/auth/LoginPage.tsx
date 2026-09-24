import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "@/api/auth";

import "./Auth.css";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await login({
                email,
                password,
            });

            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Не удалось выполнить вход.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="container">
                <div className="auth-card">

                    <h1>Вход</h1>

                    {error && (
                        <div className="form-errors">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

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

                        <button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Вход..." : "Войти"}
                        </button>

                    </form>

                    <p>
                        Нет аккаунта?{" "}
                        <Link to="/register">
                            Зарегистрироваться
                        </Link>
                    </p>

                </div>
            </div>
        </main>
    );
}

export default LoginPage;