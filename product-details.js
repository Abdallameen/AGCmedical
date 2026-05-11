function loadProductDetails() {
    const productId = localStorage.getItem('selectedProductId');
    const product = products.find(p => p.id == productId);
    const container = document.getElementById('productDetail');
    
    if (!product) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ ${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</div>`;
        return;
    }
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${product.img}" alt="${product.name[currentLang]}" onerror="this.src='https://via.placeholder.com/500x400?text=No+Image'">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name[currentLang] || product.name.ar}</h1>
                    ${product.desc[currentLang] ? `<p style="color:#666; line-height:1.6;">${product.desc[currentLang]}</p>` : ''}
                    <div class="product-detail-price">💰 ${product.price || '---'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>
                    ${product.supplyText[currentLang] ? `<div class="product-detail-supply">📦 ${product.supplyText[currentLang]}</div>` : ''}
                    
                    <div class="section-title">
                        <i class="fas fa-clipboard-list"></i> ${currentLang === 'ar' ? 'معلومات إضافية عن المنتج' : 'Additional Product Information'}
                    </div>
                    <div class="additional-info">
                        <textarea id="additionalInfo" placeholder="${currentLang === 'ar' ? 'أضف معلومات إضافية عن المنتج هنا...' : 'Add additional product information here...'}"></textarea>
                        <p style="font-size:12px; color:#999; margin-top:8px;">
                            💡 ${currentLang === 'ar' ? 'يمكنك إضافة: المواصفات الفنية، الضمان، طريقة الاستخدام، المحتويات...' : 'You can add: specifications, warranty, usage instructions, contents...'}
                        </p>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-whatsapp-large" onclick="orderProduct(${product.id})">
                            <i class="fab fa-whatsapp"></i> ${currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // استرجاع المعلومات الإضافية من localStorage إذا وجدت
    const savedInfo = localStorage.getItem(`product_info_${product.id}`);
    if (savedInfo) {
        document.getElementById('additionalInfo').value = savedInfo;
    }
    
    // حفظ المعلومات الإضافية عند التعديل
    document.getElementById('additionalInfo').addEventListener('change', function() {
        localStorage.setItem(`product_info_${product.id}`, this.value);
    });
}

function orderProduct(id) {
    const product = products.find(p => p.id == id);
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    let message = `📋 طلب شراء منتج\n\n`;
    message += `🏷️ المنتج: ${product.name[currentLang] || product.name.ar}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    
    if (additionalInfo) {
        message += `\n📝 ملاحظات إضافية:\n${additionalInfo}\n`;
    }
    
    message += `\n👤 بيانات العميل:\n`;
    message += `الاسم: \n`;
    message += `العنوان: \n`;
    message += `رقم التواصل: \n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

loadProductDetails();
