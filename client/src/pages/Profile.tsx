import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaTrash, FaHeart, FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import type { Tweet, UserProfile } from "../types";

const Profile = () => {
    const navigate = useNavigate();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const decoded: any = jwtDecode(token);
                const userId = decoded.user?.id || decoded.id;

                if (!userId) return;

                const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` } 
                });

                if (userRes.data.success) {
                    setUser(userRes.data.data);
                }

                const tweetsRes = await axios.get(`http://localhost:5000/api/tweets?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (tweetsRes.data.success) {
                    setTweets(tweetsRes.data.data);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this tweet?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/tweets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Tweet Deleted");
            setTweets(tweets.filter((t) => t._id !== id));
        } catch (error) {
            toast.error("Error deleting tweet");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            <button
                onClick={() => navigate("/")}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-500 font-bold transition"
            >
                <FaArrowLeft /> Back to Home
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center mb-6">
                <div className="flex justify-center mb-4">
                    <FaUserCircle className="text-8xl text-gray-300" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 capitalize">
                    {user?.name || "Loading..."}
                </h1>
                <p className="text-gray-500">{user?.email}</p>

                <div className="flex justify-center gap-8 mt-6 border-t border-gray-100 pt-6">
                    <div className="text-center">
                        <span className="block font-bold text-xl text-gray-800">{tweets.length}</span>
                        <span className="text-sm text-gray-500">Tweets</span>
                    </div>

                    <div className="text-center">
                        <span className="block font-bold text-xl text-gray-800">
                            {user?.followers?.length || 0}
                        </span>
                        <span className="text-sm text-gray-500">Followers</span>
                    </div>

                    <div className="text-center">
                        <span className="block font-bold text-xl text-gray-800">
                            {user?.following?.length || 0}
                        </span>
                        <span className="text-sm text-gray-500">Following</span>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4 px-2">My Tweets</h2>
            <div className="space-y-4">
                {tweets.length === 0 ? (
                    <p className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100">
                        You haven't posted any tweets yet.
                    </p>
                ) : (
                    tweets.map((tweet) => (
                        <div key={tweet._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <FaUserCircle className="text-4xl text-gray-400" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{tweet.author?.name}</h3>
                                        <p className="text-sm text-gray-500">{new Date(tweet.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(tweet._id)} className="text-gray-400 hover:text-red-600 p-2">
                                    <FaTrash />
                                </button>
                            </div>
                            <p className="mt-4 text-gray-800 text-lg leading-relaxed">{tweet.content}</p>

                            <div className="mt-4 flex items-center gap-2 text-gray-500">
                                <FaHeart className="text-red-500" /> <span>{tweet.likes?.length || 0}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Profile;