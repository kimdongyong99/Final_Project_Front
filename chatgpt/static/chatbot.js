document.getElementById('send-button').addEventListener('click', sendMessage);

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) {
        alert("메시지를 입력하세요.");
        return;
    }

    // 챗봇 소개글 및 이미지가 있는 요소들을 숨기기
    document.querySelector('.chatbot-icon').style.display = 'none';
    document.querySelector('.chatbot-text').style.display = 'none';
    document.querySelector('.chatbot-subtext').style.display = 'none';

    // 사용자가 입력한 메시지를 대화창에 추가
    addMessageToChat("user", message);

    // POST 요청을 통해 Django 백엔드에 메시지 전송
    fetch('http://localhost:8000/api/chat_gpt/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // GPT의 응답을 대화창에 추가
                addMessageToChat("assistant", data.message);
            } else if (data.error) {
                alert("오류: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    // 입력 필드 초기화
    userInput.value = '';
}

// 대화창에 메시지를 추가하는 함수
function addMessageToChat(role, message) {
    const chatWindow = document.getElementById('chat-messages'); // 채팅 메시지 창

    // 대화창이 숨겨져 있으면 표시
    chatWindow.style.display = 'block';

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(role);  // 'user' 또는 'assistant' 클래스 추가
    messageDiv.innerText = message;
    chatWindow.appendChild(messageDiv);

    // 대화창을 자동으로 스크롤하여 최신 메시지 표시
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

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