import "./styles.css";
type Headerprops = { title: string };

const Header = ({ title }: Headerprops) => {
    return (
        <div className="navbar">
            <h1>{title}</h1>
        </div>
    );
}
export default Header;