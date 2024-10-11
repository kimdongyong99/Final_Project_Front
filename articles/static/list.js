document.addEventListener("DOMContentLoaded", async function () {
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

    // 뉴스 데이터를 HTML에 동적으로 추가하는 함수
    function displayNews(newsData) {
        console.log(newsData);
        
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";  // 기존 내용 초기화

        newsData.forEach(newsItem => {
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

    // 페이지 로드 시 뉴스 데이터를 가져옴
    fetchNews();
});
