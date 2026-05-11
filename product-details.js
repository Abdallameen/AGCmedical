// product-details.js - الإصدار النهائي الذي يعمل مباشرةً مع الـ API وأعمدة Excel

const API_URL = 'https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1';
let currentLang = localStorage.getItem('currentLang') || 'ar';

async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    if (!container) return;

    // 1. عرض حالة التحميل
    container.innerHTML = `<div style="text-align:center;padding:60px;">⏳ ${currentLang === 'ar' ? 'جاري تحميل بيانات المنتج...' : 'Loading product details...'}</div>`;

    // 2. الحصول على ID المنتج من الرابط
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    if (!productId) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'لم يتم تحديد المنتج' : 'No product selected'}<br><a href="index.html" style="color:#0d6efd;">← ${currentLang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</a></div>`;
        return;
    }

    try {
        // 3. جلب جميع البيانات من الـ API مباشرة
        console.log("جاري تحميل البيانات من API...");
        const response = await fetch(API_URL);
        const allProducts = await response.json();
        console.log("تم تحميل", allProducts.length, "منتج من API");

        // 4. البحث عن المنتج باستخدام ID (ترتيبه في المصفوفة)
        const productIndex = parseInt(productId);
        if (productIndex >= 0 && productIndex < allProducts.length) {
            const product = allProducts[productIndex];
            displayProduct(product);
        } else {
            throw new Error("Product not found");
        }

    } catch (error) {
        console.error("خطأ في التحميل:", error);
        container.innerHTML = `<div style="text-align:center;padding:60px;">⚠️ ${currentLang === 'ar' ? 'خطأ في تحميل بيانات المنتج' : 'Error loading product data'}<br><a href="index.html" style="color:#0d6efd;">← ${currentLang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</a></div>`;
    }
}

function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    // قراءة البيانات حسب اللغة من الأعمدة الصحيحة في Excel
    const name = currentLang === 'ar' ? (product.name_ar || '') : (product.name_en || product.name_ar || '');
    const desc = currentLang === 'ar' ? (product.desc_ar || '') : (product.desc_en || product.desc_ar || '');
    const details = currentLang === 'ar' ? (product.details_ar || '') : (product.details_en || product.details_ar || '');
    const specs = currentLang === 'ar' ? (product.specs_ar || '') : (product.specs_en || product.specs_ar || '');
    const warranty = currentLang === 'ar' ? (product.warranty_ar || '') : (product.warranty_en || product.warranty_ar || '');
    const supply = currentLang === 'ar' ? (product.supply_ar || '') : (product.supply_en || product.supply_ar || '');
    const isInstant = String(product.isInstant).toUpperCase() === 'TRUE';
    const price = product.price || (currentLang === 'ar' ? 'غير محدد' : 'Not specified');
    const imgSrc = product.img || 'https://via.placeholder.com/500x400?text=No+Image';

    // دالة لتنسيق النص (تحويل السطور والنقاط)
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/^\* (.*)$/gm, '• $1').replace(/^\- (.*)$/gm, '• $1');
    }

    // عناوين الأقسام حسب اللغة
    const detailsTitle = currentLang === 'ar' ? '📋 تفاصيل المنتج' : '📋 Product Details';
    const specsTitle = currentLang === 'ar' ? '⚙️ المواصفات التقنية' : '⚙️ Technical Specifications';
    const warrantyTitle = currentLang === 'ar' ? '🛡️ الضمان' : '🛡️ Warranty';
    const orderText = currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp';
    const instantText = currentLang === 'ar' ? 'توريد فوري' : 'Instant Supply';

    // بناء HTML المعروض
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${imgSrc}" alt="${name}" onerror="this.src='https://via.placeholder.com/500x400?text=Image+Error'">
                </div>
                <div class="product-detail-info">
                    <h1>${name || 'No Name'}</h1>
                    ${desc ? `<p style="color:#666; line-height:1.8; margin:15px 0;">${desc}</p>` : ''}
                    
                    <div class="product-detail-price">💰 ${price} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>
                    
                    ${supply ? `<div class="product-detail-supply">📦 ${supply}</div>` : ''}
                    
                    ${isInstant ? `<div class="instant-badge-large">⚡ ${instantText}</div>` : ''}
                    
                    ${details ? `<div class="info-section"><h3><i class="fas fa-info-circle"></i> ${detailsTitle}</h3><div class="info-content">${formatText(details)}</div></div>` : ''}
                    ${specs ? `<div class="info-section"><h3><i class="fas fa-microchip"></i> ${specsTitle}</h3><div class="info-content">${formatText(specs)}</div></div>` : ''}
                    ${warranty ? `<div class="info-section"><h3><i class="fas fa-shield-alt"></i> ${warrantyTitle}</h3><div class="info-content">${formatText(warranty)}</div></div>` : ''}
                    
                    <button onclick="orderProduct(${product.id ? product.id : 0})" class="btn-whatsapp-large">
                        <i class="fab fa-whatsapp"></i> ${orderText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// دالة الطلب عبر واتساب
window.orderProduct = function(id) {
    fetch(API_URL)
        .then(res => res.json())
        .then(allProducts => {
            const product = allProducts[id];
            if (!product) return;
            
            const name = currentLang === 'ar' ? (product.name_ar || '') : (product.name_en || product.name_ar || '');
            const specs = currentLang === 'ar' ? (product.specs_ar || '') : (product.specs_en || product.specs_ar || '');
            
            let message = `📋 طلب شراء منتج - AGC\n\n`;
            message += `🏷️ المنتج: ${name}\n`;
            message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
            if (specs) message += `\n⚙️ المواصفات:\n${specs.substring(0, 300)}\n`;
            message += `\n👤 بيانات العميل:\nالاسم: \nرقم الجوال: \nالعنوان: \n`;
            
            window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
        });
};

// بدء تحميل الصفحة
loadProductDetails();
