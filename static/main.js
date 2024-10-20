// 페이지 로드 시 사용자 정보 가져오기
window.onload = function() {
    fetch('http://localhost:8000/api/accounts/social-account/', {
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
