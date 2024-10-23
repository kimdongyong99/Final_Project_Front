function displayPostList(posts) {
    const containers = document.getElementsByClassName('profile-post-list');
    
    // 컨테이너가 존재하지 않으면 오류 출력
    if (containers.length === 0) {
        console.error("게시글 제목을 표시할 컨테이너가 없습니다.");
        return;
    }

    const container = containers[0]; // 첫 번째 컨테이너를 선택
    console.log(container);  // container가 ul 요소인지 확인

    // 컨테이너가 ul 요소인지 확인
    if (!(container instanceof HTMLUListElement)) {
        console.error("선택된 컨테이너는 ul 요소가 아닙니다.");
        return;
    }

    const ulElement = document.createElement('li');

    // posts 배열에서 각 게시글을 순회하면서 목록에 추가
    posts.forEach(post => {
        const liElement = document.createElement('li');
        liElement.innerHTML = `<a href="/static/post_detail.html?id=${post.id}" style="text-decoration: none; color: inherit;">${post.title}</a>`; 
        container.appendChild(liElement); 
    });

    // 좋아요한 게시글 목록을 가져와서 추가
    const favoriteContainer = document.getElementsByClassName('profile-liked-postlist')[0];  // 좋아요한 게시글 컨테이너
    if (favoriteContainer) {
        // 좋아요한 게시글 추가 처리
        favoriteContainer.innerHTML = ''; // 기존 좋아요한 게시글 목록 초기화
        posts.forEach(post => {
            const liElement = document.createElement('li');
            liElement.innerHTML = `<a href="/static/post_detail.html?id=${post.id}" style="text-decoration: none; color: inherit;">${post.title}</a>`; 
            favoriteContainer.appendChild(liElement);
        });
    }
}

// 좋아요한 게시글을 가져와서 표시하는 함수 추가
async function displayLikedPosts() {
    const access_token = localStorage.getItem('access_token');
    const username = localStorage.getItem("username");

    if (access_token && username) {
        try {
            // 사용자가 좋아요한 게시글 목록 가져오기
            const response = await fetch(`https://afitday.shop/api/posts/${username}/liked_posts`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}` // 토큰 필요 시 사용
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const favoriteContainer = document.getElementsByClassName('profile-liked-postlist')[0];  // 좋아요한 게시글 컨테이너
            if (favoriteContainer) {
                favoriteContainer.innerHTML = ''; // 기존 좋아요한 게시글 목록 초기화

                data.results.forEach(post => {
                    const liElement = document.createElement('li');
                    const postDetailUrl = `/static/post_detail.html?id=${post.id}`;  // 게시글 ID로 상세 페이지 링크 생성
                    liElement.innerHTML = `<a href="${postDetailUrl}" style="text-decoration: none; color: inherit;">${post.title}</a>`; 
                    favoriteContainer.appendChild(liElement);
                });
            }
        } catch (error) {
            console.error('좋아요한 게시글 목록을 불러오는 중 문제가 발생했습니다:', error);
        }
    }
}

// 좋아요한 기사 목록을 가져와서 표시하는 함수 추가
async function displayLikedArticles() {
    const access_token = localStorage.getItem('access_token');
    const username = localStorage.getItem("username");

    if (access_token && username) {
        try {
            // 사용자가 좋아요한 기사 목록 가져오기
            const response = await fetch(`https://afitday.shop/api/articles/${username}/liked_articles`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}` // 토큰 필요 시 사용
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const articleContainer = document.getElementsByClassName('profile-liked-articlelist')[0];  // 좋아요한 기사 컨테이너
            if (articleContainer) {
                articleContainer.innerHTML = ''; // 기존 좋아요한 기사 목록 초기화
                data.results.forEach(article => {
                    const liElement = document.createElement('li');
                    liElement.innerHTML = `<a href="/static/detail.html?id=${article.id}" style="text-decoration: none; color: inherit;">${article.title}</a>`;
                    
                    // 구분선 추가
                    const hrElement = document.createElement('hr');
                    liElement.appendChild(hrElement);  // 각 기사 아래에 구분선 추가

                    articleContainer.appendChild(liElement);
                });
            }
        } catch (error) {
            console.error('좋아요한 기사 목록을 불러오는 중 문제가 발생했습니다:', error);
        }
    }
}

document.addEventListener("DOMContentLoaded", async function() {

    const access_token = localStorage.getItem('access_token');  // localStorage에서 토큰 확인
    const username = localStorage.getItem("username"); 

    if (access_token) {
        const response = await fetch(`https://afitday.shop/api/accounts/${localStorage.getItem("username")}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}` // 토큰 필요 시 사용
            }
        }).then(response => response.json()).then(data=> {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('address').textContent = data.address;
            document.getElementById("detail_address").textContent = data.detail_address;
            console.log(data);

            // 프로필 이미지 설정
            const profileImage = document.getElementById('my-profile');
            if (data.profile_image) {
                // 서버에서 받은 프로필 이미지 경로 설정
                profileImage.src = `https://afitday.shop${data.profile_image}`;
            } else {
                // 기본 이미지 설정 (프로필 이미지가 없는 경우)
                profileImage.src = '/static/human.png';
            }

            console.log(data);  // 데이터를 확인
        })
        .catch(error => {
            console.error('프로필 정보를 불러오는 중 문제가 발생했습니다.', error);
        });

        // 사용자가 작성한 게시글 목록 가져오기
        await fetch(`https://afitday.shop/api/posts/?author=${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            displayPostList(data.results);  // 게시글 제목 목록 표시 함수 호출
        })
        .catch(error => {
            console.error('게시글 목록을 불러오는 중 문제가 발생했습니다.', error);
        });

        // 좋아요한 게시글 목록 표시
        await displayLikedPosts();
        // 좋아요한 기사 목록 표시
        await displayLikedArticles();  // 좋아요한 기사 목록 표시
    }
});

    // 회원 정보 수정 버튼 클릭 시 profile_update.html로 이동
    const profileEditButton = document.getElementById('profile-edit-btn');
    profileEditButton.addEventListener('click', function(event) {
        event.preventDefault();  // 기본 동작 막기
        window.location.href = '/static/profile_update.html';  // profile_update.html로 이동
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
