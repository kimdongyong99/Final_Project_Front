document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // 기본 폼 제출 방지

    // 폼 입력값 가져오기
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // 로그인 API 요청
        const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            const access_token = data.access_token;  // 서버로부터 받은 access_token

            // localStorage에 access_token 저장
            localStorage.setItem('access_token', access_token);
            // localStorage에 username 저장
            localStorage.setItem('username', data.username);

            // 로그인 성공 후 페이지 이동 (예: 메인 페이지)
            window.location.href = '/static/list.html';
        } else {
            // 로그인 실패 시 에러 메시지 표시
            const errorData = await response.json();
            document.getElementById('error-message').textContent = errorData.message || '로그인에 실패했습니다.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = '로그인 중 오류가 발생했습니다.';
    }
});
