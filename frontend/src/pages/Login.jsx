function Login() {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="bg-white shadow-lg rounded-xl p-8 w-80">

                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="border p-2 mb-3 w-full rounded"
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    className="border p-2 mb-4 w-full rounded"
                />

                <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded">
                    Login
                </button>

            </div>
        </div>
    );
}

export default Login;