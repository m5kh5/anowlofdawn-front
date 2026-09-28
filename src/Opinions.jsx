import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Opinions() {
    const { t } = useTranslation();
    const [loggedinuser, setloggedinuser] = useState(null);
    const [comments, setcomments] = useState(() => {
        const savedcomments = localStorage.getItem("opinions");
        if (savedcomments) { return JSON.parse(savedcomments); }
       
         
        return [
            {
                id: 1,
                username: 'shino',
                text: 'this manga is better than owri no seraph ',
                timestamp: Date.now(),
                likes: 0,
                dislikes: 0,
                likesby: [],
                dislikeby: [],
                ispinned: true,
                replies: [
                    { id: 9, username: 'Fatima Al wisam', text: "sure it is ", }
                ]
            },
        ];
    });

    const [commentinput, setcommentinput] = useState("");
    const [sortby, setsortby] = useState('newest');
   const ADMIN_USERNAME='Michael'
  const isadmin = loggedinuser?.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
    const [replybox, setreplybox] = useState(null);
    const [replyinput, setreplyinput] = useState('');

    useEffect(() => {
        const storeduser = localStorage.getItem("username");
        if (storeduser) {
            setloggedinuser(storeduser);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("opinions", JSON.stringify(comments));
    }, [comments]);

    const addcomment = (a) => {
        a.preventDefault();
        if (!commentinput) { return; }
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
        if(!isadmin) return;
        setcomments(comments.map(c => {
            if (c.id == id) {
                return { ...c, ispinned: !c.ispinned };
            }
            return c;
        }));
    };

    const addreply = (comid) => {
        if (!replyinput.trim()) {
            return;
        }

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
                }
                else {
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
                }
                else {
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
        if(!isadmin)return;
        if (window.confirm(t("Are you sure you want to delete this comment?"))) {
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
        <>
            <div className="w-full min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans flex flex-col justify-between overflow-hidden" dir="rtl">

                {/* شريط التنقل العلوي (Navbar) */}
                <nav className="bg-[#160d22]/95 backdrop-blur-md border-b border-[#2d1b42] px-8 py-4 flex justify-between items-center">
                    <div className="text-2xl font-black tracking-wider text-[#cbd5e1]">
                        An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
                    </div>
                    <Link to="/" className="text-sm font-medium text-[#a78bfa] hover:underline">
                        {t(' Home ← ')}
                    </Link>
                </nav>

                {/* المحتوى الرئيسي للمراجعات */}
                <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-grow">
                    <h1 className="text-3xl font-extrabold text-white mb-2 text-center">{t('Reader Opinions & Reviews')}</h1>
                    <p className="text-gray-400 text-sm text-center mb-8">{t('Share your thoughts and impressions about the Books')}</p>

                    {/* أدوات الفرز والتصنيف */}
                    <div className="flex justify-between items-center bg-[#160d22] p-4 rounded-xl border border-[#2d1b42] mb-6">
                        <span className="text-sm text-gray-400 font-medium">{t('Sort opinions by:')}</span>
                        <select
                            value={sortby}
                            onChange={(e) => setsortby(e.target.value)}
                            className="bg-[#0d0714] border border-[#2d1b42] text-white p-2 rounded-lg text-sm focus:outline-none focus:border-[#a78bfa]"
                        >
                            <option value="newest">{t('Newest First')}</option>
                            <option value="oldest">{t('Oldest First')}</option>
                            <option value="mostliked">{t('Most Liked')}</option>
                        </select>
                    </div>

                    {/* فورم إرسال تعليق جديد */}
                    <form onSubmit={addcomment} className="bg-[#160d22] p-6 rounded-xl border border-[#2d1b42] mb-8">
                        <div className="mb-4">
                            <span className="text-xs text-gray-400 block mb-2">{t('Posting as:')}</span>
                            <span className="text-sm font-bold text-[#a78bfa] bg-[#a78bfa]/10 px-3 py-1.5 rounded-md border border-[#a78bfa]/20">
                                {loggedinuser ? loggedinuser : t('Guest (Please log in to show your username)')}
                            </span>
                        </div>
                        <textarea
                            value={commentinput}
                            onChange={(e) => setcommentinput(e.target.value)}
                            placeholder={t('Write your honest comment or review here...')}
                            className="w-full bg-[#0d0714] border border-[#2d1b42] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#a78bfa] resize-none h-28 text-sm"
                            required
                        />
                        <div className="mt-4 flex justify-end">
                            <button type="submit" className="bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] text-black font-bold px-6 py-2 rounded-lg text-sm hover:opacity-95 transition">
                                {t('Post Comment')}
                            </button>
                        </div>
                    </form>

                    {/* شبكة عرض التعليقات والردود الديناميكية */}
                    <div className="space-y-4">
                        {sortedcomments.map((comment) => (
                            <div
                                key={comment.id}
                                className={`p-5 rounded-xl border transition-all duration-300 ${
                                    comment.ispinned
                                        ? 'bg-[#1e1233] border-[#a78bfa] shadow-md shadow-[#a78bfa]/5'
                                        : 'bg-[#160d22] border-[#2d1b42]'
                                }`}
                            >
                                {/* إشارة التثبيت العلوي للزوار */}
                                {comment.ispinned && (
                                    <div className="flex items-center gap-1 text-xs text-[#a78bfa] font-semibold mb-2">
                                        📌 {t('Pinned review by Admin')}
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{comment.username}</h3>
                                        <span className="text-xs text-gray-500">
                                            {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('en-US') : t('Just now')}
                                        </span>
                                    </div>

                                    {/* أدوات الأدمن: الحذف والتثبيت الديناميكي */}
                                    {isadmin && (
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <button
                                                onClick={() => pinned(comment.id)}
                                                className={`px-2 py-1 rounded text-xs font-medium transition ${
                                                    comment.ispinned
                                                        ? 'bg-[#a78bfa]/20 text-[#a78bfa] hover:bg-[#a78bfa]/30'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                }`}
                                            >
                                                {comment.ispinned ? t('Unpin') : t('Pin')}
                                            </button>
                                            <button
                                                onClick={() => deletecomment(comment.id)}
                                                className="text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white px-2 py-1 rounded text-xs transition"
                                            >
                                                {t('Delete')}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">{comment.text}</p>

                                {/* أزرار التفاعل (لايك، ديسلايك، رد) */}
                                <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-400 border-t border-[#2d1b42]/50 pt-3">
                                    <button onClick={() => like(comment.id)} className="hover:text-emerald-400 flex items-center gap-1 transition">
                                        👍 <span>{comment.likes}</span>
                                    </button>
                                    <button onClick={() => dislike(comment.id)} className="hover:text-rose-400 flex items-center gap-1 transition">
                                        👎 <span>{comment.dislikes}</span>
                                    </button>
                                    <button
                                        onClick={() => setreplybox(replybox === comment.id ? null : comment.id)}
                                        className="text-[#a78bfa] hover:underline"
                                    >
                                        {t('Reply to this comment')}
                                    </button>
                                </div>

                                {/* صندوق إدخال الرد عند التفعيل */}
                                <div className="space-y-4">
                                    {replybox === comment.id && (
                                        <div className="mt-4 mr-4 p-3 bg-[#0d0714] rounded-lg border border-[#2d1b42] flex gap-2">
                                            <input
                                                type="text"
                                                value={replyinput}
                                                onChange={(e) => setreplyinput(e.target.value)}
                                                placeholder={`${t('Replying as:')} ${loggedinuser || 'unknown'}...`}
                                                className="flex-grow bg-[#160d22] border border-[#2d1b42] rounded-md p-2 text-xs text-white focus:outline-none focus:border-[#a78bfa]"
                                            />
                                            <button
                                                onClick={() => addreply(comment.id)}
                                                className="bg-[#a78bfa] text-black font-bold px-4 py-1.5 rounded-md text-xs hover:bg-[#bcb2ff] transition"
                                            >
                                                {t('Send')}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* طباعة الردود التابعة للتعليق المستهدف إن وُجدت */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4 mr-6 space-y-2 border-r-2 border-[#2d1b42] pr-4">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="bg-[#0d0714]/60 p-3 rounded-lg border border-[#2d1b42]/40 text-xs">
                                                <span className="font-bold text-[#a78bfa] block mb-1">{reply.username}</span>
                                                <p className="text-gray-300">{reply.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </main>

                {/* الفوتر العام */}
                <footer className="w-full bg-[#0d0714] border-t border-[#2d1b42] py-4 px-8 text-center text-xs text-gray-500">
                    © 2026 An Owl of Dawn. All Rights Reserved
                </footer>
                
            </div>
        
        </>
        
    );
}

export default Opinions;