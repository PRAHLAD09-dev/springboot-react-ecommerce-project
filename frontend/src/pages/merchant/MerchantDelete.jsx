function MerchantDelete() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-red-500 mb-4">
                Delete Merchant Account
            </h1>

            <button className="bg-yellow-500 text-white px-4 py-2 mb-3">
                Send OTP
            </button>

            <input
                placeholder="Enter OTP"
                className="border p-2 mb-2 block"
            />

            <button className="bg-red-600 text-white px-4 py-2">
                Delete Account
            </button>
        </div>
    );
}

export default MerchantDelete;