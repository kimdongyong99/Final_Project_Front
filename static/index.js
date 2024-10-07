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
        console.log(data); // 받은 데이터 처리
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

    // // POST 요청 예시
    // const postData = { key: 'value' };

    // fetch(apiUrl, {
    // method: 'POST',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    // body: JSON.stringify(postData),
    // })
    // .then(response => {
    //     if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log(data); // 서버에서 응답받은 데이터 처리
    // })
    // .catch(error => {
    //     console.error('There has been a problem with your fetch operation:', error);
    // });