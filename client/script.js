document.addEventListener("DOMContentLoaded", async () => {

    // ─────────────────────────────────────────────────────────────
    // 🌐 API URL ve Global Değişkenler
    // ─────────────────────────────────────────────────────────────
    const URL = "https://pizzaapi-v1.onrender.com";
    let basePrice = 0;

    // ─────────────────────────────────────────────────────────────
    // 📌 DOM Element Seçimleri
    // ─────────────────────────────────────────────────────────────
    const pizzaSelect = document.getElementById("pizzaId");
    const sizeSelect = document.getElementById("size");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");
    const totalPriceInput = document.getElementById("totalPrice");
    const form = document.getElementById("pizzaOrderForm");

    // ─────────────────────────────────────────────────────────────
    // ✅ Başarılı Sipariş Modal Fonksiyonu
    // ─────────────────────────────────────────────────────────────
    function showSuccessModal() {
        const modal = document.getElementById("successModal");
        modal.classList.remove("hidden");

        setTimeout(() => {
            modal.classList.add("hidden");
        }, 3000);
    }

    // ─────────────────────────────────────────────────────────────
    // 🍕 Pizza Listesini API'den Çek ve Select İçine Ekle
    // ─────────────────────────────────────────────────────────────
    try {
        const response = await fetch(`${URL}/pizzas`);
        if (!response.ok) throw new Error("Pizza listesi alınamadı.");
        const pizzas = await response.json();

        pizzas.result.forEach((pizza) => {
            const option = document.createElement("option");
            option.value = pizza._id;
            option.textContent = pizza.name;
            option.dataset.price = pizza.price;
            pizzaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Hata:", error.message);

        Toastify({
            text: "Pizza listesi yüklenemedi!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#dc3545",
            close: true,
        }).showToast();
    }

    // ─────────────────────────────────────────────────────────────
    // 💰 Fiyat Hesaplama Fonksiyonu
    // ─────────────────────────────────────────────────────────────
    function updatePrice() {
        const size = sizeSelect.value;
        const quantity = parseInt(quantityInput.value) || 1;

        let multiplier = 1;
        if (size === "Medium") multiplier = 1.15;
        else if (size === "Large") multiplier = 1.3;
        else if (size === "XLarge") multiplier = 1.45;

        const calculatedPrice = parseFloat((basePrice * multiplier).toFixed(2));
        const totalPrice = parseFloat((calculatedPrice * quantity).toFixed(2));

        priceInput.value = calculatedPrice;
        totalPriceInput.value = totalPrice;
    }

    // ─────────────────────────────────────────────────────────────
    // 🎯 Event Listener'lar: Seçimler ve Inputlar
    // ─────────────────────────────────────────────────────────────
    pizzaSelect.addEventListener("change", () => {
        const selectedOption = pizzaSelect.options[pizzaSelect.selectedIndex];
        basePrice = parseFloat(selectedOption.dataset.price) || 0;
        updatePrice();
    });

    sizeSelect.addEventListener("change", updatePrice);
    quantityInput.addEventListener("input", updatePrice);

    // ─────────────────────────────────────────────────────────────
    // 📝 Sipariş Formu Submit Olayı
    // ─────────────────────────────────────────────────────────────
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(priceInput.value);
        const totalPrice = parseFloat((price * quantity).toFixed(2));

        const formData = {
            userId: document.getElementById("userId").value,
            pizzaId: pizzaSelect.value,
            size: sizeSelect.value,
            quantity,
            price,
            totalPrice,
            address: document.getElementById("address").value,
            phone: document.getElementById("phone").value,
            paymentMethod: document.getElementById("paymentMethod").value,
            notes: document.getElementById("notes").value || ""
        };

        try {
            const response = await fetch(`${URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!data.error) {
                showSuccessModal();
                form.reset();
            } else {
                console.error("Sunucu hatası:", data);

                Toastify({
                    text: `🚫 Sipariş gönderilemedi! 
                    ${data.details}`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#dc3545",
                    close: true,
                }).showToast();
            }
        } catch (err) {
            console.error("İstek hatası:", err);

            Toastify({
                text: "❌ Sunucuya ulaşılamadı!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#dc3545",
                close: true,
            }).showToast();
        }
    });

});
