// product-details.js - يجلب التفاصيل من Excel تلقائياً

async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    // جلب اللغة من localStorage
    const savedLang = localStorage.getItem('currentLang');
    if (savedLang) window.currentLang = savedLang;
    
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            <div style="font-size:40px;">⏳</div>
            <p>${window.currentLang === 'ar' ? 'جاري تحميل بيانات المنتج...' : 'Loading product details...'}</p>
        </div>
    `;
    
    // انتظار تحميل products من data.js
    let attempts = 0;
    while (window.products === undefined || window.products.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (attempts > 50) break;
    }
    
    console.log("Products loaded:", window.products?.length);
    
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId) productId = localStorage.getItem('selectedProductId');
    
    console.log("Looking for product ID:", productId);
    
    if (!productId || !window.products || window.products.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${window.currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}<br><br><a href="index.html" style="color:#0d6efd;">← ${window.currentLang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</a></div>`;
        return;
    }
    
    const product = window.products.find(p => p.id == parseInt(productId));
    
    if (!product) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${window.currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}<br><br><a href="index.html" style="color:#0d6efd;">← ${window.currentLang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</a></div>`;
        return;
    }
    
    displayProduct(product);
}

function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    // اختيار النصوص حسب اللغة - من Excel مباشرة
    const name = window.currentLang === 'ar' ? (product.name?.ar || product.name_ar) : (product.name?.en || product.name_en || product.name?.ar);
    const desc = window.currentLang === 'ar' ? (product.desc?.ar || product.desc_ar) : (product.desc?.en || product.desc_en);
    const details = window.currentLang === 'ar' ? (product.details?.ar || product.details_ar) : (product.details?.en || product.details_en);
    const specs = window.currentLang === 'ar' ? (product.specs?.ar || product.specs_ar) : (product.specs?.en || product.specs_en);
    const warranty = window.currentLang === 'ar' ? (product.warranty?.ar || product.warranty_ar) : (product.warranty?.en || product.warranty_en);
    const supply = window.currentLang === 'ar' ? (product.supplyText?.ar || product.supply_ar) : (product.supplyText?.en || product.supply_en);
    
    const imgSrc = product.img || "https://via.placeholder.com/500x400?text=No+Image";
    const price = product.price || "غير محدد";
    
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/^\* (.*)$/gm, '• $1').replace(/^\- (.*)$/gm, '• $1');
    }
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${imgSrc}" alt="${name}" onerror="this.src='https://via.placeholder.com/500x400?text=Image+Error'">
                </div>
                <div class="product-detail-info">
                    <h1>${name || 'No Name'}</h1>
                    
                    ${desc ? `<p style="color:#666; line-height:1.8; margin:15px 0;">${desc}</p>` : ''}
                    
                    <div class="product-detail-price">💰 ${price} ${window.currentLang === 'ar' ? 'ريال' : 'SAR'}</div>
                    
                    ${supply ? `<div class="product-detail-supply">📦 ${supply}</div>` : ''}
                    
                    ${product.isInstant ? `<div class="instant-badge-large">⚡ ${window.currentLang === 'ar' ? 'توريد فوري' : 'Instant Supply'}</div>` : ''}
                    
                    ${details ? `
                    <div class="info-section">
                        <h3><i class="fas fa-info-circle"></i> ${window.currentLang === 'ar' ? '📋 تفاصيل المنتج' : '📋 Product Details'}</h3>
                        <div class="info-content">${formatText(details)}</div>
                    </div>
                    ` : ''}
                    
                    ${specs ? `
                    <div class="info-section">
                        <h3><i class="fas fa-microchip"></i> ${window.currentLang === 'ar' ? '⚙️ المواصفات التقنية' : '⚙️ Technical Specifications'}</h3>
                        <div class="info-content">${formatText(specs)}</div>
                    </div>
                    ` : ''}
                    
                    ${warranty ? `
                    <div class="info-section">
                        <h3><i class="fas fa-shield-alt"></i> ${window.currentLang === 'ar' ? '🛡️ الضمان' : '🛡️ Warranty'}</h3>
                        <div class="info-content">${formatText(warranty)}</div>
                    </div>
                    ` : ''}
                    
                    <button onclick="orderProduct(${product.id})" class="btn-whatsapp-large">
                        <i class="fab fa-whatsapp"></i> ${window.currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function orderProduct(id) {
    const product = window.products.find(p => p.id == id);
    if (!product) return;
    
    const name = window.currentLang === 'ar' ? (product.name?.ar || product.name_ar) : (product.name?.en || product.name_en);
    const specs = window.currentLang === 'ar' ? (product.specs?.ar || product.specs_ar) : (product.specs?.en || product.specs_en);
    const details = window.currentLang === 'ar' ? (product.details?.ar || product.details_ar) : (product.details?.en || product.details_en);
    
    let message = `📋 طلب شراء منتج - مؤسسة ركن الخليج العربي AGC\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏷️ المنتج: ${name}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${window.currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
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
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

// بدء التشغيل
loadProductDetails();
