document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');  // URL에서 상품 ID 추출

    // 상품 정보 불러오기
    fetch(`https://3.38.95.210/api/payment/products/${productId}/`)
        .then(response => response.json())
        .then(product => {
            const productDetail = document.getElementById('product-detail');
            productDetail.innerHTML = `
                <img src="${product.image}" alt="${product.name} 이미지" class="product-image">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p class="product-price">${Math.floor(product.price).toLocaleString()} 원</p>
                    <p class="product-description">${product.description}</p>
                    <div class="buttons">
                        <button id="kakaopay-button">카카오페이로 결제하기</button>
                        <button id="toss-button">토스페이로 결제하기</button>
                    </div>
                </div>
            `;

            // 결제 버튼 이벤트
            const kakaopayButton = document.getElementById('kakaopay-button');
            kakaopayButton.addEventListener('click', () => checkLoginStatusAndPay(product.name, product.price, 'kakaopay', productId));

            const tossButton = document.getElementById('toss-button');
            tossButton.addEventListener('click', () => checkLoginStatusAndPay(product.name, product.price, 'uplus', productId));
        })
        .catch(error => console.error('Error:', error));
});

// 로그인 여부 확인 후 결제 처리
const checkLoginStatusAndPay = (productName, productPrice, pgType, productId) => {  // productId 인자로 추가
    const token = localStorage.getItem('access_token');

    // 로그인 상태 확인
    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = '/static/login.html';  // 로그인 페이지로 리다이렉트
        return;
    }

    // 로그인되어 있으면 결제 진행
    onClickPay(productName, productPrice, pgType, productId);
};

// 결제 요청 함수
const onClickPay = (productName, productPrice, pgType, productId) => {  // productId 인자로 추가
    IMP.init("imp01142555");  // 실제 가맹점 식별 코드

    IMP.request_pay({
        pg: pgType,  // PG사 설정 (카카오페이 또는 토스페이)
        pay_method: "card",   // 결제 방법
        amount: productPrice,  // 상품 가격
        name: productName,  // 상품명
        merchant_uid: "ORD" + new Date().getTime(),  // 고유한 주문번호
    }, function (rsp) {
        if (rsp.success) {
            // 결제 성공 시 백엔드로 결제 정보 전송
            fetch('https://3.38.95.210/api/payment/complete/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),  // 로그인한 유저의 토큰 전송
                },
                body: JSON.stringify({
                    product_id: productId,  // 결제한 상품의 ID
                    amount: rsp.paid_amount,  // 결제 금액
                    status: rsp.status,  // 결제 상태
                    imp_uid: rsp.imp_uid,  // 아임포트 고유 ID
                    merchant_uid: rsp.merchant_uid,  // 상점 고유 ID
                }),
            })
            .then(response => response.json())
            .then(data => {
                alert("결제가 완료되었습니다.");
                console.log("결제 정보 저장:", data);
            })
            .catch(error => console.error('결제 정보 저장 실패:', error));
        } else {
            alert("결제에 실패하였습니다. 오류: " + rsp.error_msg);
        }
    });
};
