let currentCategory = "all";
let currentSort = "default";
let searchQuery = "";

function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    categoryList.innerHTML = '';
    
    Object.keys(categories).forEach(key => {
        const count = key === 'all' ? products.length : 
                     (key === 'instant' ? products.filter(p => p.isInstant).length :
                     products.filter(p => p.category === key).length);
        
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" onclick="filterByCategory('${key}'); return false;" class="${currentCategory === key ? 'active' : ''}">
                <i class="fas ${categories[key].icon}"></i>
                <span>${categories[key][currentLang]}</span>
                <span class="category-count">${count}</span>
            </a>
        `;
        categoryList.appendChild(li);
    });
}

function filterByCategory(category) {
    currentCategory = category;
    renderCategories();
    renderProducts();
}

function sortProducts(productsList) {
    let sorted = [...productsList];
    
    switch(currentSort) {
        case 'price-asc':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-desc':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'name':
            sorted.sort((a, b) => {
                const nameA = (a.name[currentLang] || '').toString();
                const nameB = (b.name[currentLang] || '').toString();
                return nameA.localeCompare(nameB);
            });
            break;
        default:
            break;
    }
    return sorted;
}

function filterProducts() {
    let filtered = [...products];
    
    if (currentCategory === 'instant') {
        filtered = filtered.filter(p => p.isInstant);
    } else if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            (p.name.ar || '').toLowerCase().includes(query) ||
            (p.name.en || '').toLowerCase().includes(query) ||
            (p.desc.ar || '').toLowerCase().includes(query) ||
            (p.desc.en || '').toLowerCase().includes(query)
        );
    }
    
    return sortProducts(filtered);
}

function renderProducts() {
    const productsDiv = document.getElementById('products');
    if (!productsDiv) return;
    
    const filtered = filterProducts();
    const countSpan = document.getElementById('productsCount');
    if (countSpan) {
        countSpan.innerText = currentLang === 'ar' 
            ? `عرض ${filtered.length} منتج` 
            : `Showing ${filtered.length} products`;
    }
    
    if (filtered.length === 0) {
        productsDiv.innerHTML = `<div style="text-align:center;padding:60px;">📭 ${currentLang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</div>`;
        return;
    }
    
    productsDiv.innerHTML = filtered.map(p => `
        <div class="product-card ${p.isInstant ? 'instant' : ''}" onclick="goToProduct(${p.id})">
            <img class="product-image" src="${p.img}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x220?text=No+Image'">
            <div class="product-info">
                <h3 class="product-title">${p.name[currentLang] || p.name.ar || p.name.en}</h3>
                ${p.price ? `<div class="product-price">💰 ${p.price} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</div>` : ''}
                <div class="product-actions" onclick="event.stopPropagation()">
                    <button class="btn-details" onclick="goToProduct(${p.id})">📖 ${currentLang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</button>
                    <button class="btn-whatsapp" onclick="orderOnWhatsApp(${p.id})">💬</button>
                </div>
            </div>
        </div>
    `).join('');
}

// استبدل دالة goToProduct في main.js بهذه:

function goToProduct(id) {
    localStorage.setItem('selectedProductId', id);
    window.location.href = 'product.html?id=' + id;  // أضف id في URL
}

function orderOnWhatsApp(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const msg = encodeURIComponent(
            `📋 استفسار عن منتج: ${product.name[currentLang] || product.name.ar}\n` +
            `🏥 مؤسسة ركن الخليج العربي (AGC)\n` +
            `💰 السعر: ${product.price || 'غير محدد'}`
        );
        window.open(`https://wa.me/966560967982?text=${msg}`, '_blank');
    }
}

function setLang(lang) {
    currentLang = lang;
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    renderCategories();
    renderProducts();
    
    const navHome = document.getElementById('nav-home');
    const navContact = document.getElementById('nav-contact');
    const categoriesTitle = document.getElementById('categories-title');
    
    if (navHome) navHome.innerHTML = lang === 'ar' ? '🏠 الرئيسية' : '🏠 Home';
    if (navContact) navContact.innerHTML = lang === 'ar' ? '📞 اتصل بنا' : '📞 Contact';
    if (categoriesTitle) categoriesTitle.innerHTML = lang === 'ar' ? 'التصنيفات' : 'Categories';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Event Listeners
if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });
}

if (document.getElementById('sortSelect')) {
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });
}

setTimeout(() => {
    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderProducts === 'function') renderProducts();
}, 500);
