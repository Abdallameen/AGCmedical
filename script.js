let products = []; 
let currentLang = "ar";

// رابط الـ API الخاص بك
const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1"; 

// 1. قاموس ترجمة الأقسام (تأكد أن الأسماء في الإكسيل تطابق الـ Key هنا)
const categoryNames = {
    all: { ar: "كل المنتجات", en: "All Products" },
    instant: { ar: "توريد فوري", en: "Instant Supply" },
    lab: { ar: "المعمل والتشخيص", en: "Lab & Diagnostics" },
    surgery: { ar: "الجراحة والتعقيم", en: "Surgery & Sterilization" },
    vet: { ar: "الرعاية البيطرية", en: "Veterinary Care" },
    sonar: { ar: "السونار Sonoscape", en: "Sonoscape Ultrasound" },
    xray: { ar: "الأشعة X-Ray", en: "X-Ray Systems" },
    dental: { ar: "الأسنان", en: "Dental Equipment" },
    blood: { ar: "نقل الدم", en: "Blood Transfer" },
    misc: { ar: "منوعات", en: "Miscellaneous" }
};

async function loadProducts() {
    try {
        // إضافة مؤشر تحميل بسيط في البداية
        document.getElementById("products").innerHTML = currentLang === "ar" ? "<p>جاري تحميل الكتالوج...</p>" : "<p>Loading Catalog...</p>";
        
        const response = await fetch(apiURL);
        const data = await response.json();
        
        products = data.map(item => ({
            name: { ar: item.name_ar, en: item.name_en },
            desc: { ar: item.desc_ar, en: item.desc_en },
            price: item.price,
            supplyText: { ar: item.supply_ar, en: item.supply_en },
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img,
            category: item.category 
        }));

        renderButtons(); 
        showProducts(products); 
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        document.getElementById("products").innerHTML = "<p>Error loading data. Please check your connection.</p>";
    }
}

function renderButtons() {
    const btnContainer = document.getElementById("categoryButtons");
    if(!btnContainer) return;
    btnContainer.innerHTML = ""; 

    Object.keys(categoryNames).forEach(key => {
        const btn = document.createElement("button");
        btn.innerText = categoryNames[key][currentLang];
        
        if(key === 'instant') btn.className = "btn-instant";
        
        btn.onclick = () => filterProducts(key);
        btnContainer.appendChild(btn);
    });
}

function showProducts(list) {
    const div = document.getElementById("products");
    div.innerHTML = "";

    if (list.length === 0) {
        div.innerHTML = currentLang === "ar" ? "<p>لا توجد منتجات في هذا القسم حالياً.</p>" : "<p>No products found in this category.</p>";
        return;
    }

    list.forEach(p => {
        // ميزة Lazy Loading مضافة هنا لتحسين الأداء
        div.innerHTML += `
            <div class="card ${p.isInstant ? 'instant' : ''}">
                <img src="${p.img}" 
                     loading="lazy" 
                     alt="product image" 
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/280x200?text=Image+Not+Found'">
                <h3>${p.name[currentLang] || ''}</h3>
                <p>${p.desc[currentLang] || ''}</p>
                <p><strong>${currentLang === "ar" ? "السعر" : "Price"}:</strong> ${p.price || ''}</p>
                <p><strong>${currentLang === "ar" ? "التوريد" : "Supply"}:</strong> ${p.supplyText[currentLang] || ''}</p>
                <a href="https://wa.me/966560967982?text=${encodeURIComponent((currentLang === 'ar' ? 'أهلاً، استفسار عن: ' : 'Hello, inquiry about: ') + p.name[currentLang])}" target="_blank">
                    ${currentLang === "ar" ? "اطلب الآن" : "Order Now"}
                </a>
            </div>
        `;
    });
}

function filterProducts(type) {
    if (type === "all") {
        showProducts(products);
    } else if (type === "instant") {
        showProducts(products.filter(p => p.isInstant === true));
    } else {
        showProducts(products.filter(p => p.category === type));
    }
}

function setLang(lang) {
    currentLang = lang;
    document.body.style.direction = lang === "ar" ? "rtl" : "ltr";
    const title = document.getElementById("title");
    if(title) title.innerText = lang === "ar" ? "كتالوج المنتجات الطبية" : "Medical Products Catalog";
    
    renderButtons(); 
    showProducts(products);
}

loadProducts();
