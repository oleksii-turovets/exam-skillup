type Props = {
    children: React.ReactNode
    isShown: boolean
    setIsMessageShown: (a: boolean) => void
}
const PopUpMessage = ({ children, isShown, setIsMessageShown }: Props) => {
    return (
        <div className="pop-up" style={{ display: `${isShown ? 'flex' : 'none'}` }}>
            <div className="pop-up-content">
                <div className="message">{children}</div>
                <button
                    type="button"
                    className="close"
                    onClick={() => setIsMessageShown(false)}
                >
                    X
                </button>
            </div>
        </div>
    )
}
export default PopUpMessage
