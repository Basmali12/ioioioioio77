// ========================================================
// 1. إعدادات التلجرام
// ========================================================
const TELEGRAM_BOT_TOKEN = "8529273467:AAHZUXN4FW7pQaOLyTaImqmr2tp5c3ORUfo";
const TELEGRAM_CHAT_ID = "7821966897";

// ========================================================
// 2. قاعدة بيانات المنيو (تستطيع إضافة، حذف أو تعديل الوجبات والصور براحتك)
// ========================================================
const menuData = [
    { id: 1, category: "وجبات", title: "وجبة كباب عراقي مشوي", desc: "نفر كباب لحم غنم مع الطماطم والبصل المشوي والخبز الحار.", price: 12000, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80" },
    { id: 2, category: "وجبات", title: "نصف دجاجة على الفحم", desc: "نصف دجاجة متبلة بالتوابل الخاصة ومشوية على الفحم.", price: 10000, img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&q=80" },
    { id: 3, category: "سندويشات", title: "برجر لحم كلاسيك", desc: "شريحة لحم بقري طازج مع جبن شيدر وصوص المطعم الخاص.", price: 6000, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
    { id: 4, category: "سندويشات", title: "شاورما دجاج بخبز الصاج", desc: "شاورما دجاج مع الثومية والمخلل والبطاطا.", price: 4000, img: "https://images.unsplash.com/photo-1648906649712-4fb32eb34d2a?w=500&q=80" },
    { id: 5, category: "بيتزا", title: "بيتزا بيبيروني", desc: "عجينة إيطالية هشة، صلصة طماطم، موزاريلا وبيبيروني.", price: 9000, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
    { id: 6, category: "مشروبات", title: "عصير برتقال طبيعي", desc: "عصير برتقال فريش عصرة أولى 100%.", price: 3000, img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&q=80" },
    { id: 7, category: "مشروبات", title: "بيبسي علب", desc: "مشروب غازي مثلج.", price: 1000, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" },
    { id: 8, category: "حلويات", title: "كيكة شوكولاتة", desc: "قطعة كيك غنية بصوص الشوكولاتة الذائبة.", price: 4500, img: "https://images.unsplash.com/photo-1578985545062-69928b1ea34f?w=500&q=80" }
];

let cart = []; // مصفوفة السلة
let currentFilter = "الكل"; // القسم الافتراضي

// استخراج الأقسام من الوجبات برمجياً بدون تكرار
const categories = ["الكل", ...new Set(menuData.map(item => item.category))];

// تعريف عناصر الـ HTML
const categoryList = document.getElementById('category-list');
const menuContainer = document.getElementById('menu-container');
const cartModal = document.getElementById('cart-modal');
const cartBtnFloat = document.getElementById('cart-btn');

// ========================================================
// 3. دوال عرض الموقع
// ========================================================

// دالة توليد أزرار الأقسام
function renderCategories() {
    categoryList.innerHTML = "";
    categories.forEach(cat => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = `cat-btn ${currentFilter === cat ? 'active' : ''}`;
        btn.innerText = cat;
        btn.onclick = () => {
            currentFilter = cat;
            renderCategories();
            renderMenu();
        };
        li.appendChild(btn);
        categoryList.appendChild(li);
    });
}

// دالة عرض الوجبات
function renderMenu() {
    menuContainer.innerHTML = "";
    const filteredData = currentFilter === "الكل" ? menuData : menuData.filter(item => item.category === currentFilter);

    filteredData.forEach(item => {
        menuContainer.innerHTML += `
            <div class="menu-card">
                <img src="${item.img}" alt="${item.title}" loading="lazy">
                <div class="item-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="price-row">
                        <span class="price">${item.price.toLocaleString()} د.ع</span>
                        <button class="add-btn" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

// ========================================================
// 4. نظام سلة المشتريات
// ========================================================

function addToCart(id) {
    const product = menuData.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) existingItem.quantity++;
    else cart.push({ ...product, quantity: 1 });

    updateCartUI();
    
    // تأثير اهتزاز خفيف لزر السلة
    cartBtnFloat.style.transform = "translateX(-50%) scale(1.05)";
    setTimeout(() => cartBtnFloat.style.transform = "translateX(-50%) scale(1)", 200);
}

function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
    }
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // تحديث الأرقام
    document.getElementById('cart-count').innerText = totalItems;
    document.getElementById('cart-total-float').innerText = `${totalPrice.toLocaleString()} د.ع`;
    document.getElementById('total-price').innerText = `${totalPrice.toLocaleString()} د.ع`;

    // إظهار أو إخفاء الزر العائم للسلة
    if (cart.length > 0) cartBtnFloat.classList.add('visible');
    else {
        cartBtnFloat.classList.remove('visible');
        cartModal.classList.remove('show'); // إغلاق النافذة لو فرغت السلة
    }

    // تحديث نافذة السلة من الداخل
    const cartItemsContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">سلة الطلبات فارغة حالياً 🛒</p>';
        return;
    }

    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span class="cart-item-price">${(item.price * item.quantity).toLocaleString()} د.ع</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                </div>
            </div>
        `;
    });
}

// دالة فتح وإغلاق السلة
window.toggleCart = function() {
    if (cart.length > 0) cartModal.classList.toggle('show');
}
// إغلاق السلة عند الضغط في المساحة الرمادية
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('show');
});

// ========================================================
// 5. نظام إرسال الفاتورة عبر تلجرام
// ========================================================
window.sendOrderTelegram = function() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();

    if (!name || !phone) {
        alert("يرجى إدخال الاسم ورقم الهاتف لتأكيد الطلب.");
        return;
    }

    if (cart.length === 0) return;

    let total = 0;
    const itemsForLink = cart.map(item => {
        total += (item.price * item.quantity);
        return { title: item.title, qty: item.quantity };
    });

    // تجهيز بيانات الطلب وتحويلها لرابط مشفر
    const orderData = {
        customer: name,
        phone: phone,
        items: itemsForLink,
        total: total
    };

    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(orderData))));
    const viewLink = window.location.href.split('?')[0] + "?order=" + encodedData;

    // تجهيز الرسالة للبوت
    let message = `🔔 *طلب جديد من المتجر!*\n\n`;
    message += `👤 الاسم: ${name}\n`;
    message += `📞 الهاتف: ${phone}\n`;
    message += `💰 الإجمالي: ${total.toLocaleString()} د.ع\n\n`;
    message += `🔗 [اضغط هنا لعرض تفاصيل الطلب بالكامل](${viewLink})`;

    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = 'جاري الإرسال... <i class="fa-solid fa-spinner fa-spin"></i>';
    checkoutBtn.disabled = true;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
            disable_web_page_preview: true
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.ok) {
            alert("تم إرسال طلبك بنجاح! شكراً لك.");
            cart = [];
            document.getElementById('cust-name').value = '';
            document.getElementById('cust-phone').value = '';
            updateCartUI();
            cartModal.classList.remove('show');
        } else {
            alert("حدث خطأ أثناء الإرسال. الرجاء المحاولة لاحقاً.");
        }
    })
    .catch(error => {
        alert("تأكد من اتصالك بالإنترنت.");
    })
    .finally(() => {
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
    });
}

// ========================================================
// 6. نظام استقبال وعرض الطلب (عند الضغط على الرابط من التلجرام)
// ========================================================
function checkIncomingOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderRaw = urlParams.get('order');
    
    if (orderRaw) {
        try {
            const decodedData = JSON.parse(decodeURIComponent(escape(atob(orderRaw))));
            
            let msg = `📋 **تفاصيل الطلب المستلم**\n\n`;
            msg += `👤 اسم الزبون: ${decodedData.customer}\n`;
            msg += `📞 رقم الهاتف: ${decodedData.phone}\n\n`;
            msg += `🛍️ **المنتجات المطلوبة:**\n`;
            
            decodedData.items.forEach(i => {
                msg += `- ${i.title} (الكمية: ${i.qty})\n`;
            });
            
            msg += `\n💰 المجموع الكلي: ${decodedData.total.toLocaleString()} د.ع`;
            
            alert(msg);
            
            // إزالة الكود من الرابط بعد فتحه حتى لا يظهر مرة أخرى عند التحديث
            window.history.replaceState({}, document.title, window.location.pathname);
            
        } catch(e) {
            alert("عذراً، رابط الطلب غير صالح أو تالف.");
        }
    }
}

// تشغيل الموقع لأول مرة
renderCategories();
renderMenu();
updateCartUI();
checkIncomingOrder();
