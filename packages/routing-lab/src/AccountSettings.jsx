export function AccountSettings({ userName, setUserName }) {
    return (
        <div>
            <h2>Account settings</h2>
            <label>
                Username
                <input
                    type="text"
                    value={userName} // ✅ Pre-fills with current username
                    onChange={(e) => setUserName(e.target.value)}
                />
            </label>
            <p><i>Changes are auto-saved.</i></p>
        </div>
    );
}
