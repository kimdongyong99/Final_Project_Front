
document.addEventListener("DOMContentLoaded", async function() {
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
    }
});

// 페이지 로드 시 사용자 정보 가져오기
window.onload = function() {
    fetch('https://3.38.95.210/api/accounts/social-account/', {
        method: 'GET',
        credentials: 'include',  // 자격 증명(쿠키 등) 포함
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            // Local Storage에 사용자 정보 저장
            localStorage.setItem('user_info', JSON.stringify(data));
            console.log('사용자 정보가 Local Storage에 저장되었습니다.');

            // 예: 화면에 사용자 정보 표시
            document.body.innerHTML += `<p>Username: ${data.username}</p>`;
            document.body.innerHTML += `<p>Email: ${data.email}</p>`;
            document.body.innerHTML += `<p>Provider: ${data.provider}</p>`;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
};

// 로그아웃 시 Local Storage에서 사용자 정보 삭제
function logout() {
    localStorage.removeItem('user_info');
    console.log('사용자 정보가 Local Storage에서 삭제되었습니다.');
}

