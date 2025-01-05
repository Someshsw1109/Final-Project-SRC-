import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import countryCodes from "../../utils/countryCodes"; // Import country codes list

const Signup = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    // User Signup State
    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        countryCode: "+1", // Default country code
        role: "user",
    });

    // OTP State
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    /**========================================================================
     *                          Phone Verification
    *========================================================================**/
    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            { size: "invisible" },
            auth
        );
    };

    const sendPhoneVerification = async () => {
        if (userSignup.phone === "") {
            toast.error("Phone number is required for verification");
            return;
        }

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const fullPhoneNumber = `${userSignup.countryCode}${userSignup.phone}`;
            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
            setConfirmationResult(result);
            setShowOtpInput(true);
            toast.success("OTP sent to your phone");
        } catch (error) {
            console.error("Error during phone verification:", error);
            toast.error("Failed to send OTP. Please try again.");
        }
    };

    const verifyOtp = async () => {
        try {
            await confirmationResult.confirm(otp);
            toast.success("Phone number verified successfully");
            handleSignup(); // Proceed with signup after phone verification
        } catch (error) {
            console.error("OTP verification failed:", error);
            toast.error("Invalid OTP. Please try again.");
        }
    };

    /**========================================================================
     *                          User Signup Function
    *========================================================================**/
    const handleSignup = async () => {
        // Validation
        if (userSignup.name === "" || userSignup.email === "" || userSignup.password === "") {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);

            // Send email verification
            await sendEmailVerification(userCredential.user);
            toast.success("Verification email sent. Please check your inbox.");

            // Create user object for Firestore
            const user = {
                name: userSignup.name,
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                phone: `${userSignup.countryCode}${userSignup.phone}`,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
            };

            // Add user to Firestore
            const userReference = collection(fireDB, "user");
            await addDoc(userReference, user);

            // Reset form
            setUserSignup({
                name: "",
                email: "",
                password: "",
                phone: "",
                countryCode: "+1",
                role: "user",
            });

            setOtp("");
            toast.success("Signup Successful");
            navigate("/login");
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <div className="signup_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">

                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500'>
                        Signup
                    </h2>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={userSignup.name}
                        onChange={(e) => setUserSignup({ ...userSignup, name: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={userSignup.email}
                        onChange={(e) => setUserSignup({ ...userSignup, email: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        placeholder="Password"
                        value={userSignup.password}
                        onChange={(e) => setUserSignup({ ...userSignup, password: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                    />
                </div>

                <div className="mb-3">
                    <select
                        value={userSignup.countryCode}
                        onChange={(e) => setUserSignup({ ...userSignup, countryCode: e.target.value })}
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
                        value={userSignup.phone}
                        onChange={(e) => setUserSignup({ ...userSignup, phone: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
                    />
                </div>

                {!showOtpInput && (
                    <div className="mb-5">
                        <button
                            type="button"
                            onClick={sendPhoneVerification}
                            className="bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md"
                        >
                            Verify Phone Number
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
                                onClick={verifyOtp}
                                className="bg-green-500 hover:bg-green-600 w-full text-white text-center py-2 font-bold rounded-md"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                )}

                <div id="recaptcha-container"></div>

                <div>
                    <h2 className="text-black">
                        Already have an account? <Link className="text-pink-500 font-bold" to="/login">Login</Link>
                    </h2>
                </div>

            </div>
        </div>
    );
};

export default Signup;
