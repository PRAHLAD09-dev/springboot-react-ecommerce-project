function Promotion() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Send Promotion</h1>

            <input
                placeholder="Title"
                className="border p-2 mb-3 block w-full"
            />

            <textarea
                placeholder="Message"
                className="border p-2 mb-3 block w-full"
            />

            <button className="bg-blue-500 text-white px-4 py-2">
                Send
            </button>
        </div>
    );
}

export default Promotion;