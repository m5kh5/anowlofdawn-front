import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "https://anowlofdawn.onrender.com";

// ⚠️ غيّر هذا لمسار صفحة الشراء الفعلي عندك في الـ Router
const PURCHASE_PATH = "/purchase";
const LOGIN_PATH = "/login";

/* ============================================================
   1) جلب صفحات الكتاب من السيرفر (محمية بالـ token)
   ============================================================ */
export function useSecurePages({ bookId, lang, currentPageIndex, totalItems }) {
  const navigate = useNavigate();
  const [currentSrc, setCurrentSrc] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const cacheRef = useRef({}); // رقم الصفحة -> Promise يرجع رابط مؤقت
  const urlsRef = useRef([]);  // كل الروابط المؤقتة لتنظيفها لاحقا

  const loadPage = useCallback((n) => {
    if (!cacheRef.current[n]) {
      cacheRef.current[n] = (async () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("401");
        const res = await fetch(`${API_URL}/api/page/${bookId}/${lang}/${n}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(String(res.status));
        const url = URL.createObjectURL(await res.blob());
        urlsRef.current.push(url);
        return url;
      })().catch((err) => {
        delete cacheRef.current[n];
        throw err;
      });
    }
    return cacheRef.current[n];
  }, [bookId, lang]);

  useEffect(() => {
    let cancelled = false;
    const n = currentPageIndex + 1; // الصفحات على السيرفر تبدأ من 1

    setCurrentSrc(null);
    setLoadFailed(false);

    loadPage(n)
      .then((url) => {
        if (!cancelled) setCurrentSrc(url);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.message === "401") {
          localStorage.removeItem("token");
          navigate(LOGIN_PATH);
        } else if (err.message === "403") {
          navigate(PURCHASE_PATH);
        } else {
          setLoadFailed(true);
        }
      });

    // تحميل مسبق للصفحات القريبة
    [n + 1, n + 2, n - 1].forEach((p) => {
      if (p >= 1 && p <= totalItems) loadPage(p).catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [currentPageIndex, loadPage, navigate, totalItems]);

  // تنظيف الروابط المؤقتة عند الخروج من الصفحة
  useEffect(() => {
    return () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlsRef.current = [];
      cacheRef.current = {};
    };
  }, []);

  return { currentSrc, loadFailed };
}

/* ============================================================
   2) الزوم (عجلة الماوس + قرص باللمس + سحب) مع التركيز على نقطة المؤشر
   + سحب لقلب الصفحات عندما لا يوجد زوم
   ============================================================ */
const clampZoom = (z) => Math.min(4, Math.max(1, +z.toFixed(2)));
const getDist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

export function useZoom(isFullscreen, onNext, onPrev) {
  const [zoom, setZoom] = useState(1);

  const zoomWrapRef = useRef(null);
  const focusRef = useRef(null);
  const pinchStartDist = useRef(null);
  const pinchStartZoom = useRef(1);
  const multiTouch = useRef(false);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const touchStartX = useRef(0);

  const resetZoom = useCallback(() => {
    focusRef.current = null;
    pinchStartDist.current = null;
    multiTouch.current = false;
    dragging.current = false;
    setZoom(1);
  }, []);

  // نحفظ أي نقطة من الصورة كانت تحت المؤشر قبل التكبير
  const setFocus = (clientX, clientY) => {
    const img = zoomWrapRef.current?.querySelector('img');
    if (!img) return;
    const r = img.getBoundingClientRect();
    if (!r.width || !r.height) return;
    focusRef.current = {
      clientX,
      clientY,
      rx: (clientX - r.left) / r.width,
      ry: (clientY - r.top) / r.height,
    };
  };

  // بعد ما يتغير حجم الصورة، نحرك السكرول بحيث تبقى نفس النقطة تحت المؤشر
  useLayoutEffect(() => {
    const el = zoomWrapRef.current;
    const f = focusRef.current;
    focusRef.current = null;
    if (!el || !f) return;
    const img = el.querySelector('img');
    if (!img) return;
    const r = img.getBoundingClientRect();
    el.scrollLeft += r.left + f.rx * r.width - f.clientX;
    el.scrollTop += r.top + f.ry * r.height - f.clientY;
  }, [zoom]);

  // ---- الماوس ----
  const onWheel = (e) => {
    if (!isFullscreen) return;
    setFocus(e.clientX, e.clientY);
    setZoom((z) => clampZoom(z - e.deltaY * 0.002));
  };

  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!dragging.current || !zoomWrapRef.current) return;
    zoomWrapRef.current.scrollLeft -= e.clientX - lastPos.current.x;
    zoomWrapRef.current.scrollTop -= e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  // ---- اللمس ----
  const onTouchStart = (e) => {
    if (e.touches.length >= 2) {
      multiTouch.current = true;
      if (isFullscreen) {
        pinchStartDist.current = getDist(e.touches);
        pinchStartZoom.current = zoom;
      }
      return;
    }
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDist.current) {
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setFocus(cx, cy);
      setZoom(clampZoom(pinchStartZoom.current * (getDist(e.touches) / pinchStartDist.current)));
    }
  };

  const onTouchEnd = (e) => {
    if (multiTouch.current) {
      if (e.touches.length === 0) {
        multiTouch.current = false;
        pinchStartDist.current = null;
      }
      return; // لا تقلب الصفحة بعد القرص
    }
    if (isFullscreen && zoom > 1) return; // وأنت مكبّر السحب للتحرك مو لقلب الصفحة

    const distance = touchStartX.current - e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (distance > swipeThreshold) onNext();
    else if (distance < -swipeThreshold) onPrev();
  };

  return {
    zoom,
    zoomWrapRef,
    resetZoom,
    zoomHandlers: { onWheel, onMouseDown, onMouseMove, onMouseUp: stopDrag, onMouseLeave: stopDrag },
    touchHandlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}