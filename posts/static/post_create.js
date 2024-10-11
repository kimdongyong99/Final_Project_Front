

// POST 요청을 보낼 함수
async function sendPostRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // 응답이 성공적일 경우
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('응답 데이터:', jsonResponse);
        } else {
            console.error('HTTP 오류:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('요청 중 오류 발생:', error);
    }
}

// 사용 예
const apiUrl = 'http://127.0.0.1:8000/api/posts/'; // API URL을 입력하세요
const postData = {
    key1: 'title',
    key2: 'content',
    key3: 'image',
    // 필요한 데이터를 여기에 추가하세요
};

// POST 요청 실행
sendPostRequest(apiUrl, postData);
