
import { useEffect } from "react";
import SupportForm from "@/components/support/SupportForm";
import "./SupportPage.css";

export default function SupportPage() {
    useEffect(() => {
        document.title = "Поддержка — Турбосервер";
    }, []);

    return (
        <main className="support-section">
            <div className="container">
                <h1>Поддержка</h1>
                <p className="support-intro">
                    Опишите вопрос, и мы свяжемся с вами
                    для решения проблемы.
                </p>
                <SupportForm />
            </div>
        </main>
    );
}
