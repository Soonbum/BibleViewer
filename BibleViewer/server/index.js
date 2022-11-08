const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const fs = require('fs');

app.use(cors({origin: '*', }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 동적 라우팅 적용
// 요청 URL 예시 --> localhost:3000/korhkjv/2/5 --> 한글킹제임스흠정역, 출애굽기, 5장
app.get('/:version/:book/:chapter', (req, res) => {
  // 역본 종류
  // korhkjv: 한글킹제임스흠정역
  // engkjv: 영어킹제임스(KJV)
  // korhrv: 한글개역성경

  let text = '';
  let bookNumber = req.params.book.padStart(2, '0');
  let filename = `bible/${req.params.version}/${req.params.version}${bookNumber}_${req.params.chapter}.lfb`;
  fs.readFile(filename, 'utf8', (err, text) => {
    if(err) {
      console.error(err);
      return
    } else {
      res.send(JSON.stringify(`${text}`));
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});