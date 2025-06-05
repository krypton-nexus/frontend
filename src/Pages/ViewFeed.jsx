import React, { useState, useEffect } from "react";
import Sidebar from "../Components/SideBar";
import Skeleton from "@mui/material/Skeleton";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import "../CSS/ViewFeed.css";

const ViewFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, club, announcement, event
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest

  // Simulated API call (replace with real fetch)
  const fetchFeed = async () => {
    try {
      setLoading(true);
      // const res = await fetch(`${BASE_URL}/feed`);
      // const data = await res.json();

      const mockData = [
        {
          id: 1,
          title: "Gavel Club Workshop",
          content:
            "Join us tomorrow at 5 PM for a public speaking workshop. RSVP now!",
          date: "2024-06-02T17:00:00Z",
          type: "club",
          clubId: "gavel-club",
        },
        {
          id: 2,
          title: "Annual Career Fair",
          content:
            "The University Career Center hosts a fair next month. Visit for details.",
          date: "2024-05-30T09:00:00Z",
          type: "announcement",
          clubId: null,
        },
        {
          id: 3,
          title: "Hackathon 2025 Registration",
          content:
            "SESA invites all students to register for Hackathon 2025—prizes, workshops, and more.",
          date: "2024-05-28T12:00:00Z",
          type: "event",
          clubId: "sesa",
        },
        {
          id: 4,
          title: "Drama Club Tryouts",
          content:
            "Auditions for the Drama Club’s spring play start next week. Sign up ASAP.",
          date: "2024-05-26T14:00:00Z",
          type: "club",
          clubId: "drama-club",
        },
        {
          id: 5,
          title: "Library Closed This Friday",
          content:
            "Central library will be closed for maintenance—plan accordingly.",
          date: "2024-05-25T08:00:00Z",
          type: "announcement",
          clubId: null,
        },
        {
          id: 6,
          title: "Guest Lecture: AI Ethics",
          content:
            "Join Prof. Silva on June 10 for a lecture on AI Ethics in modern society.",
          date: "2024-05-24T10:30:00Z",
          type: "event",
          clubId: null,
        },
      ];

      // Simulate network delay
      await new Promise((r) => setTimeout(r, 800));
      setPosts(mockData);
      setError(null);
    } catch (err) {
      setError("Failed to load feed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Filter and sort logic
  const filteredAndSortedPosts = () => {
    let filteredPosts = posts;
    if (filter !== "all") {
      filteredPosts = posts.filter((post) => post.type === filter);
    }
    return filteredPosts.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });
  };

  const formatDate = (isoString) => {
    const dt = new Date(isoString);
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const postsToDisplay = filteredAndSortedPosts();

  // Render six skeleton cards for loading state
  const renderSkeletonGrid = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <div className="feed-card skeleton-card" key={idx}>
        <Skeleton
          variant="rectangular"
          height={24}
          width="60%"
          style={{ marginBottom: 12 }}
        />
        <Skeleton
          variant="text"
          height={20}
          width="90%"
          style={{ marginBottom: 6 }}
        />
        <Skeleton
          variant="text"
          height={20}
          width="80%"
          style={{ marginBottom: 6 }}
        />
        <Skeleton variant="rectangular" height={20} width="40%" />
      </div>
    ));

  if (loading) {
    return (
      <div className="view-feed-container">
        <Sidebar />
        <main className="feed-main-content">
          <div className="feed-header">
            <h2 className="feed-title">Feed</h2>
            <div className="feed-controls">
              <Skeleton variant="rectangular" width={120} height={36} />
              <Skeleton variant="rectangular" width={160} height={36} />
            </div>
          </div>
          <div className="feed-grid">{renderSkeletonGrid()}</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-feed-container">
        <Sidebar />
        <main className="main-content">
          <div className="feed-error">
            <h2>Error Loading Feed</h2>
            <p>{error}</p>
            <button onClick={fetchFeed} className="retry-btn">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="view-feed-container">
      <Sidebar />
      <main className="main-content">
        <div className="feed-header">
          <h2 className="feed-title">Feed</h2>
          <div className="feed-controls">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select">
              <option value="all">All Types</option>
              <option value="club">Club Posts</option>
              <option value="announcement">Announcements</option>
              <option value="event">Events</option>
            </select>

            <button
              onClick={() =>
                setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"))
              }
              className="sort-button">
              {sortBy === "newest" ? (
                <>
                  <FaSortAmountDown /> Newest First
                </>
              ) : (
                <>
                  <FaSortAmountUp /> Oldest First
                </>
              )}
            </button>
          </div>
        </div>

        {postsToDisplay.length === 0 ? (
          <div className="no-posts">
            <p>No posts found for the selected filter.</p>
          </div>
        ) : (
          <div className="feed-grid">
            {postsToDisplay.map((post) => (
              <div key={post.id} className={`feed-card feed-card-${post.type}`}>
                <div className="feed-card-header">
                  <h3 className="feed-card-title">{post.title}</h3>
                  <time className="feed-card-date" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                <p className="feed-card-body">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewFeed;
