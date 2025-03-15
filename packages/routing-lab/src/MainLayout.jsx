import { Outlet } from "react-router";
import { Header } from "./Header.jsx";

export function MainLayout({ isChecked, setIsChecked, onLogout }) {
    return (
        <div>
            <Header isChecked={isChecked} setIsChecked={setIsChecked} onLogout={onLogout} />
            <div style={{ padding: "0 2em" }}>
                <Outlet />
            </div>
        </div>
    );
}
