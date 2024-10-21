$(document).ready(function () {
    const postId = getPostIdFromURL(); // 게시글 ID를 URL에서 추출
    const postUrl = `http://localhost:8000/api/posts/${postId}/`; // 백엔드 수정 API URL
    // JWT 토큰 가져오기 (예: localStorage에 저장된 토큰)
    const token = localStorage.getItem('access_token');  // 로그인 시 저장된 JWT 토큰을 가져옴

    // 게시글 정보를 불러오기
    function loadPostDetails() {
        $.ajax({
            url: postUrl,
            type: 'GET',
            success: function (response) {
                $('#post-title-inp').val(response.title); // 제목 설정
                $('#content').val(response.content); // 내용 설정

                // 해시태그 설정
                const hashtags = response.hashtags;
                hashtags.forEach(function (hashtag) {
                    addHashtagToList(hashtag.replace(/^#/, '')); // #을 제거한 후 리스트에 추가
                });
            },
            error: function () {
                alert('게시글 정보를 불러오는데 실패했습니다.');
            }
        });
    }

    // 게시글 불러오기 함수 호출
    loadPostDetails();

    // 해시태그 추가 버튼 클릭 이벤트
    $('#addHashtagButton').click(function () {
        const hashtagInput = $('#hashtagInput').val().trim();
        if (hashtagInput !== "") {
            addHashtagToList(hashtagInput);
            $('#hashtagInput').val('');
        }
    });

    // 해시태그 리스트에 추가하는 함수
    function addHashtagToList(hashtag) {
        // 해시태그가 이미 #으로 시작하지 않으면 #을 붙여서 추가
        if (!hashtag.startsWith("#")) {
            hashtag = "#" + hashtag;
        }
        const hashtagElement = `<li>${hashtag} <button type="button" class="remove-hashtag">제거</button></li>`;
        $('#hashtagList').append(hashtagElement);
    }

    // 해시태그 제거 버튼 클릭 이벤트
    $('#hashtagList').on('click', '.remove-hashtag', function () {
        $(this).parent().remove();
    });

    // 게시글 수정 처리
    $('#postForm').submit(function (e) {
        e.preventDefault();

        // 해시태그를 배열로 수집
        const hashtags = [];
        $('#hashtagList li').each(function () {
            const hashtagText = $(this).text().replace(" 제거", "").trim();
            // 중복 # 방지를 위해 두 번 붙지 않도록 처리
            hashtags.push(hashtagText.startsWith("#") ? hashtagText : `#${hashtagText}`);
        });

        // 제목과 내용 가져오기
        const postData = {
            title: $('#post-title-inp').val().trim(),
            content: $('#content').val().trim(),
            hashtags: hashtags
        };

        // 게시글 수정 API 호출
        $.ajax({
            url: postUrl,
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                "Authorization": `Bearer ${token}`  // JWT 토큰을 Authorization 헤더에 추가
            },
            data: JSON.stringify(postData),
            success: function (response) {
                alert('게시글이 성공적으로 수정되었습니다.');
                window.location.href = `post_detail.html?id=${postId}` // 수정 후 게시글 상세 페이지로 이동
            },
            error: function () {
                alert('게시글 수정에 실패했습니다.');
            }
        });
    });

    document.getElementById('cancelButton').addEventListener('click', function() {
        window.location.href = `post_detail.html?id=${postId}`;  // 취소 버튼 클릭 시 이동할 페이지
    
    });

    // URL에서 postId를 추출하는 함수 (예: ?id=1 형태)
    function getPostIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
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
