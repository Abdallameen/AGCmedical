// product-details.js - دعم كامل للغتين

let products = [];
let currentLang = "ar";

const API_URL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1";

async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    // جلب اللغة من localStorage أو من الصفحة الرئيسية
    const savedLang = localStorage.getItem('currentLang');
    if (savedLang) currentLang = savedLang;
    
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            <div style="font-size:40px;">⏳</div>
            <p>${currentLang === 'ar' ? 'جاري تحميل بيانات المنتج...' : 'Loading product details...'}</p>
        </div>
    `;
    
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId) productId = localStorage.getItem('selectedProductId');
    
    if (!productId) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'لم يتم تحديد المنتج' : 'No product selected'}</div>`;
        return;
    }
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        products = data.map((item, index) => ({
            id: index,
            name_ar: item.name_ar || "",
            name_en: item.name_en || "",
            desc_ar: item.desc_ar || "",
            desc_en: item.desc_en || "",
            details_ar: item.details_ar || "",
            details_en: item.details_en || "",
            specs_ar: item.specs_ar || "",
            specs_en: item.specs_en || "",
            warranty_ar: item.warranty_ar || "",
            warranty_en: item.warranty_en || "",
            price: item.price || "",
            supply_ar: item.supply_ar || "",
            supply_en: item.supply_en || "",
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img || "",
            category: item.category || "misc"
        }));
        
        const product = products.find(p => p.id == parseInt(productId));
        
        if (!product) {
            container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</div>`;
            return;
        }
        
        displayProduct(product);
        
    } catch (error) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">⚠️ ${currentLang === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}</div>`;
    }
}

function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    // اختيار النصوص حسب اللغة الحالية
    const name = currentLang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
    const desc = currentLang === 'ar' ? product.desc_ar : (product.desc_en || product.desc_ar);
    const details = currentLang === 'ar' ? product.details_ar : (product.details_en || product.details_ar);
    const specs = currentLang === 'ar' ? product.specs_ar : (product.specs_en || product.specs_ar);
    const warranty = currentLang === 'ar' ? product.warranty_ar : (product.warranty_en || product.warranty_ar);
    const supply = currentLang === 'ar' ? product.supply_ar : (product.supply_en || product.supply_ar);
    
    // اختيار العناوين حسب اللغة
    const detailsTitle = currentLang === 'ar' ? '📋 تفاصيل المنتج' : '📋 Product Details';
    const specsTitle = currentLang === 'ar' ? '⚙️ المواصفات التقنية' : '⚙️ Technical Specifications';
    const warrantyTitle = currentLang === 'ar' ? '🛡️ الضمان' : '🛡️ Warranty';
    const orderText = currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp';
    const instantText = currentLang === 'ar' ? 'توريد فوري' : 'Instant Supply';
    
    let imgSrc = product.img;
    if (!imgSrc) imgSrc = "https://via.placeholder.com/500x400?text=No+Image";
    
    function formatText(text) {
        if (!text) return '';
        // تحويل النقاط إلى list items
        let formatted = text.replace(/\n/g, '<br>');
        formatted = formatted.replace(/^\* (.*)$/gm, '• $1');
        formatted = formatted.replace(/^\- (.*)$/gm, '• $1');
        formatted = formatted.replace(/^\d+\. (.*)$/gm, '<strong>$&</strong>');
        return formatted;
    }
    
    // بناء HTML للتفاصيل (تظهر فقط لو فيه بيانات)
    let detailsHTML = '';
    if (details && details.trim() !== '') {
        detailsHTML = `
            <div class="info-section">
                <h3><i class="fas fa-info-circle"></i> ${detailsTitle}</h3>
                <div class="info-content">${formatText(details)}</div>
            </div>
        `;
    }
    
    let specsHTML = '';
    if (specs && specs.trim() !== '') {
        specsHTML = `
            <div class="info-section">
                <h3><i class="fas fa-microchip"></i> ${specsTitle}</h3>
                <div class="info-content">${formatText(specs)}</div>
            </div>
        `;
    }
    
    let warrantyHTML = '';
    if (warranty && warranty.trim() !== '') {
        warrantyHTML = `
            <div class="info-section">
                <h3><i class="fas fa-shield-alt"></i> ${warrantyTitle}</h3>
                <div class="info-content">${formatText(warranty)}</div>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${imgSrc}" alt="${name}" onerror="this.src='https://via.placeholder.com/500x400?text=Image+Error'">
                </div>
                <div class="product-detail-info">
                    <h1>${name}</h1>
                    ${desc ? `<p style="color:#666; line-height:1.8; margin:15px 0;">${desc}</p>` : ''}
                    
                    ${product.price ? `<div class="product-detail-price">💰 ${product.price} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>` : ''}
                    
                    ${supply ? `<div class="product-detail-supply">📦 ${supply}</div>` : ''}
                    
                    ${product.isInstant ? `<div class="instant-badge-large">⚡ ${instantText}</div>` : ''}
                    
                    ${detailsHTML}
                    ${specsHTML}
                    ${warrantyHTML}
                    
                    <button onclick="orderProduct(${product.id})" class="btn-whatsapp-large">
                        <i class="fab fa-whatsapp"></i> ${orderText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function orderProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    const name = currentLang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
    const specs = currentLang === 'ar' ? product.specs_ar : (product.specs_en || product.specs_ar);
    const details = currentLang === 'ar' ? product.details_ar : (product.details_en || product.details_ar);
    
    let message = `📋 طلب شراء منتج - مؤسسة ركن الخليج العربي AGC\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏷️ المنتج: ${name}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (details && details.trim() !== '') {
        message += `📝 تفاصيل المنتج:\n${details.substring(0, 300)}\n\n`;
    }
    
    if (specs && specs.trim() !== '') {
        message += `⚙️ المواصفات:\n${specs.substring(0, 300)}\n\n`;
    }
    
    message += `👤 بيانات العميل:\n`;
    message += `الاسم: \n`;
    message += `رقم الجوال: \n`;
    message += `العنوان: \n`;
    message += `المدينة: \n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('currentLang', lang);
    loadProductDetails();
}

// بدء التشغيل
loadProductDetails();
