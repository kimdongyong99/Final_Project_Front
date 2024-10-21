const apiUrl = 'http://127.0.0.1:8000/api/posts/';

let currentPage = 1; // 현재 페이지
const itemsPerPage = 10; // 한 페이지당 항목 수
let posts = []; // 전체 게시글 데이터

// 검색어와 검색 타입을 URL에서 가져오기
const searchParams = new URLSearchParams(window.location.search);
const searchWord = searchParams.get("search_word");
const searchType = searchParams.get("type");

// GET 요청 (검색어 포함)
let searchQuery = apiUrl;
if (searchWord && searchType) {
    searchQuery += `?search=${searchWord}&type=${searchType}`;
}

fetch(searchQuery)
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
                <td>${post.image ? `<img src='이미지-아이콘.png' style='width:30px;' />` : ' '}</td>
                <td><a href="/static/post_detail.html?id=${post.id}" style="text-decoration: none; color: inherit;">${post.title}</a></td>
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
});
