// 뉴스 데이터를 HTML에 동적으로 추가하는 함수
function displayNews(newsData) {
    console.log(newsData);

    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";  // 기존 내용 초기화

    newsData.forEach(newsItem => {
        console.log(newsItem.total_likes);  // 좋아요 수 출력하여 확인
        
        const newsElement = document.createElement("div");
        newsElement.classList.add("news-item");

        const newsContent = `
            <div class="card h-100">
                <img src="${newsItem.image_url || 'default_image.jpg'}" class="card-img-top" alt="${newsItem.title}">
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="/static/detail.html?id=${newsItem.id}">${newsItem.title}</a>
                    </h5>
                    <p class="card-text">좋아요 수: ${newsItem.total_likes}</p>
                    <button class="btn btn-primary" onclick="likeArticle(${newsItem.id})">좋아요</button>
                </div>
            </div>
        `;
        newsElement.innerHTML = newsContent;
        newsContainer.appendChild(newsElement);
    });
}

// 뉴스 데이터를 가져오는 함수
async function fetchNews() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/articles/news/");
        if (response.ok) {
            const data = await response.json();
            console.log(data); // 데이터 확인
            displayNews(data);
        } else {
            console.error("Failed to fetch news");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 좋아요 버튼을 클릭했을 때 호출되는 함수
async function likeArticle(articleId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}/like/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}` // 토큰 필요 시 사용
            }
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            fetchNews();  // 좋아요 후 뉴스 목록 새로고침
        } else {
            console.error("Failed to like article");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

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

    // 페이지 로드 시 뉴스 데이터를 가져옴
    fetchNews();
});
