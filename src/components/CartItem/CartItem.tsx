import { Product } from '../../App'

type Props = {
    product: Product
    productCount: number
    currency: string
    currencyRate: number
    removeProductFromCart: (id: number) => void
    changeProductQuantity: (id: number, count: number) => void
}
const CartItem = ({
    product,
    productCount,
    currency,
    currencyRate,
    removeProductFromCart,
    changeProductQuantity,
}: Props) => {
    return (
        <li className="cart-item">
            <h3>{product.title}</h3>
            <div className="quantity">
                <button
                    type="button"
                    onClick={() =>
                        productCount === 1
                            ? removeProductFromCart(product.id)
                            : changeProductQuantity(
                                  product.id,
                                  productCount - 1
                              )
                    }
                >
                    -
                </button>
                <input type="text" value={productCount} disabled />
                <button
                    type="button"
                    onClick={() =>
                        changeProductQuantity(product.id, productCount + 1)
                    }
                    disabled={productCount >= 10}
                >
                    +
                </button>
            </div>
            <div className="total-item-price">
                {currency}{' '}
                {Math.round(product.price * productCount * currencyRate * 100) /
                    100}
            </div>
            <div className="delete-item">
                <button
                    type="button"
                    onClick={() => removeProductFromCart(product.id)}
                >
                    X
                </button>
            </div>
        </li>
    )
}
export default CartItem
