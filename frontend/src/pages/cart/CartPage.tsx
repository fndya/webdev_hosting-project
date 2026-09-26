import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    checkout,
    getCart,
    removeFromCart,
    updateCartItem,
} from "@/api/cart";
import { getTariff } from "@/api/tariffs";
import { useAuth } from "@/context/AuthContext";

import type { CartData, CartItem } from "@/types/cart";
import type { Tariff } from "@/types/tariff";

import region from "@/assets/icons/region.svg";
import cpu from "@/assets/icons/cpu.svg";
import ram from "@/assets/icons/ram.svg";
import storage from "@/assets/icons/storage.svg";
import traffic from "@/assets/icons/traffic.svg";
import price from "@/assets/icons/pricetag.svg";

import "./CartPage.css";

interface CartItemWithTariff extends CartItem {
    tariff: Tariff;
}

function getCoreWord(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return "ядро";
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
    ) {
        return "ядра";
    }

    return "ядер";
}

function CartPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [cart, setCart] = useState<CartData | null>(null);
    const [items, setItems] = useState<CartItemWithTariff[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isOrderCreated, setIsOrderCreated] = useState(false);

    const loadCart = async (showLoading = false) => {
        if (showLoading) {
            setIsLoading(true);
        }

        setError("");

        try {
            const cartData = await getCart();

            setCart(cartData);

            const detailedItems = await Promise.all(
                cartData.items.map(async (item) => {
                    const tariff = await getTariff(item.tariff_id);

                    return {
                        ...item,
                        tariff,
                    };
                })
            );

            setItems(detailedItems);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Не удалось загрузить корзину.");
            }
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        loadCart(true);
    }, []);

    const handleDecrease = async (
        item: CartItemWithTariff
    ) => {
        if (item.quantity <= 1) {
            return;
        }

        try {
            await updateCartItem(
                item.tariff_id,
                item.quantity - 1
            );

            await loadCart();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    const handleIncrease = async (
        item: CartItemWithTariff
    ) => {
        try {
            await updateCartItem(
                item.tariff_id,
                item.quantity + 1
            );

            await loadCart();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    const handleRemove = async (
        tariffId: number
    ) => {
        try {
            await removeFromCart(tariffId);

            await loadCart();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setIsCheckingOut(true);
        setError("");

        try {
            await checkout();

            setIsOrderCreated(true);

            await loadCart();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Не удалось оформить заказ.");
            }
        } finally {
            setIsCheckingOut(false);
        }
    };

    const closeOrderModal = () => {
        setIsOrderCreated(false);
    };

    const goToAccount = () => {
        setIsOrderCreated(false);
        navigate("/account");
    };

    if (isLoading) {
        return (
            <main className="cart-page">
                <div className="container">
                    <p>Загрузка...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">

            <div className="container">

                <h1 className="cart-title">
                    Корзина
                </h1>

                {error && (
                    <div className="form-errors">
                        {error}
                    </div>
                )}

                {cart && cart.items.length > 0 ? (

                    <div className="cart-layout">

                        {/* Левая часть */}

                        <div className="cart-products-column">

                            <section className="cart-products">

                                <div className="cart-table-header">

                                    <span>
                                        Тариф
                                    </span>

                                    <span>
                                        Количество
                                    </span>

                                    <span>
                                        Цена
                                    </span>

                                </div>

                                {items.map((item) => (

                                    <article
                                        className="cart-product"
                                        key={item.tariff_id}
                                    >

                                        {/* Тариф */}

                                        <div className="cart-product-main">

                                            <details className="cart-specifications">

                                                <summary
                                                    aria-label="Показать характеристики тарифа"
                                                    title="Показать характеристики"
                                                >

                                                    <span className="cart-product-title">
                                                        {item.tariff_title}
                                                    </span>

                                                    <span className="cart-specifications-arrow">
                                                        ⌄
                                                    </span>

                                                </summary>

                                                <div className="cart-specifications-list">

                                                    <div className="cart-spec-row">

                                                        <span className="tariff-icon">
                                                            <img
                                                                src={region}
                                                                alt=""
                                                            />
                                                        </span>

                                                        <strong>
                                                            Регион
                                                        </strong>

                                                        <span>
                                                            Россия
                                                        </span>

                                                    </div>

                                                    <div className="cart-spec-row">

                                                        <span className="tariff-icon">
                                                            <img
                                                                src={cpu}
                                                                alt=""
                                                            />
                                                        </span>

                                                        <strong>
                                                            Процессор
                                                        </strong>

                                                        <span>
                                                            {item.tariff.cpu_cores}{" "}
                                                            {getCoreWord(
                                                                item.tariff.cpu_cores
                                                            )}
                                                        </span>

                                                    </div>

                                                    <div className="cart-spec-row">

                                                        <span className="tariff-icon">
                                                            <img
                                                                src={ram}
                                                                alt=""
                                                            />
                                                        </span>

                                                        <strong>
                                                            ОЗУ
                                                        </strong>

                                                        <span>
                                                            {item.tariff.ram_gb} ГБ
                                                        </span>

                                                    </div>

                                                    <div className="cart-spec-row">

                                                        <span className="tariff-icon">
                                                            <img
                                                                src={storage}
                                                                alt=""
                                                            />
                                                        </span>

                                                        <strong>
                                                            Диск
                                                        </strong>

                                                        <span>
                                                            {item.tariff.storage_gb} ГБ
                                                        </span>

                                                    </div>

                                                    <div className="cart-spec-row">

                                                        <span className="tariff-icon">
                                                            <img
                                                                src={traffic}
                                                                alt=""
                                                            />
                                                        </span>

                                                        <strong>
                                                            Трафик
                                                        </strong>

                                                        <span>
                                                            {item.tariff.traffic}
                                                        </span>

                                                    </div>

                                                    <div className="cart-spec-row">

                                                        <span className="tariff-icon">
                                                            <img
                                                                src={price}
                                                                alt=""
                                                            />
                                                        </span>

                                                        <strong>
                                                            Цена
                                                        </strong>

                                                        <span>
                                                            {item.tariff.price_monthly} ₽/мес
                                                        </span>

                                                    </div>

                                                </div>

                                            </details>

                                        </div>

                                        {/* Количество */}

                                        <div className="cart-product-quantity">

                                            <button
                                                type="button"
                                                className="quantity-btn"
                                                onClick={() =>
                                                    handleDecrease(item)
                                                }
                                                disabled={item.quantity <= 1}
                                                aria-label="Уменьшить количество"
                                            >
                                                −
                                            </button>

                                            <span className="quantity-value">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                className="quantity-btn"
                                                onClick={() =>
                                                    handleIncrease(item)
                                                }
                                                aria-label="Увеличить количество"
                                            >
                                                +
                                            </button>

                                        </div>

                                        {/* Цена */}

                                        <div className="cart-product-price">

                                            <strong>
                                                {item.total_price} ₽
                                            </strong>

                                            <button
                                                type="button"
                                                className="cart-remove"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.tariff_id
                                                    )
                                                }
                                            >
                                                Удалить
                                            </button>

                                        </div>

                                    </article>

                                ))}

                            </section>

                            <Link
                                className="cart-back-btn"
                                to="/tariffs"
                            >
                                ← Вернуться к тарифам
                            </Link>

                        </div>

                        {/* Правая часть */}

                        <aside className="cart-summary">

                            <h2>
                                Сумма заказа
                            </h2>

                            <div className="cart-total">
                                {cart.total_price} ₽
                            </div>

                            <button
                                type="button"
                                className="cart-pay-btn"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut
                                    ? "Оформление..."
                                    : "Оплатить"}
                            </button>

                        </aside>

                    </div>

                ) : (

                    <section className="cart-empty">

                        <h2>
                            Корзина пуста
                        </h2>

                        <p>
                            Добавьте тарифы, чтобы продолжить.
                        </p>

                        <Link
                            className="cart-empty-btn"
                            to="/tariffs"
                        >
                            Перейти к тарифам
                        </Link>

                    </section>

                )}

            </div>

            {isOrderCreated && (

                <div
                    className="order-modal"
                    id="orderModal"
                >

                    <div
                        className="order-modal-overlay"
                        onClick={closeOrderModal}
                    />

                    <div
                        className="order-modal-window"
                        role="dialog"
                        aria-modal="true"
                    >

                        <button
                            className="order-modal-close"
                            type="button"
                            aria-label="Закрыть"
                            onClick={closeOrderModal}
                        >
                            <img
                                src="/src/assets/icons/cross.svg"
                                alt=""
                            />
                        </button>

                        <div className="order-modal-icon">
                            <img
                                src="/src/assets/icons/check.svg"
                                alt=""
                            />
                        </div>

                        <h2>
                            Заказ оформлен!
                        </h2>

                        <p>
                            Спасибо за заказ. Ваш заказ успешно сохранён.
                        </p>

                        <button
                            className="order-modal-confirm"
                            type="button"
                            onClick={goToAccount}
                        >
                            Понятно
                        </button>

                    </div>

                </div>

            )}

        </main>
    );
}

export default CartPage;