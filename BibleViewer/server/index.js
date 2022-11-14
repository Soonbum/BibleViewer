const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const fs = require('fs');

app.use(cors({origin: '*', }));

app.get('/', (req, res) => {
  res.send('안녕하세요! 성경보기 서비스 서버입니다.');
});

app.listen(port, () => {
  console.log(`${port} 포트로 통신 중입니다.`);
});

// 역본 종류
// korhkjv: 한글킹제임스흠정역
// engkjv: 영어킹제임스(KJV)
// korhrv: 한글개역성경

// 본문 요청
// 요청 URL 예시: localhost:3000/korhkjv/2/5 --> 한글킹제임스흠정역, 출애굽기, 5장
app.get('/:version/:book/:chapter', (req, res) => {
  let text = '';
  let bookNumber = req.params.book.padStart(2, '0');
  let filename = `bible/${req.params.version}/${req.params.version}${bookNumber}_${req.params.chapter}.lfb`;
  fs.readFile(filename, 'utf8', (err, text) => {
    if(err) {
      console.error(err);
      return;
    } else {
      res.send(JSON.stringify(`${text}`));
    }
  });
});

// 검색 요청
// 요청 URL 예시: localhost:3000/search/korhkjv/키워드 --> 키워드가 포함된 절을 새로운 창에 보여줌
app.get('/:version/:keyword', (req, res) => {
  console.log(`요청한 키워드: ${req.params.keyword}`);

  // 요청 값 저장
  let keyword = req.params.keyword;
  let foundVerse = [];

  // 선택한 역본에서 키워드 전체 검색 시도
  for(i=1 ; i<=66 ; i++) {
    for(j=1 ; j<=150 ; j++) {
      let bookNumber = fillZeroStart(2, `${i}`);
      let chapterNumber = `${j}`;
      let filename = `bible/${req.params.version}/${req.params.version}${bookNumber}_${chapterNumber}.lfb`;

      if(!fs.existsSync(filename)) break;

      let wholeText = fs.readFileSync(filename, 'utf8', 'r');
      if(wholeText) {
        let lines = wholeText.split('\n');
        for(k=0 ; k<lines.length ; k++) {
          if(lines[k].search(keyword) !== -1) {
            foundVerse.push(`${lines[k]}\n`);
          }
        }
      }
    }
  }
  res.send(JSON.stringify(`${foundVerse}`));
});

// 함수: 자릿수만큼 남은 앞부분을 0으로 채움
function fillZeroStart(width, str) {
  return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;
}