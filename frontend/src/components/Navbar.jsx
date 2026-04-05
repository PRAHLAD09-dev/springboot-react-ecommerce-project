import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="bg-gray-900 text-white p-4 flex justify-between">
            <h1 className="font-bold">E-Commerce</h1>

            <div className="flex gap-6">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </div>
    );
}

export default Navbar;