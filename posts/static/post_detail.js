document.addEventListener("DOMContentLoaded", function () {
    const postId = window.location.search.split('=')[1]; // URL에서 postId 추출
    const postUrl = `http://127.0.0.1:8000/api/posts/${postId}/`;

    // JWT 토큰 및 로그인한 사용자 정보 가져오기
    const token = localStorage.getItem('access_token');
    const loggedInUsername = localStorage.getItem('username');  // 로그인한 사용자의 username

    // 게시글 상세 데이터 가져오기
    fetch(postUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('post-title').innerText = data.title;
            document.getElementById('post-author').innerText = `작성자: ${data.author}`;
            document.getElementById('post-likes').innerText = `좋아요: ${data.likes_count}`;
            document.getElementById('post-content').innerText = data.content;
            if (data.image) {
                const imageUrl = `http://127.0.0.1:8000${data.image}`;  // 서버 URL에 /media 경로 추가
                document.getElementById('post-image').src = imageUrl;
            }

            // 해시태그 추가
            const hashtagContainer = document.getElementById('post-hashtags');
            data.hashtags.forEach(hashtag => {
                const hashtagElement = document.createElement('span');
                hashtagElement.innerText = `${hashtag.hashtag}`;
                hashtagContainer.appendChild(hashtagElement);
            });

            // 게시글 작성자와 로그인한 사용자 비교
            if (data.author !== loggedInUsername) {
                // 수정, 삭제 버튼을 숨김
                document.getElementById('edit-btn').style.display = 'none';
                document.getElementById('delete-btn').style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Error fetching post:", error);
        });

    // 좋아요 버튼 클릭 시 처리
    document.getElementById('like-btn').addEventListener('click', function () {
        if (!token) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }

        const likeUrl = `${postUrl}like/`;
        fetch(likeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // JWT 토큰 추가
            }
        })
        .then(response => response.json())
        .then(data => {
            const likeCountElement = document.getElementById('post-likes');

            // 좋아요 수 및 메시지 실시간 반영
            likeCountElement.innerText = `좋아요: ${data.likes_count}`;
            alert(data.message);  // "좋아요" 또는 "좋아요 취소" 메시지 표시
        })
        .catch(error => {
            console.error("Error liking post:", error);
        });
    });

    // 삭제 버튼 클릭 시 처리
    document.getElementById('delete-btn').addEventListener('click', function () {
        const deleteUrl = postUrl;

        if (confirm("정말로 삭제하시겠습니까?")) {
            fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`  // 인증 토큰 추가
                },
            })
            .then(response => {
                if (response.status === 204) {
                    alert("게시글이 삭제되었습니다.");
                    window.location.href = "/static/post.html"; // 삭제 후 post 리스트 페이지로 이동
                } else {
                    alert("삭제할 수 없습니다.");
                }
            })
            .catch(error => {
                console.error("Error deleting post:", error);
            });
        }
    });

    // 수정 버튼 클릭 시 처리
    document.getElementById('edit-btn').addEventListener('click', function () {
        window.location.href = `/static/post_update.html?id=${postId}`; // 수정 페이지로 이동
    });

    // 댓글 작성 처리
    document.getElementById('comment-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const commentContent = document.getElementById('comment-input').value;

        // 댓글 내용이 비어 있으면 경고
        if (!commentContent.trim()) {
            alert("댓글 내용을 입력하세요.");
            return;
        }

        const commentData = {
            content: commentContent
        };

        fetch(`http://127.0.0.1:8000/api/posts/${postId}/comment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // JWT 토큰 추가
            },
            body: JSON.stringify(commentData)
        })
        .then(response => response.json())
        .then(data => {
            alert("댓글이 성공적으로 작성되었습니다.");
            location.reload();  // 댓글 작성 후 페이지 새로고침
        })
        .catch(error => {
            console.error("Error posting comment:", error);
        });
    });

    // 댓글 목록 가져오기
    fetch(`http://127.0.0.1:8000/api/posts/${postId}/comment/`)
        .then(response => response.json())
        .then(data => {
            const commentList = document.getElementById('comment-list');
            commentList.innerHTML = '';  // 기존 댓글 목록 초기화
            
            // results 배열에 있는 댓글 리스트를 사용
            if (Array.isArray(data.results)) {
                data.results.forEach(comment => {
                    const commentItem = document.createElement('div');
                    commentItem.classList.add('comment-item');
                    commentItem.innerHTML = `
                        <p><strong>${comment.author}</strong></p>
                        <p class="comment-content" id="comment-content-${comment.id}">${comment.content}</p>
                        <p>${new Date(comment.created_at).toLocaleDateString()}</p>
                        ${comment.author === loggedInUsername ? `
                            <button class="edit-comment" data-id="${comment.id}">수정</button>
                            <button class="delete-comment" data-id="${comment.id}">삭제</button>
                        ` : ''}
                    `;
                    commentList.appendChild(commentItem);
                });

                // 댓글 수정 이벤트 추가
                document.querySelectorAll('.edit-comment').forEach(button => {
                    button.addEventListener('click', function () {
                        const commentId = this.getAttribute('data-id');
                        const contentElement = document.getElementById(`comment-content-${commentId}`);
                        const currentContent = contentElement.innerText;

                        // textarea로 변환하고 확인 및 취소 버튼 추가
                        contentElement.innerHTML = `
                            <textarea id="edit-input-${commentId}" rows="3" style="width:100%;">${currentContent}</textarea>
                            <button class="save-edit" data-id="${commentId}">확인</button>
                            <button class="cancel-edit" data-id="${commentId}">취소</button>
                        `;

                        // 확인 버튼 클릭 시
                        document.querySelector(`.save-edit[data-id="${commentId}"]`).addEventListener('click', function () {
                            const newContent = document.getElementById(`edit-input-${commentId}`).value;
                            editComment(commentId, newContent);  // 수정 함수 호출
                        });

                        // 취소 버튼 클릭 시
                        document.querySelector(`.cancel-edit[data-id="${commentId}"]`).addEventListener('click', function () {
                            contentElement.innerHTML = currentContent;  // 수정 취소 후 원래 댓글 내용으로 복구
                        });
                    });
                });

                // 댓글 삭제 이벤트 추가
                document.querySelectorAll('.delete-comment').forEach(button => {
                    button.addEventListener('click', function () {
                        const commentId = this.getAttribute('data-id');
                        deleteComment(commentId);  // 삭제 함수 호출
                    });
                });

            } else {
                console.error("Expected an array but got:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching comments:", error);
        });

    // 댓글 수정 함수
    function editComment(commentId, newContent) {
        const editUrl = `http://127.0.0.1:8000/api/posts/comment/${commentId}`;  // URL에 commentId 추가

        fetch(editUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: newContent })
        })
        .then(response => {
            if (response.ok) {
                alert("댓글이 수정되었습니다.");
                location.reload();
            } else {
                alert("댓글 수정에 실패했습니다.");
            }
        })
        .catch(error => {
            console.error("Error editing comment:", error);
        });
    }

    // 댓글 삭제 함수
    function deleteComment(commentId) {
        const deleteUrl = `http://127.0.0.1:8000/api/posts/comment/${commentId}`;  // URL에 commentId 추가

        if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("댓글이 삭제되었습니다.");
                    location.reload();
                } else {
                    alert("댓글 삭제에 실패했습니다.");
                }
            })
            .catch(error => {
                console.error("Error deleting comment:", error);
            });
        }
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
