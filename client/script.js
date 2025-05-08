document.addEventListener("DOMContentLoaded", async () => {
    const pizzaSelect = document.getElementById("pizzaId");
    const sizeSelect = document.getElementById("size");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");
    const totalPriceInput = document.getElementById("totalPrice");

    let basePrice = 0;
    function showSuccessModal() {
        const modal = document.getElementById("successModal");
        modal.classList.remove("hidden");

        setTimeout(() => {
            modal.classList.add("hidden");
        }, 3000); // 2 saniye sonra kapanır
    }

    // 🍕 Pizza listesini API'den çek
    try {
        const response = await fetch("http://127.0.0.1:8000/pizzas");
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

    // 🎯 Pizza seçildiğinde fiyatı güncelle
    pizzaSelect.addEventListener("change", () => {
        const selectedOption = pizzaSelect.options[pizzaSelect.selectedIndex];
        basePrice = parseFloat(selectedOption.dataset.price) || 0;
        updatePrice();
    });

    sizeSelect.addEventListener("change", updatePrice);
    quantityInput.addEventListener("input", updatePrice);

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

    // ✅ Form gönderimi
    document.getElementById("pizzaOrderForm").addEventListener("submit", async function (e) {
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
            const response = await fetch("http://127.0.0.1:8000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!data.error) {
                showSuccessModal();
                document.getElementById("pizzaOrderForm").reset();
            } else {
                Toastify({
                    text: "🚫 Sipariş gönderilemedi!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#dc3545",
                    close: true,
                }).showToast();
                console.error("Sunucu hatası:", data);
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

