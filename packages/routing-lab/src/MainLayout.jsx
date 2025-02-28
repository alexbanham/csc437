import { Outlet } from "react-router";
import { Header } from "./Header.jsx";

export function MainLayout({ isChecked, setIsChecked }) {
    return (
        <div>
            <Header isChecked={isChecked} setIsChecked={setIsChecked} />
            <div style={{ padding: "0 2em" }}>
                <Outlet />
            </div>
        </div>
    );
}
