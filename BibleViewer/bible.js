// 상수: 서버에 대한 정보
//const server_address = 'http://bibleviewer.cafe24app.com';
const server_address = 'http://localhost:8001';

// 상수: 지원하는 역본 목록
const version_name = {'korhkjv': '한글킹제임스흠정역', 'engkjv': '영어킹제임스(KJV)', 'korhrv': '한글개역성경'};

// 상수: 책에 대한 정보
const book_info = [ ['창세기', '창', 50],
                    ['출애굽기', '출', 40],
                    ['레위기', '레', 27],
                    ['민수기', '민', 36],
                    ['신명기', '신', 34],
                    ['여호수아', '수', 24],
                    ['사사기', '삿', 21],
                    ['룻기', '룻', 4],
                    ['사무엘상', '삼상', 31],
                    ['사무엘하', '삼하', 24],
                    ['열왕기상', '왕상', 22],
                    ['열왕기하', '왕하', 25],
                    ['역대상', '대상', 29],
                    ['역대하', '대하', 36],
                    ['에스라', '스(라)', 10],
                    ['느헤미야', '느', 13],
                    ['에스더', '에(더)', 10],
                    ['욥기', '욥', 42],
                    ['시편', '시', 150],
                    ['잠언', '잠', 31],
                    ['전도서', '전', 12],
                    ['아가', '아', 8],
                    ['이사야', '사', 66],
                    ['예레미야', '렘', 52],
                    ['예레미야 애가', '애', 5],
                    ['에스겔', '겔', 48],
                    ['다니엘', '단', 12],
                    ['호세아', '호', 14],
                    ['요엘', '욜', 3],
                    ['아모스', '암', 9],
                    ['오바댜', '옵', 1],
                    ['요나', '욘', 4],
                    ['미가', '미', 7],
                    ['나훔', '나', 3],
                    ['하박국', '합', 3],
                    ['스바냐', '습', 3],
                    ['학개', '학', 2],
                    ['스가랴', '슥', 14],
                    ['말라기', '말', 4],
                    ['마태복음', '마', 28],
                    ['마가복음', '막', 16],
                    ['누가복음', '눅', 24],
                    ['요한복음', '요', 21],
                    ['사도행전', '행', 28],
                    ['로마서', '롬', 16],
                    ['고린도전서', '고전', 16],
                    ['고린도후서', '고후', 13],
                    ['갈라디아서', '갈', 6],
                    ['에베소서', '엡', 6],
                    ['빌립보서', '빌', 4],
                    ['골로새서', '골', 4],
                    ['데살로니가전서', '살전', 5],
                    ['데살로니가후서', '살후', 3],
                    ['디모데전서', '딤전', 6],
                    ['디모데후서', '딤후', 4],
                    ['디도서', '딛', 3],
                    ['빌레몬서', '몬', 1],
                    ['히브리서', '히', 13],
                    ['야고보서', '약', 5],
                    ['베드로전서', '벧전', 5],
                    ['베드로후서', '벧후', 3],
                    ['요한1서', '요일', 5],
                    ['요한2서', '요이', 1],
                    ['요한3서', '요삼', 1],
                    ['유다서', '유', 1],
                    ['요한계시록', '계', 22], ];

// 저장한 값 불러오기
function loadStates() {
    // 역본 선택자 상태 복구
    let version_combos_states = JSON.parse(localStorage.getItem('version_combos'));
    if(version_combos_states) {
        let version_combos = document.querySelectorAll('#version');
        for(i=0 ; i < version_combos.length ; i++) {
            if((!version_combos[i].innerHTML) && (version_combos_states[i][1] !== -1)) {
                for(j=0 ; j < Object.keys(version_name).length ; j++) {
                    let new_combo = document.createElement('option');
                    new_combo.setAttribute('value', `${Object.keys(version_name)[j]}`);
                    new_combo.innerHTML = `${Object.values(version_name)[j]}`;
                    version_combos[i].appendChild(new_combo);
                }
            }
            version_combos[i].className = version_combos_states[i][0];
            version_combos[i].selectedIndex = parseInt(version_combos_states[i][1]);
        }
    }

    // 현재 책 복구
    let book_button = document.querySelector('#current_book');
    let current_book = JSON.parse(localStorage.getItem('current_book'));
    if(current_book) {
        book_button.innerHTML = current_book;
    }

    // 현재 장 복구
    let chapter_button = document.querySelector('#current_chapter');
    let current_chapter = JSON.parse(localStorage.getItem('current_chapter'));
    if(current_chapter) {
        chapter_button.innerHTML = current_chapter;
    }
}

// 현재 값 저장
function saveStates() {
    // 역본 선택자 상태 저장
    let version_combos = document.querySelectorAll('#version');
    let version_combos_states = [];
    for(i=0 ; i < version_combos.length ; i++) {
        version_combos_states[i] = [version_combos[i].className, version_combos[i].selectedIndex];   // class 이름과 인덱스 저장
    }

    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    // 로컬저장소에 값 저장하기
    localStorage.setItem('version_combos', JSON.stringify(version_combos_states));
    localStorage.setItem('current_book', JSON.stringify(current_book));
    localStorage.setItem('current_chapter', JSON.stringify(current_chapter));
}


// 역본 추가 버튼 클릭시
let version_add_button = document.querySelector('#version_add');
version_add_button.addEventListener('click', () => {
    // display-none이 처음 나오는 태그를 찾고, 콤보박스 추가할 것
    let empty_version_combos = document.getElementById('version_section').getElementsByClassName('display-none')[0];
    empty_version_combos.className = 'display-inline';
    if(!empty_version_combos.innerHTML) {
        for(i=0 ; i < Object.keys(version_name).length ; i++) {
            let new_combo = document.createElement('option');
            new_combo.setAttribute('value', `${Object.keys(version_name)[i]}`);
            new_combo.innerHTML = `${Object.values(version_name)[i]}`;
            empty_version_combos.appendChild(new_combo);
        }
    }
    showText();
});

// 역본 제거 버튼 클릭시
let version_del_button = document.querySelector('#version_del');
version_del_button.addEventListener('click', () => {
    // display-inline이 마지막으로 나오는 태그를 찾고, 콤보박스 숨길 것
    let last_version_combos = document.getElementById('version_section').getElementsByClassName('display-inline');
    if((last_version_combos[last_version_combos.length-1]) && (last_version_combos.length-1 !== 0)) {
        last_version_combos[last_version_combos.length-1].className = 'display-none';
    }
    showText();
});

// 역본 종류를 선택하고 키워드 입력 후 검색 버튼을 누르면 새로운 창에 결과물 보여주기
let keyword_tag = document.querySelector('#keyword_for_search');
let search_button = document.querySelector('#search_button');
search_button.addEventListener('click', search, false);
async function search() {
    let search_version_combo = document.querySelector('#version_to_search');
    let version_value = search_version_combo.options[search_version_combo.selectedIndex].value;

    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Search Results',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: `${version_value}`,
            keyword: `${keyword_tag.value}`,
        }),
    });
    let inboundText = await res.json();
    let bodyText = '';

    inboundText = inboundText.split('\n');
    inboundText = inboundText.filter((elem) => {
        // 빈 요소 제거
        return elem !== undefined && elem !== null && elem !== '';
    });
    bodyText += `<strong>총 ${inboundText.length}개의 결과를 찾았습니다.</strong><br><br>`;
    for(i=0 ; i<inboundText.length ; i++) {
        // 맨 앞의 , 기호 제거하고 책 번호 제거하기
        inboundText[i] = inboundText[i].replace(/^,/gm, '').replace(/^[0-9][0-9]/gm, '');
        bodyText += (inboundText[i] + '<br><br>');
    }

    // 검색 결과 보여주기
    let special_buttion_section = document.querySelector('#special_button_section');
    let search_result_section = document.querySelector('#search_result_section');
    special_buttion_section.classList = 'display-block';
    search_result_section.classList = 'display-block';
    search_result_section.innerHTML = bodyText;
    
    // 네비게이션 버튼 숨기기
    let navigation_section = document.querySelector('#navigation_section');
    navigation_section.classList = 'display-none';

    // 책갈피 버튼 숨기기
    let bookmark_section = document.querySelector('#bookmark_section');
    bookmark_section.classList = 'display-none';

    // 성경 본문 숨기기
    let contents = document.querySelector('#contents_section');
    contents.classList = 'display-none';
}

// 성경 보기 모드 버튼 클릭시
let text_view_mode_button = document.querySelector('#show_text_button');
text_view_mode_button.addEventListener('click', () => {
    // 검색 결과 숨기기
    let special_buttion_section = document.querySelector('#special_button_section');
    let search_result_section = document.querySelector('#search_result_section');
    special_buttion_section.classList = 'display-none';
    search_result_section.classList = 'display-none';
    
    // 네비게이션 버튼 보여주기
    let navigation_section = document.querySelector('#navigation_section');
    navigation_section.classList = 'display-block';

    // 책갈피 버튼 숨기기
    let bookmark_section = document.querySelector('#bookmark_section');
    bookmark_section.classList = 'display-block';

    // 성경 본문 보여주기
    let contents = document.querySelector('#contents_section');
    contents.classList = 'contents-style';
});

// 키보드 이벤트
document.addEventListener('keydown', checkKeyPressed, false);
function checkKeyPressed(e) {
    if(document.querySelector('#keyword_for_search') !== document.activeElement) {
        if(e.keyCode === 81)   prevBook();      // q
        if(e.keyCode === 87)   prevChapter();   // w
        if(e.keyCode === 69)   nextChapter();   // e
        if(e.keyCode === 82)   nextBook();      // r
    }
}

// 함수: 이전 책
function prevBook() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    for(i=0 ; i < book_info.length ; i++) {
        if(current_book === book_info[i][0]) {
            if(i===0) {
                current_book = book_info[book_info.length-1][0];
                break;
            } else {
                current_book = book_info[i-1][0];
                break;
            }
        }
    }

    book_button.innerHTML = current_book;
    chapter_button.innerHTML = '1장';
    showText();
}

// 함수: 이전 장
function prevChapter() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    for(i=0 ; i < book_info.length ; i++) {
        if(current_book === book_info[i][0]) {
            if(current_chapter==='1장') {
                // 이전 책의 마지막 장으로 이동
                if(i===0) {
                    book_button.innerHTML = book_info[book_info.length-1][0];
                    current_chapter = book_info[book_info.length-1][2] + '장';
                } else {
                    book_button.innerHTML = book_info[i-1][0];
                    current_chapter = book_info[i-1][2] + '장';
                }

                break;
            } else {
                let chapterNumber = parseInt(current_chapter)-1;
                current_chapter = chapterNumber + '장';
                break;
            }
        }
    }

    chapter_button.innerHTML = current_chapter;
    showText();
}

// 함수: 다음 장
function nextChapter() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    for(i=0 ; i < book_info.length ; i++) {
        if(current_book === book_info[i][0]) {
            let chapterNumber = parseInt(current_chapter);
            if(chapterNumber === book_info[i][2]) {
                // 다음 책의 1장으로 이동
                if(i===book_info.length-1) {
                    book_button.innerHTML = book_info[0][0];
                } else {
                    book_button.innerHTML = book_info[i+1][0];
                }

                chapterNumber = 1;
                current_chapter = chapterNumber + '장';
                break;
            } else {
                chapterNumber++;
                current_chapter = chapterNumber + '장';
                break;
            }
        }
    }

    chapter_button.innerHTML = current_chapter;
    showText();
}

// 함수: 다음 책
function nextBook() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    for(i=0 ; i < book_info.length ; i++) {
        if(current_book === book_info[i][0]) {
            if(i===book_info.length-1) {
                current_book = book_info[0][0];
                break;
            } else {
                current_book = book_info[i+1][0];
                break;
            }
        }
    }

    book_button.innerHTML = current_book;
    chapter_button.innerHTML = '1장';
    showText();
}

// 현재 책 버튼 (하단에 책 선택 버튼들을 보이기/숨기기)
let current_book_button = document.querySelector('#current_book');
current_book_button.addEventListener('click', () => {
    let book_buttons_div = document.querySelector('#book_buttons');
    if(book_buttons_div.className === 'display-none')
        book_buttons_div.className = 'display-block';
    else
        book_buttons_div.className = 'display-none';
});

// 현재 장 버튼 (하단에 장 선택 버튼들을 보이기/숨기기)
let current_chapter_button = document.querySelector('#current_chapter');
current_chapter_button.addEventListener('click', () => {
    let chapter_buttons_div = document.querySelector('#chapter_buttons');
    if(chapter_buttons_div.className === 'display-none')
        chapter_buttons_div.className = 'display-block';
    else
        chapter_buttons_div.className = 'display-none';

    // 단, 해당 책에서 없는 장들은 숨길 것
    let maxChapter = 150;
    for(i=0 ; i < book_info.length ; i++) {
        if(book_info[i][0] === current_book_button.innerHTML) {
            maxChapter = book_info[i][2];
            break;
        }
    }
    let chapter_button = document.querySelectorAll('#chapter_button');
    for(i=0 ; i < chapter_button.length ; i++) {
        let chapterNumber = parseInt(chapter_button[i].innerHTML);
        if(chapterNumber <= maxChapter) {
            chapter_button[i].className = 'display-inline';
        } else {
            chapter_button[i].className = 'display-none';
        }
    }
});

// 책 버튼 중 하나 클릭시
let book_buttons = document.querySelectorAll('#book_button');
for(i=0 ; i < book_buttons.length ; i++) {
    let book_button = book_buttons[i];
    book_button.addEventListener('click', () => {
        for(i=0 ; i < book_info.length ; i++) {
            if(book_info[i][1] === book_button.innerHTML) {
                current_book_button.innerHTML = book_info[i][0];
                break;
            }
        }
        let book_buttons_div = document.querySelector('#book_buttons');
        book_buttons_div.className = 'display-none';
        let current_chapter_button = document.querySelector('#current_chapter');
        current_chapter_button.innerHTML = '1장';
        showText();
    });
}

// 장 버튼 중 하나 클릭시
let chapter_buttons = document.querySelectorAll('#chapter_button');
for(i=0 ; i < chapter_buttons.length ; i++) {
    let chapter_button = chapter_buttons[i];
    chapter_button.addEventListener('click', () => {
        current_chapter_button.innerHTML = chapter_button.innerHTML;

        let chapter_buttons_div = document.querySelector('#chapter_buttons');
        chapter_buttons_div.className = 'display-none';
        showText();
    });
}

// 이전 책 버튼
let prev_book_button = document.querySelector('#prev_book');
prev_book_button.addEventListener('click', prevBook);

// 이전 장 버튼
let prev_chapter_button = document.querySelector('#prev_chapter');
prev_chapter_button.addEventListener('click', prevChapter);

// 다음 장 버튼
let next_chapter_button = document.querySelector('#next_chapter');
next_chapter_button.addEventListener('click', nextChapter);

// 다음 책 버튼
let next_book_button = document.querySelector('#next_book');
next_book_button.addEventListener('click', nextBook);

// 듣기 버튼
let listen_button = document.querySelector('#listen');
listen_button.addEventListener('click', () => {
    if(!window.speechSynthesis) {
        alert('음성 재생을 지원하지 않는 브라우저입니다.');
        return;
    }

    if(window.speechSynthesis.paused === false) {
        let text_panels = document.querySelectorAll('#bodyText');
    
        // 맨 앞의 절 번호, 괄호, 한자는 제거함, div, br 태그도 제거함
        let text_to_speech = text_panels[0].innerHTML.replace(/<p(.*?)>(.*?)<\/p>/gm, '').replace(/[\(\)\[\]{}一-龥]*/gm, '').replace(/<div class="text-line">/gm, '').replace(/<\/div>/gm, '').replace(/<br>/gm, '');
        u = new SpeechSynthesisUtterance(text_to_speech);
        u.lang = 'ko-KR';
        window.speechSynthesis.speak(u);
    } else {
        window.speechSynthesis.resume();
    }
});

// 정지 버튼
let stop_button = document.querySelector('#stop');
stop_button.addEventListener('click', () => {
    window.speechSynthesis.cancel();
});

// 일시정지 버튼
let pause_button = document.querySelector('#pause');
pause_button.addEventListener('click', () => {
    window.speechSynthesis.pause();
});

// 함수: 본문 보여주기
async function showText() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;
    
    // 책의 순번 알아내기
    let current_book_index = 0;
    for(i=0 ; i < book_info.length ; i++) {
        if(book_info[i][0] === current_book) {
            current_book_index = i + 1;
            break;
        }
    }

    // 장 번호 추출
    let current_chapter_index = parseInt(current_chapter);
    let version_combos = document.querySelectorAll('#version');
    let text_divs = document.querySelectorAll('#bodyText');
    let nShow = 0;
    for(i=0 ; i < 4 ; i++) {
        // 표시할 역본 개수
        if(version_combos[i].className !== 'display-none') {
            nShow++;
            text_divs[i].className = 'text-column';
        } else {
            text_divs[i].className = 'display-none';
        }
    }

    // 본문 내용 서버로부터 가져오기
    for(i=0 ; i < nShow ; i++) {
        let version_value = version_combos[i].options[version_combos[i].selectedIndex].value;
        if(version_value) {
            let bodyText = '';
            let horizontalLineCount = 0;
            
            const res = await fetch(`${server_address}/`, {
                method: 'POST',
                headers: {
                    'Request-Type': 'Body Text',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    version: `${version_value}`,
                    book: `${current_book_index}`,
                    chapter: `${current_chapter_index}`,
                }),
            });
            let inboundText = await res.json();

            inboundText = inboundText.split('\n');
            for(j=0 ; j<inboundText.length ; j++) {
                inboundText[j] = inboundText[j].replace(/^[0-9]+.+ [0-9]+:/gm, '');

                // 1번째 공백을 기준으로 처음 나오는 절 번호에 컬러값 부여
                let spacePos = inboundText[j].indexOf(' ');
                let statement = '<div class="text-line"><p class="verse-number">' + inboundText[j].substr(0, spacePos) + '</p>' + inboundText[j].substr(spacePos, inboundText[j].length) + '</div>';

                bodyText += statement;
                horizontalLineCount++;

                // 5절씩 끊기
                if(horizontalLineCount === 5) {
                    bodyText += '<br>';
                    horizontalLineCount = 0;
                }
            }

            text_divs[i].innerHTML = bodyText;
        }
    }

    saveStates();
}

// 함수: 본문 하이라이트
function textHilighting() {
    window.onclick = (ev) => {
        // 본문 텍스트를 클릭할 경우
        if(ev.target.tagName === 'DIV' && ev.target.className === 'text-line') {
            let elem = ev.target;
            if(elem.className === 'text-line') {
                if(elem.style.backgroundColor === "rgb(204, 204, 204)") {
                    elem.style.backgroundColor = "rgb(255, 255, 255)";
                } else {
                    elem.style.backgroundColor = "rgb(204, 204, 204)";
                }
            }
        }
    }
}

// 함수: 계정 관련 레이아웃
function personalLayout() {
    // 토큰이 존재할 경우 로그인된 상태로 취급
    let join_button = document.querySelector('#join');
    let login_button = document.querySelector('#login');
    let logout_button = document.querySelector('#logout');
    let modification_button = document.querySelector('#modification');

    if(localStorage.getItem('token')) {
        join_button.classList = 'display-none';
        login_button.classList = 'display-none';
        logout_button.classList = 'display-inline';
        modification_button.classList = 'display-inline';
    } else {
        join_button.classList = 'display-inline';
        login_button.classList = 'display-inline';
        logout_button.classList = 'display-none';
        modification_button.classList = 'display-none';
    }
}

// 로그인 버튼 누를 경우
function onLogin() {
    let id_label = document.querySelector('#id_label');
    let id_field = document.querySelector('#id');
    let password_label = document.querySelector('#password_label');
    let password_field = document.querySelector('#password');
    let confirm_button = document.querySelector('#confirm_button');

    if(id_label.className === 'display-none') {
        id_label.className = 'display-inline';
        id_field.className = 'display-inline';
        password_label.className = 'display-inline';
        password_field.className = 'display-inline';
        confirm_button.className = 'display-inline';

        document.removeEventListener('keydown', checkKeyPressed);
    } else {
        id_label.className = 'display-none';
        id_field.className = 'display-none';
        password_label.className = 'display-none';
        password_field.className = 'display-none';
        confirm_button.className = 'display-none';

        document.addEventListener('keydown', checkKeyPressed, false);
    }
}

// 함수: 로그아웃 버튼
function onLogout() {
    let welcome_message = document.querySelector('#welcome_message');
    welcome_message.className = 'display-none';
    welcome_message.innerHTML = ``;

    localStorage.removeItem('token');   // 토큰을 제거함

    // 기존 책갈피 버튼 모두 제거하고
    bookmarks = document.querySelectorAll('#bookmark');
    for(i=0 ; i<bookmarks.length ; i++) {
        bookmarks[i].parentNode.removeChild(bookmarks[i]);
    }

    // 책갈피 데이터도 제거함
    localStorage.removeItem('bookmark');

    personalLayout();
}

// 회원가입 - 확인 버튼 누를 경우
async function onJoinConfirm() {
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

// 로그인 - 확인 버튼 누를 경우
async function onLoginConfirm() {
    let id = document.querySelector('#id').value;
    let password = document.querySelector('#password').value;

    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Login Request',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: `${id}`,
            password: `${password}`,
        })
    });
    let inboundMessage = await res.json();
    if(inboundMessage.code === 200) {
        // 로그인에 성공하면 입력 필드 숨기기
        localStorage.setItem('token', inboundMessage.token);    // JWT 토큰 저장

        let id_label = document.querySelector('#id_label');
        let id_field = document.querySelector('#id');
        let password_label = document.querySelector('#password_label');
        let password_field = document.querySelector('#password');
        let confirm_button = document.querySelector('#confirm_button');

        id_field.value = '';
        password_field.value = '';

        id_label.className = 'display-none';
        id_field.className = 'display-none';
        password_label.className = 'display-none';
        password_field.className = 'display-none';
        confirm_button.className = 'display-none';

        let welcome_message = document.querySelector('#welcome_message');
        welcome_message.className = 'display-inline';
        welcome_message.innerHTML = `${inboundMessage.nickname}님 (${inboundMessage.email}), 안녕하세요!`;

        personalLayout();
        document.addEventListener('keydown', checkKeyPressed, false);
    } else {
        // 로그인에 실패하면 오류 메시지를 보여줌
        alert(`${inboundMessage.message}`);
    }

    getBookmarksFromServer();
}

// 개인정보 변경 - 확인 버튼 누를 경우
async function onChangeConfirm() {
    let token = localStorage.getItem('token');
    let old_password = document.querySelector('#old_password').value;
    let new_password = document.querySelector('#new_password').value;
    let new_password_re = document.querySelector('#new_password_re').value;
    let nickname = document.querySelector('#nickname').value;
    let email = document.querySelector('#email').value;

    let bValidInformation = true;

    // 새 비밀번호 다시 입력 체크
    if(new_password !== new_password_re) {
        alert('새 비밀번호를 다시 확인하십시오');
        let new_password_field = document.querySelector('#new_password');
        let new_password_re_field = document.querySelector('#new_password_re');
        new_password_field.value = ''
        new_password_re_field.value = '';
        bValidInformation = false;
    }

    // 입력한 정보가 유효하지 않으면 함수 중단
    if(!bValidInformation) {
        return;
    }
    
    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Change Request',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: `${token}`,
            old_password: `${old_password}`,
            new_password: `${new_password}`,
            nickname: `${nickname}`,
            email: `${email}`,
        }),
    });
    let inboundMessage = await res.json();

    if(inboundMessage.code === 200) {
        alert(`회원정보 변경을 성공했습니다.`);
        window.close();
    } else {
        alert(`회원정보 변경에 실패했습니다.\n로그아웃 후 다시 로그인하셨다가 재시도하십시오.\n${inboundMessage.message}`);
        window.close();
    }
}

// 개인정보 변경 - 탈퇴 버튼 누를 경우
async function onLeaveConfirm() {
    let token = localStorage.getItem('token');
    let old_password = document.querySelector('#old_password').value;

    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Leave Request',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: `${token}`,
            old_password: `${old_password}`,
        }),
    });
    let inboundMessage = await res.json();

    if(inboundMessage.code === 200) {
        alert(`회원 탈퇴를 성공했습니다.`);
        window.close();
    } else {
        alert(`회원 탈퇴에 실패했습니다.\n로그아웃 후 다시 로그인하셨다가 재시도하십시오.\n${inboundMessage.message}`);
        window.close();
    }
}

// 책갈피 가져오기
async function getBookmarksFromServer() {
    // 기존 책갈피 전부 제거
    localStorage.removeItem('bookmark');

    // 서버에서 책갈피 정보 다 가져와서 저장하기
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'All Bookmark Get Request',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: `${token}`,
        }),
    });
    let inboundMessage = await res.json();

    if(inboundMessage.code === 200) {
        const bookmarkInfo = inboundMessage.bookmarks;
        localStorage.setItem('bookmark', JSON.stringify(bookmarkInfo));
    } else {
        alert(`책갈피 가져오기에 실패했습니다.\n로그아웃 후 다시 로그인하셨다가 재시도하십시오.\n${inboundMessage.message}`);
    }

    showBookmarks();
}

// 책갈피 추가 버튼 클릭할 경우
async function addBookmark() {
    // prompt 창에서 책갈피 이름 입력 받음
    let tag_name = prompt('책갈피 이름을 입력하십시오.');
    if(tag_name === null) {
        tag_name = '';
    }

    // 토큰, 현재 책/장, 책갈피 이름을 서버에 전송
    const token = localStorage.getItem('token');
    const current_book_name = document.querySelector('#current_book').innerHTML;
    const current_chapter_number = document.querySelector('#current_chapter').innerHTML;

    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Bookmark Add Request',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: `${token}`,
            book: `${current_book_name}`,
            chapter: `${current_chapter_number}`,
            tag_name: `${tag_name}`,
        }),
    });
    let inboundMessage = await res.json();

    if(inboundMessage.code === 200) {
        let bookmarkInfo = [];
        const existBookmark = JSON.parse(localStorage.getItem('bookmark'));
        if(existBookmark) {
            for(i=0 ; i<existBookmark.length ; i++) {
                bookmarkInfo.push(existBookmark[i]);
            }
        }
        let newEntry = [];
        newEntry.push(inboundMessage.book);
        newEntry.push(inboundMessage.chapter);
        newEntry.push(inboundMessage.tag_name);
        bookmarkInfo.push(newEntry);
        localStorage.setItem('bookmark', JSON.stringify(bookmarkInfo));
    } else {
        alert(`책갈피 추가에 실패했습니다.\n로그아웃 후 다시 로그인하셨다가 재시도하십시오.\n${inboundMessage.message}`);
    }

    showBookmarks();
}

// 기존 책갈피 싱글-클릭할 경우 (해당 책/장으로 이동)
function moveBookmark() {
    window.onclick = (ev) => {
        if(ev.target.tagName === 'BUTTON' && ev.target.id === 'bookmark') {
            let elem = ev.target;

            const buttonText = elem.innerHTML.split(' ');
    
            let book_button = document.querySelector('#current_book');
            book_button.innerHTML = buttonText[0];
            
            let chapter_button = document.querySelector('#current_chapter');
            chapter_button.innerHTML = buttonText[1];
    
            showText();
        }
    }
}

// 기존 책갈피 더블-클릭할 경우 (책갈피 삭제)
async function delBookmark() {
    let bookmark_buttons = document.querySelectorAll('#bookmark');
    for(i=0 ; i < bookmark_buttons.length ; i++) {
        let bookmark_button = bookmark_buttons[i];
        // 토큰과 클릭한 책갈피의 책/장 이름을 서버에 전송
        const token = localStorage.getItem('token');
        const buttonText = bookmark_button.className.split('_');

        // 현재 책/장과 일치하는 책갈피 버튼을 찾아서 지움
        let current_book_button = document.querySelector('#current_book');
        let current_chapter_button = document.querySelector('#current_chapter');
        if((current_book_button.innerHTML !== buttonText[0]) || (current_chapter_button.innerHTML !== buttonText[1]))
            continue;

        const res = await fetch(`${server_address}/`, {
            method: 'POST',
            headers: {
                'Request-Type': 'Bookmark Del Request',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: `${token}`,
                book: `${buttonText[0]}`,
                chapter: `${buttonText[1]}`,
            }),
        });
        let inboundMessage = await res.json();

        if(inboundMessage.code === 200) {
            // 클릭한 책갈피의 책/장 이름을 로컬저장소에서 제거함
            const bookmarkInfo = JSON.parse(localStorage.getItem('bookmark'));

            if(bookmarkInfo) {
                let newBookmarkInfo = bookmarkInfo.filter((elem) => (elem[0] !== buttonText[0]) || (elem[1] !== buttonText[1]));

                localStorage.setItem('bookmark', JSON.stringify(newBookmarkInfo));
            }
        } else {
            alert(`책갈피 제거에 실패했습니다.\n로그아웃 후 다시 로그인하셨다가 재시도하십시오.\n${inboundMessage.message}`);
        }
    }

    showBookmarks();
}

// 기존 책갈피 표시하기
function showBookmarks() {
    // 기존 책갈피 버튼 모두 제거하고
    bookmarks = document.querySelectorAll('#bookmark');
    for(i=0 ; i<bookmarks.length ; i++) {
        bookmarks[i].parentNode.removeChild(bookmarks[i]);
    }

    const bookmarkInfo = JSON.parse(localStorage.getItem('bookmark'));
    
    // 책갈피 정보가 있으면 다시 버튼을 생성함
    if(bookmarkInfo) {
        for(i=0 ; i<bookmarkInfo.length ; i++) {
            const book = bookmarkInfo[i][0];
            const chapter = bookmarkInfo[i][1];
            const tag_name = bookmarkInfo[i][2];
    
            const targetTag = document.getElementById('bookmark_section');
            let bookmarkTag = document.createElement('button');
            bookmarkTag.setAttribute('id', 'bookmark');
            bookmarkTag.setAttribute('class', `${book}_${chapter}`);
            bookmarkTag.setAttribute('onclick', 'moveBookmark()');
            bookmarkTag.innerHTML = `${book} ${chapter} : ${tag_name}`;
    
            targetTag.appendChild(bookmarkTag);
        }
    }
}

// 함수: 다크모드 토글
function toggleDarkmode() {
    let darkmode_button = document.querySelector('#darkmode');
    if(darkmode_button.innerHTML === '어둡게') {
        // 다크 모드로 전환
        darkmode_button.innerHTML = '밝게';
        document.documentElement.setAttribute('color-theme', 'dark');
    } else {
        // 라이트 모드로 전환
        darkmode_button.innerHTML = '어둡게';
        document.documentElement.setAttribute('color-theme', 'light');
    }
}

// 실제 호출부
let current_book = '';      // 현재 선택한 책 (창세기, 출애굽기 등)
let current_chapter = 0;    // 현재 선택한 장

loadStates();
showBookmarks();
showText();
textHilighting();
personalLayout();