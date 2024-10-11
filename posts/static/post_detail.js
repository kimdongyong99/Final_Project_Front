document.addEventListener('DOMContentLoaded', () => {
    const postPk = 1; // 게시글 ID는 동적으로 설정해야 함
    const apiUrl = `http://localhost:8000/api/posts/${postPk}/`; // Django API URL

    // 게시글 데이터를 가져와서 렌더링
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('post-title').textContent = data.title;
            document.getElementById('author').textContent = `작성자: ${data.author}`;
            document.getElementById('likes-count').textContent = `좋아요: ${data.likes_count}`;
            document.getElementById('post-content').textContent = data.content;
            document.querySelector('#post-image img').src = data.image;

            // 해시태그 출력
            let hashtags = '';
            data.hashtags.forEach(tag => {
                hashtags += `#${tag.name} `;
            });
            document.getElementById('hashtags').textContent = hashtags;

            // 댓글 리스트 출력
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = '';  // 기존 댓글 목록 초기화
            data.comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.className = 'comment-item';
                commentItem.innerHTML = `
                    <strong>${comment.author}</strong><br>
                    <span class="comment-content">${comment.content}</span><br>
                    <button class="btn btn-sm btn-warning edit-comment" data-id="${comment.id}">수정</button>
                    <button class="btn btn-sm btn-danger delete-comment" data-id="${comment.id}">삭제</button>
                `;
                commentsList.appendChild(commentItem);
            });

            // 이벤트 리스너 연결
            attachCommentListeners();
        })
        .catch(error => console.error('Error fetching post details:', error));

    // 댓글 작성
    document.getElementById('submit-comment').addEventListener('click', () => {
        const commentContent = document.getElementById('comment-content').value;
        if (commentContent.trim() === '') {
            alert('댓글 내용을 입력하세요.');
            return;
        }

        console.log('댓글 작성 요청 시작');

        // 댓글 작성 URL을 게시글에 맞게 설정
        fetch(`http://localhost:8000/api/posts/${postPk}/comment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: commentContent }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('댓글 작성 요청 실패');
            }
            return response.json();
        })
        .then(data => {
            console.log('댓글 작성 성공:', data);
            const commentsList = document.getElementById('comments-list');
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <strong>${data.author}</strong><br>
                <span class="comment-content">${data.content}</span><br>
                <button class="btn btn-sm btn-warning edit-comment" data-id="${data.id}">수정</button>
                <button class="btn btn-sm btn-danger delete-comment" data-id="${data.id}">삭제</button>
            `;
            commentsList.appendChild(commentItem);
            document.getElementById('comment-content').value = '';

            // 새로 추가된 댓글에 이벤트 리스너 연결
            attachCommentListeners();
        })
        .catch(error => console.error('댓글 작성 오류:', error));
    });

    // 댓글 삭제 함수
    function handleDeleteComment(event) {
        const commentId = event.target.getAttribute('data-id');
        fetch(`http://localhost:8000/api/posts/comment/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                event.target.closest('.comment-item').remove(); // 댓글 삭제
            } else {
                console.error('Error deleting comment');
            }
        })
        .catch(error => console.error('Error deleting comment:', error));
    }

    // 댓글 수정 함수
    function handleEditComment(event) {
        const commentId = event.target.getAttribute('data-id');
        const commentItem = event.target.closest('.comment-item');
        const oldContent = commentItem.querySelector('.comment-content').textContent.trim();
        const newContent = prompt('수정할 내용을 입력하세요:', oldContent);

        if (newContent && newContent !== oldContent) {
            fetch(`http://localhost:8000/api/posts/comment/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newContent }),
            })
            .then(response => response.json())
            .then(data => {
                commentItem.querySelector('.comment-content').textContent = data.content; // 수정된 내용으로 업데이트
            })
            .catch(error => console.error('Error editing comment:', error));
        }
    }

    // 댓글 수정 및 삭제 이벤트 리스너 추가 함수
    function attachCommentListeners() {
        document.querySelectorAll('.delete-comment').forEach(button => {
            button.addEventListener('click', handleDeleteComment);
        });

        document.querySelectorAll('.edit-comment').forEach(button => {
            button.addEventListener('click', handleEditComment);
        });
    }
});
