import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Purchase() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || "https://anowlofdawn.onrender.com";

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [purchaseType, setPurchaseType] = useState('digital');
    const [hasAccess, setHasAccess] = useState(false);

    //(priceBHD * 2.65).toFixed(2);
    const priceBHD = 0.35;
    const roundedUSD =7

    // 1. مصفوفة الكتب
const books = ["BOOK1", "BOOK2", "BOOK3"];

// 2. حالة الكتاب المحدد (موجودة أو أضفها):
const [selectedBookId, setSelectedBookId] = useState("BOOK1");

const handleBookSelect = (book) => {
    if (selectedBookId !== book) {
        setSelectedBookId(book);
        setHasAccess(false);
        setErrorMessage("");
        setStep(1)
    }
};


    useEffect(() => {
        const checkUserAccess = async () => {
            setLoading(false);
    setErrorMessage("");
            const email = localStorage.getItem("useremail");
            if (!email) {
        // تحويل المستخدم لصفحة تسجيل الدخول إذا لم يكن مسجلاً
        navigate("/login");
        return;}
           
            try {
                const res = await fetch(`${API_URL}/api/check-access?email=${email}&bookId=${selectedBookId}`);
                if (res.ok) {
                    const data = await res.json();
                    setHasAccess(data.hasAccess);
                    
                    if (data.hasAccess) {
  // تحويل مباشر للقراءة دون المرور بصفحة الشراء
  const lang = i18n.language === 'ar' ? 'ar' : 'eng';
  navigate(`/${selectedBookId.toLowerCase()}${lang}`);
}
                }
                
            } catch (error) {
                console.error("Error checking access:", error);
            } finally {
                setLoading(false);
            }
        };

        checkUserAccess();
    }, [API_URL,navigate,selectedBookId]);

    const handleShipping = () => {
        alert(t("Redirecting to shipping details..."));
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#0d0714] flex justify-center items-center text-[#a78bfa]">
                <p className="text-lg font-bold">{t("Loading...")}</p>
            </div>
        );
    }
    // إذا اختار المستخدم BOOK2 أو BOOK3، نعرض له هذه الصفحة المنفصلة تماماً
if (selectedBookId === 'BOOK2' || selectedBookId === 'BOOK3') {
    return (
        <div className="min-h-screen bg-[#0d0714] text-white flex flex-col items-center justify-center p-4">
            {/* شريط اختيار الكتب للتنقل بينها */}
            <div className="flex justify-center items-center gap-1.5 mb-8 bg-[#130b21] p-1.5 rounded-lg border border-[#2d1b42]">
                {books.map((book) => (
                    <button
                        key={book}
                        type="button"
                        onClick={() => setSelectedBookId(book)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            selectedBookId === book
                                ? 'bg-[#a78bfa] text-black shadow-sm'
                                : 'text-gray-400 hover:text-white bg-transparent'
                        }`}
                    >
                        {book}
                    </button>
                ))}
            </div>

            {/* كارت الصفحة المنفصلة */}
            <div className="max-w-md w-full bg-[#130b21] p-8 rounded-2xl border border-[#2d1b42] text-center shadow-xl">
                <div className="w-16 h-16 bg-[#2d1b42] text-[#a78bfa] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    📖
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                    {selectedBookId} غير متاح حالياً
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    هذا الكتاب قيد الإعداد والطباعة وسيتم إطلاقه قريباً. يمكنك العودة وقراءة الكتاب الأول المتاح حالياً.
                </p>
                <button
                    type="button"
                    onClick={() => setSelectedBookId('BOOK1')}
                    className="w-full py-3 bg-[#a78bfa] text-black font-bold rounded-xl hover:bg-[#bcb2ff] transition-all cursor-pointer"
                >
                    العودة للكتاب الأول (BOOK1)
                </button>
            </div>
        </div>
    );
}

    return (
        <PayPalScriptProvider options={{ "client-id" :import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
            <div className="w-full min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans flex flex-col justify-between overflow-hidden" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                
                {/* Navbar */}
                <nav className="bg-[#160d22]/95 backdrop-blur-md border-b border-[#2d1b42] px-8 py-4 flex justify-between items-center">
                    {step === 1 ? (
                        <Link to="/" className="text-sm font-medium text-[#a78bfa] hover:underline">
                            {t('← Home')}
                        </Link>
                    ) : (
                        <button 
                            onClick={() => {
                                setStep(1);
                                setErrorMessage("");
                            }} 
                            className="text-sm font-medium text-[#a78bfa] hover:underline cursor-pointer bg-transparent border-0"
                        >
                            {t('← Back to Options')}
                        </button>
                    )}
                    <div className="text-2xl font-black tracking-wider text-[#cbd5e1]">
                        An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-grow flex flex-col justify-center items-center">
                    
                    
                    {/* Step 1: Choice */}
                    {step === 1 && (
                        <div className="w-full max-w-2xl bg-[#160d22] p-8 rounded-xl border border-[#2d1b42] shadow-xl">
                            <h2 className="text-2xl font-extrabold text-white mb-2 text-center">
                                {t('Complete Your Purchase')}
                            </h2>
                            <p className="text-gray-400 text-sm text-center mb-8">
                                {t('Please select your preferred book format to proceed')}
                            </p>
                            {/* --- شريط أزرار صغير مدمج للغاية --- */}
<div className="flex justify-center items-center gap-1.5 mb-6 bg-[#0d0714] p-1 rounded-lg border border-[#2d1b42] w-fit mx-auto">
    {books.map((book) => (
        <button
            key={book}
            type="button"
            onClick={() =>{ setSelectedBookId(book);
            setHasAccess(false);
            setErrorMessage(""); 
  setStep(1);          
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                selectedBookId === book
                    ? 'bg-[#a78bfa] text-black shadow-sm'
                    : 'text-gray-400 hover:text-white bg-transparent'
            }`}
        >
            {book}
        </button>
    ))}
</div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div 
                                    onClick={() => setPurchaseType('digital')}
                                    className={`cursor-pointer p-6 rounded-xl border transition-all flex flex-col items-center justify-center text-center ${
                                        purchaseType === 'digital'
                                        ? 'border-[#a78bfa] bg-[#2d1b42]/40 shadow-lg shadow-[#a78bfa]/5'
                                        : 'border-[#2d1b42] bg-[#0d0714] hover:border-gray-600'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${purchaseType === 'digital' ? 'bg-[#a78bfa] text-black' : 'bg-[#160d22] text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-white block mb-1">{t('Digital Edition')}</span>
                                    <span className="text-xs text-gray-400">{t('Read instantly on the website')}</span>
                                </div>

                                <div 
                                    onClick={() => setPurchaseType('physical')}
                                    className={`cursor-pointer p-6 rounded-xl border transition-all flex flex-col items-center justify-center text-center ${
                                        purchaseType === 'physical'
                                        ? 'border-[#a78bfa] bg-[#2d1b42]/40 shadow-lg shadow-[#a78bfa]/5'
                                        : 'border-[#2d1b42] bg-[#0d0714] hover:border-gray-600'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${purchaseType === 'physical' ? 'bg-[#a78bfa] text-black' : 'bg-[#160d22] text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-white block mb-1">{t('Physical Book')}</span>
                                    <span className="text-xs text-gray-400">{t('High-quality printed version that can be delivered to you')}</span>
                                </div>
                            </div>

                            <div className="bg-[#0d0714] p-6 rounded-lg border border-[#2d1b42] mb-6">
                                {purchaseType === 'digital' ? (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-[#a78bfa] uppercase tracking-wider">{t('Digital Benefits')}</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                            <li>{t('Instant access upon payment approval')}</li>
                                            <li>{t('No shipping fees')}</li>
                                            <li>{t('Lifetime updates')}</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-[#a78bfa] uppercase tracking-wider">{t('Shipping Information')}</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                            <li>{t('Delivery within 3-5 business days')}</li>
                                            <li>{t('Secure packaging to protect the book')}</li>
                                            <li>{t('Tracking number provided via email')}</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {purchaseType === 'digital' ? (
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full py-3.5 bg-[#a78bfa] text-black font-bold rounded-lg text-sm transition-all hover:bg-[#bcb2ff] hover:shadow-lg hover:shadow-[#a78bfa]/20 cursor-pointer"
                                >
                                    {t('Proceed to Digital Access')}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleShipping}
                                    className="w-full py-3.5 bg-[#a78bfa] text-black font-bold rounded-lg text-sm transition-all hover:bg-[#bcb2ff] hover:shadow-lg hover:shadow-[#a78bfa]/20 cursor-pointer"
                                >
                                    {t('Proceed to Shipping Details')}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 2: Payment & Confirmation */}
                    {step === 2 && (
                        <>
                            {!hasAccess ? (
                                <div className="w-full max-w-xl bg-[#160d22] p-8 rounded-xl border border-[#2d1b42] shadow-xl text-center">
                                    <h2 className="text-2xl font-extrabold text-white mb-2">
                                        {t('Digital Access Payment')}
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        {t('Complete your payment via PayPal to unlock immediate access to the chapter.')}
                                    </p>

                                    {errorMessage && (
                                        <div className="mb-4 p-3 bg-red-900/40 border border-red-500 rounded text-red-200 text-xs">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <div className="bg-[#0d0714] p-6 rounded-lg border border-[#2d1b42] mb-6 flex justify-between items-center">
                                        <div className="text-left">
                                            <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                                {t('Item')}
                                            </span>
                                            <span className="text-base font-bold text-white">
                                                {t('Digital Chapter Access')}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-[#a78bfa] block">
                                                {priceBHD.toFixed(3)} BHD
                                            </span>
                                            <span className="text-xs text-gray-400 block">
                                                (≈ ${roundedUSD} USD)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider block mb-3 text-left">
                                            {t('Select Payment Method')}
                                        </label>
                                        <div className="p-4 rounded-xl border border-[#a78bfa] bg-[#2d1b42]/40 shadow-lg shadow-[#a78bfa]/5 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow">
                                                    <svg className="w-full h-full text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.761.761 0 0 1 .752-.638h7.243c2.4 0 4.298.543 5.39 1.543 1.037.95 1.373 2.378.948 4.02-.022.086-.048.172-.075.257-.61 2.39-2.185 4.062-4.557 4.834a9.7 9.7 0 0 1-3.082.443H8.928a.76.76 0 0 0-.751.638l-.94 5.92a.64.64 0 0 1-.161.602z"/>
                                                    </svg>
                                                </div>
                                                <span className="font-bold text-white text-sm">PayPal</span>
                                            </div>
                                            <span className="text-xs text-[#a78bfa] bg-[#a78bfa]/10 px-2.5 py-1 rounded-full border border-[#a78bfa]/30 font-medium">
                                                {t('Selected')}
                                            </span>
                                        </div>
                                    </div>

                                    {processingPayment ? (
                                        <div className="py-4 text-[#a78bfa] text-sm animate-pulse">
                                            {t("Verifying your payment, please wait...")}
                                        </div>
                                    ) : (
                                        <PayPalButtons
                                            style={{ layout: "vertical", color: "gold", shape: "rect" }}
                                            createOrder={async () => {
                                                setErrorMessage("");
                                                const email = localStorage.getItem("useremail");
                                                
                                                if (!email) {
                                                    setErrorMessage(t("Please log in before completing the purchase."));
                                                    throw new Error("User email not found");
                                                }

                                                try {
                                                    const response = await fetch(`${API_URL}/api/create-paypal-order`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ bookId: selectedBookId, email })
                                                    });
                                                    
                                                    if (!response.ok) {
                                                        throw new Error("Failed to create PayPal order");
                                                    }

                                                    const order = await response.json();
                                                    return order.id;
                                                } catch (err) {
                                                    setErrorMessage(t("Could not initialize order. Please try again."));
                                                    throw err;
                                                }
                                            }}
                                            onApprove={async (data, actions) => {
                                                setProcessingPayment(true);
                                                const email = localStorage.getItem("useremail");
                                                try {
                                                    const response = await fetch(`${API_URL}/api/orders`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ orderID: data.orderID, email ,bookId: selectedBookId}),
                                                    });
                                                    
                                                    const result = await response.json();

                                                    if (result.success) {
                                                        setHasAccess(true);
                                                        const lang = i18n.language === 'ar' ? 'ar' : 'eng';
                                                        navigate(`/${selectedBookId.toLowerCase()}${lang}`);
                                                    } else {
                                                        setErrorMessage(t("Payment verification failed. Please contact support."));
                                                    }
                                                } catch (error) {
                                                    console.error("Error confirming payment:", error);
                                                    setErrorMessage(t("Server connection error. Please try again."));
                                                } finally {
                                                    setProcessingPayment(false);
                                                }
                                            }}
                                            onError={(err) => {
                                                console.error("PayPal Error:", err);
                                                setErrorMessage(t("An error occurred with PayPal. Please try again."));
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-full max-w-2xl bg-[#160d22] p-8 rounded-xl border border-[#a78bfa] shadow-2xl text-center space-y-6">
                                    <div className="w-16 h-16 bg-[#a78bfa]/20 border border-[#a78bfa] rounded-full flex items-center justify-center mx-auto text-[#a78bfa]">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <h2 className="text-2xl font-black text-white">
                                        {t('Payment Successful!')}
                                    </h2>
                                    <p className="text-gray-300 text-sm">
                                        {t('Thank you for your purchase. You now have full digital access to the chapter.')}
                                    </p>

                                    <div className="p-6 bg-[#0d0714] rounded-lg border border-[#2d1b42] text-left">
                                        <h3 className="text-lg font-bold text-[#a78bfa] mb-2">
                                            {t('Chapter Access Unlocked')}
                                        </h3>
                                        <p className="text-xs text-gray-400 mb-4">
                                            {t('Click below to start reading the digital content directly in your browser.')}
                                        </p>
                                        
                                        <Link 
    to={i18n.language === 'ar' ? `/${selectedBookId.toLowerCase()}ar` : `/${selectedBookId.toLowerCase()}eng`} 
    className="block text-center w-full py-3 bg-[#a78bfa] text-black font-bold rounded-lg text-sm hover:bg-[#bcb2ff] transition-all"
>
    {t('Start Reading')} {selectedBookId}
</Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </main>

                {/* Footer */}
                <footer className="w-full bg-[#0d0714] border-t border-[#2d1b42] py-4 px-8 text-center text-xs text-gray-500">
                    © 2026 An Owl of Dawn. All Rights Reserved
                </footer>
            </div>
        </PayPalScriptProvider> 
    );
}

export default Purchase;