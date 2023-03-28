import './reset.css'
import './App.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { omit } from 'lodash'
import CartItem from './components/CartItem/CartItem'
import PopUpMessage from './components/PopUpMessage/PopUpMessage'

type Props = {}

export type Product = {
    id: number
    title: string
    description: string
    price: number
    currency: string
}

type MonoCurrencyRate = {
    currencyCodeA: number
    currencyCodeB: number
    date: number
    rateSell: number
    rateBuy: number
    rateCross: number
}

type ConvertedCurrencyRate = {
    [code: number]: number
}
type CurrentCurrencyRate = {
    code: number
    rate: number
}

type ProductsInCart = {
    [id: number]: number
}

const productsArray: Product[] = [
    {
        id: 1,
        title: 'iPhone 14 Pro',
        description: 'This is iPhone 14 Pro',
        price: 1000,
        currency: 'EUR',
    },
    {
        id: 2,
        title: 'iPhone 13',
        description: 'This is iPhone 13',
        price: 800,
        currency: 'EUR',
    },
    {
        id: 3,
        title: 'iPhone 12',
        description: 'This is iPhone 12',
        price: 500,
        currency: 'EUR',
    },
]

const productsObject: { [id: number]: Product } = productsArray.reduce(
    (object, product) => ({
        ...object,
        [product.id]: product,
    }),
    {}
)

const currencyCodesObject: { [code: number]: string } = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR',
    826: 'GBP',
    985: 'PLN',
}
const currenciesArray: number[] = [980, 840, 978, 826, 985]

const App = (props: Props) => {
    const [currentCurrency, setCurrentCurrency] = useState<CurrentCurrencyRate>(
        {
            code: 978,
            rate: 1,
        }
    )

    const [currenciesRates, setCurrenciesRates] =
        useState<ConvertedCurrencyRate>([])

    const [productsInCart, setProductsInCart] = useState<ProductsInCart>({})

    const [isMessageShown, setIsMessageShown] = useState<boolean>(false)

    useEffect(() => {
        axios
            .get('https://api.monobank.ua/bank/currency')
            .then((res) => res.data)
            .then((res: MonoCurrencyRate[]) =>
                res
                    .filter(
                        (item) =>
                            item.currencyCodeB! === 980 &&
                            currenciesArray.includes(item.currencyCodeA!)
                    )
                    .reduce(
                        (object, rate) => ({
                            ...object,
                            [rate.currencyCodeA]:
                                rate.rateCross !== 0
                                    ? rate.rateCross
                                    : rate.rateBuy,
                        }),
                        {
                            980: 1,
                        }
                    )
            )
            .then((res: ConvertedCurrencyRate) =>
                Object.fromEntries(
                    Object.entries(res).map((currData) => [
                        currData[0],
                        Math.round((res[978] / currData[1]) * 10000) / 10000,
                    ])
                )
            )
            .then((res) => setCurrenciesRates(res))
            .catch((error) => {
                if (error.response) {
                    alert(
                        `Something went wrong! ${error.response.data.errorDescription}. Please, try again later!`
                    )
                } else {
                    alert(
                        `Something went wrong! Problems on our side. We will fix them soon. Please, try again later!`
                    )
                }
            })
    }, [])

    const changeCurrentCurrency = (newCode: number) => {
        setCurrentCurrency((prevState) => ({
            ...prevState,
            code: newCode,
            rate: currenciesRates[newCode],
        }))
    }

    const addProductToCart = (id: number) => {
        setProductsInCart((prevState) => ({
            ...prevState,
            [id]: (prevState[id] || 0) + 1,
        }))
    }

    const removeProductFromCart = (id: number) => {
        setProductsInCart((prevState) => omit(prevState, id))
    }

    const changeProductQuantity = (id: number, count: number) => {
        setProductsInCart((prevState) => ({
            ...prevState,
            [id]: count,
        }))
    }

    return (
        <div className="App">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        Welcome to our Three-products shop page
                    </div>
                </div>
            </header>
            <main className="main">
                <div className="container">
                    <div className="main-content">
                        <h1 className="title">Three-products shop</h1>
                        <div className="currency-choosing">
                            <div className="instruction">
                                Choose your currency
                            </div>
                            <ul className="currency-filter">
                                {currenciesArray.map((code) => (
                                    <li
                                        key={code}
                                        className={
                                            currentCurrency.code === code
                                                ? 'active'
                                                : ''
                                        }
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeCurrentCurrency(code)
                                            }
                                        >
                                            {currencyCodesObject[code]}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="products">
                            <h2>Our products</h2>
                            <ul className="products-list">
                                {productsArray.map(
                                    ({ id, title, description, price }) => (
                                        <li
                                            className="products-list-item"
                                            key={id}
                                        >
                                            <div className="product-content">
                                                <h3>{title}</h3>
                                                <p className="dscrptn">
                                                    {description}
                                                </p>
                                                <div className="price">
                                                    <div className="price-currency">
                                                        {
                                                            currencyCodesObject[
                                                                currentCurrency
                                                                    .code
                                                            ]
                                                        }
                                                    </div>
                                                    <div className="price-value">
                                                        {Math.round(
                                                            price *
                                                                currentCurrency.rate *
                                                                100
                                                        ) / 100}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        addProductToCart(id)
                                                    }
                                                >
                                                    Add to cart
                                                </button>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="cart">
                            <h2>Cart</h2>
                            <ul className="cart-items-list">
                                <li
                                    className="cart-empty"
                                    style={{
                                        display: `${
                                            Object.keys(productsInCart)
                                                .length === 0
                                                ? 'block'
                                                : 'none'
                                        }`,
                                    }}
                                >
                                    There is nothing in your cart.
                                </li>
                                {Object.keys(productsInCart).map(
                                    (productId) => (
                                        <CartItem
                                            key={productId}
                                            product={
                                                productsObject[
                                                    parseInt(productId)
                                                ]
                                            }
                                            productCount={
                                                productsInCart[
                                                    parseInt(productId)
                                                ]
                                            }
                                            currency={
                                                currencyCodesObject[
                                                    currentCurrency.code
                                                ]
                                            }
                                            currencyRate={currentCurrency.rate}
                                            removeProductFromCart={
                                                removeProductFromCart
                                            }
                                            changeProductQuantity={
                                                changeProductQuantity
                                            }
                                        />
                                    )
                                )}
                            </ul>
                            <div
                                style={{
                                    display: `${
                                        Object.keys(productsInCart).length !== 0
                                            ? 'block'
                                            : 'none'
                                    }`,
                                }}
                            >
                                <div className="total">
                                    Total:{' '}
                                    {currencyCodesObject[currentCurrency.code]}{' '}
                                    {Math.round(
                                        Object.keys(productsInCart).reduce(
                                            (total, productId) =>
                                                total +
                                                productsObject[
                                                    parseInt(productId)
                                                ].price *
                                                    productsInCart[
                                                        parseInt(productId)
                                                    ] *
                                                    currentCurrency.rate,
                                            0
                                        ) * 100
                                    ) / 100}
                                </div>
                                <div className="checkout-button">
                                    <button
                                        type="button"
                                        onClick={() => setIsMessageShown(true)}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PopUpMessage
                    isShown={isMessageShown}
                    setIsMessageShown={setIsMessageShown}
                >
                    Sorry, but we are a fake shop and do not accept orders. It's
                    better for your to visit another online-shop.
                </PopUpMessage>
            </main>
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div>Thanks for visiting us!</div>
                        <div>
                            @2023 - All Right Reserved. Designed and Developed
                            by Oleksii Turovets for Educational Purposes
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
