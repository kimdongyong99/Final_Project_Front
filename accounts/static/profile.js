document.addEventListener("DOMContentLoaded", async function() {
    // 로그인 여부에 따라 네비게이션 바 변경
    const authLinks = document.getElementById('auth-links');
    const access_token = localStorage.getItem('access_token');  // localStorage에서 토큰 확인

    if (access_token) {
        const response = await fetch(`http://127.0.0.1:8000/api/accounts/${localStorage.getItem("username")}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}` // 토큰 필요 시 사용
            }
        }).then(response => response.json()).then(data=> {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('address').textContent = data.address;
            // document.getElementById('my-profile').src = data.profile_image;
        });

    } else {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href="/static/login.html/"
    }
    
document.addEventListener('DOMContentLoaded', (event) => {
    fetchProfile();
    openTab('Posts');
});

function fetchProfile() {
    fetch('http://localhost:5000/api/profile')  // 백엔드 API에서 프로필 데이터 가져오기
        .then(response => response.json())
        .then(data => {
            // 프로필 이미지 업데이트
            console.log(data.profile_image)
            document.getElementById('profile_image').src = data.profile_image;
            // 사용자 이름, 이메일, 주소 업데이트
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('address').textContent = data.address;

            // 작성한 게시글 리스트 업데이트
            const postList = document.getElementById('PostList');
            postList.innerHTML = '';  // 기존 리스트 초기화
            data.posts.forEach(post => {
                let li = document.createElement('li');
                li.textContent = post.title;  // 게시물 제목으로 표시
                postList.appendChild(li);
            });

            // 좋아요한 게시글 리스트 업데이트
            const likedPostsList = document.getElementById('PostLike');
            likedPostsList.innerHTML = '';  // 기존 리스트 초기화
            data.liked_posts.forEach(post => {
                let li = document.createElement('li');
                li.textContent = post.title;  // 게시물 제목으로 표시
                likedPostsList.appendChild(li);
            });
        });

    }});