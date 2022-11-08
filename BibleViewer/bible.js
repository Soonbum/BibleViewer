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

// 상수: 서버에 대한 정보
const server_address = 'http://localhost:3000';

// 함수: 현재 표시된 역본 목록 가져오기
versionList = function() {
    let version_combos = document.getElementById('version_section').getElementsByClassName('display-inline');
    let open_version_name = [];    // 표시된 역본 이름들
    for(i=0 ; i < version_combos.length ; i++) {
        open_version_name[i] = version_combos[i][version_combos[i].selectedIndex].innerHTML;
    }
    return open_version_name;
}

// 현재 값 저장
// saveStates = function() {
//     // 역본 선택자 상태 저장
//     let version_combos = document.querySelectorAll('#version');
//     let version_combos_states = [];
//     for(i=0 ; i < version_combos.length ; i++) {
//         version_combos_states[i] = [version_combos[i].className, version_combos[i].selectedIndex];   // class 이름과 인덱스 저장
//     }

//     // 현재 선택한 책, 장 알아내기
//     let book_button = document.querySelector('#current_book');
//     let chapter_button = document.querySelector('#current_chapter');

//     current_book = book_button.innerHTML;
//     current_chapter = chapter_button.innerHTML;

//     // 로컬저장소에 값 저장하기
//     localStorage.setItem('version_combos', JSON.stringify(version_combos_states));
//     localStorage.setItem('current_book', JSON.stringify(current_book));
//     localStorage.setItem('current_chapter', JSON.stringify(current_chapter));
// }


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
version_add_button.addEventListener('change', () => {
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
version_del_button.addEventListener('change', () => {
    showText();
});

// search_section: 역본 종류를 선택하고 키워드 입력 후 검색 버튼을 누르면 새로운 창에 결과물 보여주기
// version_to_search: 검색하려는 책 이름
// keyword_for_search: 검색하려는 단어
// !!!


let current_book = '';      // 현재 선택한 책 (창세기, 출애굽기, ...)
let current_chapter = 0;    // 현재 선택한 장

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
prevBook = function() {
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
prevChapter = function() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    for(i=0 ; i < book_info.length ; i++) {
        if(current_book === book_info[i][0]) {
            if(current_chapter==='1장') {
                current_chapter = book_info[i][2] + '장';
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
nextChapter = function() {
    // 현재 선택한 책, 장 알아내기
    let book_button = document.querySelector('#current_book');
    let chapter_button = document.querySelector('#current_chapter');

    current_book = book_button.innerHTML;
    current_chapter = chapter_button.innerHTML;

    for(i=0 ; i < book_info.length ; i++) {
        if(current_book === book_info[i][0]) {
            let chapterNumber = parseInt(current_chapter);
            if(chapterNumber === book_info[i][2]) {
                current_chapter = '1장';
            } else {
                chapterNumber++;
                current_chapter = chapterNumber + '장';
            }
        }
    }

    chapter_button.innerHTML = current_chapter;
    showText();
}

// 함수: 다음 책
nextBook = function() {
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

// 함수: 본문 보여주기 !!!
showText = async function() {
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

    // 화면을 분할함
    //let contents_section_div = document.getElementById('contents_section');
    //contents_section_div.style = `column-count: ${nShow}; column-rule: 0.2em solid #ccc;`;

    // 본문 내용 서버로부터 가져오기
    for(i=0 ; i < nShow ; i++) {
        let version_value = version_combos[i].options[version_combos[i].selectedIndex].value;
        if(version_value) {
            let reqUrl = `${server_address}/${version_value}/${current_book_index}/${current_chapter_index}`;

            const res = await fetch(reqUrl);
            const bodyText = await res.json();
            text_divs[i].innerHTML = bodyText;
            //text_divs[i].style.width = `${totalWidth/nShow}px`;
        }
    }
}
showText();

// 저장한 값 불러오기
// loadStates = function() {
//     // 역본 선택자 상태 복구
//     let version_combos_states = JSON.parse(localStorage.getItem('version_combos'));
//     if(version_combos_states) {
//         let version_combos = document.querySelectorAll('#version');
//         for(i=0 ; i < version_combos.length ; i++) {
//             if(!version_combos[i].innerHTML) {
//                 for(j=0 ; j < Object.keys(version_name).length ; j++) {
//                     let new_combo = document.createElement('option');
//                     new_combo.setAttribute('value', `${Object.keys(version_name)[j]}`);
//                     new_combo.innerHTML = `${Object.values(version_name)[j]}`;
//                     version_combos[i].appendChild(new_combo);
//                 }
//             }
//             version_combos[i].className = version_combos_states[i][0];
//             version_combos[i].selectedIndex = parseInt(version_combos_states[i][1]);
//         }
//     }

//     // 현재 책 복구
//     let book_button = document.querySelector('#current_book');
//     let current_book = JSON.parse(localStorage.getItem('current_book'));
//     if(current_book) {
//         book_button.innerHTML = current_book;
//     }

//     // 현재 장 복구
//     let chapter_button = document.querySelector('#current_chapter');
//     let current_chapter = JSON.parse(localStorage.getItem('current_chapter'));
//     if(current_chapter) {
//         chapter_button.innerHTML = current_chapter;
//     }
// }
// loadStates();