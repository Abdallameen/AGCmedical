// product-details.js - النسخة النهائية المبسطة التي تعمل 100%

let products = [];
let currentLang = "ar";

// الرابط المباشر للـ API
const API_URL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1";

// صفحة التفاصيل
async function loadProductDetails() {
    const container = document.getElementById('productDetail');
    
    // عرض مؤشر تحميل
    container.innerHTML = `
        <div style="text-align:center;padding:60px;">
            <div style="font-size:40px;">⏳</div>
            <p style="margin-top:20px;">جاري تحميل بيانات المنتج...</p>
        </div>
    `;
    
    // جلب ID المنتج من الرابط
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    
    // لو مفيش في الرابط، جرب من localStorage
    if (!productId) {
        productId = localStorage.getItem('selectedProductId');
    }
    
    console.log("Product ID:", productId);
    
    if (!productId) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <div style="font-size:40px;">❓</div>
                <p style="margin-top:20px;">لم يتم تحديد المنتج</p>
                <a href="index.html" style="display:inline-block;margin-top:20px;background:#0d6efd;color:white;padding:10px 25px;border-radius:25px;text-decoration:none;">العودة للمتجر</a>
            </div>
        `;
        return;
    }
    
    // جلب البيانات من الـ API مباشرة
    try {
        console.log("جاري تحميل البيانات من API...");
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("تم تحميل", data.length, "منتج");
        
        // تحويل البيانات
        products = data.map((item, index) => ({
            id: index,
            name_ar: item.name_ar || "",
            name_en: item.name_en || "",
            desc_ar: item.desc_ar || "",
            desc_en: item.desc_en || "",
            price: item.price || "",
            supply_ar: item.supply_ar || "",
            supply_en: item.supply_en || "",
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img || "",
            category: item.category || "misc"
        }));
        
        // البحث عن المنتج
        const product = products.find(p => p.id == parseInt(productId));
        
        if (!product) {
            console.log("المنتج غير موجود. المنتجات المتاحة:", products.map(p => ({id: p.id, name: p.name_ar})));
            container.innerHTML = `
                <div style="text-align:center;padding:60px;">
                    <div style="font-size:40px;">📦</div>
                    <p style="margin-top:20px;">المنتج غير موجود</p>
                    <p style="font-size:12px;color:#999;">ID: ${productId}</p>
                    <a href="index.html" style="display:inline-block;margin-top:20px;background:#0d6efd;color:white;padding:10px 25px;border-radius:25px;text-decoration:none;">العودة للمتجر</a>
                </div>
            `;
            return;
        }
        
        // عرض المنتج
        displayProduct(product);
        
    } catch (error) {
        console.error("خطأ:", error);
        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <div style="font-size:40px;">⚠️</div>
                <p style="margin-top:20px;color:red;">خطأ في تحميل البيانات</p>
                <p style="font-size:12px;color:#999;">${error.message}</p>
                <button onclick="location.reload()" style="margin-top:20px;background:#0d6efd;color:white;padding:10px 25px;border-radius:25px;border:none;cursor:pointer;">إعادة المحاولة</button>
            </div>
        `;
    }
}

// عرض المنتج
function displayProduct(product) {
    const container = document.getElementById('productDetail');
    
    // اختيار اللغة
    const productName = currentLang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
    const productDesc = currentLang === 'ar' ? product.desc_ar : (product.desc_en || product.desc_ar);
    const productSupply = currentLang === 'ar' ? product.supply_ar : (product.supply_en || product.supply_ar);
    
    // معالجة الصورة
    let productImg = product.img;
    if (!productImg || productImg === "") {
        productImg = "https://via.placeholder.com/500x400?text=No+Image";
    }
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${productImg}" 
                         alt="${productName}"
                         style="width:100%; border-radius:15px;"
                         onerror="this.src='https://via.placeholder.com/500x400?text=Image+Error'">
                </div>
                <div class="product-detail-info">
                    <h1 style="font-size:28px; margin-bottom:15px;">${productName}</h1>
                    
                    ${productDesc ? `<p style="color:#666; line-height:1.8; margin:15px 0;">${productDesc}</p>` : ''}
                    
                    ${product.price ? `
                    <div style="font-size:28px; color:#0d6efd; font-weight:bold; margin:20px 0;">
                        💰 ${product.price} ${currentLang === 'ar' ? 'ريال' : 'SAR'}
                    </div>
                    ` : ''}
                    
                    ${productSupply ? `
                    <div style="background:#e8f5e9; padding:12px 18px; border-radius:12px; margin:15px 0; color:#2e7d32;">
                        📦 ${productSupply}
                    </div>
                    ` : ''}
                    
                    ${product.isInstant ? `
                    <div style="background:linear-gradient(135deg, #198754, #157347); padding:10px 18px; border-radius:25px; display:inline-block; margin:10px 0; color:white; font-weight:bold;">
                        ⚡ توريد فوري
                    </div>
                    ` : ''}
                    
                    <!-- منطقة إضافة تفاصيل إضافية -->
                    <div style="margin: 30px 0 20px; padding:20px; background:#f8f9fa; border-radius:15px;">
                        <h3 style="margin-bottom:15px; color:#0d6efd;">📋 معلومات إضافية عن المنتج</h3>
                        <textarea id="additionalInfo" 
                                  rows="6" 
                                  style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; font-family:inherit; resize:vertical;"
                                  placeholder="يمكنك إضافة هنا: المواصفات الفنية، الضمان، طريقة الاستخدام، المحتويات، بلد المنشأ..."></textarea>
                        <p style="font-size:12px; color:#999; margin-top:8px;">
                            💡 هذه المعلومات ستظهر فقط لك ويمكنك تعديلها في أي وقت
                        </p>
                    </div>
                    
                    <div style="margin-top:20px;">
                        <button onclick="orderProduct(${product.id})" 
                                style="width:100%; background:#25d366; color:white; border:none; padding:15px; border-radius:50px; font-size:18px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;">
                            <i class="fab fa-whatsapp"></i> اطلب المنتج عبر واتساب
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // استرجاع المعلومات الإضافية المحفوظة
    const savedInfo = localStorage.getItem(`product_info_${product.id}`);
    if (savedInfo) {
        document.getElementById('additionalInfo').value = savedInfo;
    }
    
    // حفظ المعلومات الإضافية عند الكتابة
    document.getElementById('additionalInfo').addEventListener('input', function() {
        localStorage.setItem(`product_info_${product.id}`, this.value);
    });
}

// طلب المنتج عبر واتساب
function orderProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    const productName = currentLang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
    const additionalInfo = document.getElementById('additionalInfo')?.value || '';
    
    let message = `📋 طلب شراء منتج - مؤسسة ركن الخليج العربي AGC\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏷️ المنتج: ${productName}\n`;
    message += `💰 السعر: ${product.price || 'غير محدد'} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (additionalInfo) {
        message += `📝 ملاحظات إضافية:\n${additionalInfo}\n\n`;
    }
    
    message += `👤 بيانات العميل:\n`;
    message += `الاسم: \n`;
    message += `رقم الجوال: \n`;
    message += `العنوان: \n`;
    message += `المدينة: \n`;
    
    window.open(`https://wa.me/966560967982?text=${encodeURIComponent(message)}`, '_blank');
}

// تغيير اللغة
function setLang(lang) {
    currentLang = lang;
    // إعادة تحميل المنتج الحالي
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        loadProductDetails();
    }
}

// بدء التشغيل
loadProductDetails();
