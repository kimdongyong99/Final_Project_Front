let currentPage = 1;  // 현재 페이지를 저장하는 변수

// 뉴스 데이터를 HTML에 동적으로 추가하는 함수
function displayNews(newsData) {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";  // 기존 내용 초기화

    // LocalStorage에서 사용자가 좋아요한 기사 목록 가져오기
    let likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];

    newsData.news.forEach(newsItem => {
        const newsElement = document.createElement("div");
        newsElement.classList.add("news-item");

        // LocalStorage에 저장된 likedArticles에서 이 기사가 좋아요되었는지 확인
        const heartClass = likedArticles.includes(newsItem.id) ? 'fas fa-heart' : 'far fa-heart';

        const newsContent = `
            <div class="card h-100">
                <img src="${newsItem.image_url || 'default_image.jpg'}" class="card-img-top" alt="${newsItem.title}">
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="/static/detail.html?id=${newsItem.id}">${newsItem.title}</a>
                    </h5>
                    <p class="card-text">좋아요 수: ${newsItem.total_likes}</p>
                    <button class="btn like-btn" onclick="likeArticle(${newsItem.id}, this)">
                        <i class="${heartClass}"></i>
                    </button>
                </div>
            </div>
        `;
        newsElement.innerHTML = newsContent;
        newsContainer.appendChild(newsElement);
    });

    // 페이지네이션 버튼 상태 업데이트
    document.getElementById("prev-btn").disabled = !newsData.has_previous;
    document.getElementById("next-btn").disabled = !newsData.has_next;
}

// 뉴스 데이터를 가져오는 함수 (페이지를 쿼리로 포함)
async function fetchNews(page = 1, search = "") {
    const url = search ? `http://3.38.95.210/api/articles/news/?search=${search}&page=${page}` : `http://3.38.95.210/api/articles/news/?page=${page}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched Data:', data); // 데이터 확인

            // 페이지네이션을 지원하는 구조인지 확인
            if (data.results) {
                displayNews(data.result);  // 데이터의 결과 부분을 전달
            } else {
                displayNews(data);  // 전체 데이터를 전달
            }

            currentPage = page;  // 현재 페이지 업데이트
        } else {
            console.error("Failed to fetch news");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 좋아요 버튼을 클릭했을 때 호출되는 함수
async function likeArticle(articleId, button) {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            // 로그인되지 않은 경우 경고창을 띄우고 로그인 페이지로 이동
            alert("로그인이 필요합니다.");
            window.location.href = "/static/login.html";
            return; // 로그인되지 않은 경우 함수 종료
        }

        const response = await fetch(`http://3.38.95.210/api/articles/${articleId}/like/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}` // 토큰 필요 시 사용
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Server Response:', data);  // 서버로부터 반환된 응답 확인

            // LocalStorage에 저장된 likedArticles 목록 업데이트
            let likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];

            // 버튼 상태 토글: 하트 아이콘을 직접 변경
            const heartIcon = button.querySelector('i');
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                // 좋아요한 기사 ID를 로컬 저장소에 추가
                likedArticles.push(articleId);
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                // 좋아요 취소된 기사 ID를 로컬 저장소에서 제거
                likedArticles = likedArticles.filter(id => id !== articleId);
            }

            // 업데이트된 likedArticles 목록을 다시 LocalStorage에 저장
            localStorage.setItem('likedArticles', JSON.stringify(likedArticles));

            // 좋아요 수 업데이트
            const likesCountElement = button.previousElementSibling;  // 좋아요 수가 표시된 요소 찾기
            likesCountElement.textContent = `좋아요 수: ${data.total_likes}`;  // 서버로부터 받은 총 좋아요 수로 업데이트
        } else {
            console.error("Failed to like article");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 페이지네이션 버튼 이벤트 처리
document.getElementById("next-btn").addEventListener("click", () => {
    fetchNews(currentPage + 1);  // 다음 페이지로 이동
});

document.getElementById("prev-btn").addEventListener("click", () => {
    fetchNews(currentPage - 1);  // 이전 페이지로 이동
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
    }

    // 검색 버튼 클릭 시 검색어를 기반으로 뉴스 가져오기
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    searchBtn.addEventListener("click", function() {
        const searchQuery = searchInput.value;
        fetchNews(1, searchQuery);  // 검색어를 전달하여 첫 페이지 뉴스 검색
    });

    // 페이지 로드 시 첫 번째 페이지 뉴스 가져오기
    fetchNews();
});
