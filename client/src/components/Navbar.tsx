import { Link, useNavigate } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Navbar = () => {
    const navigate = useNavigate();

    const isAuth = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">

                <Link to="/" className="text-blue-500 text-3xl hover:opacity-80 transition">
                    <FaTwitter />
                </Link>

                <div className="flex gap-4 items-center">
                    {isAuth ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-blue-500 border border-blue-500 px-5 py-2 rounded-full font-bold hover:bg-blue-50 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-600 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;