import "./SupportForm.css";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";

type SupportFormProps = {
    compact?: boolean;
};

type ContactRequest = {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function SupportForm({
    compact = false,
}: SupportFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await apiFetch<ContactRequest>("/requests/", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    message,
                }),
            });

            setSuccess(true);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось отправить заявку."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            {!compact && (
                <p>
                    Опишите вопрос, и мы свяжемся с вами
                    для решения проблемы.
                </p>
            )}

            {error && (
                <div className="form-errors" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="form-messages" role="status">
                    <div className="form-message success">
                        Заявка успешно отправлена.
                    </div>
                </div>
            )}

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="support-name">Ваше имя</label>
                    <input
                        id="support-name"
                        name="name"
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                    />
                    <span className="form-help">
                        Укажите ваше имя.
                    </span>
                </div>

                <div className="form-field">
                    <label htmlFor="support-email">
                        Электронная почта
                    </label>
                    <input
                        id="support-email"
                        name="email"
                        type="email"
                        placeholder="Почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <span className="form-help">
                        На эту почту мы отправим ответ.
                    </span>
                </div>

                <div className="form-field">
                    <label htmlFor="support-phone">
                        Номер телефона
                    </label>
                    <input
                        id="support-phone"
                        name="phone"
                        type="tel"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={30}
                    />
                    <span className="form-help">
                        Необязательное поле.
                    </span>
                </div>
            </div>

            <div className="form-field">
                <label htmlFor="support-message">
                    Ваше сообщение
                </label>
                <textarea
                    id="support-message"
                    name="message"
                    placeholder="Ваше сообщение"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <span className="form-help">
                    Опишите вопрос или проблему.
                </span>
            </div>

            <div className="form-button">
                <button type="submit" disabled={loading}>
                    {loading ? "Отправка..." : "Отправить заявку"}
                </button>
            </div>
        </form>
    );
}
