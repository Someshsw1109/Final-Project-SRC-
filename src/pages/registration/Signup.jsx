import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const Signup = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    // User Signup State
    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user", // Default role
    });

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

            // Save user data to localStorage
            localStorage.setItem("users", JSON.stringify(user));

            // Reset form
            setUserSignup({
                name: "",
                email: "",
                password: "",
                role: "user",
            });

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
                        value={userSignup.role}
                        onChange={(e) => setUserSignup({ ...userSignup, role: e.target.value })}
                        className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none text-pink-500 font-bold"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="mb-5">
                    <button
                        type="button"
                        onClick={handleSignup}
                        className="bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md"
                    >
                        Signup
                    </button>
                </div>

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
