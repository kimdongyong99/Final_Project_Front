document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);  // 이메일 대신 username
    formData.append("password", document.getElementById("password").value);

    try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {  // 로그인 API 경로
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            alert("Login successful!");
            // 로그인 성공 후 base.html로 리디렉션
            window.location.href = "/static/base.html";  // base.html의 경로로 리디렉션
        } else {
            const errorData = await response.json();
            alert("Error: " + JSON.stringify(errorData));  // 에러 메시지 출력
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }
});
