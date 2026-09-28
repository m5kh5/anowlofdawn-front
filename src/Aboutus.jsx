import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Aboutus() {
    const { t, i18n } = useTranslation();
    // تحديد الاتجاه الحالي بناءً على اللغة (rtl للعربية، ltr للغات الأخرى)
    const currentDir = i18n.dir(); 
    const isRtl = currentDir === "rtl";

    // التبويب النشط يبدأ بصفحة "من نحن" كوضع افتراضي
    const [activeTab, setActiveTab] = useState('about');

    return (
        <div 
            className="w-full min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans flex flex-col justify-between overflow-hidden" 
            dir={currentDir}
        >
            
            {/* شريط التنقل العلوي (Navbar) */}
            <nav className="bg-[#160d22]/95 backdrop-blur-md border-b border-[#2d1b42] px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-sm font-medium text-[#a78bfa] hover:underline">
                    {t('← Home ')}
                </Link>
                <div className="text-2xl font-black tracking-wider text-[#cbd5e1]">
                    An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
                </div>
            </nav>

            {/* المحتوى الرئيسي */}
            <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-grow">
                
                {/* أزرار التبديل الثلاثة (التبويبات) */}
                <div className="flex justify-center gap-4 mb-12 bg-[#160d22] p-2 rounded-xl border border-[#2d1b42]">
                    
                    {/* زر About Us */}
                    <button 
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                            activeTab === 'about' 
                            ? 'bg-[#a78bfa] text-black shadow-md' 
                            : 'text-gray-400 hover:text-white hover:bg-[#0d0714]'
                        }`}
                    >
                        {t('About Us Tab')}
                    </button>

                    {/* زر Terms of Service */}
                    <button 
                        onClick={() => setActiveTab('terms')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                            activeTab === 'terms' 
                            ? 'bg-[#a78bfa] text-black shadow-md' 
                            : 'text-gray-400 hover:text-white hover:bg-[#0d0714]'
                        }`}
                    >
                        {t('Terms of Service Tab')}
                    </button>

                    {/* زر Privacy Policy */}
                    <button 
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                            activeTab === 'privacy' 
                            ? 'bg-[#a78bfa] text-black shadow-md' 
                            : 'text-gray-400 hover:text-white hover:bg-[#0d0714]'
                        }`}
                    >
                        {t('Privacy Policy Tab')}
                    </button>

                </div>

                {/* منطقة عرض النصوص الديناميكية بحسب الشرط */}
                <div className={`bg-[#160d22] p-8 rounded-xl border border-[#2d1b42] shadow-xl min-h-[300px] ${isRtl ? 'text-right' : 'text-left'}`}>
                    
                    {/* عرض محتوى About Us */}
                    {activeTab === 'about' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold text-white mb-6 border-b border-[#2d1b42] pb-2">
                                {t('About Us Title')}
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-base">
                                {t('About Us Content')}
                            </p>
                        </div>
                    )}

                    {/* عرض محتوى Terms of Service */}
                    {activeTab === 'terms' && (
                        <div className="space-y-6">
                            {/* القسم الأول: شروط الخدمة وما يمكن للمستخدم فعله */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-extrabold text-white mb-4 border-b border-[#2d1b42] pb-2">
                                    {t('Terms of Service Title')}
                                </h2>
                                <p className="text-gray-400 text-sm mb-4">
                                    {t('When the user creates an account on an Owl of Dawn, this enables him/her to take any/all of the following actions:')}
                                </p>
                                <ul className={`list-decimal list-inside text-gray-300 text-base space-y-3 ${isRtl ? 'pr-2' : 'pl-2'}`}>
                                    <li>{t('The user can buy an electronic version of the books available on the website.')}</li>
                                    <li>{t('The user can make a request to buy Printed books that are displayed on the website.')}</li>
                                    <li>{t('The user can leave comments and/or general opinions regarding the books.')}</li>
                                    <li>{t('The user can get access to the social media accounts of an Owl of Dawn.')}</li>
                                    <li>{t('The user can directly contact the writer of the books via Gmail.')}</li>
                                    <li>{t('When faced with any technical problem, the user can contact the customer service.')}</li>
                                </ul>
                            </div>

                            {/* القسم الثاني: الأشياء المحظورة قانونياً */}
                            <div className="space-y-4 pt-4 border-t border-[#2d1b42]">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {t('Things that are legally prohibited on the website:')}
                                </h3>
                                <ul className={`list-decimal list-inside text-gray-300 text-base space-y-3 ${isRtl ? 'pr-2' : 'pl-2'}`}>
                                    <li>
                                        <span className="text-white mb-2 font-medium">{t('Impolite language:')} </span>
                                        {t('Using any form of language that is considered impolite, such as swear words. When this is done, the comment and/or opinion will be immediately deleted.')}
                                    </li>
                                    <li>
                                        <span className="text-white mb-2 font-medium">{t('Intellectual property theft:')} </span>
                                        {t('Stealing any of the books or works displayed on the website. When this is done, legal actions will be taken against the user.')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* عرض محتوى Privacy Policy */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold text-white mb-6 border-b border-[#2d1b42] pb-2">
                                {t('Privacy Policy Title')}
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-base">
                                {t('Privacy Policy Content 1')}
                            </p>
                            <p className="text-gray-300 leading-relaxed text-base">
                                {t('Privacy Policy Content 2')}
                            </p>
                            <p className="text-gray-300 leading-relaxed text-base">
                                {t('Privacy Policy Content 3')}
                            </p>
                        </div>
                    )}

                </div>

            </main>

            {/* الفوتر */}
            <footer className="w-full bg-[#0d0714] border-t border-[#2d1b42] py-4 px-8 text-center text-xs text-gray-500">
                © 2026 An Owl of Dawn. All Rights Reserved
            </footer>
        </div>
    );
}

export default Aboutus;