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

    // 좋아요한 게시글 목록을 가져와서 추가할 수 있는 위치
    const favoriteContainer = document.getElementsByClassName('favorite-box')[0];  // 좋아요한 게시글 컨테이너
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
    const access_token = localStorage.getItem('access_token');  // localStorage에서 토큰 확인
    const username = localStorage.getItem("username");

    if (access_token && username) {
        // 사용자가 좋아요한 게시글 목록 가져오기
        await fetch(`http://127.0.0.1:8000/api/posts/like/?username=${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}` // 토큰 필요 시 사용
            }
        })
        .then(response => response.json())
        .then(data => {
            const favoriteContainer = document.getElementsByClassName('favorite-box')[0];  // 좋아요한 게시글 컨테이너
            if (favoriteContainer) {
                favoriteContainer.innerHTML = ''; // 기존 좋아요한 게시글 목록 초기화
                data.results.forEach(post => {
                    const liElement = document.createElement('li');
                    liElement.innerHTML = `<a href="/static/post_detail.html?id=${post.id}" style="text-decoration: none; color: inherit;">${post.title}</a>`; 
                    favoriteContainer.appendChild(liElement);
                });
            }
        })
        .catch(error => {
            console.error('좋아요한 게시글 목록을 불러오는 중 문제가 발생했습니다.', error);
        });
    }
}


document.addEventListener("DOMContentLoaded", async function() {

    const access_token = localStorage.getItem('access_token');  // localStorage에서 토큰 확인
    const username = localStorage.getItem("username"); 

    if (access_token) {
        const response = await fetch(`http://127.0.0.1:8000/api/accounts/${localStorage.getItem("username")}/`, {
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
        })
        .catch(error => {
            console.error('프로필 정보를 불러오는 중 문제가 발생했습니다.', error);
        });
       // 사용자가 작성한 게시글 목록 가져오기
       const postResponse = await fetch(`http://127.0.0.1:8000/api/posts/?author=${username}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }).then(response => response.json())
      .then(data => {
          displayPostList(data.results);  // 게시글 제목 목록 표시 함수 호출
      })
      .catch(error => {
          console.error('게시글 목록을 불러오는 중 문제가 발생했습니다:', error);
      });
}
});
