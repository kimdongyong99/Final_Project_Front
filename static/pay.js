IMP.init("imp01142555");  // 실제 프로젝트의 가맹점 식별 코드

const onClickPay = () => {
    IMP.request_pay({
        pg: "uplus",  // 실제 PG사
        pay_method: "card",   // 결제 방법
        amount: "1000",       // 결제 금액
        name: "테스트 결제",  // 상품명
        merchant_uid: "ORD" + new Date().getTime(),  // 고유한 주문번호
    }, function (rsp) {
        if (rsp.success) {
            alert("결제가 완료되었습니다.");
        } else {
            alert("결제에 실패하였습니다. 오류: " + rsp.error_msg);
        }
    });
};

document.querySelector("button").addEventListener("click", onClickPay);
