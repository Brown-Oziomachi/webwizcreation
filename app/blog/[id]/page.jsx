"use client"
import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db1, db3 } from "@/lib/firebaseConfig";

import {
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  arrayUnion,
  addDoc,
  serverTimestamp,
  getDoc,
  where,
} from "firebase/firestore";
import { LoaderCircle, Heart, Share, LinkIcon } from "lucide-react";
import Link from "next/link";
import BlogDisplay from "@/components/BlogDisplay";
import Ads from "@/components/Ads";

const BlogDetails = ({ params }) => {
const resolvedParams = use(params);
const id = resolvedParams?.id;

  const { data: session } = useSession();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
const [replyText, setReplyText] = useState("");

const handleReplySubmit = async (commentId, replyText, setReplyText, setReplyingTo, setComments) => {
  if (!replyText.trim()) return;

  // ✅ Get the logged-in user from Auth.js
  const user = session?.user;

  if (!user) {
    alert("Please log in to reply.");
    return;
  }

  const replyData = {
    id: Date.now().toString(),
    userName: user.name || "Anonymous", // ✅ Auth.js uses `user.name`
    userImage: user.image || "/default-avatar.png", // ✅ Auth.js uses `user.image`
    text: replyText,
    timestamp: Math.floor(Date.now() / 1000)
  };

  const commentRef = doc(db3, "comments", commentId);

  try {
    await updateDoc(commentRef, {
      replies: arrayUnion(replyData)
    });

    // ✅ Instantly update UI without refresh
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), replyData] }
          : comment
      )
    );

    setReplyText(""); 
    setReplyingTo(null);
  } catch (error) {
    console.error("Error submitting reply:", error);
  }
};



  // Fetch comments for this blog post
  useEffect(() => {
    async function fetchComments() {
      if (!id) return;
      try {
        const commentsQuery = query(
          collection(db3, "comments"),
          where("blogId", "==", id)
        );
        const querySnapshot = await getDocs(commentsQuery);
        const commentsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsArray);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [id]);

  // Fetch the currently selected blog
  useEffect(() => {
    if (!id) return;
    async function fetchBlog() {
      const blogRef = doc(db1, "blog", id);
      const blogDoc = await getDoc(blogRef);
      if (blogDoc.exists()) {
        setBlog({ id, ...blogDoc.data() });
        setLikes(blogDoc.data().likes || 0);
      }
    }
    fetchBlog();
  }, [id]);

  // Check local storage for liked state
  useEffect(() => {
    const storedLiked = localStorage.getItem(`liked-${id}`);
    if (storedLiked) {
      setLiked(true);
    }
  }, [id]);

  // Fetch other blog options (excluding the current one)
  useEffect(() => {
    if (!blog) return;
    async function fetchOtherBlogs() {
      try {
        const blogsRef = collection(db1, "blog");
        const q = query(blogsRef);
        const querySnapshot = await getDocs(q);
        const blogs = [];
        querySnapshot.forEach((docSnap) => {
          if (docSnap.id !== blog.id) {
            blogs.push({ id: docSnap.id, ...docSnap.data() });
          }
        });
        setOtherBlogs(blogs);
      } catch (err) {
        console.error("Error fetching other blogs:", err);
      }
    }
    fetchOtherBlogs();
  }, [blog]);



  // Submit a new comment
  const handleCommentSubmit = async () => {
    if (newComment.trim() !== "") {
      try {
        const commentData = {
          blogId: id,
          text: newComment,
          userName: session?.user?.name || "Anonymous",
          userImage: session?.user?.image || "/default-avatar.png",
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db3, "comments"), commentData);
        setComments((prev) => [...prev, commentData]);
        setNewComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };
 const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Blog link copied to clipboard!");
  };

  // Handle like button click
  const handleLikeClick = async () => {
    const newLikes = liked ? likes - 1 : likes + 1;
    setLiked(!liked);
    setLikes(newLikes);
    localStorage.setItem(`liked-${id}`, (!liked).toString()); // Store like state in local storage

    try {
      const blogRef = doc(db1, "blog", id);
      await updateDoc(blogRef, { likes: newLikes });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  

  // Render loading state if blog is not fetched yet
  if (!blog) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="text-gray-600 w-14 h-14 animate-spin" />
      </div>
    );
  }


return (
  <div className="min-h-screen px-2 py-16 max-w-5xl mx-auto bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-300 font-sans leading-relaxed space-y-14">
    
    {/* Blog Header Section */}
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 shadow-xl rounded-2xl p-10 relative border border-gray-700 space-y-6">
      <Link href={`/blog/${blog.id}`}>
        <span className="inline-block px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold text-sm rounded-full shadow-md transition-transform hover:scale-105">
          {blog.genre}
        </span>
      </Link>

      <h1 className="text-xs text-gray-400 text-center absolute top-10 right-6 font-mono tracking-widest">
        THE <span className="text-orange-400">SUN</span> WEB
      </h1>

      <h1 className="text-5xl font-extrabold text-white text-center drop-shadow-lg">
        {blog.title}
      </h1>

      
      <div className="flex flex-col items-center mb-6">
        <Link href={`/profile/${blog.author}`}>
          <img
            title="View Profile"
            src={session?.user?.image}
            alt="User"
            className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          />
        </Link>
        <h3 className="mt-2 text-lg font-semibold text-orange-600">{blog.author}</h3>

          <p className="text-gray-500 text-sm mt-1">
            Posted on {blog.timestamp || "Unknown Date"}
          </p>
        </div>
    </div>

    {/* Blog Body Content */}
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
      <BlogDisplay body={blog.body} />
    </div>

    {/* Like / Share Section */}
    <div className="flex flex-wrap justify-center gap-6 items-center shadow-lg">
      <button
        onClick={handleLikeClick}
        className="flex items-center text-gray-300 hover:text-red-500 transition-all"
        aria-label="Like Button"
      >
        <Heart
          className={`h-7 w-7 mr-2 transition-transform ${liked ? "fill-red-500 scale-110" : "fill-none"}`}
        />
        {liked ? "Liked" : "Like"} ({likes})
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 text-gray-400 font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition"
      >
        <LinkIcon className="h-6 w-6" /> Copy Link
      </button>

      <button
        onClick={handleShareClick}
        className="flex items-center gap-2 text-gray-400 font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition relative"
      >
        <Share className="h-6 w-6" /> Share
        {showShareMenu && (
          <div className="absolute top-full mt-3 right-0 bg-gray-800 shadow-xl rounded-lg p-4 flex flex-col gap-3 text-sm w-56 z-50 border border-gray-700">
            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Share on Twitter</a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Share on LinkedIn</a>
            <a href={`https://api.whatsapp.com/send?text=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Share on WhatsApp</a>
            <button onClick={() => setShowShareMenu(false)} className="flex items-center text-gray-400 hover:text-white mt-2">
              <LinkIcon className="h-5 w-5 mr-2" /> Close
            </button>
          </div>
        )}
      </button>
    </div>

    {/* Comment Section */}
    <div className="bg-gray-950 shadow-xl rounded-2xl p-8 border border-gray-700 space-y-8">
      <h2 className="text-3xl font-extrabold text-white tracking-wide">
        Join the Conversation
      </h2>

      {/* New Comment Input */}
      <div className="lg:flex items-center space-x-5 grid space-y-4 lg:space-y-0">
        <img
          src={session?.user?.image || "/default-avatar.png"}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-2 border-orange-500 shadow-md"
        />
        <input
          type="text"
          placeholder="What's on your mind?"
          className="flex-grow p-5 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleCommentSubmit}
          className="lg:px-5 lg:py-2 px-3 py-2 max-md:w-1/2  bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-lg shadow-md hover:from-orange-600 hover:to-yellow-500 transition"
        >
          Post
        </button>
      </div>

      {/* List of Comments */}
      <ul className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
        {comments.length > 0 ? (
          comments
            .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
            .map((comment) => (
              <li
                key={comment.id}
                className="bg-gray-900 p-6 rounded-xl shadow-lg hover:bg-gray-800 transition"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={comment.userImage || "/default-avatar.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-sm"
                  />
                  <div>
                    <p className="text-white font-semibold">{comment.userName}</p>
                    {comment.timestamp && (
                      <p className="text-sm text-gray-400">
                        {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 mb-3">{comment.text}</p>

                <button
                  className="text-orange-400 font-semibold hover:underline"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  Reply
                </button>

                {replyingTo === comment.id && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="px-5 py-2 bg-orange-400 text-black font-semibold rounded-lg shadow-md hover:bg-orange-500 transition"
                      onClick={() =>
                        handleReplySubmit(
                          comment.id,
                          replyText,
                          setReplyText,
                          setReplyingTo,
                          setComments,
                          db3
                        )
                      }
                    >
                      Submit
                    </button>
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <ul className="ml-4 mt-6 space-y-4 border-l border-gray-700 pl-4">
                    {comment.replies.map((reply) => (
                      <li key={reply.id} className="flex space-x-2 bg-gray-800 p-3 rounded-lg">
                        <img
                          src={reply.userImage || "/default-avatar.png"}
                          alt="Reply User"
                          className="w-8 h-8 rounded-full border-2 border-orange-500 shadow"
                        />
                        <div>
                          <p className="text-white font-semibold">{reply.userName}</p>
                          <p className="text-gray-400">{reply.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
        ) : (
          <p className="text-gray-400">Be the first to comment!</p>
        )}
      </ul>
    </div>

    {/* Other Blog Suggestions */}
    {otherBlogs.length > 0 && (
      <div className="space-y-6">
        <h2 className="text-3xl font-extrabold text-white tracking-wide">Other Blog Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherBlogs.map((other) => (
            <Link key={other.id} href={`/blog/${other.id}`}>
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:bg-gray-800 transition cursor-pointer border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-2">{other.title}</h3>
                <p className="text-orange-400 font-semibold text-sm mb-3">{other.genre}</p>
                <p className="text-gray-300 text-sm line-clamp-3">{other.body?.slice(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
);
}
export default BlogDetails;
