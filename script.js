let products = []; 
let currentLang = "ar";

const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1"; 

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
            category: item.category // العمود الجديد للأقسام
        }));

        showProducts(products); 
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
    }
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
                <a href="https://wa.me/+966560967982?text=أهلاً، أرغب في الاستفسار عن: ${p.name['ar']}" target="_blank">
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
        // الفلترة بناءً على القسم المكتوب في عمود category
        const filtered = products.filter(p => p.category === type);
        showProducts(filtered);
    }
}

function setLang(lang) {
    currentLang = lang;
    document.body.style.direction = lang === "ar" ? "rtl" : "ltr";
    document.getElementById("title").innerText = lang === "ar" ? "كتالوج المنتجات الطبية" : "Medical Products Catalog";
    document.getElementById("allBtn").innerText = lang === "ar" ? "كل المنتجات" : "All Products";
    document.getElementById("instantBtn").innerText = lang === "ar" ? "توريد فوري" : "Instant Supply";
    showProducts(products);
}

loadProducts();
