document.addEventListener("DOMContentLoaded", async function () {
    // URL에서 기사 ID 추출
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');  // 여기서 'id' 값을 추출

    console.log("articleId:", articleId);

    // 기사 ID가 없을 경우 오류 처리
    if (!articleId) {
        console.error("Article ID is missing from URL");
        return;
    }

    // API 호출을 통해 기사 데이터를 가져오는 함수
    async function fetchArticle() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}/`);
            if (response.ok) {
                const articleData = await response.json();
                displayArticle(articleData);
            } else {
                console.error("Failed to fetch article data");
            }
        } catch (error) {
            console.error("Error fetching article data:", error);
        }
    }

    // 가져온 기사 데이터를 HTML에 추가하는 함수
    function displayArticle(articleData) {
        document.getElementById("article-title").textContent = articleData.title;
        document.getElementById("article-image").src = articleData.image_url || 'default_image.jpg';
        document.getElementById("article-link").href = articleData.link;
        document.getElementById("article-summary").textContent = articleData.summary || "요약이 제공되지 않았습니다.";
    }

    // 페이지 로드 시 기사 데이터를 가져옴
    fetchArticle();
});
