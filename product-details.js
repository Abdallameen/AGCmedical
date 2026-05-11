// product-details.js - يستخدم data.js

let currentLang = localStorage.getItem('currentLang') || 'ar';

async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            <div style="font-size:40px;">⏳</div>
            <p>${currentLang === 'ar' ? 'جاري تحميل بيانات المنتج...' : 'Loading product details...'}</p>
        </div>
    `;
    
    // انتظر products من data.js
    let waitCount = 0;
    while (products.length === 0 && waitCount < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitCount++;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId) productId = localStorage.getItem('selectedProductId');
    
    if (!productId || products.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</div>`;
        return;
    }
    
    const product = products.find(p => p.id == parseInt(productId));
    
    if (!product) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</div>`;
        return;
    }
    
    displayProduct(product);
}

function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    const name = currentLang === 'ar' ? product.name.ar : (product.name.en || product.name.ar);
    const desc = currentLang === 'ar' ? product.desc.ar : (product.desc.en || product.desc.ar);
    const details = currentLang === 'ar' ? product.details.ar : (product.details.en || product.details.ar);
    const specs = currentLang === 'ar' ? product.specs.ar : (product.specs.en || product.specs.ar);
    const warranty = currentLang === 'ar' ? product.warranty.ar : (product.warranty.en || product.warranty.ar);
    const supply = currentLang === 'ar' ? product.supplyText.ar : (product.supplyText.en || product.supplyText.ar);
    
    const detailsTitle = currentLang === 'ar' ? '📋 تفاصيل المنتج' : '📋 Product Details';
    const specsTitle = currentLang === 'ar' ? '⚙️ المواصفات التقنية' : '⚙️ Technical Specifications';
    const warrantyTitle = currentLang === 'ar' ? '🛡️ الضمان' : '🛡️ Warranty';
    const orderText = currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp';
    const instantText = currentLang === 'ar' ? 'توريد فوري' : 'Instant Supply';
    
    let imgSrc = product.img;
    if (!imgSrc) imgSrc = "https://via.placeholder.com/500x400?text=No+Image";
    
    function formatText(text) {
        if (!text) return '';
        let formatted = text.replace(/\n/g, '<br>');
        formatted = formatted.replace(/^\* (.*)$/gm, '• $1');
        formatted = formatted.replace(/^\- (.*)$/gm, '• $1');
        return formatted;
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
                    
                    ${details ? `<div class="info-section"><h3><i class="fas fa-info-circle"></i> ${detailsTitle}</h3><div class="info-content">${formatText(details)}</div></div>` : ''}
                    ${specs ? `<div class="info-section"><h3><i class="fas fa-microchip"></i> ${specsTitle}</h3><div class="info-content">${formatText(specs)}</div></div>` : ''}
                    ${warranty ? `<div class="info-section"><h3><i class="fas fa-shield-alt"></i> ${warrantyTitle}</h3><div class="info-content">${formatText(warranty)}</div></div>` : ''}
                    
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
    
    const name = currentLang === 'ar' ? product.name.ar : (product.name.en || product.name.ar);
    const specs = currentLang === 'ar' ? product.specs.ar : (product.specs.en || product.specs.ar);
    
    let message = `📋 طلب شراء منتج - AGC\n\n`;
    message += `🏷️ المنتج: ${name}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'}\n`;
    if (specs) message += `\n⚙️ المواصفات:\n${specs.substring(0, 300)}\n`;
    message += `\n👤 بيانات العميل:\nالاسم: \nرقم الجوال: \nالعنوان: \n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('currentLang', lang);
    loadProductDetails();
}

loadProductDetails();
