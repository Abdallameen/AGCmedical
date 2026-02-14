let products = []; 
let currentLang = "ar";

const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1"; 

// 1. قاموس ترجمة الأقسام
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

        renderButtons(); // رسم الأزرار باللغة الافتراضية
        showProducts(products); 
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
    }
}

// 2. دالة لإنشاء الأزرار وترجمتها
function renderButtons() {
    const btnContainer = document.getElementById("categoryButtons");
    btnContainer.innerHTML = ""; // مسح الأزرار الحالية

    // إنشاء الأزرار بناءً على القاموس أعلاه
    Object.keys(categoryNames).forEach(key => {
        const btn = document.createElement("button");
        btn.innerText = categoryNames[key][currentLang];
        
        // تمييز زر التوريد الفوري بلون مختلف
        if(key === 'instant') btn.className = "btn-instant";
        
        btn.onclick = () => filterProducts(key);
        btnContainer.appendChild(btn);
    });
}

function showProducts(list) {
    const div = document.getElementById("products");
    div.innerHTML = "";

    list.forEach(p => {
        div.innerHTML += `
            <div class="card ${p.isInstant ? 'instant' : ''}">
                <img src="${p.img}" alt="product" onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
                <h3>${p.name[currentLang] || ''}</h3>
                <p>${p.desc[currentLang] || ''}</p>
                <p><strong>${currentLang === "ar" ? "السعر" : "Price"}:</strong> ${p.price || ''}</p>
                <p><strong>${currentLang === "ar" ? "التوريد" : "Supply"}:</strong> ${p.supplyText[currentLang] || ''}</p>
                <a href="https://wa.me/+966560967982?text=${currentLang === 'ar' ? 'أهلاً، استفسار عن' : 'Hello, inquiry about'}: ${p.name[currentLang]}" target="_blank">
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
    document.getElementById("title").innerText = lang === "ar" ? "كتالوج المنتجات الطبية" : "Medical Products Catalog";
    
    renderButtons(); // إعادة رسم الأزرار باللغة الجديدة
    showProducts(products);
}

loadProducts();
