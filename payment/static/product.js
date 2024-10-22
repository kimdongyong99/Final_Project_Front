document.addEventListener("DOMContentLoaded", () => {
    fetch('https://3.38.95.210/api/payment/products/')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            
            // data에 직접 상품 목록이 있으므로 data에 대해 forEach를 사용
            data.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                
                // 카드 클릭 시 상세 페이지로 이동하도록 이벤트 추가
                productItem.addEventListener('click', () => {
                    window.location.href = `/static/product_detail.html?id=${product.id}`;
                });

                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name} 이미지">
                    <h2>${product.name}</h2>
                    <p>가격: ${Math.floor(product.price).toLocaleString()} 원</p>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error:', error));
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