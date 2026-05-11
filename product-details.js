// product-details.js
let currentLang = localStorage.getItem('currentLang') || 'ar';

async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            ⏳ ${currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
    `;
    
    // انتظار تحميل products من data.js
    let attempts = 0;
    while (products.length === 0 && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    console.log("Products loaded:", products.length);
    
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId) productId = localStorage.getItem('selectedProductId');
    
    console.log("Looking for product ID:", productId);
    
    if (!productId || products.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}<br><br><a href="index.html" style="color:#0d6efd;">← ${currentLang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</a></div>`;
        return;
    }
    
    const product = products.find(p => p.id == parseInt(productId));
    
    if (!product) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}<br><br><a href="index.html" style="color:#0d6efd;">← ${currentLang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</a></div>`;
        return;
    }
    
    displayProduct(product);
}

function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    const name = currentLang === 'ar' ? (product.name?.ar || product.name_ar) : (product.name?.en || product.name_en || product.name?.ar);
    const desc = currentLang === 'ar' ? (product.desc?.ar || product.desc_ar) : (product.desc?.en || product.desc_en);
    const details = currentLang === 'ar' ? (product.details?.ar || product.details_ar) : (product.details?.en || product.details_en);
    const specs = currentLang === 'ar' ? (product.specs?.ar || product.specs_ar) : (product.specs?.en || product.specs_en);
    const warranty = currentLang === 'ar' ? (product.warranty?.ar || product.warranty_ar) : (product.warranty?.en || product.warranty_en);
    const supply = currentLang === 'ar' ? (product.supplyText?.ar || product.supply_ar) : (product.supplyText?.en || product.supply_en);
    
    const imgSrc = product.img || "https://via.placeholder.com/500x400?text=No+Image";
    
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/^\* (.*)$/gm, '• $1');
    }
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${imgSrc}" alt="${name}" onerror="this.src='https://via.placeholder.com/500x400?text=Image+Error'">
                </div>
                <div class="product-detail-info">
                    <h1>${name || 'No Name'}</h1>
                    ${desc ? `<p style="color:#666; margin:15px 0;">${desc}</p>` : ''}
                    ${product.price ? `<div class="product-detail-price">💰 ${product.price} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>` : ''}
                    ${supply ? `<div class="product-detail-supply">📦 ${supply}</div>` : ''}
                    ${product.isInstant ? `<div class="instant-badge-large">⚡ ${currentLang === 'ar' ? 'توريد فوري' : 'Instant Supply'}</div>` : ''}
                    
                    ${details ? `<div class="info-section"><h3><i class="fas fa-info-circle"></i> ${currentLang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h3><div class="info-content">${formatText(details)}</div></div>` : ''}
                    ${specs ? `<div class="info-section"><h3><i class="fas fa-microchip"></i> ${currentLang === 'ar' ? 'المواصفات' : 'Specifications'}</h3><div class="info-content">${formatText(specs)}</div></div>` : ''}
                    ${warranty ? `<div class="info-section"><h3><i class="fas fa-shield-alt"></i> ${currentLang === 'ar' ? 'الضمان' : 'Warranty'}</h3><div class="info-content">${formatText(warranty)}</div></div>` : ''}
                    
                    <button onclick="orderProduct(${product.id})" class="btn-whatsapp-large">
                        <i class="fab fa-whatsapp"></i> ${currentLang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function orderProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    const name = currentLang === 'ar' ? (product.name?.ar || product.name_ar) : (product.name?.en || product.name_en);
    
    let message = `📋 طلب منتج - AGC\n`;
    message += `🏷️ ${name}\n`;
    message += `💰 ${product.price || 'السعر غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n\n`;
    message += `👤 بياناتي:\nالاسم: \nرقم الجوال: \nالعنوان: \n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

loadProductDetails();
