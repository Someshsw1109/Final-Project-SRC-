import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import countryCodes from "../../utils/countryCodes"; // Import country codes list

const Login = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // Navigate
    const navigate = useNavigate();

    // Login State
    const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: "",
        phone: "",
        countryCode: "+1",
    });

    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

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
     *                          Phone Login Functions
    *========================================================================**/
    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            { size: "invisible" },
            auth
        );
    };

    const sendPhoneOtp = async () => {
        if (userLogin.phone === "") {
            toast.error("Phone number is required");
            return;
        }

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const fullPhoneNumber = `${userLogin.countryCode}${userLogin.phone}`;
            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
            setConfirmationResult(result);
            setShowOtpInput(true);
            toast.success("OTP sent to your phone");
        } catch (error) {
            console.error("Error during phone OTP login:", error);
            toast.error("Failed to send OTP. Please try again.");
        }
    };

    const verifyPhoneOtp = async () => {
        try {
            const result = await confirmationResult.confirm(otp);
            const q = query(
                collection(fireDB, "user"),
                where("uid", "==", result.user.uid)
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
                localStorage.setItem("userUID", result.user.uid);

                // Store user data in localStorage
                localStorage.setItem("users", JSON.stringify(user));

                setUserLogin({ phone: "", countryCode: "+1" });
                setOtp("");
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
            console.error("OTP verification failed:", error);
            toast.error("Invalid OTP. Please try again.");
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

                {/* Login Method Switch */}
                <div className="mb-5">
                    <button
                        onClick={() => setLoginMethod("email")}
                        className={`py-2 px-4 mr-2 rounded-md ${loginMethod === "email" ? "bg-pink-500 text-white" : "bg-gray-200 text-black"}`}
                    >
                        Login with Email
                    </button>
                    <button
                        onClick={() => setLoginMethod("phone")}
                        className={`py-2 px-4 rounded-md ${loginMethod === "phone" ? "bg-pink-500 text-white" : "bg-gray-200 text-black"}`}
                    >
                        Login with Phone
                    </button>
                </div>

                {loginMethod === "email" && (
                    <>
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
                    </>
                )}

                {loginMethod === "phone" && (
                    <>
                        <div className="mb-3">
                            <select
                                value={userLogin.countryCode}
                                onChange={(e) => setUserLogin({ ...userLogin, countryCode: e.target.value })}
                                className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none text-pink-500 font-bold"
                            >
                                {countryCodes.map((country) => (
                                    <option key={country.code} value={country.dial_code}>
                                        {country.name} ({country.dial_code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={userLogin.phone}
                                onChange={(e) => setUserLogin({ ...userLogin, phone: e.target.value })}
                                className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                            />
                        </div>
                        {!showOtpInput && (
                            <div className="mb-5">
                                <button
                                    type="button"
                                    onClick={sendPhoneOtp}
                                    className="bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md"
                                >
                                    Send OTP
                                </button>
                            </div>
                        )}
                        {showOtpInput && (
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                                />
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={verifyPhoneOtp}
                                        className="bg-green-500 hover:bg-green-600 w-full text-white text-center py-2 font-bold rounded-md"
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div id="recaptcha-container"></div>

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
