import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaTrash, FaHeart, FaRegHeart, FaUserPlus, FaUserCheck, FaArrowDown } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import type { Tweet } from "../types";

const Home = () => {
    const navigate = useNavigate();

    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("");

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchTweets = async (pageNum: number, reset = false) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            if (!currentUserId) {
                try {
                    const decoded: any = jwtDecode(token);
                    setCurrentUserId(decoded.user?.id || decoded.id);
                } catch (e) { console.error("Token Error", e); }
            }

            const response = await axios.get(`http://localhost:5000/api/tweets?page=${pageNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const newTweets = response.data.data;

                if (reset) {
                    setTweets(newTweets);
                } else {
                    setTweets((prev) => {
                        const existingIds = new Set(prev.map(t => t._id));
                        const uniqueNewTweets = newTweets.filter((t: Tweet) => !existingIds.has(t._id));
                        return [...prev, ...uniqueNewTweets];
                    });
                }

                if (newTweets.length < 10) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTweets(1, true);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTweets(nextPage, false);
    };

    const handlePostTweet = async () => {
        if (!content.trim()) return toast.error("Please write something!");

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/tweets",
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Tweet Posted!");
            setContent("");
            setPage(1);
            fetchTweets(1, true);
        } catch (error) {
            toast.error("Failed to post tweet");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/tweets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Tweet Deleted");
            setTweets(tweets.filter(t => t._id !== id));
        } catch (error) {
            toast.error("Error");
        }
    };

    const handleLike = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/tweets/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTweets((prevTweets) =>
                prevTweets.map((tweet) => {
                    if (tweet._id === id) {
                        const isLiked = tweet.likes?.includes(currentUserId);
                        return {
                            ...tweet,
                            likes: isLiked
                                ? tweet.likes?.filter(uid => uid !== currentUserId)
                                : [...(tweet.likes || []), currentUserId]
                        };
                    }
                    return tweet;
                })
            );

        } catch (error) { toast.error("Error liking tweet"); }
    };

    const handleFollow = async (authorId: string) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(`http://localhost:5000/api/users/${authorId}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Updated!");

            setTweets((prevTweets) =>
                prevTweets.map((tweet) => {
                    if (tweet.author._id === authorId) {
                        const currentFollowers = (tweet.author as any).followers || [];
                        const isFollowing = currentFollowers.includes(currentUserId);

                        let newFollowers;
                        if (isFollowing) {
                            newFollowers = currentFollowers.filter((id: string) => id !== currentUserId);
                        } else {
                            newFollowers = [...currentFollowers, currentUserId];
                        }

                        return {
                            ...tweet,
                            author: {
                                ...tweet.author,
                                followers: newFollowers
                            } as any
                        };
                    }
                    return tweet;
                })
            );

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error following user");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">

            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
                <textarea
                    className="w-full p-3 border-b border-gray-200 focus:outline-none text-lg resize-none"
                    rows={3}
                    placeholder="What is happening?!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handlePostTweet}
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition disabled:bg-gray-400"
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                {tweets.map((tweet) => {
                    const likesList = tweet.likes || [];
                    const isLiked = likesList.includes(currentUserId);

                    const authorFollowers = (tweet.author as any).followers || [];
                    const isFollowing = authorFollowers.includes(currentUserId);

                    const isMe = String(tweet.author._id) === String(currentUserId);

                    return (
                        <div key={tweet._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <Link to={isMe ? "/profile" : `/user/${tweet.author._id}`}>
                                        <FaUserCircle className="text-4xl text-gray-400 cursor-pointer" />
                                    </Link>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Link to={isMe ? "/profile" : `/user/${tweet.author._id}`} className="hover:underline">
                                                <h3 className="font-bold text-gray-900">{tweet.author?.name || "Unknown"}</h3>
                                            </Link>
                                            {!isMe && (
                                                <button
                                                    onClick={() => handleFollow(tweet.author._id)}
                                                    className={`text-xs px-2 py-1 rounded-full border font-bold flex items-center gap-1 transition-all 
                                                        ${isFollowing
                                                            ? "bg-white text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-500"
                                                            : "bg-black text-white hover:opacity-80"
                                                        }`}
                                                >
                                                    {isFollowing ? (
                                                        <>Following <FaUserCheck /></>
                                                    ) : (
                                                        <><FaUserPlus /> Follow</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{new Date(tweet.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {isMe && <button onClick={() => handleDelete(tweet._id)} className="text-gray-400 hover:text-red-600"><FaTrash /></button>}
                            </div>
                            <p className="mt-4 text-gray-800 text-lg">{tweet.content}</p>
                            <div className="mt-4 flex items-center gap-4 border-t pt-3 border-gray-100">
                                <button onClick={() => handleLike(tweet._id)} className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                                    {isLiked ? <FaHeart /> : <FaRegHeart />} <span>{likesList.length}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && tweets.length > 0 && (
                <div className="flex justify-center pb-8">
                    <button
                        onClick={handleLoadMore}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition"
                    >
                        Load More <FaArrowDown />
                    </button>
                </div>
            )}

            {!hasMore && tweets.length > 0 && (
                <p className="text-center text-gray-400 pb-8">You've reached the end!</p>
            )}

        </div>
    );
};

export default Home;