function MerchantUpdate() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Update Profile</h1>

            <input placeholder="Shop Name" className="border p-2 mb-2 block" />
            <input placeholder="Phone" className="border p-2 mb-2 block" />

            <button className="bg-blue-500 text-white px-4 py-2">
                Update
            </button>
        </div>
    );
}

export default MerchantUpdate;