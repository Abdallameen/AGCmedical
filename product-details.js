// product-details.js - البيانات كلها من Excel مباشرة

let products = [];
let currentLang = "ar";

const API_URL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1";

async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            <div style="font-size:40px;">⏳</div>
            <p>جاري تحميل بيانات المنتج...</p>
        </div>
    `;
    
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId) productId = localStorage.getItem('selectedProductId');
    
    if (!productId) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">❌ لم يتم تحديد المنتج</div>`;
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
            container.innerHTML = `<div style="text-align:center;padding:60px;">❌ المنتج غير موجود</div>`;
            return;
        }
        
        displayProduct(product);
        
    } catch (error) {
        container.innerHTML = `<div style="text-align:center;padding:60px;">⚠️ خطأ في تحميل البيانات</div>`;
    }
}

function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    const name = currentLang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
    const desc = currentLang === 'ar' ? product.desc_ar : (product.desc_en || product.desc_ar);
    const details = currentLang === 'ar' ? product.details_ar : (product.details_en || product.details_ar);
    const specs = currentLang === 'ar' ? product.specs_ar : (product.specs_en || product.specs_ar);
    const warranty = currentLang === 'ar' ? product.warranty_ar : (product.warranty_en || product.warranty_ar);
    const supply = currentLang === 'ar' ? product.supply_ar : (product.supply_en || product.supply_ar);
    
    let imgSrc = product.img;
    if (!imgSrc) imgSrc = "https://via.placeholder.com/500x400?text=No+Image";
    
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/\* (.*?)(\n|$)/g, '• $1<br>');
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
                    
                    ${product.isInstant ? `<div class="instant-badge-large">⚡ ${currentLang === 'ar' ? 'توريد فوري' : 'Instant Supply'}</div>` : ''}
                    
                    ${details ? `
                    <div class="info-section">
                        <h3><i class="fas fa-info-circle"></i> ${currentLang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h3>
                        <div class="info-content">${formatText(details)}</div>
                    </div>
                    ` : ''}
                    
                    ${specs ? `
                    <div class="info-section">
                        <h3><i class="fas fa-microchip"></i> ${currentLang === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}</h3>
                        <div class="info-content">${formatText(specs)}</div>
                    </div>
                    ` : ''}
                    
                    ${warranty ? `
                    <div class="info-section">
                        <h3><i class="fas fa-shield-alt"></i> ${currentLang === 'ar' ? 'الضمان' : 'Warranty'}</h3>
                        <div class="info-content">${formatText(warranty)}</div>
                    </div>
                    ` : ''}
                    
                    <button onclick="orderProduct(${product.id})" class="btn-whatsapp-large">
                        <i class="fab fa-whatsapp"></i> ${currentLang === 'ar' ? 'اطلب المنتج عبر واتساب' : 'Order via WhatsApp'}
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
    
    let message = `📋 طلب شراء منتج - AGC\n\n`;
    message += `🏷️ المنتج: ${name}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    
    if (specs) message += `\n📋 المواصفات:\n${specs.substring(0, 200)}\n`;
    
    message += `\n👤 بيانات العميل:\nالاسم: \nرقم الجوال: \nالعنوان: \n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

function setLang(lang) {
    currentLang = lang;
    loadProductDetails();
}

loadProductDetails();
