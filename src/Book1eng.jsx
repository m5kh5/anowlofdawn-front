import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

function Book1eng() {
  // --- حالة التبويب النشط (book | comments) ---
  const [activeTab, setActiveTab] = useState('book');

  // --- حالات المانجا / الرواية ---
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageError, setImageError] = useState(false);

  const imageContainerRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);


  const pagesList = [];
  for (let i = 1; i <= 35; i++) {
    pagesList.push({ label: `${i}`, src: `/engimages/${i}.jpg` });


  }
  

  const currentItem = pagesList[currentPageIndex];
  const totalItems = pagesList.length;

  const handleNext = useCallback(() => {
    setCurrentPageIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // إعادة ضبط حالة الخطأ عند تغيير الصفحة
  useEffect(() => {
    setImageError(false);
  }, [currentPageIndex]);

  // i cant 
  useEffect(() => {
  const handleKeyDown = (e) => {
    // منع DevTools واختصارات عرض المصدر
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
      (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key))
    ) {
      e.preventDefault();
    }
  };

  // منع زر الفأرة الأيمن وسحب الصور
  const handleContextMenu = (e) => e.preventDefault();
  const handleDragStart = (e) => e.preventDefault();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('dragstart', handleDragStart);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('dragstart', handleDragStart);
  };
}, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
      if (activeTab !== 'book') return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeTab]);

  // التمرير باللمس للأجهزة المحمولة
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const swipeThreshold = 50;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > swipeThreshold) {
      handleNext();
    } else if (distance < -swipeThreshold) {
      handlePrev();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (imageContainerRef.current?.requestFullscreen) {
        imageContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setShowControls(true);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  const handleMouseMove = () => {
    if (!isFullscreen) return;
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 2500);
  };


  const STORAGE_KEY = "opinions_book1";
  const ADMIN_USERNAME = 'Michael';

  const [loggedinuser, setloggedinuser] = useState(null);
  const [commentinput, setcommentinput] = useState("");
  const [sortby, setsortby] = useState('newest');
  const [replybox, setreplybox] = useState(null);
  const [replyinput, setreplyinput] = useState('');

  const [comments, setcomments] = useState(() => {
    const savedcomments = localStorage.getItem(STORAGE_KEY);
    if (savedcomments) {
      return JSON.parse(savedcomments);
    }
    return [
      {
        id: 1,
        username: 'shino',
        text: 'this manga is better than owri no seraph',
        timestamp: Date.now(),
        likes: 505,
        dislikes: 0,
        likedby: [],
        dislikedby: [],
        ispinned: true,
        replies: [
          { id: 9, username: 'Fatima Al wisam', text: "sure it is" }
        ]
      },
    ];
  });

  useEffect(() => {
    const storeduser = localStorage.getItem("username");
    if (storeduser) {
      setloggedinuser(storeduser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const isadmin = loggedinuser?.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();

  const addcomment = (e) => {
    e.preventDefault();
    if (!commentinput.trim()) return;
    const newcomment = {
      id: Date.now(),
      username: loggedinuser || 'unknown',
      text: commentinput,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      ispinned: false,
      replies: []
    };
    setcomments([newcomment, ...comments]);
    setcommentinput('');
  };

  const pinned = (id) => {
    if (!isadmin) return;
    setcomments(comments.map(c => c.id === id ? { ...c, ispinned: !c.ispinned } : c));
  };

  const addreply = (comid) => {
    if (!replyinput.trim()) return;
    setcomments(comments.map(comment => {
      if (comment.id === comid) {
        const currentreplies = comment.replies || [];
        return {
          ...comment,
          replies: [...currentreplies, { id: Date.now(), username: loggedinuser || 'unknown', text: replyinput }]
        };
      }
      return comment;
    }));
    setreplyinput('');
    setreplybox(null);
  };

  const like = (id) => {
    const user = loggedinuser || 'unknown';
    setcomments(comments.map(c => {
      if (c.id === id) {
        let likedby = c.likedby || [];
        let dislikedby = c.dislikedby || [];
        let likes = c.likes || 0;
        let dislikes = c.dislikes || 0;

        if (likedby.includes(user)) {
          likedby = likedby.filter(u => u !== user);
          likes = Math.max(0, likes - 1);
        } else {
          likedby = [...likedby, user];
          likes += 1;
          if (dislikedby.includes(user)) {
            dislikedby = dislikedby.filter(u => u !== user);
            dislikes = Math.max(0, dislikes - 1);
          }
        }
        return { ...c, likes, dislikes, likedby, dislikedby };
      }
      return c;
    }));
  };

  const dislike = (id) => {
    const user = loggedinuser || 'unknown';
    setcomments(comments.map(c => {
      if (c.id === id) {
        let likedby = c.likedby || [];
        let dislikedby = c.dislikedby || [];
        let likes = c.likes || 0;
        let dislikes = c.dislikes || 0;

        if (dislikedby.includes(user)) {
          dislikedby = dislikedby.filter(u => u !== user);
          dislikes = Math.max(0, dislikes - 1);
        } else {
          dislikedby = [...dislikedby, user];
          dislikes += 1;
          if (likedby.includes(user)) {
            likedby = likedby.filter(u => u !== user);
            likes = Math.max(0, likes - 1);
          }
        }
        return { ...c, likes, dislikes, likedby, dislikedby };
      }
      return c;
    }));
  };

  const deletecomment = (id) => {
    if (!isadmin) return;
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setcomments(comments.filter(c => c.id !== id));
    }
  };

  const sortedcomments = [...comments].sort((a, b) => {
    if (a.ispinned && !b.ispinned) return -1;
    if (!a.ispinned && b.ispinned) return 1;
    if (sortby === 'newest') return b.timestamp - a.timestamp;
    if (sortby === 'oldest') return a.timestamp - b.timestamp;
    if (sortby === 'mostliked') return b.likes - a.likes;
    return 0;
  });

  return (
    <div 
      className="min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans flex flex-col justify-between selection:bg-[#a78bfa] selection:text-black" 
      dir="ltr"
    >
      
   
      <nav className="w-full px-8 py-5 flex justify-between items-center bg-[#0d0714] border-b border-[#1a0f2b] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link 
            to="/Nova" 
            className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium transition duration-200 flex items-center gap-1 mr-2"
          >
            <span>←</span> Home Page
          </Link>

         
          <div className="flex bg-[#130a1e] p-1 rounded-xl border border-[#231435]">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
                activeTab === 'book'
                  ? 'bg-[#a78bfa] text-[#0d0714] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📖 Read Book
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1.5 ${
                activeTab === 'comments'
                  ? 'bg-[#a78bfa] text-[#0d0714] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💬 Comments <span className="bg-[#231435] text-[#a78bfa] px-1.5 py-0.5 rounded-full text-[10px]">{comments.length}</span>
            </button>
          </div>
        </div>
        
        <div className="text-xl font-bold text-white hidden md:block">
          The Birth of a Tale {activeTab === 'book' && <span className="text-[#a78bfa]"> — Page {currentItem.label}</span>}
        </div>

        <div className="text-xl font-black tracking-wider text-[#cbd5e1]" dir="ltr">
          An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
        </div>
      </nav>

     
      <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-8 py-6 flex-grow">
        
       
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
          
            <aside className="lg:col-span-3 bg-[#130a1e]/90 border border-[#231435] rounded-2xl p-5 shadow-xl sticky top-24">
              <h2 className="text-base font-bold text-white mb-4 border-b border-[#231435] pb-3 text-center flex items-center justify-center gap-2">
                <span>📚</span> Novel Pages
              </h2>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
                {pagesList.map((item, index) => {
                  const isActive = currentPageIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPageIndex(index)}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? 'bg-[#a78bfa] text-[#0d0714] border-[#a78bfa] shadow-lg shadow-[#a78bfa]/20 scale-105'
                          : 'bg-[#0d0714] text-gray-300 border-[#231435] hover:border-[#a78bfa] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </aside>

          
            <section className="lg:col-span-9 bg-[#130a1e]/90 border border-[#231435] rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col justify-between items-center min-h-[75vh]">
              
              <div className="w-full flex justify-between items-center border-b border-[#231435] pb-4 mb-4">
                <span className="text-sm font-semibold text-[#a78bfa] bg-[#a78bfa]/10 px-3 py-1 rounded-lg border border-[#a78bfa]/20">
                  Chapter 1
                </span>
                <span className="text-xs text-gray-400 font-mono bg-[#0d0714] px-3 py-1 rounded-lg border border-[#231435]">
                  Page {currentItem.label}
                </span>
              </div>

            
              <div 
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className={`relative flex-grow flex items-center justify-between my-2 ${currentItem.label === '18' ? 'overflow-visible' : 'overflow-hidden'}bg-[#0d0714] border-[#231435]/50 transition-all duration-300 select-none ${
                  isFullscreen 
                    ? 'w-full h-full p-4 justify-center bg-[#050308]' 
                    : `w-full rounded-xl border p-2 transition-all duration-300 ${
    currentItem.label === '18' 
      ? 'max-w-5xl min-h-[500px]' // مساحة واسعة ومربّعة للصفحة 18
      : 'max-w-3xl min-h-[650px] sm:min-h-[750px]' // المقاس العمودي للطقس العادي
  }`
                } ${isFullscreen && !showControls ? 'cursor-none' : 'cursor-default'}`}
              >
                {isFullscreen && (
                  <button
                    onClick={toggleFullscreen}
                    className={`absolute top-6 left-6 z-20 bg-[#231435]/90 hover:bg-red-500 text-white p-3 rounded-full border border-white/20 shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-md ${
                      showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    title="Exit Fullscreen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

               
                <button
                  onClick={handlePrev}
                  disabled={currentPageIndex === 0}
                  className={`z-10 p-3 sm:p-4 rounded-full border transition-all duration-300 backdrop-blur-md ${
                    isFullscreen ? 'fixed left-6 sm:left-12 top-1/2 -translate-y-1/2' : ''
                  } ${
                    isFullscreen && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                  } ${
                    currentPageIndex === 0
                      ? 'bg-gray-900/40 text-gray-600 border-transparent cursor-not-allowed'
                      : 'bg-[#130a1e]/80 text-[#a78bfa] border-[#231435] hover:bg-[#a78bfa] hover:text-[#0d0714] shadow-lg cursor-pointer'
                  }`}
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                
                <div className={`flex items-center justify-center h-full ${isFullscreen ? 'max-w-2xl w-full mx-auto' : 'flex-grow px-2'}`}>
                  {imageError ? (
                    <div className="flex flex-col items-center justify-center w-full h-[450px] bg-[#130a1e] rounded-2xl border-2 border-dashed border-[#a78bfa]/30 p-8 text-center animate-pulse">
                      <div className="text-5xl mb-3">📖</div>
                      <h3 className="text-lg font-bold text-[#a78bfa] mb-1">Page {currentItem.label}</h3>
                      <p className="text-xs text-gray-400 font-mono bg-[#0d0714] px-3 py-1.5 rounded-lg border border-[#231435] mb-2">
                        {currentItem.src}
                      </p>
                      <span className="text-xs text-gray-500">Image file not added to public/engimages yet</span>
                    </div>
                  ) : (
                    <img 
                      src={currentItem.src} 
                      alt={`Page ${currentItem.label}`}
                     className={`object-contain rounded-lg shadow-2xl transition-all duration-300 pointer-events-none ${
  isFullscreen 
    ? (currentItem.label === '18' ? 'w-[95vw] max-w-[1500px] max-h-[96vh]' : 'max-h-[96vh] max-w-full')
    : (currentItem.label === '18' ? 'w-full max-h-[75vh]' : 'w-full max-h-[80vh] sm:max-h-[85vh]')
}`}
                    />
                  )}
                </div>

               
                <button
                  onClick={handleNext}
                  disabled={currentPageIndex === totalItems - 1}
                  className={`z-10 p-3 sm:p-4 rounded-full border transition-all duration-300 backdrop-blur-md ${
                    isFullscreen ? 'fixed right-6 sm:right-12 top-1/2 -translate-y-1/2' : ''
                  } ${
                    isFullscreen && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                  } ${
                    currentPageIndex === totalItems - 1
                      ? 'bg-gray-900/40 text-gray-600 border-transparent cursor-not-allowed'
                      : 'bg-[#130a1e]/80 text-[#a78bfa] border-[#231435] hover:bg-[#a78bfa] hover:text-[#0d0714] shadow-lg cursor-pointer'
                  }`}
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

             
              <div className="w-full flex justify-center items-center pt-4 border-t border-[#231435] mt-4">
                <button
                  onClick={toggleFullscreen}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition duration-200 flex items-center gap-2 cursor-pointer shadow-md border ${
                    isFullscreen
                      ? 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border-red-500/30'
                      : 'bg-[#231435] hover:bg-[#a78bfa] text-[#a78bfa] hover:text-[#0d0714] border-[#3b2259] hover:border-[#a78bfa]'
                  }`}
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                </button>
              </div>

            </section>
          </div>
        )}

        
        {activeTab === 'comments' && (
          <div className="max-w-4xl mx-auto py-2">
            <h1 className="text-3xl font-extrabold text-white mb-2 text-center">Book 1 — Comments & Reviews</h1>
            <p className="text-gray-400 text-sm text-center mb-8">Share your thoughts and impressions about Book 1 specifically</p>

           
            <div className="flex justify-between items-center bg-[#130a1e] p-4 rounded-xl border border-[#231435] mb-6">
              <span className="text-sm text-gray-400 font-medium">Sort opinions by:</span>
              <select
                value={sortby}
                onChange={(e) => setsortby(e.target.value)}
                className="bg-[#0d0714] border border-[#231435] text-white p-2 rounded-lg text-sm focus:outline-none focus:border-[#a78bfa]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostliked">Most Liked</option>
              </select>
            </div>

            
            <form onSubmit={addcomment} className="bg-[#130a1e] p-6 rounded-xl border border-[#231435] mb-8">
              <div className="mb-4">
                <span className="text-xs text-gray-400 block mb-2">Posting as:</span>
                <span className="text-sm font-bold text-[#a78bfa] bg-[#a78bfa]/10 px-3 py-1.5 rounded-md border border-[#a78bfa]/20">
                  {loggedinuser ? loggedinuser : 'Guest'}
                </span>
              </div>
              <textarea
                value={commentinput}
                onChange={(e) => setcommentinput(e.target.value)}
                placeholder="Write your comment or review about Book 1 here..."
                className="w-full bg-[#0d0714] border border-[#231435] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#a78bfa] resize-none h-28 text-sm"
                required
              />
              <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-[#a78bfa] text-[#0d0714] font-bold px-6 py-2 rounded-lg text-sm hover:bg-[#c4b5fd] transition">
                  Post Comment
                </button>
              </div>
            </form>

           
            <div className="space-y-4">
              {sortedcomments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-5 rounded-xl border transition-all duration-300 ${
                    comment.ispinned
                      ? 'bg-[#1c102e] border-[#a78bfa] shadow-md'
                      : 'bg-[#130a1e] border-[#231435]'
                  }`}
                >
                  {comment.ispinned && (
                    <div className="flex items-center gap-1 text-xs text-[#a78bfa] font-semibold mb-2">
                      📌 Pinned Review
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{comment.username}</h3>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('en-US') : 'Just now'}
                      </span>
                    </div>

                    {isadmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => pinned(comment.id)}
                          className={`px-2 py-1 rounded text-xs font-medium transition ${
                            comment.ispinned
                              ? 'bg-[#a78bfa]/20 text-[#a78bfa]'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {comment.ispinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          onClick={() => deletecomment(comment.id)}
                          className="text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white px-2 py-1 rounded text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">{comment.text}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-[#231435] pt-3">
                    <button onClick={() => like(comment.id)} className="hover:text-emerald-400 flex items-center gap-1 transition">
                      👍 <span>{comment.likes}</span>
                    </button>
                    <button onClick={() => dislike(comment.id)} className="hover:text-rose-400 flex items-center gap-1 transition">
                      👎 <span>{comment.dislikes}</span>
                    </button>
                    <button
                      onClick={() => setreplybox(replybox === comment.id ? null : comment.id)}
                      className="text-[#a78bfa] hover:underline ml-2"
                    >
                      Reply
                    </button>
                  </div>

                  {replybox === comment.id && (
                    <div className="mt-4 ml-4 p-3 bg-[#0d0714] rounded-lg border border-[#231435] flex gap-2">
                      <input
                        type="text"
                        value={replyinput}
                        onChange={(e) => setreplyinput(e.target.value)}
                        placeholder={`Replying as: ${loggedinuser || 'unknown'}...`}
                        className="flex-grow bg-[#130a1e] border border-[#231435] rounded-md p-2 text-xs text-white focus:outline-none focus:border-[#a78bfa]"
                      />
                      <button
                        onClick={() => addreply(comment.id)}
                        className="bg-[#a78bfa] text-[#0d0714] font-bold px-4 py-1.5 rounded-md text-xs hover:bg-[#c4b5fd] transition"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-6 space-y-2 border-l-2 border-[#231435] pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-[#0d0714]/60 p-3 rounded-lg border border-[#231435]/40 text-xs">
                          <span className="font-bold text-[#a78bfa] block mb-1">{reply.username}</span>
                          <p className="text-gray-300">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

     
      <footer className="w-full py-6 text-center text-xs text-gray-500 bg-[#0d0714] border-t border-[#1a0f2b]" dir="ltr">
        © 2026 An Owl of Dawn. All Rights Reserved
      </footer>

    </div>
  );
}

export default Book1eng;