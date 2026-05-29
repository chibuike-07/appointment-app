import "./styles.css";

const Header = ({title}) => {
    return (
        <div className="navbar">
            <h1>{title}</h1>
        </div>
    );
}
export default Header;