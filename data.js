let products = [];

const apiURL = "https://api.steinhq.com/v1/storages/6978e66baffba40a6241d79d/Sheet1";

const categories = {
    all: { ar: "🌟 جميع المنتجات", en: "🌟 All Products", icon: "fa-grid" },
    instant: { ar: "⚡ توريد فوري", en: "⚡ Instant Supply", icon: "fa-bolt" },
    lab: { ar: "🔬 المعمل والتشخيص", en: "🔬 Lab & Diagnostics", icon: "fa-microscope" },
    surgery: { ar: "🏥 الجراحة والتعقيم", en: "🏥 Surgery & Sterilization", icon: "fa-scalpel" },
    vet: { ar: "🐾 الرعاية البيطرية", en: "🐾 Veterinary Care", icon: "fa-paw" },
    sonar: { ar: "🩺 السونار Sonoscape", en: "🩺 Sonoscape Ultrasound", icon: "fa-waveform" },
    xray: { ar: "📷 الأشعة X-Ray", en: "📷 X-Ray Systems", icon: "fa-x-ray" },
    dental: { ar: "🦷 الأسنان", en: "🦷 Dental Equipment", icon: "fa-tooth" },
    blood: { ar: "🩸 نقل الدم", en: "🩸 Blood Transfer", icon: "fa-droplet" },
    misc: { ar: "📦 منوعات", en: "📦 Miscellaneous", icon: "fa-box" }
};

async function loadProducts() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        products = data.map((item, index) => ({
            id: index,
            name: { ar: item.name_ar || "", en: item.name_en || "" },
            desc: { ar: item.desc_ar || "", en: item.desc_en || "" },
            details: { ar: item.details_ar || "", en: item.details_en || "" },
            specs: { ar: item.specs_ar || "", en: item.specs_en || "" },
            warranty: { ar: item.warranty_ar || "", en: item.warranty_en || "" },
            price: item.price || "",
            supplyText: { ar: item.supply_ar || "", en: item.supply_en || "" },
            isInstant: String(item.isInstant).toUpperCase() === "TRUE",
            img: item.img || "https://via.placeholder.com/300x220?text=No+Image",
            category: item.category || "misc"
        }));
        
        console.log("✅ تم تحميل", products.length, "منتج");
        return products;
    } catch (error) {
        console.error("خطأ:", error);
        return [];
    }
}

async function init() {
    await loadProducts();
    // انتظر شوية عشان main.js يخلص تحميل
    setTimeout(() => {
        if (typeof renderCategories === 'function') renderCategories();
        if (typeof renderProducts === 'function') renderProducts();
    }, 100);
}

init();
