import './reset.css'
import './App.scss'
import { useState } from 'react'
import axios from 'axios'

type Props = {}

type Product = {
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
    [code:number]: number
}

const App = (props: Props) => {
    const [currentCurrency, setCurrentCurrency] = useState<number>(978)

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

    const currencyCodesObject: { [code: number]: string } = {
        980: 'UAH',
        840: 'USD',
        978: 'EUR',
        826: 'GBP',
        985: 'PLN',
    }

    const getCurrencyRates = () =>
        axios
            .get('https://api.monobank.ua/bank/currency')
            .then((res) => res.data)
            .then((res: MonoCurrencyRate[]) =>
                res
                    .filter(
                        (item) =>
                            item.currencyCodeB! === 980 &&
                            [840, 978, 826, 985].includes(item.currencyCodeA!)
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
                Object.fromEntries(Object.entries(res).map((currData) => [
                    currData[0],
                    Math.round(currData[1] / res[978] * 10000) / 10000,
                ]))
            )
            .then((res) => console.log(res))
            .catch((e) => console.log(e))

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
                            <h2></h2>
                        </div>
                        <ul className="currency-filter">
                            <li>USD</li>
                            <li>EUR</li>
                            <li>UAH</li>
                            <li>GBP</li>
                            <li>PLN</li>
                        </ul>
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
                                                            ]
                                                        }
                                                    </div>
                                                    <div className="price-value">
                                                        {price}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        getCurrencyRates()
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
                    </div>
                </div>
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
