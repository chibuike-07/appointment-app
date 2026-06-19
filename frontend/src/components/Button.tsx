import "./styles.css";
type ButtonProps = {
    text: string;
    onClick: () => void;
    disabled: boolean;
};

const Button = ({text, onClick, disabled}: ButtonProps) => {
    return (
        <button onClick={onClick} disabled={disabled}>
        {text}
        </button>
    );
}
export default Button;