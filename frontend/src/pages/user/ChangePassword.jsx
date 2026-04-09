function ChangePassword() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Change Password</h1>

            <input
                type="password"
                placeholder="Old Password"
                className="border p-2 mb-2 block"
            />

            <input
                type="password"
                placeholder="New Password"
                className="border p-2 mb-2 block"
            />

            <button className="bg-red-500 text-white px-4 py-2">
                Change Password
            </button>
        </div>
    );
}

export default ChangePassword;