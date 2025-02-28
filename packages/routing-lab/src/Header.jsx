import { Link } from "react-router";
import "./Header.css";

export function Header({ isChecked, setIsChecked }) {
    return (
        <header>
            <h1>My cool site</h1>
            <div>
                <label>
                    Some switch (dark mode?)
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                    />
                </label>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/images">Image Gallery</Link>
                    <Link to="/account">Account</Link>
                </nav>
            </div>
        </header>
    );
}
