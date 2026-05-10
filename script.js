let products = []; 
let currentLang = "ar";
let activeCategory = "all";

// رابط API (نفس الرابط)
const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1"; 

// قاموس ترجمة الأقسام
const categoryNames = {
    all: { ar: "🌟 كل المنتجات", en: "🌟 All Products" },
    instant: { ar: "⚡ توريد فوري", en: "⚡ Instant Supply" },
    lab: { ar: "🔬 المعمل والتشخيص", en: "🔬 Lab & Diagnostics" },
    surgery: { ar: "🏥 الجراحة والتعقيم", en: "🏥 Surgery & Sterilization" },
    vet: { ar: "🐾 الرعاية البيطرية", en: "🐾 Veterinary Care" },
    sonar: { ar: "🩺 السونار Sonoscape", en: "🩺 Sonoscape Ultrasound" },
    xray: { ar: "📷 الأشعة X-Ray", en: "📷 X-Ray Systems" },
    dental: { ar: "🦷 الأسنان", en: "🦷 Dental Equipment" },
    blood: { ar: "🩸 نقل الدم", en: "🩸 Blood Transfer" },
    misc: { ar: "📦 منوعات", en: "📦 Miscellaneous" }
};

async function loadProducts() {
    const productsDiv = document.getElementById("products");
    if (productsDiv) {
        productsDiv.innerHTML = `<div class="loading-spinner">${currentLang === "ar" ? "جاري تحميل الكتالوج" : "Loading Catalog"}</div>`;
    }
    
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        products = data.map(item => ({
            name: { ar: item.name_ar || "", en: item.name_en || "" },
            desc: { ar: item.desc_ar || "", en: item.desc_en || "" },
            price: item.price || "",
            supplyText: { ar: item.supply_ar || "", en: item.supply_en || "" },
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img || "https://via.placeholder.com/320x240?text=Coming+Soon",
            category: item.category || "misc"
        }));

        // تصفية المنتجات بدون أسماء (اختياري)
        products = products.filter(p => p.name.ar || p.name.en);
        
        renderButtons(); 
        showProducts(products); 
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        document.getElementById("products").innerHTML = `<div style="text-align:center;padding:40px;color:red;">
            ${currentLang === "ar" ? "❌ خطأ في تحميل البيانات. يرجى التحقق من الاتصال." : "❌ Error loading data. Please check connection."}
        </div>`;
    }
}

function renderButtons() {
    const btnContainer = document.getElementById("categoryButtons");
    if(!btnContainer) return;
    btnContainer.innerHTML = ""; 

    Object.keys(categoryNames).forEach(key => {
        const btn = document.createElement("button");
        btn.className = "category-btn";
        if(key === 'instant') btn.classList.add("instant-supply");
        if(activeCategory === key) btn.classList.add("active");
        btn.innerText = categoryNames[key][currentLang];
        btn.onclick = () => filterProducts(key);
        btnContainer.appendChild(btn);
    });
}

function showProducts(list) {
    const div = document.getElementById("products");
    div.innerHTML = "";

    if (list.length === 0) {
        div.innerHTML = `<div style="text-align:center;padding:40px;">
            ${currentLang === "ar" ? "📭 لا توجد منتجات في هذا القسم حالياً." : "📭 No products found in this category."}
        </div>`;
        return;
    }

    list.forEach((p, index) => {
        const card = document.createElement("div");
        card.className = `product-card ${p.isInstant ? 'instant' : ''}`;
        card.style.animationDelay = `${index * 0.05}s`;
        
        const productName = p.name[currentLang] || p.name.ar || p.name.en || "Product";
        const productDesc = p.desc[currentLang] || p.desc.ar || p.desc.en || "";
        const productPrice = p.price ? `${currentLang === "ar" ? "ريال" : "SAR"} ${p.price}` : "";
        const supplyText = p.supplyText[currentLang] || p.supplyText.ar || "";
        
        const whatsappMessage = encodeURIComponent(
            `${currentLang === 'ar' ? '📋 استفسار عن منتج:' : '📋 Product Inquiry:'}\n` +
            `🏥 ${currentLang === 'ar' ? 'مؤسسة ركن الخليج العربي (AGC)' : 'Arabian Gulf Corner (AGC)'}\n` +
            `📦 ${productName}\n` +
            `${currentLang === 'ar' ? '🔗 رابط المنتج:' : '🔗 Product link:'} ${window.location.href}`
        );
        
        card.innerHTML = `
            <img class="product-image" 
                 src="${p.img}" 
                 loading="lazy" 
                 alt="${productName}"
                 onerror="this.onerror=null;this.src='https://via.placeholder.com/320x240?text=No+Image'">
            <div class="product-info">
                <h3 class="product-title">${productName}</h3>
                ${productDesc ? `<p class="product-desc">${productDesc}</p>` : ""}
                ${productPrice ? `<div class="product-price">💰 ${productPrice}</div>` : ""}
                ${supplyText ? `<div class="product-supply">📦 ${supplyText}</div>` : ""}
                <a href="https://wa.me/966560967982?text=${whatsappMessage}" 
                   class="whatsapp-btn" 
                   target="_blank">
                    💬 ${currentLang === "ar" ? "اطلب عبر واتساب" : "Order via WhatsApp"}
                </a>
            </div>
        `;
        
        div.appendChild(card);
    });
}

function filterProducts(type) {
    activeCategory = type;
    let filtered = [];
    
    if (type === "all") {
        filtered = [...products];
    } else if (type === "instant") {
        filtered = products.filter(p => p.isInstant === true);
    } else {
        filtered = products.filter(p => p.category === type);
    }
    
    // تحديث حالة الأزرار النشطة
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtns = document.querySelectorAll('.category-btn');
    const categoryKeys = Object.keys(categoryNames);
    const activeIndex = categoryKeys.indexOf(type);
    if (activeBtns[activeIndex]) {
        activeBtns[activeIndex].classList.add('active');
    }
    
    showProducts(filtered);
}

function setLang(lang) {
    currentLang = lang;
    document.body.style.direction = lang === "ar" ? "rtl" : "ltr";
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    
    // تحديث عنوان الصفحة
    document.title = lang === "ar" 
        ? "مؤسسة ركن الخليج العربي | AGC - الكتالوج الطبي" 
        : "Arabian Gulf Corner | AGC - Medical Catalog";
    
    // تحديث النصوص
    const arabicName = document.querySelector('.arabic-name');
    const englishName = document.querySelector('.english-name');
    if (arabicName && englishName) {
        arabicName.style.display = lang === "ar" ? "inline" : "none";
        englishName.style.display = lang === "en" ? "inline" : "none";
    }
    
    renderButtons(); 
    
    // إعادة عرض المنتجات حسب الفلتر الحالي
    filterProducts(activeCategory);
}

// بدء التطبيق
loadProducts();
