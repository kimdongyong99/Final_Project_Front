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

    // 로컬 스토리지에서 로그인한 사용자 ID를 가져오는 함수
    function getCurrentUserId() {
        return localStorage.getItem('user_id');  // 로그인 후 이 user_id를 저장했다고 가정
    }

    // API 호출을 통해 기사 데이터를 가져오는 함수
    async function fetchArticle() {
        try {
            const response = await fetch(`http://3.38.95.210/api/articles/${articleId}/`);
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

    // 댓글을 가져오는 함수
    async function fetchComments() {
        const articleId = new URLSearchParams(window.location.search).get('id');
        if (!articleId) return;

        try {
            const response = await fetch(`http://3.38.95.210/api/articles/${articleId}/comments/`);
            if (response.ok) {
                const commentsData = await response.json();

                console.log("commentsData:", commentsData);  // author_id가 포함되어 있는지 확인

                const currentUserId = getCurrentUserId();  // 현재 로그인한 사용자 ID 가져옴
                displayComments(commentsData, currentUserId);   // 댓글과 사용자 정보 전달
            } else {
                console.error("Failed to fetch comments");
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }

    // 댓글을 동적으로 표시하는 함수
    function displayComments(commentsData, currentUserId) {
        const commentSection = document.getElementById("comment-section");
        commentSection.innerHTML = '';  // 기존 댓글 초기화
    
        const comments = commentsData.results;  // 실제 댓글 배열인 results를 가져옴
    
        // 로그인 여부 확인 (localStorage에 access_token이 있는지 확인)
        const isLoggedIn = !!localStorage.getItem('access_token');
    
        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.id = `comment-${comment.id}`; // 댓글 div에 id 부여
            commentElement.innerHTML = `
                <strong>${comment.author}</strong> <br>
                <p id="comment-content-${comment.id}">${comment.content}</p>
            `;
    
            // 로그인이 되어 있는지 확인
            if (isLoggedIn && currentUserId === String(comment.author_id)) {
                // 현재 로그인한 사용자가 댓글 작성자인 경우에만 수정/삭제 버튼을 표시
                commentElement.innerHTML += `
                    <button class="btn btn-secondary edit-btn" data-id="${comment.id}">수정</button>
                    <button class="btn btn-danger delete-btn" data-id="${comment.id}">삭제</button>
                `;
            }
    
            commentElement.innerHTML += `<hr>`;
            commentSection.appendChild(commentElement);
        });
    
        // 수정 버튼에 이벤트 리스너 추가
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const commentId = this.getAttribute("data-id");
                enableEditComment(commentId);  // 수정 모드로 전환
            });
        });
    
        // 삭제 버튼에 이벤트 리스너 추가
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const commentId = this.getAttribute("data-id");
                deleteComment(commentId);
            });
        });
    }
    

    // 댓글 작성 함수
    async function submitComment() {
        const articleId = new URLSearchParams(window.location.search).get('id');
        const content = document.getElementById("comment-content").value;

        if (!content) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                // 로그인되지 않은 경우 경고창을 띄우고 로그인 페이지로 이동
                alert("로그인이 필요합니다.");
                window.location.href = "/static/login.html";
                return;
            }

            const response = await fetch(`http://3.38.95.210/api/articles/${articleId}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`  // 로그인된 유저의 토큰 사용
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                fetchComments();  // 댓글 다시 로드
                document.getElementById("comment-content").value = "";  // 입력란 초기화
            } else {
                alert("댓글 작성에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }

    // 댓글 수정 모드로 전환하는 함수
    window.enableEditComment = function(commentId) {
        const commentContentElement = document.getElementById(`comment-content-${commentId}`);
        const originalContent = commentContentElement.textContent;

        // 댓글을 수정할 수 있는 input 필드로 변경
        commentContentElement.innerHTML = `
            <input type="text" id="edit-content-${commentId}" value="${originalContent}" />
            <button class="btn btn-primary" onclick="submitEditComment(${commentId})">저장</button>
            <button class="btn btn-secondary" onclick="cancelEditComment(${commentId}, '${originalContent}')">취소</button>
        `;
    }

    // 댓글 수정 취소 함수
    window.cancelEditComment = function(commentId, originalContent) {
        const commentContentElement = document.getElementById(`comment-content-${commentId}`);
        commentContentElement.innerHTML = originalContent;
    }

    // 댓글 수정 제출 함수
    window.submitEditComment = async function(commentId) {
        const newContent = document.getElementById(`edit-content-${commentId}`).value;

        if (!newContent) {
            alert("수정할 내용을 입력하세요.");
            return;
        }

        try {
            const response = await fetch(`http://3.38.95.210/api/articles/comments/${commentId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ content: newContent })
            });

            if (response.ok) {
                fetchComments();  // 수정 후 댓글 다시 로드
            } else {
                alert("댓글 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    }

    // 댓글 삭제 함수
    window.deleteComment = async function(commentId) {
        if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://3.38.95.210/api/articles/comments/${commentId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                fetchComments();  // 삭제 후 댓글 다시 로드
            } else {
                alert("댓글 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    // 댓글 가져오기
    fetchComments();

    // 댓글 작성 이벤트 리스너
    document.getElementById("submit-comment").addEventListener("click", submitComment);
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
});