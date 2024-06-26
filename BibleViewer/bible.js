// 추후 개발하고 싶은 항목:
// 밑줄 저장 기능, 메모 기능, 방문자 기록 기능, 관리자 페이지(읽기 체크 초기화, 역본/여백/장 표시 설정, 개인 데이터 백업/복구, 자동 백업), 읽기 체크 기능

// 서버 주소
//const server_address = 'http://bibleviewer.cafe24app.com';
const server_address = 'http://localhost:8001';

// 멤버십 필드 초기화
join.classList = 'show';
login.classList = 'show';
logout.classList = 'hidden';
modification.classList = 'hidden';
id_label.classList = 'hidden';
id.classList = 'hidden';
password_label.classList = 'hidden';
password.classList = 'hidden';
confirm_button.classList = 'hidden';
welcome_message.classList = 'hidden';

// 역본 목록
const version_name = {'korhkjv': '한글킹제임스흠정역', 'engkjv': '영어킹제임스(KJV)', 'korhrv': '한글개역성경'};

// 책 정보
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
                    ['예레미야애가', '애', 5],
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

// 새로고침 후에도 다크모드 상태 고정
if (localStorage.getItem('darkmode_button') !== null) {
    if (localStorage.getItem('darkmode_button') !== darkmode_button.innerHTML)
        darkmode();
}

// 책, 장 버튼 숨김
document.getElementById('book_button_collection').classList = 'hidden';
document.getElementById('chapter_button_collection').classList = 'hidden';

// 검색 결과 숨김
document.getElementById('section_search_result').classList = 'hidden';

// 역본 개수 초기화
if (localStorage.getItem('version_combos') !== null) {
    // 역본 선택자 상태 저장 (초기화 때문에 필요함)
    if (localStorage.getItem('version_combos') === null) {
        let version_combos = document.querySelectorAll('#version');
        let version_combos_states = [];
        for(i=0 ; i < version_combos.length ; i++) {
            version_combos_states[i] = [version_combos[i].className, version_combos[i].selectedIndex];   // class 이름과 인덱스 저장
        }
        localStorage.setItem('version_combos', JSON.stringify(version_combos_states));
    }

    // 역본 선택자 상태 복구
    version_combos_states = JSON.parse(localStorage.getItem('version_combos'));
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
    
    // 역본 선택자 이벤트 리스너 부착 (상태 변경할 때마다 상태 저장)
    let version_combos = document.querySelectorAll('#version');
    version_combos.forEach((combo) => {
        combo.addEventListener('change', function() {
            // 역본 선택자 상태 저장
            let version_combos = document.querySelectorAll('#version');
            let version_combos_states = [];
            for(i=0 ; i < version_combos.length ; i++) {
                version_combos_states[i] = [version_combos[i].className, version_combos[i].selectedIndex];   // class 이름과 인덱스 저장
            }
            localStorage.setItem('version_combos', JSON.stringify(version_combos_states));

            showText();
        });
    });
}

// 현재 책 정보 불러오기
let current_book = document.getElementById('current_book_button');
if (localStorage.getItem('current_book') !== null) {
    current_book.innerHTML = JSON.parse(localStorage.getItem('current_book'));
}

// 현재 장 정보 불러오기
let current_chapter = document.getElementById('current_chapter_button');
if (localStorage.getItem('current_chapter') !== null) {
    current_chapter.innerHTML = JSON.parse(localStorage.getItem('current_chapter'));

    showText();
}

// 네비게이션 버튼 내용 조정
if (isMobile()) {
    prev_book_button.innerHTML = "이전 책";
    prev_chapter_button.innerHTML = "이전 장";
    next_chapter_button.innerHTML = "다음 장";
    next_book_button.innerHTML = "다음 책"
} else {
    prev_book_button.innerHTML = "이전 책 (q)";
    prev_chapter_button.innerHTML = "이전 장 (w)";
    next_chapter_button.innerHTML = "다음 장 (e)";
    next_book_button.innerHTML = "다음 책 (r)"
}

// 역본 추가 버튼
version_add.onclick = function() {
    // hidden이 처음 나오는 태그를 찾고, 콤보박스 추가할 것
    let empty_version_combos = document.querySelector('#version.hidden');
    if (empty_version_combos) {
        empty_version_combos.className = 'show';
        if(!empty_version_combos.innerHTML) {
            for(i=0 ; i < Object.keys(version_name).length ; i++) {
                let new_combo = document.createElement('option');
                new_combo.setAttribute('value', `${Object.keys(version_name)[i]}`);
                new_combo.innerHTML = `${Object.values(version_name)[i]}`;
                empty_version_combos.appendChild(new_combo);
            }
        }
    }

    // 역본 선택자 상태 저장
    let version_combos = document.querySelectorAll('#version');
    let version_combos_states = [];
    for(i=0 ; i < version_combos.length ; i++) {
        version_combos_states[i] = [version_combos[i].className, version_combos[i].selectedIndex];   // class 이름과 인덱스 저장
    }
    localStorage.setItem('version_combos', JSON.stringify(version_combos_states));

    showText();
}

// 역본 삭제 버튼
version_del.onclick = function() {
    // display-inline이 마지막으로 나오는 태그를 찾고, 콤보박스 숨길 것
    let last_version_combos = document.querySelectorAll('#version.show');
    if((last_version_combos[last_version_combos.length-1]) && (last_version_combos.length-1 !== 0)) {
        last_version_combos[last_version_combos.length-1].className = 'hidden';
    }
   
    // 역본 선택자 상태 저장
    let version_combos = document.querySelectorAll('#version');
    let version_combos_states = [];
    for(i=0 ; i < version_combos.length ; i++) {
        version_combos_states[i] = [version_combos[i].className, version_combos[i].selectedIndex];   // class 이름과 인덱스 저장
    }
    localStorage.setItem('version_combos', JSON.stringify(version_combos_states));

    showText();
}

// 키보드 이벤트 추가
document.addEventListener('keydown', checkKeyPressed, false);
function checkKeyPressed(e) {
    if(document.querySelector('#keyword_for_search') !== document.activeElement) {
        if(e.keyCode === 81)   prev_book_button.onclick();     // q
        if(e.keyCode === 87)   prev_chapter_button.onclick();  // w
        if(e.keyCode === 69)   next_chapter_button.onclick();  // e
        if(e.keyCode === 82)   next_book_button.onclick();     // r
    }
}

// 어둡게/밝게 버튼
function darkmode() {
    let darkmode_button = document.querySelector('#darkmode_button');
    const allElements = document.querySelectorAll('*');

    // 컬러 모드 변경
    if (darkmode_button.innerHTML === '어둡게') {
        // 다크 모드로 전환
        darkmode_button.innerHTML = '밝게';
        localStorage.setItem('darkmode_button', '밝게');
        allElements.forEach(element => {
            element.setAttribute('color-theme', 'dark');
        });
    } else {
        // 라이트 모드로 전환
        darkmode_button.innerHTML = '어둡게';
        localStorage.setItem('darkmode_button', '어둡게');
        allElements.forEach(element => {
            element.setAttribute('color-theme', 'light');
        });
    }
}

// 글자 작게 버튼
smaller_text_button.onclick = function() {
    let bodyText = document.getElementById('bodyText');
    let fontSize = parseInt(localStorage.getItem('font_size'));
    if (fontSize > 8) {
        fontSize -= 2;
        bodyText.style.fontSize = fontSize + 'px';
        localStorage.setItem('font_size', fontSize + 'px');
    }
}

// 글자 크게 버튼
bigger_text_button.onclick = function() {
    let bodyText = document.getElementById('bodyText');
    let fontSize = parseInt(localStorage.getItem('font_size'));
    if (fontSize < 30) {
        fontSize += 2;
        bodyText.style.fontSize = fontSize + 'px';
        localStorage.setItem('font_size', fontSize + 'px');
    }
}

// 검색 버튼
search_button.addEventListener('click', search, false);
async function search() {
    const search_keyword = document.querySelector('#keyword_for_search').value;
    const search_version_combo = document.querySelector('#version_to_search');
    let version_keyword = search_version_combo.options[search_version_combo.selectedIndex].value;

    const res = await fetch(`${server_address}/`, {
        method: 'POST',
        headers: {
            'Request-Type': 'Search Results',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: `${version_keyword}`,
            keyword: `${search_keyword}`,
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
    if (document.querySelector('#section_search_result').classList.contains('hidden')) {
        document.querySelector('#section_search_result').classList.remove('hidden');
        document.querySelector('#section_search_result').classList.add('block');
    }
    
    let search_result_text_field = document.querySelector('#search_result_text');
    if (search_result_text.classList.contains('hidden')) {
        search_result_text.classList.remove('hidden');
        search_result_text.classList.add('show');
    }
    search_result_text.innerHTML = bodyText;

    if (document.querySelector('#show_text_button').classList.contains('hidden')) {
        document.querySelector('#show_text_button').classList.remove('hidden');
        document.querySelector('#show_text_button').classList.add('show');
    }

    // 버전 콤보박스 숨기기
    if (!document.querySelector('#section_version').classList.contains('hidden')) {
        document.querySelector('#section_version').classList.remove('block');
        document.querySelector('#section_version').classList.add('hidden');
    }
    document.querySelectorAll('#version').forEach((element) => {
        if (!element.classList.contains('hidden')) {
            element.classList.remove('show');
            element.classList.add('hidden');
        }
    });
    if (!document.querySelector('#version_add').classList.contains('hidden')) {
        document.querySelector('#version_add').classList.remove('show');
        document.querySelector('#version_add').classList.add('hidden');
    }
    if (!document.querySelector('#version_del').classList.contains('hidden')) {
        document.querySelector('#version_del').classList.remove('show');
        document.querySelector('#version_del').classList.add('hidden');
    }

    // 책 정보 버튼 숨기기
    if (!document.querySelector('#section_bookselect').classList.contains('hidden')) {
        document.querySelector('#section_bookselect').classList.remove('block');
        document.querySelector('#section_bookselect').classList.add('hidden');
    }

    // 네비게이션 버튼 숨기기
    if (!document.querySelector('#section_navigate').classList.contains('hidden')) {
        document.querySelector('#section_navigate').classList.remove('block');
        document.querySelector('#section_navigate').classList.add('hidden');
    }

    // 오디오 버튼 숨기기
    if (!document.querySelector('#section_audio').classList.contains('hidden')) {
        document.querySelector('#section_audio').classList.remove('block');
        document.querySelector('#section_audio').classList.add('hidden');
    }

    // 책갈피 버튼 숨기기
    if (!document.querySelector('#section_bookmark').classList.contains('hidden')) {
        document.querySelector('#section_bookmark').classList.remove('block');
        document.querySelector('#section_bookmark').classList.add('hidden');
    }

    // 성경 본문 숨기기
    if (!document.querySelector('#section_contents').classList.contains('hidden')) {
        document.querySelector('#section_contents').classList.remove('block');
        document.querySelector('#section_contents').classList.add('hidden');
    }
    document.querySelectorAll('#bodyText').forEach((element) => {
        if (!element.classList.contains('hidden')) {
            element.classList.remove('show');
            element.classList.add('hidden');
        }
    });
}

// 성경 보기 모드 버튼
show_text_button.onclick = function() {
    // 검색 결과 숨기기
    if (!document.querySelector('#section_search_result').classList.contains('hidden')) {
        document.querySelector('#section_search_result').classList.remove('block');
        document.querySelector('#section_search_result').classList.add('hidden');
    }

    let search_result_text_field = document.querySelector('#search_result_text');
    if (search_result_text.classList.contains('show')) {
        search_result_text.classList.remove('show');
        search_result_text.classList.add('hidden');
    }

    if (document.querySelector('#show_text_button').classList.contains('show')) {
        document.querySelector('#show_text_button').classList.remove('show');
        document.querySelector('#show_text_button').classList.add('hidden');
    }

    // 버전 콤보박스 보여주기
    if (document.querySelector('#section_version').classList.contains('hidden')) {
        document.querySelector('#section_version').classList.remove('hidden');
        document.querySelector('#section_version').classList.add('block');
    }
    document.querySelectorAll('#version').forEach((element) => {
        version_combos_states = JSON.parse(localStorage.getItem('version_combos'));
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
    });
    if (!document.querySelector('#version_add').classList.contains('show')) {
        document.querySelector('#version_add').classList.remove('hidden');
        document.querySelector('#version_add').classList.add('show');
    }
    if (!document.querySelector('#version_del').classList.contains('show')) {
        document.querySelector('#version_del').classList.remove('hidden');
        document.querySelector('#version_del').classList.add('show');
    }

    // 책 정보 버튼 보여주기
    if (document.querySelector('#section_bookselect').classList.contains('hidden')) {
        document.querySelector('#section_bookselect').classList.remove('hidden');
        document.querySelector('#section_bookselect').classList.add('block');
    }

    // 네비게이션 버튼 보여주기
    if (document.querySelector('#section_navigate').classList.contains('hidden')) {
        document.querySelector('#section_navigate').classList.remove('hidden');
        document.querySelector('#section_navigate').classList.add('block');
    }

    // 오디오 버튼 보여주기
    if (document.querySelector('#section_audio').classList.contains('hidden')) {
        document.querySelector('#section_audio').classList.remove('hidden');
        document.querySelector('#section_audio').classList.add('block');
    }

    // 책갈피 버튼 보여주기
    if (document.querySelector('#section_bookmark').classList.contains('hidden')) {
        document.querySelector('#section_bookmark').classList.remove('hidden');
        document.querySelector('#section_bookmark').classList.add('block');
    }

    // 성경 본문 보여주기
    if (document.querySelector('#section_contents').classList.contains('hidden')) {
        document.querySelector('#section_contents').classList.remove('hidden');
        document.querySelector('#section_contents').classList.add('block');
    }
    document.querySelectorAll('#bodyText').forEach((element) => {
        showText();
    });
}

// 이전 책 버튼
prev_book_button.onclick = function() {
    let current_book = document.getElementById('current_book_button');
    let current_chapter = document.getElementById('current_chapter_button');

    for(i=0 ; i<book_info.length ; i++) {
        if (current_book.innerHTML === book_info[i][0]) {
            if (i === 0) {
                current_book.innerHTML = book_info[book_info.length-1][0];
                break;
            } else {
                current_book.innerHTML = book_info[i-1][0];
                break;
            }
        }
    }

    current_chapter.innerHTML = '1장';

    localStorage.setItem('current_book', JSON.stringify(current_book.innerHTML));

    document.getElementById('book_button_collection').classList = 'hidden';
    document.getElementById('chapter_button_collection').classList = 'hidden';

    showText();
}

// 이전 장 버튼
prev_chapter_button.onclick = function() {
    let current_book = document.getElementById('current_book_button');
    let current_chapter = document.getElementById('current_chapter_button');

    // 현재 장수가 1장이면 이전 책의 마지막 장으로 이동
    // 그 외의 경우 이전 장으로 이동
    if (current_chapter.innerHTML === '1장') {
        for(i=0 ; i<book_info.length ; i++) {
            if (current_book.innerHTML === book_info[i][0]) {
                if (i == 0) {
                    current_book.innerHTML = book_info[book_info.length-1][0];
                    current_chapter.innerHTML = book_info[book_info.length-1][2] + '장';
                    break;
                } else {
                    current_book.innerHTML = book_info[i-1][0];
                    current_chapter.innerHTML = book_info[i-1][2] + '장';
                    break;
                }
            }
        }
    } else {
        current_chapter.innerHTML = (parseInt(current_chapter.innerHTML) - 1) + '장';
    }

    localStorage.setItem('current_book', JSON.stringify(current_book.innerHTML));
    localStorage.setItem('current_chapter', JSON.stringify(current_chapter.innerHTML));

    document.getElementById('book_button_collection').classList = 'hidden';
    document.getElementById('chapter_button_collection').classList = 'hidden';

    showText();
}

// 다음 장 버튼
next_chapter_button.onclick = function() {
    let current_book = document.getElementById('current_book_button');
    let current_chapter = document.getElementById('current_chapter_button');

    // 현재 장수가 마지막 장이면 다음 책의 1장으로 이동
    // 그 외의 경우 현재 책의 마지막 장을 넘기 전까지 다음 장으로 이동
    if (current_chapter.innerHTML === book_info[book_info.length-1][2] + '장') {
        for(i=0 ; i<book_info.length ; i++) {
            if (current_book.innerHTML === book_info[i][0]) {
                if (i == book_info.length-1) {
                    current_book.innerHTML = book_info[0][0];
                    current_chapter.innerHTML = '1장';
                    break;
                } else {
                    current_book.innerHTML = book_info[i+1][0];
                    current_chapter.innerHTML = '1장';
                    break;
                }
            }
        }
    } else {
        for(i=0 ; i<book_info.length ; i++) {
            if (current_book.innerHTML === book_info[i][0]) {
                if (parseInt(current_chapter.innerHTML) === book_info[i][2]) {
                    current_chapter.innerHTML = '1장';
                    if (i == book_info.length-1) {
                        current_book.innerHTML = book_info[0][0];
                        break;
                    } else {
                        current_book.innerHTML = book_info[i+1][0];
                        break;
                    }
                } else {
                    current_chapter.innerHTML = (parseInt(current_chapter.innerHTML) + 1) + '장';
                    break;
                }
            }
        }
    }

    localStorage.setItem('current_book', JSON.stringify(current_book.innerHTML));
    localStorage.setItem('current_chapter', JSON.stringify(current_chapter.innerHTML));

    document.getElementById('book_button_collection').classList = 'hidden';
    document.getElementById('chapter_button_collection').classList = 'hidden';

    showText();
}

// 다음 책 버튼
next_book_button.onclick = function() {
    let current_book = document.getElementById('current_book_button');
    let current_chapter = document.getElementById('current_chapter_button');

    for(i=0 ; i<book_info.length ; i++) {
        if (current_book.innerHTML === book_info[i][0]) {
            if (i === book_info.length-1) {
                current_book.innerHTML = book_info[0][0];
                break;
            } else {
                current_book.innerHTML = book_info[i+1][0];
                break;
            }
        }
    }

    current_chapter.innerHTML = '1장';

    localStorage.setItem('current_book', JSON.stringify(current_book.innerHTML));

    document.getElementById('book_button_collection').classList = 'hidden';
    document.getElementById('chapter_button_collection').classList = 'hidden';

    showText();
}

// 현재 책 버튼
current_book_button.onclick = function() {
    removeBrTags('book_button_collection1');
    removeBrTags('book_button_collection2');

    // 장 선택 버튼은 숨김
    document.getElementById('chapter_button_collection').classList = 'hidden';

    if (document.getElementById('book_button_collection').classList.contains('show')) {
        document.getElementById('book_button_collection').classList = 'hidden';
    } else {
        document.getElementById('book_button_collection').classList = 'show';
    }

    if (isMobile()) {
        addBrTags('book_button_collection1', 5);
        addBrTags('book_button_collection2', 5);
    } else {
        addBrTags('book_button_collection1', 10);
        addBrTags('book_button_collection2', 10);
    }
}

// 현재 장 버튼
current_chapter_button.onclick = function() {
    removeBrTags('chapter_button_collection');

    // 책 선택 버튼은 숨김
    document.getElementById('book_button_collection').classList = 'hidden';

    if (document.getElementById('chapter_button_collection').classList.contains('show')) {
        document.getElementById('chapter_button_collection').classList = 'hidden';
    } else {
        document.getElementById('chapter_button_collection').classList = 'show';

        // 현재 책에 해당하는 장 버튼만 보여주거나 숨김
        for(i=0 ; i<book_info.length ; i++) {
            if (current_book.innerHTML === book_info[i][0]) {
                let max_chapter = book_info[i][2];

                let all_chapter_button = document.querySelectorAll('#chapter_button');
                for(j=0 ; j<all_chapter_button.length ; j++) {
                    let chapter_number = parseInt(all_chapter_button[j].innerHTML.replace('장', ''));
                    if (chapter_number > max_chapter) {
                        all_chapter_button[j].classList = 'hidden';
                    } else {
                        all_chapter_button[j].classList = 'show';
                    }
                }

                break;
            }
        }
    }

    if (isMobile()) {
        addBrTags('chapter_button_collection', 5);
    } else {
        addBrTags('chapter_button_collection', 10);
    }
}

// 책 버튼 중 하나를 클릭할 경우
let all_book_button = document.getElementById('book_button_collection').querySelectorAll('#book_button');
all_book_button.forEach((button) => {
    button.addEventListener('click', (e) => {
        let clicked_button_name = event.target.innerHTML;
        
        for (i=0 ; i<book_info.length ; i++) {
            if (clicked_button_name === book_info[i][1]) {
                document.getElementById('current_book_button').innerHTML = book_info[i][0];
                document.getElementById('current_chapter_button').innerHTML = '1장';

                localStorage.setItem('current_book', JSON.stringify(book_info[i][0]));
                localStorage.setItem('current_chapter', JSON.stringify('1장'));

                document.getElementById('book_button_collection').classList = 'hidden';
                document.getElementById('chapter_button_collection').classList = 'hidden';

                break;
            }
        }

        showText();
    });
});

// 장 버튼 중 하나를 클릭할 경우
let all_chapter_button = document.getElementById('chapter_button_collection').querySelectorAll('#chapter_button');
all_chapter_button.forEach((button) => {
    button.addEventListener('click', (e) => {
        let clicked_button_name = event.target.innerHTML;

        document.getElementById('current_chapter_button').innerHTML = clicked_button_name;

        localStorage.setItem('current_chapter', JSON.stringify(clicked_button_name));

        document.getElementById('book_button_collection').classList = 'hidden';
        document.getElementById('chapter_button_collection').classList = 'hidden';

        showText();
    });
});

// 성경 본문 표시
async function showText() {
    // 현재 선택한 책, 장 알아내기
    let current_book = document.querySelector('#current_book_button').innerHTML;
    let current_chapter = document.querySelector('#current_chapter_button').innerHTML;

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
    for(i=0 ; i < 3 ; i++) {
        // 표시할 역본 개수
        if(version_combos[i].className !== 'hidden') {
            nShow++;
            text_divs[i].className = 'show';
        } else {
            text_divs[i].className = 'hidden';
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

            horizontalLineCount = 0;
            inboundText = inboundText.split('\n');
            for(j=0 ; j<inboundText.length ; j++) {
                // 서버에서 받은 텍스트를 정리함
                inboundText[j] = inboundText[j].replace(/^[0-9]+.+ [0-9]+:/gm, '');

                // 1번째 공백을 기준으로 처음 나오는 절 번호 위치를 골라냄
                let spacePos = inboundText[j].indexOf(' ');
                // 절 번호: inboundText[j].substr(0, spacePos), 절 내용: inboundText[j].substr(spacePos, inboundText[j].length)
                let statement;
                if (darkmode_button.innerHTML === '밝게') {
                    statement = '<div id="text" color-theme="dark"><p class="verse-number">' + inboundText[j].substr(0, spacePos) + '</p><p class="verse-text">' + inboundText[j].substr(spacePos, inboundText[j].length) + '</p></div>';
                } else {
                    statement = '<div id="text" color-theme="light"><p class="verse-number">' + inboundText[j].substr(0, spacePos) + '</p><p class="verse-text">' + inboundText[j].substr(spacePos, inboundText[j].length) + '</p></div>';
                }
                bodyText += statement;

                // 5절씩 끊기
                horizontalLineCount++;
                if(horizontalLineCount % 5 === 0) {
                    bodyText += '<br>';
                }
            }

            // 절 버튼에 절 범위를 표시함
            horizontalLineCount--;
            let verse_button = document.querySelector('#verse_button');
            verse_button.innerHTML = '1-' + horizontalLineCount + '절';

            text_divs[i].innerHTML = bodyText;
        }
    }

    // 절을 클릭하면 색상이 바뀌도록 함
    let verses = document.querySelectorAll('#text');
    verses.forEach(element => {
        element.addEventListener('click', function() {
            // color-theme를 변경함
            if(element.getAttribute('color-theme') === 'dark') {
                element.setAttribute('color-theme', 'light');
            } else {
                element.setAttribute('color-theme', 'dark');
            }
        });
    });

    // 글자 크기 초기화 및 저장
    if (localStorage.getItem('font_size') === null) {
        localStorage.setItem('font_size', '16px');
    } else {
        let bodyText = document.getElementById('bodyText');
        let fontSize = parseInt(localStorage.getItem('font_size'));
        bodyText.style.fontSize = fontSize + 'px';
        localStorage.setItem('font_size', fontSize + 'px');
    }

    personalLayout();
    showBookmarks();
}

// 재생 버튼
let listen_button = document.querySelector('#listen');
listen_button.addEventListener('click', () => {
    if(!window.speechSynthesis) {
        alert('음성 재생을 지원하지 않는 브라우저입니다.');
        return;
    }

    if(window.speechSynthesis.paused === false) {
        let text_panels = document.querySelectorAll('#bodyText');
    
        // verse-text 안의 텍스트만 추출하고 괄호, 한자는 제거한 후 TTS로 읽음
        let verseTexts = document.querySelectorAll('.verse-text');
        let extractedTexts = '';
        verseTexts.forEach(p => {
            extractedTexts += `${p.innerHTML}`;
        });
        extractedTexts.replace(/[\(\)\[\]{}一-龥]*/gm, '')
        u = new SpeechSynthesisUtterance(extractedTexts);
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

// 모바일이면 true, PC 환경이면 false
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// parent_elements(book_button_collection, chapter_button_collection 등) 안에 있는 button 태그들 사이 interval 개마다 <br> 태그 삽입
function addBrTags(parent_elements, interval) {
    const collection = document.getElementById(parent_elements);
    const buttons = Array.from(collection.getElementsByTagName('button'));
    for (i = 0; i < buttons.length; i++) {
        if ((i+1) % interval === 0) {
            const br = document.createElement('br');
            buttons[i].after(br);
        }
    }
}

// parent_elements(book_button_collection, chapter_button_collection 등) 안에 있는 button 태그들 사이에 있는 <br> 태그 제거
function removeBrTags(parent_elements) {
    const parent_div = document.getElementById(parent_elements);
    const brTags = parent_div.getElementsByTagName('br');

    // brTags를 배열로 변환 후 모든 <br> 태그 제거
    Array.from(brTags).forEach(br => br.remove());
}

// 함수: 계정 관련 레이아웃
function personalLayout() {
    // 토큰이 존재할 경우 로그인된 상태로 취급
    let join_button = document.querySelector('#join');
    let login_button = document.querySelector('#login');
    let logout_button = document.querySelector('#logout');
    let modification_button = document.querySelector('#modification');

    if(localStorage.getItem('token')) {
        join_button.classList = 'hidden';
        login_button.classList = 'hidden';
        logout_button.classList = 'show';
        modification_button.classList = 'show';
    } else {
        join_button.classList = 'show';
        login_button.classList = 'show';
        logout_button.classList = 'hidden';
        modification_button.classList = 'hidden';
    }
}

// 로그인 버튼 누를 경우
function onLogin() {
    let id_label = document.querySelector('#id_label');
    let id_field = document.querySelector('#id');
    let password_label = document.querySelector('#password_label');
    let password_field = document.querySelector('#password');
    let confirm_button = document.querySelector('#confirm_button');

    if(id_label.classList.contains('hidden')) {
        id_label.classList = 'show';
        id_field.classList = 'show';
        password_label.classList = 'show';
        password_field.classList = 'show';
        confirm_button.classList = 'show';

        document.removeEventListener('keydown', checkKeyPressed);
    } else {
        id_label.classList = 'hidden';
        id_field.classList = 'hidden';
        password_label.classList = 'hidden';
        password_field.classList = 'hidden';
        confirm_button.classList = 'hidden';

        document.addEventListener('keydown', checkKeyPressed, false);
    }
}

// 함수: 로그아웃 버튼
function onLogout() {
    let welcome_message = document.querySelector('#welcome_message');
    welcome_message.classList = 'hidden';
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

        id_label.classList = 'hidden';
        id_field.classList = 'hidden';
        password_label.classList = 'hidden';
        password_field.classList = 'hidden';
        confirm_button.classList = 'hidden';

        let welcome_message = document.querySelector('#welcome_message');
        welcome_message.classList = 'show';
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
    const current_book_name = document.querySelector('#current_book_button').innerHTML;
    const current_chapter_number = document.querySelector('#current_chapter_button').innerHTML;

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

// 기존 책갈피 버튼을 클릭할 경우 (해당 책/장으로 이동)
function moveBookmark() {
    window.onclick = (ev) => {
        if(ev.target.tagName === 'BUTTON' && ev.target.id === 'bookmark') {
            let elem = ev.target;

            const buttonText = elem.innerHTML.split(' ');
    
            let book_button = document.querySelector('#current_book_button');
            book_button.innerHTML = buttonText[0];
            
            let chapter_button = document.querySelector('#current_chapter_button');
            chapter_button.innerHTML = buttonText[1];
    
            showText();
        }
    }
}

// 책갈피 삭제 버튼 클릭할 경우
async function delBookmark() {
    let bookmark_buttons = document.querySelectorAll('#bookmark');
    for(i=0 ; i < bookmark_buttons.length ; i++) {
        let bookmark_button = bookmark_buttons[i];
        // 토큰과 클릭한 책갈피의 책/장 이름을 서버에 전송
        const token = localStorage.getItem('token');
        const buttonText = bookmark_button.className.split('_');

        // 현재 책/장과 일치하는 책갈피 버튼을 찾아서 지움
        let current_book_button = document.querySelector('#current_book_button');
        let current_chapter_button = document.querySelector('#current_chapter_button');
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
    
            const targetTag = document.getElementById('section_bookmark');
            let bookmarkTag = document.createElement('button');
            bookmarkTag.setAttribute('id', 'bookmark');
            bookmarkTag.setAttribute('class', `${book}_${chapter}`);
            bookmarkTag.setAttribute('onclick', 'moveBookmark()');
            bookmarkTag.innerHTML = `${book} ${chapter} : ${tag_name}`;
    
            targetTag.appendChild(bookmarkTag);
        }
    }
}
