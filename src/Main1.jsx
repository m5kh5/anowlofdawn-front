import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import './index.css';
import insta from './assets/insta.png';
import youtube from './assets/youtube.png';
import gmail from './assets/gmail.png';
import { useTranslation } from 'react-i18next';
const API_URL = import.meta.env.VITE_API_URL || "https://anowlofdawn.onrender.com";
function Main1() {
  const navigate = useNavigate();
  const [loggedinuser, setloggedinuser] = useState(null);
 

const [selectedchapter, setselectedchapter] = useState(null);

const [hasaccess, setHasAccess] = useState(false);

useEffect(() => {
  const checkAccessStatus = async () => {
    const userEmail = localStorage.getItem("useremail");
    
    // إذا لم يكن هناك إيميل مسجل، نعتمد على القيمة المحلية أو نرفض الوصول
    if (!userEmail) {
      setHasAccess(false);
      return;
    }

    try {
      // 1. الاستعلام من السيرفر مباشرة للتأكد من قاعدة البيانات
      const res = await fetch(`${API_URL}/api/check-access?email=${encodeURIComponent(userEmail)}&bookId=BOOK1`);
      if (!res.ok) {
  throw new Error("حدث خطأ في استجابة السيرفر");
}
      const data = await res.json();

      if (data.hasAccess) {
        setHasAccess(true);
        localStorage.setItem("hasdigitalaccess", "1"); // تحديث الكاش المحلي
      } else {
        setHasAccess(false);
        localStorage.setItem("hasdigitalaccess", "0");
      }
    } catch (error) {
      console.error("خطأ في التحقق من صلاحية الوصول:", error);
      // في حال وجود خطأ في الاتصال، نعتمد على القيمة المخزنة سابقاً كخيار احتياطي
      const localAccess = localStorage.getItem("hasdigitalaccess");
      if (localAccess === "true" || localAccess === "1") {
        setHasAccess(true);
      }else{
        setHasAccess(false)
      }
    }
  };

  checkAccessStatus();
}, []);
 

  useEffect(() => {
    const storeduser = localStorage.getItem("username");
    if (storeduser) {
      setloggedinuser(storeduser);
    }
  }, []);
  const buyclick =()=>{

  if (loggedinuser==null) {
  navigate("/login")
  return;
}
if(hasaccess){
  navigate("/Nova")
}
else {
    // 3. إذا كان مسجلاً ولا يملك صلاحية، يذهب لصفحة الشراء
    navigate("/Purchase");
  }
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    localStorage.removeItem("hasdigitalaccess");
    setHasAccess(false)
    setloggedinuser(null);
    navigate("/login");
  };

  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans selection:bg-[#a78bfa] selection:text-black flex flex-col justify-between" dir="rtl">
      
      <div>
        {/* 1. شريط التنقل - Navbar */}
       <nav className="sticky top-0 z-50 bg-[#160d22]/95 backdrop-blur-md border-b border-[#2d1b42] px-8 py-4 flex justify-between items-center">
  {/* القسم الأيسر: اللوجو فقط */}
  <div className='flex items-center space-x-6 space-x-reverse'>
    <div className="text-2xl font-black tracking-wider text-[#cbd5e1]">
      An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
    </div>
  </div>
  
  {/* القسم الأوسط: الروابط */}
  

  {/* القسم الأيمن: التحكم بالترجمة والحساب */}
  <div>
    {loggedinuser ? (
      <div className="flex items-center space-x-4 space-x-reverse text-sm">
        {/* 1. اسم المستخدم */}
        <span className="text-white font-medium">
          {t('HI')}   <span className="text-[#a78bfa]">{loggedinuser}</span> 
        </span>

        {/* 2. زر الترجمة (في المنتصف بين الاسم وتسجيل الخروج) */}
        <button
          onClick={() => {
            const newlang = i18n.language === 'en' ? 'ar' : 'en';
            i18n.changeLanguage(newlang);
          }}
          className='w-8 h-8 rounded-full border border-[#2d1b42] bg-[#1d112d] hover:border-[#a78bfa] text-[#cbd5e1] hover:text-[#a78bfa] flex items-center justify-center font-bold text-sm transition duration-300 shadow-md cursor-pointer'
        >
          {i18n.language === 'en' ? 'ع' : 'E'}
        </button>

        {/* 3. زر تسجيل الخروج */}
        <button 
          onClick={logout}
          className="bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg transition text-xs cursor-pointer"
        >
          {t('Log out')} 
        </button>
      </div>
    ) : (
      // في حال عدم تسجيل الدخول: يظهر زر الترجمة بجانب زر تسجيل الدخول مباشرة
      <div className="flex items-center space-x-4 space-x-reverse">
        <button
          onClick={() => {
            const newlang = i18n.language === 'en' ? 'ar' : 'en';
            i18n.changeLanguage(newlang);
          }}
          className='w-8 h-8 rounded-full border border-[#2d1b42] bg-[#1d112d] hover:border-[#a78bfa] text-[#cbd5e1] hover:text-[#a78bfa] flex items-center justify-center font-bold text-sm transition duration-300 shadow-md cursor-pointer'
        >
          {i18n.language === 'en' ? 'ع' : 'E'}
        </button>

        <Link 
          to="/login" 
          className="bg-[#2d1b42] hover:bg-[#3b2457] text-[#e2e8f0] px-6 py-2 rounded-lg text-sm font-medium transition border border-[#442966] inline-block text-center cursor-pointer"
        >
          {t('log in')}
        </Link>
      </div>
    )}
  </div>
</nav>

        {/* 2. القسم الرئيسي المطور - Hero Section */}
        <header className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* النصوص والتحفيز */}
          <div className="lg:col-span-7 text-right">
            <span className="text-xs font-bold tracking-widest text-[#cbd5e1] uppercase bg-[#cbd5e1]/10 px-3 py-1 rounded-md border border-[#cbd5e1]/20">
              {t('First Edition')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 leading-tight">
              {t('Enter a World of')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]">
                {t('Fantasy and Mystery')}
              </span>
            </h1>
            <p className="mt-6 text-gray-450 text-base md:text-lg leading-relaxed max-w-2xl">
              {t('Hero Description')} 
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-start">
             <button 
  onClick={buyclick} 
  className="bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] hover:opacity-95 text-black font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-white/5 transition cursor-pointer"
>
 {loggedinuser && hasaccess ? t("Read now") : t("buy a copy now")}
</button>
            </div>
          </div>

          {/* غلاف الكتاب */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[320px]">
              
              {/* التوهج الخلفي */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#cbd5e1] to-[#a78bfa] rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition duration-700"></div>
              
              {/* غلاف الكتاب كـ <button> */}
              <button className="w-full relative aspect-[3/4] bg-gradient-to-br from-[#1c112b] to-[#0d0714] rounded-2xl border border-[#cbd5e1]/30 group-hover:border-[#a78bfa]/60 shadow-2xl flex flex-col justify-between p-8 text-center transition-all duration-300 transform group-hover:-translate-y-2 cursor-pointer focus:outline-none">
                
                {/* الجزء العلوي */}
                <div className="text-xs font-bold text-[#cbd5e1] tracking-widest group-hover:scale-105 transition duration-300">
                  {t('Chapter 1')}
                </div>
                
                {/* الجزء الأوسط */}
                <div className="my-auto py-8">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">📘</div>
                  <h2 className="text-2xl font-bold text-white tracking-wide group-hover:text-[#a78bfa] transition duration-300">
                    {t('AL Andalos Family  Trailer 1')}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">{t('BY Fatima Al Wisam')} </p>
                </div>
                
                {/* الجزء السفلي التفاعلي */}
                <div className="text-[11px] text-[#a78bfa] opacity-0 group-hover:opacity-100 transition duration-300 font-medium">
                  {t('Tap to open')} ↗
                </div>

              </button>

            </div>
          </div>
        </header>

        {/* 3. قسم الفصول المنظم - Chapters Section */}
        <section id="chapters" className="bg-[#160d22] py-20 border-t border-[#2d1b42]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-center mb-12 border-r-4 border-[#cbd5e1] pr-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{t('AL Andalos Family Title')}</h3>
            
            </div>

            {/* شبكة الفصول */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { no: "1", title: t("The Birth of a Tale"), duration: `30 ${t('Pages')}` },
                { no: "2", title: t("The Rules of the Game"), duration: `30 ${t('Pages')}` },
                { no: "3", title: t("Content for Being in a Family"), duration: `30 ${t('Pages')}` },
                { no: "4", title: t("The Hunted Palace"), duration: `30 ${t('Pages')}` },
              ].map((chapter, index) => {
                const cardContent = (
                  <div className="bg-[#0d0714] rounded-xl overflow-hidden border border-[#2d1b42] hover:border-[#cbd5e1]/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-56 p-5">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-mono text-[#cbd5e1] bg-[#cbd5e1]/10 px-2 py-0.5 rounded">
                        {t('Chapter')} {chapter.no}
                      </span>
                      <span className="text-xs text-gray-400 bg-[#160d22] px-2 py-1 rounded border border-[#2d1b42]" dir='ltr'>
                        {chapter.duration}
                      </span>
                    </div>
                    <div className="text-right mt-auto">
                      <h4 className="font-bold text-lg text-white group-hover:text-[#cbd5e1] transition duration-300 line-clamp-2">
                        {chapter.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-2">{t('Click to read')}</p>
                    </div>
                  </div>
                );

                if (index === 0) {

                  return  hasaccess  ?(
                    <Link key={index} to="/Nova" className="block no-underline">
      {cardContent}
    </Link>
                  ):(<button 
      key={index} 
      onClick={buyclick} 
      className="block w-full border-0 bg-transparent p-0 cursor-pointer text-right no-underline"
    >
      {cardContent}
    </button>)
                }
                if(index>0){
                 return (
    <div key={index} className="w-full">
      <button 
        onClick={() => setselectedchapter(index)} 
        className="block w-full border-0 bg-transparent p-0 cursor-pointer text-right no-underline"
      >
        {cardContent}
      </button>

      {/* يظهر النص الكبير فقط إذا تم الضغط على هذا الشابتر بالذات */}
      {selectedchapter === index && (
        <div className="text-xl font-extrabold text-[#a78bfa] text-center mt-3 animate-pulse">
          {t('Chapter not released yet!')}
        </div>
      )}
    </div>
  );
                }

                return <div key={index}>{cardContent}</div>;
              })}
</div>
          </div>
        </section>
        <div className="bg-[#130C22] py-5 px-6 w-full">
  <div className="hidden md:flex justify-center space-x-12 space-x-reverse items-center text-sm font-medium text-gray-300">
    <Link 
      to="/Aboutus" 
      className="hover:text-[#a78bfa] transition-colors duration-200"
    >
      {t('About us')}
    </Link>
    
    <Link 
      to="/Opinions" 
      className="hover:text-[#a78bfa] transition-colors duration-200"
    >
      {t('Readers opinions')}
    </Link>
    <a 
      href="mailto:roa65521@gamil.com" 
      className="hover:text-[#a78bfa] transition-colors duration-200"
    >
      {t('Customer Service')}
    </a>
    
  </div>
</div>
      </div>

      {/* 4. شريط الحقوق السفلي المطور والتفاعلي - Footer */}
     
      <footer className="w-full bg-[#0d0714] border-t border-[#2d1b42] py-6 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* اليمين */}
          <div className="text-base md:text-lg font-bold text-white tracking-wide text-center md:text-right">
            An Owl of Dawn 
          </div>

          {/* الوسط */}
          <div className="flex space-x-5 space-x-reverse justify-center">
            <a href="https://www.youtube.com/@Anowlofdawn" target='_blank' rel='noopener noreferrer' className="w-14 h-14 rounded-full bg-[#160d22] border border-[#2d1b42] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#cbd5e1] hover:scale-110 transition duration-300 shadow-lg shadow-black/60" title="Youtube">
              <img src={youtube} alt="youtube" className="w-full h-full object-cover rounded-full" />
            </a>
            <a href="https://www.instagram.com/anowlofdawn" className="w-14 h-14 rounded-full bg-[#160d22] border border-[#2d1b42] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#cbd5e1] hover:scale-110 transition duration-300 shadow-lg shadow-black/40" title="Instagram">
              <img src={insta} alt="instagram" className="w-full h-full object-cover rounded-full" />
            </a>
            <a href="mailto:anowlofdawn@gmail.com" className="w-14 h-14 rounded-full bg-[#160d22] border border-[#2d1b42] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#cbd5e1] hover:scale-110 transition duration-300 shadow-lg shadow-black/40" title="Gmail">
              <img src={gmail} alt="gmail" className='w-full h-full object-cover rounded-full'/>
            </a>
          </div>

          {/* اليسار */}
          <div className="text-xs text-gray-500 tracking-wider text-center md:text-left">
            ©2026 An Owl of Dawn. All Rights Reserved
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Main1;