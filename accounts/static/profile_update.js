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
document.addEventListener("DOMContentLoaded", async function() {
    // 기존 프로필 이미지를 불러오기
    try {
        const username = localStorage.getItem("username");
        const access_token = localStorage.getItem('access_token');
        const response = await fetch(`https://afitday.shop/api/accounts/${username}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const profileImage = document.getElementById('update-profile');
            if (data.profile_image) {
                // 기존 프로필 이미지를 설정
                profileImage.src = `https://afitday.shop${data.profile_image}`;
            } else {
                // 기본 프로필 이미지 설정 (이미지가 없는 경우)
                profileImage.src = '/static/img.png';
            }
        } else {
            console.error("프로필 정보를 불러오는 중 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error("Error during profile fetch request:", error);
    }

    // 회원정보 수정 폼 제출    
document.getElementById("profile-update-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData();
    let password=document.getElementById("password").value;
    let passwordConfirm=document.getElementById("password_confirm").value;
    formData.append("password", document.getElementById("password").value);
    formData.append("password_confirm", document.getElementById("password_confirm").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("detail_address", document.getElementById("detail_address").value); // 상세 주소 추가
    formData.append("profile_image",document.getElementById("profile_image").files[0]);

    // 비밀번호 입력 확인
    if (password !== passwordConfirm) {
        alert("패스워드가 일치하지 않습니다. 다시 확인해주세요.");
        return; // 비밀번호가 다르면 제출하지 않음
    }

    try {


        // 회원정보 수정 요청
        const response = await fetch(`https://afitday.shop/api/accounts/${localStorage.getItem("username")}/`, {
            method: "PUT",
            body: formData,
            headers: {

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
});
// 로그인 여부에 따라 네비게이션 바 변경
    const authLinks = document.getElementById('auth-links');
    const access_token = localStorage.getItem('access_token');  // localStorage에서 토큰 확인

    if (access_token) {
        // 로그인 상태라면 프로필과 로그아웃 버튼을 표시
        authLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/static/profile.html">프로필</a>
            </li>
            <li class="nav-item">
                <span class="nav-link">|</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="logout-btn">로그아웃</a>
            </li>
        `;

        // 로그아웃 기능 추가
        document.getElementById('logout-btn').addEventListener('click', function() {
            // 로그아웃 시 토큰 삭제
            localStorage.removeItem('access_token');
            localStorage.removeItem('username'); //username 삭제//
            alert("로그아웃 되었습니다.");
            window.location.href = '/static/login.html';  // 로그인 페이지로 이동
        });
    } else {
        // 비로그인 상태라면 회원가입과 로그인 버튼 표시
        authLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/static/signup.html">회원가입</a>
            </li>
            <li class="nav-item">
                <span class="nav-link">|</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/static/login.html">로그인</a>
            </li>
        `;
    };