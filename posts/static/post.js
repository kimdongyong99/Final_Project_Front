const apiUrl = 'http://127.0.0.1:8000/api/posts/';

let currentPage = 1; // 현재 페이지
const itemsPerPage = 10; // 한 페이지당 항목 수
let posts = []; // 전체 게시글 데이터


// GET 요청
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        posts = data.results || []; // 데이터를 posts 배열에 할당
        displayPosts(currentPage); // 현재 페이지의 게시글 표시
        console.log(data); // 받은 데이터 처리
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

// 게시글을 표시하는 함수
function displayPosts(page) {
    const container = document.getElementById('data-container');
    let tableContent = `
    <table class="table">
        <thead>
            <tr>
                <th>작성자</th>
                <th>이미지</th>
                <th>제목</th>
                <th>추천 수</th>
            </tr>
        </thead>
        <tbody>
    `; // 테이블 헤더 설정

    // 시작 인덱스와 종료 인덱스 계산
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, posts.length);

    for (let i = startIndex; i < endIndex; i++) {
        const post = posts[i];
        tableContent += `
            <tr>
                <td>${post.author}</td>
                <td>${post.image ? `<img src='${post.image}' style='width:50px;' />` : ' '}</td>
                <td><a href="/post/${post.id}" style="text-decoration: none; color: inherit;">${post.title}</a></td>
                <td>${post.likes_count}</td>
            </tr>
        `;
    }

    tableContent += `
        </tbody>
    </table>
    `; // 테이블 바디 종료
    container.innerHTML = tableContent;
    // 페이지네이션 업데이트
    updatePagination(page);
}

// 페이지네이션을 업데이트하는 함수
function updatePagination(currentPage) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(posts.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayPosts(currentPage); // 현재 페이지로 게시글 표시
        };

        if (i === currentPage) {
            pageButton.disabled = true; // 현재 페이지는 비활성화
        }

        paginationContainer.appendChild(pageButton);
    }
}
// 게시글 상세 페이지로 이동하는 함수
function goToPostDetail(postId) {
    window.location.href = `/post/${postId}`; // 상세 페이지로 이동
}
// 예시: 게시글 상세 페이지 로드 시
document.addEventListener('DOMContentLoaded', () => {
    const postId = getPostIdFromUrl(); // URL에서 게시글 ID 가져오기
    fetchPostDetail(postId); // 게시글 상세 정보 가져오기
});

// URL에서 게시글 ID를 가져오는 함수
function getPostIdFromUrl() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1]; // 마지막 세그먼트가 ID
}

// 게시글 상세 정보를 가져오는 함수
function fetchPostDetail(postId) {
    fetch(`http://127.0.0.1:8000/api/posts/${postId}/`) // API URL 수정
        .then(response => response.json())
        .then(data => {
            displayPostDetail(data); // 상세 페이지에 데이터 표시
        })
        .catch(error => {
            console.error('Error fetching post detail:', error);
        });
}

// 게시글 상세 정보를 표시하는 함수
function displayPostDetail(post) {
    const container = document.getElementById('post-detail-container'); // 상세 페이지 컨테이너
    container.innerHTML = `
        <h2>${post.title}</h2>
        <img src='${post.image}' alt='Post Image' />
        <p>작성자: ${post.author}</p>
        <p>${post.content}</p>
        <p>추천 수: ${post.likes_count}</p>
    `;
}
