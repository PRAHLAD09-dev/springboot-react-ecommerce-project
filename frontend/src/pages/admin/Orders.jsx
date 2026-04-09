function Orders() {
    const orders = [
        { id: 1, product: "iPhone", price: 80000 },
        { id: 2, product: "Laptop", price: 60000 },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>

            {orders.map((o) => (
                <div key={o.id} className="border p-3 mb-2 rounded">
                    <p>{o.product}</p>
                    <p className="text-gray-500">₹{o.price}</p>
                </div>
            ))}
        </div>
    );
}

export default Orders;