$(document).ready(function () {
    // JWT 토큰 가져오기 (예: localStorage에 저장된 토큰)
    const token = localStorage.getItem('access_token');  // 로그인 시 저장된 JWT 토큰을 가져옴

    // 해시태그 추가 버튼 클릭 이벤트
    $('#addHashtagButton').click(function () {
        const hashtagInput = $('#hashtagInput').val().trim();
        if (hashtagInput !== "") {
            addHashtagToList(hashtagInput);
            $('#hashtagInput').val('');  // 해시태그 입력란 초기화
        }
    });

    // 해시태그 리스트에 추가하는 함수
    function addHashtagToList(hashtag) {
        // 해시태그가 이미 #으로 시작하지 않으면 #을 붙임
        if (!hashtag.startsWith('#')) {
            hashtag = '#' + hashtag;
        }
        const hashtagElement = `<li style="list-style-type: none;">${hashtag} <button type="button" class="remove-hashtag">제거</button></li>`;
        $('#hashtagList').append(hashtagElement);
    }

    // 해시태그 제거 버튼 클릭 이벤트
    $('#hashtagList').on('click', '.remove-hashtag', function () {
        $(this).parent().remove();
    });

    // 게시글 작성 처리
    $('#postForm').submit(function (e) {
        e.preventDefault();

        // 해시태그를 배열로 수집 (서버에 보낼 때는 #을 제외한 텍스트만 보냄)
        const hashtags = [];
        $('#hashtagList li').each(function () {
            const hashtagText = $(this).text().replace(" 제거", "").trim();
            hashtags.push(hashtagText.replace("#", ""));  // 해시태그에서 # 제거 후 배열에 추가
        });

        // FormData를 사용하여 파일과 데이터를 함께 전송
        const formData = new FormData();
        formData.append('title', $('#post-title-inp').val().trim());
        formData.append('content', $('#content').val().trim());

        // 쉼표로 구분된 해시태그 문자열로 전송
        formData.append('hashtags', hashtags.join(','));  // JSON.stringify 대신 join 사용

        // 파일 첨부 처리 (name="image"로 변경)
        const fileInput = $('#exampleFormControlFile1')[0].files[0];
        if (fileInput) {
            formData.append('image', fileInput);  // 파일 필드 이름을 'image'로 변경
        }

        // 게시글 저장 API 호출 (AJAX 요청)
        $.ajax({
            url: 'http://localhost:8000/api/posts/',  // 백엔드 게시글 저장 API URL
            type: 'POST',
            processData: false,  // FormData 사용 시 false로 설정
            contentType: false,  // FormData 사용 시 false로 설정
            headers: {
                "Authorization": `Bearer ${token}`  // JWT 토큰을 Authorization 헤더에 추가
            },
            data: formData,
            success: function (response) {
                alert('게시글이 성공적으로 저장되었습니다.');
                // 응답에서 게시글 ID를 받아 리디렉션
                window.location.href = `post_detail.html?id=${response.id}`;  // 게시글 ID를 사용해 상세 페이지로 이동
            },
            error: function (xhr) {
                alert('게시글 저장에 실패했습니다. 오류 메시지: ' + xhr.responseText);
            }
        });
    });
});

document.getElementById('cancelButton').addEventListener('click', function() {
    window.location.href = 'post.html';  // 취소 버튼 클릭 시 이동할 페이지

});

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
    }});

