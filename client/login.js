// ─────────────────────────────────────────────────────────────
// 📝 Login Olayı
// ─────────────────────────────────────────────────────────────
const URL = "https://pizzaapi-v1.onrender.com";

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // Spinner'ı göster
    document.getElementById("loadingPopup").style.display = "block";

    fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // Spinner'ı gizle
            document.getElementById("loadingPopup").style.display = "none";
            localStorage.setItem("data", JSON.stringify(data)); // gelen veriyi localStorage'a kaydet
            // Eğer hata yoksa, kullanıcıyı yönlendir"
            if (data.error === false) {
                window.location.href = "index.html";
            } else {
                alert("Giriş başarısız: " + data.message);
                password.value = ""; // sadece şifreyi temizle
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
            alert("Bir hata oluştu.");
            passwordInput.value = ""; // yine sadece şifreyi temizle
            document.getElementById("loadingPopup").style.display = "none";
        });
});
