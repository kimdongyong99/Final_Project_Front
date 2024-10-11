const apiUrl = 'http://127.0.0.1:8000/api/posts/<int:post_pk>/';
// API URL

// GET 요청
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        post_data = data;
        fetchPosts(post_data)
        // console.log(data); // 받은 데이터 처리
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });