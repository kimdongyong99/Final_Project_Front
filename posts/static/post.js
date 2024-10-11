const apiUrl = 'http://127.0.0.1:8000/api/posts/';
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

// API에서 JSON 데이터를 가져오는 함수
async function fetchPosts(post_data) {
    // try {
    //     const response = await fetch('http://127.0.0.1:8000/api/posts/')
    //     if (!response.ok) {
    //         throw new Error('네트워크 오류');
    //     }
    //     const posts = await response.json();
    //     displayPosts(posts);
    // } catch (error) {
    //     console.error('데이터를 가져오는 중 오류 발생:', error);
    // }
    displayPosts(post_data);
}

// 데이터를 HTML에 표시하는 함수
// function displayPosts(data) {
//     const container = document.getElementById('data-container');
//     container.innerHTML = `
//     <table>
//         <thead>
//             <tr>제목</tr>
//             <tr>작성자</tr>
//             <tr>좋아요</tr>
//             <tr>이미지</tr>
//         </thead>
//         <tbody>
//     `; // 기존 내용을 지움
//     container.append(div);

//     const posts = data.results || []; // results 배열 가져오기

//     posts.forEach(post => {
//         // const div = document.createElement('div');
//         div.classList.add('post');
//         console.log(post)
//         // div.innerHTML = `
//         //     <h2>${post.title}</h2>
//         //     <p>작성자: ${post.author}</p>
//         //     <p>좋아요 수: ${post.likes_count}</p>
//         //     ${post.image ? `<img src = '${post.image}'>` : '-'}
//         // `;
//         div.innerHTML = `
//             <td>${post.title}</td>
//             <td>${post.auther}</td>
//             <td>${post.likes_count}</td>
//             <td>${post.image ? `<img src = '${post.image}'>` : '-'}</td>
//         `;
//         container.append(div);
//     });

//     container.innerHTML = `
//     </tbody>
//     </table>`


// }

function displayPosts(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = `
    <table>
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
 // results 배열 가져오기
    const posts = data.results || [];
    

    posts.forEach(post => {
        container.innerHTML += `
            <tr>
            <p></p>
                <td>${post.author}</td>
                <td>${post.image ? `<img src='${post.image}'` : '-'}</td>
                <td>${post.title}</td>
                <td>${post.likes_count}</td>
            </tr>
        `;
    });

    container.innerHTML += `
        </tbody>
    </table>
    `; // 테이블 바디 종료
}

// 페이지 로드 시 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});

