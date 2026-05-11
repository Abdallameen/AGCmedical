function loadProductDetails() {
    const productId = localStorage.getItem('selectedProductId');
    const product = products.find(p => p.id == productId);
    const container = document.getElementById('productDetail');
    
    if (!product) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</div>`;
        return;
    }
    
    // تحويل النصوص إلى HTML (لو فيها فواصل أسطر)
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/\* (.*?)(\n|$)/g, '• $1<br>');
    }
    
    const detailsText = formatText(product.details[currentLang] || product.details.ar);
    const specsText = formatText(product.specs[currentLang] || product.specs.ar);
    const warrantyText = formatText(product.warranty[currentLang] || product.warranty.ar);
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${product.img}" alt="${product.name[currentLang]}" onerror="this.src='https://via.placeholder.com/500x400?text=No+Image'">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name[currentLang] || product.name.ar}</h1>
                    
                    ${product.desc[currentLang] ? `<p style="color:#666; line-height:1.6; margin:10px 0;">${product.desc[currentLang]}</p>` : ''}
                    
                    <div class="product-detail-price">💰 ${product.price || '---'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>
                    
                    ${product.supplyText[currentLang] ? `<div class="product-detail-supply">📦 ${product.supplyText[currentLang]}</div>` : ''}
                    
                    ${product.isInstant ? `<div class="instant-badge-large">⚡ ${currentLang === 'ar' ? 'متوفر للتوريد الفوري' : 'Available for Instant Supply'}</div>` : ''}
                    
                    <!-- تفاصيل إضافية من Excel -->
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

function orderProduct(id) {
    const product = products.find(p => p.id == id);
    
    let message = `📋 طلب شراء منتج - مؤسسة ركن الخليج العربي AGC\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏷️ المنتج: ${product.name[currentLang] || product.name.ar}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    message += `📦 حالة التوريد: ${product.isInstant ? 'توريد فوري ⚡' : (product.supplyText[currentLang] || 'حسب الطلب')}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // إضافة المواصفات للطلب
    if (product.specs[currentLang] || product.specs.ar) {
        message += `📋 المواصفات:\n${(product.specs[currentLang] || product.specs.ar).substring(0, 200)}\n\n`;
    }
    
    message += `👤 بيانات العميل:\n`;
    message += `الاسم: \n`;
    message += `رقم الجوال: \n`;
    message += `العنوان: \n`;
    message += `المدينة: \n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🚚 يرجى تأكيد الطلب وسنقوم بالتواصل معكم`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

// دالة لتحويل النص إلى HTML جميل
function formatDetails(text) {
    if (!text) return '';
    // تحويل النقاط
    text = text.replace(/^\* (.*)$/gm, '• $1');
    // تحويل الأرقام
    text = text.replace(/^(\d+)\. (.*)$/gm, '<strong>$1.</strong> $2');
    return text;
}

loadProductDetails();
