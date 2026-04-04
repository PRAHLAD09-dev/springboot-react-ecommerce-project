import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div style={{ padding: "10px", background: "#222", color: "white" }}>
            <Link to="/" style={{ marginRight: "10px", color: "white" }}>Home</Link>
            <Link to="/login" style={{ marginRight: "10px", color: "white" }}>Login</Link>
            <Link to="/signup" style={{ color: "white" }}>Signup</Link>
        </div>
    );
}

export default Navbar;