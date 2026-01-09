import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle, FaArrowLeft, FaHeart, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import type { Tweet, UserProfile } from "../types";

const OtherUserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [currentUserId, setCurrentUserId] = useState("");

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            const decoded: any = jwtDecode(token);
            const myId = decoded.user?.id || decoded.id;
            setCurrentUserId(myId);

            const userRes = await axios.get(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (userRes.data.success) {
                setUser(userRes.data.data);
            }

            const tweetsRes = await axios.get(`http://localhost:5000/api/tweets?userId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (tweetsRes.data.success) {
                setTweets(tweetsRes.data.data);
            }

        } catch (error) {
            console.log(error);
            toast.error("Error loading profile");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/users/${id}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Updated!");
            fetchData();
        } catch (error) {
            toast.error("Error following user");
        }
    };

    const isFollowing = user?.followers.includes(currentUserId);
    const isMe = currentUserId === id;

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-500 font-bold transition"
            >
                <FaArrowLeft /> Back
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center mb-6">
                <div className="flex justify-center mb-4">
                    <FaUserCircle className="text-8xl text-gray-300" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 capitalize">
                    {user?.name || "Loading..."}
                </h1>
                <p className="text-gray-500 mb-4">{user?.email}</p>

                {!isMe && user && (
                    <button
                        onClick={handleFollow}
                        className={`mx-auto flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${isFollowing
                            ? "bg-white border border-gray-300 text-black hover:bg-red-50 hover:text-red-500 hover:border-red-500"
                            : "bg-black text-white hover:opacity-80"
                            }`}
                    >
                        {isFollowing ? (
                            <>Following <FaUserCheck /></>
                        ) : (
                            <>Follow <FaUserPlus /></>
                        )}
                    </button>
                )}

                <div className="flex justify-center gap-8 mt-6 border-t border-gray-100 pt-6">
                    <div className="text-center">
                        <span className="block font-bold text-xl text-gray-800">{tweets.length}</span>
                        <span className="text-sm text-gray-500">Tweets</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-xl text-gray-800">{user?.followers.length || 0}</span>
                        <span className="text-sm text-gray-500">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-xl text-gray-800">{user?.following.length || 0}</span>
                        <span className="text-sm text-gray-500">Following</span>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4 px-2">{user?.name}'s Tweets</h2>
            <div className="space-y-4">
                {tweets.length === 0 ? (
                    <p className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100">
                        No tweets yet.
                    </p>
                ) : (
                    tweets.map((tweet) => (
                        <div key={tweet._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex gap-3">
                                <FaUserCircle className="text-4xl text-gray-400" />
                                <div>
                                    <h3 className="font-bold text-gray-900">{tweet.author?.name}</h3>
                                    <p className="text-sm text-gray-500">{new Date(tweet.createdAt).toLocaleDateString()}</p>
                                </div>
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

export default OtherUserProfile;