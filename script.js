let products = []; 
let currentLang = "ar";

// رابط الـ API الخاص بك
const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1"; 

// 1. دالة جلب البيانات من Google Sheets عبر Stein
async function loadProducts() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        // تحويل البيانات من شكل الجدول إلى شكل الكود
        products = data.map(item => ({
            name: { ar: item.name_ar, en: item.name_en },
            desc: { ar: item.desc_ar, en: item.desc_en },
            price: item.price,
            supplyText: { ar: item.supply_ar, en: item.supply_en },
            // التأكد من قراءة القيمة المنطقية سواء كانت نصاً أو Boolean
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img
        }));

        showProducts(products); 
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        document.getElementById("products").innerHTML = "<p>عذراً، حدث خطأ أثناء تحميل المنتجات.</p>";
    }
}

// 2. دالة عرض المنتجات في الصفحة
function showProducts(list) {
    const div = document.getElementById("products");
    div.innerHTML = "";

    list.forEach(p => {
        div.innerHTML += `
            <div class="card ${p.isInstant ? 'instant' : ''}">
                <img src="${p.img}" alt="product" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${p.name[currentLang] || ''}</h3>
                <p>${p.desc[currentLang] || ''}</p>
                <p><strong>${currentLang === "ar" ? "السعر" : "Price"}:</strong> ${p.price || ''}</p>
                <p><strong>${currentLang === "ar" ? "التوريد" : "Supply"}:</strong> ${p.supplyText[currentLang] || ''}</p>
                <a href="https://wa.me/+966560967982" target="_blank">
                    ${currentLang === "ar" ? "اطلب الآن" : "Order Now"}
                </a>
            </div>
        `;
    });
}

// 3. دالة الفلترة
function filterProducts(type) {
    if (type === "instant") {
        const filtered = products.filter(p => p.isInstant === true);
        showProducts(filtered);
    } else {
        showProducts(products);
    }
}

// 4. دالة تغيير اللغة
function setLang(lang) {
    currentLang = lang;
    document.body.style.direction = lang === "ar" ? "rtl" : "ltr";
    
    document.getElementById("title").innerText = 
        lang === "ar" ? "كتالوج المنتجات الطبية" : "Medical Products Catalog";
    document.getElementById("allBtn").innerText = 
        lang === "ar" ? "كل المنتجات" : "All Products";
    document.getElementById("instantBtn").innerText = 
        lang === "ar" ? "توريد فوري" : "Instant Supply";

    showProducts(products);
}

// تشغيل جلب البيانات عند فتح الصفحة
loadProducts();