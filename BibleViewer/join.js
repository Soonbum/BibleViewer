// 상수: 서버에 대한 정보
//const server_address = 'http://bibleviewer.cafe24app.com';
const server_address = 'http://localhost:8001';

// 확인 버튼 누를 경우
async function onConfirm() {
    let id = document.querySelector('#id').value;
    let password = document.querySelector('#password').value;
    let password_re = document.querySelector('#password_re').value;
    let nickname = document.querySelector('#nickname').value;
    let email = document.querySelector('#email').value;

    let bValidInformation = true;

    // 비밀번호 다시 입력 체크
    if(password !== password_re) {
        alert('비밀번호를 다시 확인하십시오.');
        let password_field = document.querySelector('#password');
        let password_re_field = document.querySelector('#password_re');
        password_field.value = ''
        password_re_field.value = '';
        bValidInformation = false;
    }

    // 입력한 정보가 유효하지 않으면 함수 중단
    if(!bValidInformation) {
        return;
    }

    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Join Request',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: `${id}`,
            password: `${password}`,
            nickname: `${nickname}`,
            email: `${email}`,
        }),
    });
    let inboundMessage = await res.json();
    inboundMessage = inboundMessage.split(',');
    let showMessage = '';
    for(i=0 ; i<inboundMessage.length ; i++) {
        showMessage += inboundMessage[i] + '\n';
    }
    alert(`${showMessage}`);

    if(showMessage.includes('회원가입에 성공했습니다.') === true) {
        window.close();
    }
}
