// Daum 우편번호 API
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 검색 결과에서 주소 정보를 가져와서 해당 input에 넣습니다.
            document.getElementById('address').value = data.address; // 주소
            document.getElementById('detail_address').focus(); // 상세 주소 입력 필드로 포커스 이동
        }
    }).open();
}

// 이메일로 인증번호 요청
document.getElementById("send-verification-code").addEventListener("click", async function () {
    const email = document.getElementById("email").value;

    try {
        const response = await fetch("https://3.38.95.210/api/accounts/email-verification/", {
            method: "POST",
            body: JSON.stringify({ email: email }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            alert("Verification code sent to your email.");
        } else {
            const errorData = await response.json();
            alert("Error: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }
});

// 회원가입 요청
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("password").value);
    formData.append("password_confirm", document.getElementById("password_confirm").value);
    formData.append("verification_code", document.getElementById("verification_code").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("detail_address", document.getElementById("detail_address").value); // 상세 주소 추가

    // 프로필 이미지 추가
    const profileImage = document.getElementById("profile_image").files[0];
    if (profileImage) {
        formData.append("profile_image", profileImage);
    }

    try {
        const response = await fetch("https://3.38.95.210/api/accounts/signup/", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            alert("Sign up successful!");
            window.location.href = "/static/login.html";  // 회원가입 후 로그인 페이지로 이동
        } else {
            const errorData = await response.json();
            alert("Error: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Error during fetch request:", error);
        alert("Error: " + error.message);
    }
});
