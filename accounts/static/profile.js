document.addEventListener('DOMContentLoaded', (event) => {
    fetchProfile();
    openTab('Posts');
});

function fetchProfile() {
    fetch('http://localhost:5000/api/profile')  // 백엔드 API에서 프로필 데이터 가져오기
        .then(response => response.json())
        .then(data => {
            // 프로필 이미지 업데이트
            console.log(data.profile_image)
            document.getElementById('profile_image').src = data.profile_image;
            // 사용자 이름, 이메일, 주소 업데이트
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('address').textContent = data.address;

            // 작성한 게시물 리스트 업데이트
            const myPostsList = document.getElementById('PostsList');
            myPostsList.innerHTML = '';  // 기존 리스트 초기화
            data.posts.forEach(post => {
                let li = document.createElement('li');
                li.textContent = post;
                myPostsList.appendChild(li);
            });

            // 좋아요한 게시물 리스트 업데이트
            const likedPostsList = document.getElementById('likedPostsList');
            likedPostsList.innerHTML = '';  // 기존 리스트 초기화
            data.likedPosts.forEach(post => {
                let li = document.createElement('li');
                li.textContent = post;
                likedPostsList.appendChild(li);
            });

            // 좋아요한 기사 리스트 업데이트
            const likedArticlesList = document.getElementById('likedArticlesList');
            likedArticlesList.innerHTML = '';  // 기존 리스트 초기화
            data.likedArticles.forEach(article => {
                let li = document.createElement('li');
                li.textContent = article;
                likedArticlesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching profile data:', error));
}
