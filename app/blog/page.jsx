"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { db1 } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { serverTimestamp } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import Popup from "@/components/Popup";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown Date";

  // Firestore timestamp object (has seconds)
  if (timestamp.seconds && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  // Firestore timestamp object with toDate()
  if (typeof timestamp.toDate === "function") {
    try {
      return timestamp.toDate().toLocaleDateString();
    } catch {
      return "Unknown Date";
    }
  }

  // Date object
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString();
  }

  // String date
  try {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  } catch {
    return "Unknown Date";
  }

  return "Unknown Date";
};

const BlogPage = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showContentType, setShowContentType] = useState("blog");
  const [adShown, setAdShown] = useState({
    video: false,
    reel: false,
  });

  const handleClick = (type) => {
    if (type === "reel" && !adShown[type]) {
      window.open("https://otieu.com/4/9366150", "_blank");
      setAdShown((prev) => ({ ...prev, [type]: true }));
      return;
    }
    handleContentTypeChange(type);
  };

  const genres = [
    "Webwiz",
    "Technology",
    "Spirituality",
    "Science",
    "Art",
    "Entertainment",
    "Crypto",
    "Blockchain",
    "Gaming",
    "Social Media",
    "Software",
    "Hardware",
    "Gadgets",
    "Social network",
    "Engineering",
    "Language",
    "English",
    "Statistics",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Astronomy",
    "Geography",
    "Psychology",
    "Philosophy",
    "Sociology",
    "Economics",
    "Law",
    "AI",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "Lifestyle",
    "Stories",
    "Coding",
    "Health",
    "History",
    "Nature",
    "Finance",
    "Travel",
    "Faith",
    "Religion",
    "Sex",
    "Wealth",
    "Business",
    "Ideas",
    "Action",
    "Drama",
    "Romance",
    "Music",
    "Mystery",
    "Fantasy",
    "Education",
    "Horror",
    "Comedy",
    "Adventure",
    "Documentary",
    "Marriage",
    "Teens",
    "Fashions",
    "Mothers",
    "Knowledge",
    "Ignorance",
    "Love",
    "Facts",
    "Family",
    "Culture",
    "Fathers",
    "Divorce",
    "Sports",
    "Street",
    "Strategy",
    "Animals",
    "News",
    "Politics",
    "Prayer",
    "Relationship",
    "Wisdom",
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db1, "blog"));
        const blogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(blogs);

        let basePosts = [];
        if (showContentType === "blog") {
          basePosts = blogs.filter((post) => !post.isVideo);
        } else if (showContentType === "video") {
          basePosts = blogs.filter((post) => post.isVideo && !post.isReel);
        } else if (showContentType === "reel") {
          basePosts = blogs.filter((post) => post.isReel);
        }

        setFilteredPosts(basePosts);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [showContentType]);

  const handleContentTypeChange = (type) => {
    setShowContentType(type);
    setSelectedCategory(null);

    let basePosts = [];
    if (type === "blog") {
      basePosts = blogPosts.filter((post) => !post.isVideo);
    } else if (type === "video") {
      basePosts = blogPosts.filter((post) => post.isVideo && !post.isReel);
    } else if (type === "reel") {
      basePosts = blogPosts.filter((post) => post.isReel);
    }

    setFilteredPosts(basePosts);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);

    let basePosts = [];
    if (showContentType === "blog") {
      basePosts = blogPosts.filter((post) => !post.isVideo);
    } else if (showContentType === "video") {
      basePosts = blogPosts.filter((post) => post.isVideo && !post.isReel);
    } else if (showContentType === "reel") {
      basePosts = blogPosts.filter((post) => post.isReel);
    }

    const filtered = basePosts.filter((post) => post.genre === category);
    setFilteredPosts(filtered);
  };

  const extractYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      } else if (
        parsedUrl.hostname === "www.youtube.com" ||
        parsedUrl.hostname === "youtube.com"
      ) {
        return parsedUrl.searchParams.get("v");
      }
    } catch (err) {
      console.error("Error extracting YouTube ID", err);
    }
    return null;
  };
  const openVideo = (post) => {
    if (!post.videoURL || typeof post.videoURL !== "string") {
      alert("Video URL is missing or invalid.");
      return;
    }
    const videoURL = encodeURIComponent(post.videoURL);
    const title = encodeURIComponent(post.title || "");
    const desc = encodeURIComponent(post.description || post.body || "");

    router.push(
      `/video/${post.id}?url=${videoURL}&title=${title}&desc=${desc}`
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-gray-400/5 ">
          <LoaderCircle size={50} className="animate-spin text-green-600 mt-10" />
          <img
            src="/logo.jpg"
            alt="My Logo"
            className="h-30 lg:h-30 mt-10 animate-pulse absolute top-40 left-0 right-0 bottom-0 mx-auto"
          />
        </div>
      ) : (
        <main className="min-h-screen bg-gray-400/5 text-white px-8 py-30">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-12">
              <div className="lg:flex items-center justify-center gap-20">
                <div className="max-lg:relative">
                  <h1 className="text-6xl font-bold tracking-tight   max-lg:inset-0 max-lg:top-8 lg:py-10 lg:hidden text-gray-400 mb-5">
                    <img
                      src="/blog.jpg"
                      alt=""
                      className="w-fit border-x-green-600 border border-green-600 rounded-md b border-r-white shadow-black shadow-2xl"
                    />
                    {showContentType === "blog" ? " " : "Videos"}
                  </h1>
                  <video width="640" height="360" autoPlay loop muted playsInline>
                    <source src="wiz Video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
              </video>
                </div>

                <p className="text-sm text-gray-400 font-mono">
                  <h1 className="text-6xl font-bold tracking-tight mt-5 space-x-5 lg:border-x-green-600 max-lg:inset-0 max-lg:top-8 lg:py-10 max-lg:hidden">
                    <img
                      src="blog.jpg"
                      alt=""
                      className="w-fit border-x-green-600 border border-green-600 rounded-md b border-r-white shadow-black shadow-2xl"
                    />

                    {showContentType === "blog" ? " " : "Videos"}
                  </h1>
                  Explore unique insights, stories, and expert opinions.
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mt-4">
                  Discover a world of knowledge and creativity. Whether you're
                  looking for in-depth articles, engaging videos, or quick
                  reels, we've got you covered.
                </p>
              </div>
              {/* Only show community section on blog, not video or reel */}
              {showContentType === "blog" && (
                <div>
                  <p className="text-gray-400 text-sm mt-4">
                    Join our <a href="/community" className="text-green-600">community</a> of <a href="/community" className="text-green-600">creators</a> and <a href="/community" className="text-green-600">thinkers.</a> Share your
                    thoughts, ideas, and experiences with us.
                  </p>
                </div>
              )}
              <div>
                <h1
                  className="font-bold font-serif cursor-pointer text-green-600"
                  onClick={() => {
                    const el = document.getElementById("services-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Have something to Share? ⬇
                </h1>
              </div>
            </header>

            {/* Toggle */}
            <div className="flex gap-4 mb-5 justify-center items-center">
              <a href="/gallery" className="bg-white text-black px-6 py-3 rounded-xl font-semibold transition">Gallery</a>
              {["blog", "video",].map((type) => (

                <button
                  key={type}
                  className={`px-6 py-3 rounded-xl font-semibold transition ${
                    showContentType === type
                      ? "bg-white text-black"
                      : "bg-white text-black hover:bg-gray-400/5 border-r"
                  }`}
                  onClick={() => handleClick(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="mb-8">
              <input
                type="text"
                placeholder={`Search ${showContentType} by genre...`}
                className="w-full px-4 py-2 rounded-md text-white focus:ring focus:ring-yellow-500 border border-green-600 bg-gray-400/10 border-x"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  let basePosts = [];

                  if (showContentType === "blog") {
                    basePosts = blogPosts.filter((post) => !post.isVideo);
                  } else if (showContentType === "video") {
                    basePosts = blogPosts.filter(
                      (post) => post.isVideo && !post.isReel
                    );
                  } else if (showContentType === "reel") {
                    basePosts = blogPosts.filter((post) => post.isReel);
                  }

                  if (searchTerm) {
                    const filtered = basePosts.filter(
                      (post) =>
                        post.genre &&
                        post.genre.toLowerCase().includes(searchTerm)
                    );
                    setFilteredPosts(filtered);
                    setSelectedCategory(null);
                  } else {
                    setFilteredPosts(basePosts);
                    setSelectedCategory(null);
                  }
                }}
              />
            </div>

            {/* Genre Filter Buttons */}
            <div
              className="flex overflow-x-auto whitespace-nowrap gap-3 mb-6 px-4"
              style={{ scrollbarWidth: "none" }}
            >
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`flex-shrink-0 px-4 py-2 rounded-md font-medium transition cursor-pointer ${
                    selectedCategory === genre
                      ? "bg-green-500 text-black"
                      : "bg-gray-400/5 border-x border-x-green-600 text-white hover:bg-gray-400/10"
                  }`}
                  onClick={() => filterByCategory(genre)}
                >
                  {genre}
                </button>
              ))}
              {selectedCategory && (
                <button
                  className="flex-shrink-0 px-4 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    setSelectedCategory(null);
                    let basePosts = [];
                    if (showContentType === "blog") {
                      basePosts = blogPosts.filter((post) => !post.isVideo);
                    } else if (showContentType === "video") {
                      basePosts = blogPosts.filter(
                        (post) => post.isVideo && !post.isVideo
                      );
                    } else if (showContentType === "/video") {
                      basePosts = blogPosts.filter((post) => post.isVideo);
                    }
                    setFilteredPosts(basePosts);
                  }}
                >
                  Clear Genre Filter
                </button>
              )}
            </div>

            {/* Posts */}
            {!loading &&
              filteredPosts.length > 0 &&
              showContentType !== "gallery" && (
                <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className=" rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 shadow-black shadow-2xl relative overflow-hidden h-fit "
                    >
                      <span className="absolute top-4 left-4 bg-green-600 text-black text-xs px-3 py-1 rounded-full">
                        {post.genre || "General"}
                      </span>
                      <h1 className="text-xs text-gray-400 text-center absolute top-4 right-4">
                        THE <span className="text-green-600">SUN</span> WEB
                      </h1>

                      {showContentType === "blog" ? (
                        <Link href={`/blog/${post.id}`} className="block">
                          {post.image && (
                            <div className="h-40 overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="py-5">
                            <h3 className="w-full h-24 mx-auto mb-3 object-cover opacity-30">
                              <img src="/web19.jpg" alt="" />
                            </h3>
                            <h2 className="text-xl font-bold mb-5 mt-2 text-center p-3">
                              {post.title}
                            </h2>
                            <p className="text-sm text-white mb-4 line-clamp-4 bg-gray-950 p-1">
                              {post.body}
                            </p>
                            <p className="text-xs text-green-600 text-right mr-2">
                              Posted on {formatTimestamp(post.timestamp)}
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <div>
                          <img
                            src={
                              post.thumbnail
                                ? post.thumbnail
                                : (post.videoURL &&
                                  (post.videoURL.includes("youtube.com") ||
                                    post.videoURL.includes("youtu.be")) &&
                                  extractYouTubeId(post.videoURL)
                                  ? `https://img.youtube.com/vi/${extractYouTubeId(
                                      post.videoURL
                                    )}/hqdefault.jpg`
                                  : "/video-placeholder.jpg"
                                )
                            }
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="p-5">
                            <h2 className="text-2xl font-bold mb-3 mt-5">
                              {post.title}
                            </h2>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                              {post.description || post.body}
                            </p>
                            <p className="text-xs text-gray-400 text-right">
                              Posted on {formatTimestamp(post.timestamp)}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </section>
              )}

            {loading && (
              <div className="flex justify-center items-center h-[30vh]">
                <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div id="services-section"></div>
          <div className="mt-10">
            <h1 className="font-bold font-serif">Have something to Share?</h1>
            <h2 className="font-mono">
              We value your thoughts and ideas! feel free to share your
              opinions, Suggestions, or topics you'd love to see on our blog.
              <h3>📩Reach out to us directly on WhatsApp:</h3>
            </h2>
            <a
              href="https://wa.me/message/R4UKUMFIH22RJ1"
              target="_self"
              rel="noopener noreferrer"
              className="font-bold text-green-600 cursor-pointer hover:underline"
            >
              Click here to chat
            </a>
          </div>
          <Popup />
        </main>
      )}
    </>
  );
}
export default BlogPage;
