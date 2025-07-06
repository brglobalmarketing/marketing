// Sticky Banner - Final Version
(function() {
    'use strict';
    
    // Eğer banner zaten varsa, önce kaldır
    const existingBanner = document.querySelector('.sticky-banner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    // Mevcut stilleri kaldır
    const existingStyle = document.querySelector('#sticky-banner-style');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // CSS stillerini ekle
    const style = document.createElement('style');
    style.id = 'sticky-banner-style';
    style.textContent = `
        .sticky-banner {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 1000px;
            max-width: 95vw;
            height: 90px;
            z-index: 9999;
            transition: transform 0.3s ease-in-out;
        }
        
        .sticky-banner.hidden {
            transform: translateX(-50%) translateY(100%);
        }
        
        .banner-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .banner-content {
            cursor: pointer;
            display: block;
            width: 100%;
            height: 100%;
            transition: opacity 0.3s ease;
        }
        
        .banner-content:hover {
            opacity: 0.9;
        }
        
        .banner-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
        
        .close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0,0,0,0.8);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10000;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .close-button:hover {
            background: rgba(0,0,0,0.9);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 1024px) {
            .sticky-banner {
                width: 95vw;
                height: calc(95vw * 0.09);
            }
            
            .close-button {
                width: 20px;
                height: 20px;
                font-size: 12px;
                top: 3px;
                right: 3px;
            }
        }
        
        @media (max-width: 768px) {
            .sticky-banner {
                width: 98vw;
                height: calc(98vw * 0.09);
            }
            
            .close-button {
                width: 18px;
                height: 18px;
                font-size: 11px;
                top: 2px;
                right: 2px;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Domain ismini çek (uzantısız)
    function getSiteName() {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        
        // www kaldır
        if (parts[0] === 'www') {
            parts.shift();
        }
        
        // Ana domain ismini al (uzantısız)
        return parts[0] || 'unknown';
    }
    
    // UTM parametreli URL oluştur
    function createTrackingUrl() {
        const siteName = getSiteName();
        const baseUrl = 'https://bit.ly/3IvvUTR';
        const utmParams = `?utm_source=blogs&utm_referrer=${siteName}`;
        
        return baseUrl + utmParams;
    }
    
    // Banner oluştur
    const banner = document.createElement('div');
    banner.className = 'sticky-banner';
    banner.innerHTML = `
        <div class="banner-container">
            <a href="#" class="banner-content">
                <img src="https://raw.githubusercontent.com/brglobalmarketing/marketing/refs/heads/main/.github/workflows/1000x90.gif" 
                     alt="Banner" 
                     class="banner-image"
                     onerror="this.style.display='none'">
            </a>
            <button class="close-button" title="Kapat">×</button>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Body padding ekle
    const originalPadding = document.body.style.paddingBottom;
    document.body.style.paddingBottom = '100px';
    
    // Event listener'lar
    const closeButton = banner.querySelector('.close-button');
    const bannerContent = banner.querySelector('.banner-content');
    
    // Banner durumu için sessionStorage yerine sadece geçici değişken kullan
    let isBannerClosed = false;
    
    function closeBanner() {
        banner.classList.add('hidden');
        isBannerClosed = true;
        setTimeout(() => {
            document.body.style.paddingBottom = originalPadding;
        }, 300);
    }
    
    // Sayfa değişikliklerini izle (History API)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(() => {
            if (isBannerClosed) {
                showBanner();
            }
        }, 100);
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(() => {
            if (isBannerClosed) {
                showBanner();
            }
        }, 100);
    };
    
    // Popstate event (geri/ileri butonları)
    window.addEventListener('popstate', function() {
        setTimeout(() => {
            if (isBannerClosed) {
                showBanner();
            }
        }, 100);
    });
    
    function showBanner() {
        banner.classList.remove('hidden');
        isBannerClosed = false;
        document.body.style.paddingBottom = '100px';
    }
    
    // Close button tıklama
    closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeBanner();
    });
    
    // Banner tıklama - UTM parametreli URL ile yönlendir (aynı sayfada)
    bannerContent.addEventListener('click', function(e) {
        e.preventDefault();
        const trackingUrl = createTrackingUrl();
        window.location.href = trackingUrl;
    });
    
    // Escape tuşu ile kapatma
    function handleEscape(e) {
        if (e.key === 'Escape' && !banner.classList.contains('hidden')) {
            closeBanner();
        }
    }
    
    document.addEventListener('keydown', handleEscape);
    
    // Global değişken olarak banner kontrolü için
    window.stickyBannerControl = {
        close: closeBanner,
        show: showBanner,
        remove: function() {
            banner.remove();
            style.remove();
            document.removeEventListener('keydown', handleEscape);
            document.body.style.paddingBottom = originalPadding;
            delete window.stickyBannerControl;
        }
    };
    
})();



