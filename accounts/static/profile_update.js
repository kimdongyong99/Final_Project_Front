// 다음 우편번호 API
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 검색 결과에서 주소 정보를 가져와서 해당 input에 넣습니다.
            document.getElementById('address').value = data.address; // 주소 입력
            document.getElementById('detail_address').focus(); // 상세 주소로 포커스 이동
        }
    }).open();
}

// 비밀번호 확인 및 회원정보 수정 요청
document.getElementById("profile-update-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    let password=document.getElementById("password").value;
    let passwordConfirm=document.getElementById("password_confirm").value;
    formData.append("password", document.getElementById("password").value);
    formData.append("password_confirm", document.getElementById("password_confirm").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("detail_address", document.getElementById("detail_address").value); // 상세 주소 추가
    
    // 비밀번호 입력 확인
    if (password !== passwordConfirm) {
        alert("패스워드가 일치하지 않습니다. 다시 확인해주세요.");
        return; // 비밀번호가 다르면 제출하지 않음
    }

    try {
        const responseUser= await fetch(`http://127.0.0.1:8000/api/accounts/${localStorage.getItem("username")}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}` // 사용자 인증 토큰 추가
            }
        });

        const userData = await responseUser.json();

        // 기존 비밀번호와 같으면 수정 불가
        if (userData.password === password) {
            alert("새 비밀번호가 기존 비밀번호와 같습니다. 다른 비밀번호를 입력해주세요.");
            return;
        }

        // 회원정보 수정 요청
        const response = await fetch(`http://127.0.0.1:8000/api/accounts/${localStorage.getItem("username")}/`, {
            method: "PUT",
            body: JSON.stringify({
                email: email,
                password: password, // 비밀번호가 다른 경우에만 업데이트
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}` // 사용자 인증 토큰 추가
            }
        });

        if (response.ok) {
            alert("회원정보가 성공적으로 수정되었습니다.");
            window.location.href = '/static/profile.html'; // 프로필 페이지로 이동
        } else {
            const errorData = await response.json();
            alert("오류가 발생했습니다: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Error during fetch request:", error);
        alert("Error: " + error.message);
    }
});
    // 이미지 미리보기 기능
    // 파일 입력 이벤트 리스너 추가
    document.getElementById('profile_image').addEventListener('change', function(event) {
        const file = event.target.files[0];  // 선택된 파일 가져오기
        // 파일이 있을 경우 미리보기
        if (file) {
            const reader = new FileReader();  // FileReader 객체 생성

            // 파일 읽기가 완료되면 실행될 함수
            reader.onload = function(e) {
                // update-profile 이미지의 src를 선택된 파일로 변경
                document.getElementById('update-profile').src = e.target.result;
            };

            // 파일을 읽어서 데이터 URL을 얻음
            reader.readAsDataURL(file);  // 파일을 읽어 이미지 URL 생성
        }
    });