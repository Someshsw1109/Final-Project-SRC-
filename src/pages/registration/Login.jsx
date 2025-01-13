import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Login = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    // Login State
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: "",
    });

    /**========================================================================
     *                          Email Login Function
    *========================================================================**/
    const loginWithEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userLogin.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (userLogin.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);

            const q = query(
                collection(fireDB, "user"),
                where("uid", "==", users?.user?.uid)
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                if (QuerySnapshot.empty) {
                    setLoading(false);
                    toast.error("User data not found");
                    return;
                }
                let user;
                QuerySnapshot.forEach((doc) => (user = doc.data()));

                // Store user UID in localStorage
                localStorage.setItem("userUID", users.user.uid);

                // Store user data in localStorage
                localStorage.setItem("users", JSON.stringify(user));

                setUserLogin({ email: "", password: "" });
                toast.success("Login Successful");
                setLoading(false);
                if (user.role === "user") {
                    navigate("/user-dashboard");
                } else {
                    navigate("/admin-dashboard");
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Login error:", error.message);
            setLoading(false);
            toast.error(`Login Failed: ${error.message}`);
        }
    };

    /**========================================================================
     *                          Logout Function
    *========================================================================**/
    const logout = () => {
        // Clear user data from localStorage on logout
        localStorage.removeItem("users");
        localStorage.removeItem("userUID");
        toast.success("Logout Successful");
        navigate("/login");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {loading && <Loader />}
            <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                <div className="mb-5">
                    <h2 className="text-center text-2xl font-bold text-pink-500">
                        Login
                    </h2>
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={userLogin.email}
                        onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="password"
                        placeholder="Password"
                        value={userLogin.password}
                        onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                    />
                </div>

                <div className="mb-5">
                    <button
                        type="button"
                        onClick={loginWithEmail}
                        className="bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md"
                    >
                        Login
                    </button>
                </div>

                <div className="mt-3">
                    <h2 className="text-black">
                        Don't have an account? <Link className="text-pink-500 font-bold" to="/signup">Signup</Link>
                    </h2>
                </div>

                <div className="mt-3">
                    <button
                        onClick={logout}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-center py-2 font-bold rounded-md"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
