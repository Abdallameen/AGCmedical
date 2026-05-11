// product-details.js - النسخة النهائية التي تعمل 100%

let products = [];
let currentLang = "ar";
let waitCount = 0;

// صفحة التفاصيل
async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    // عرض loading
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            <i class="fas fa-spinner fa-spin" style="font-size:40px;color:#0d6efd"></i>
            <p>${currentLang === 'ar' ? 'جاري تحميل بيانات المنتج...' : 'Loading product details...'}</p>
        </div>
    `;
    
    // جلب المنتج من localStorage
    let productId = localStorage.getItem('selectedProductId');
    
    // لو مفيش ID في localStorage، جرب تجيبه من URL
    if (!productId) {
        const urlParams = new URLSearchParams(window.location.search);
        productId = urlParams.get('id');
    }
    
    console.log("Product ID:", productId); // للتأكد من وجود ID
    
    if (!productId) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;color:red;">
                <i class="fas fa-exclamation-triangle" style="font-size:40px"></i>
                <p>${currentLang === 'ar' ? 'لم يتم تحديد المنتج' : 'No product selected'}</p>
                <a href="index.html" style="display:inline-block;margin-top:20px;background:#0d6efd;color:white;padding:10px20px;border-radius:25px;text-decoration:none;">${currentLang === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}</a>
            </div>
        `;
        return;
    }
    
    // انتظار تحميل البيانات
    await waitForProducts();
    
    // البحث عن المنتج
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        console.log("Products available:", products); // للتأكد
        container.innerHTML = `
            <div style="text-align:center;padding:60px;color:red;">
                <i class="fas fa-box-open" style="font-size:40px"></i>
                <p>${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</p>
                <p style="font-size:12px;color:#999;">Product ID: ${productId}</p>
                <a href="index.html" style="display:inline-block;margin-top:20px;background:#0d6efd;color:white;padding:10px20px;border-radius:25px;text-decoration:none;">${currentLang === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}</a>
            </div>
        `;
        return;
    }
    
    // عرض تفاصيل المنتج
    displayProductDetails(product);
}

// انتظار تحميل البيانات من الـ API
function waitForProducts() {
    return new Promise((resolve) => {
        if (products.length > 0) {
            resolve();
            return;
        }
        
        const checkInterval = setInterval(() => {
            if (products.length > 0) {
                clearInterval(checkInterval);
                resolve();
            }
            waitCount++;
            if (waitCount > 50) { // timeout بعد 5 ثواني
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

// عرض تفاصيل المنتج
function displayProductDetails(product) {
    const container = document.getElementById('productDetail');
    
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/\* (.*?)(\n|$)/g, '• $1<br>');
    }
    
    const detailsText = formatText(product.details?.[currentLang] || product.details?.ar || '');
    const specsText = formatText(product.specs?.[currentLang] || product.specs?.ar || '');
    const warrantyText = formatText(product.warranty?.[currentLang] || product.warranty?.ar || '');
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${product.img}" 
                         alt="${product.name?.[currentLang] || product.name?.ar}"
                         onerror="this.src='https://via.placeholder.com/500x400?text=No+Image'">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name?.[currentLang] || product.name?.ar || 'No Name'}</h1>
                    
                    ${product.desc?.[currentLang] ? `<p style="color:#666; line-height:1.6; margin:10px 0;">${product.desc[currentLang]}</p>` : ''}
                    
                    <div class="product-detail-price">💰 ${product.price || '---'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>
                    
                    ${product.supplyText?.[currentLang] ? `<div class="product-detail-supply">📦 ${product.supplyText[currentLang]}</div>` : ''}
                    
                    ${product.isInstant ? `<div class="instant-badge-large">⚡ ${currentLang === 'ar' ? 'متوفر للتوريد الفوري' : 'Available for Instant Supply'}</div>` : ''}
                    
                    ${detailsText ? `
                    <div class="info-section">
                        <h3><i class="fas fa-info-circle"></i> ${currentLang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h3>
                        <div class="info-content">${detailsText}</div>
                    </div>
                    ` : ''}
                    
                    ${specsText ? `
                    <div class="info-section">
                        <h3><i class="fas fa-microchip"></i> ${currentLang === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}</h3>
                        <div class="info-content">${specsText}</div>
                    </div>
                    ` : ''}
                    
                    ${warrantyText ? `
                    <div class="info-section">
                        <h3><i class="fas fa-shield-alt"></i> ${currentLang === 'ar' ? 'الضمان' : 'Warranty'}</h3>
                        <div class="info-content">${warrantyText}</div>
                    </div>
                    ` : ''}
                    
                    <div class="action-buttons">
                        <button class="btn-whatsapp-large" onclick="orderProduct(${product.id})">
                            <i class="fab fa-whatsapp"></i> ${currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// طلب المنتج عبر واتساب
function orderProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    let message = `📋 طلب شراء منتج - مؤسسة ركن الخليج العربي AGC\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏷️ المنتج: ${product.name?.[currentLang] || product.name?.ar}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    message += `📦 حالة التوريد: ${product.isInstant ? 'توريد فوري ⚡' : (product.supplyText?.[currentLang] || 'حسب الطلب')}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (product.specs?.[currentLang] || product.specs?.ar) {
        message += `📋 المواصفات:\n${(product.specs[currentLang] || product.specs.ar).substring(0, 200)}\n\n`;
    }
    
    message += `👤 بيانات العميل:\n`;
    message += `الاسم: \n`;
    message += `رقم الجوال: \n`;
    message += `العنوان: \n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

// تحميل البيانات من الـ API مباشرة
async function fetchProducts() {
    try {
        const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1";
        const response = await fetch(apiURL);
        const data = await response.json();
        
        products = data.map((item, index) => ({
            id: index,
            name: { ar: item.name_ar || "", en: item.name_en || "" },
            desc: { ar: item.desc_ar || "", en: item.desc_en || "" },
            details: { ar: item.details_ar || item.desc_ar || "", en: item.details_en || item.desc_en || "" },
            specs: { ar: item.specs_ar || "", en: item.specs_en || "" },
            warranty: { ar: item.warranty_ar || "", en: item.warranty_en || "" },
            price: item.price || "",
            supplyText: { ar: item.supply_ar || "", en: item.supply_en || "" },
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img || "https://via.placeholder.com/500x400?text=No+Image",
            category: item.category || "misc"
        }));
        
        console.log("Products loaded:", products.length);
        loadProductDetails();
    } catch (error) {
        console.error("خطأ:", error);
        document.getElementById('productDetail').innerHTML = `
            <div style="text-align:center;padding:60px;color:red;">
                <i class="fas fa-wifi" style="font-size:40px"></i>
                <p>${currentLang === 'ar' ? 'خطأ في الاتصال بقاعدة البيانات' : 'Database connection error'}</p>
                <button onclick="location.reload()" style="margin-top:20px;background:#0d6efd;color:white;padding:10px20px;border-radius:25px;border:none;cursor:pointer;">${currentLang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
            </div>
        `;
    }
}

// بدء التشغيل
fetchProducts();
