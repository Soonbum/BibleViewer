const express = require('express');
const cors = require('cors');
const app = express();
const port = 8001 || process.env.PORT;

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors({origin: '*'}));
app.use(express.json());

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send('안녕하세요! 성경보기 서비스 서버입니다.');
});

app.listen(port, () => {
  console.log(`${port} 포트로 통신 중입니다.`);
});

// 역본 종류
// korhkjv: 한글킹제임스흠정역
// engkjv: 영어킹제임스(KJV)
// korhrv: 한글개역성경

app.post('/', (req, res) => {
  let keyword = req.body.keyword;

  // 검색 요청 (버전, 키워드)
  if(req.get('Request-Type') === 'Search Results') {
    console.log(`요청한 키워드: ${req.body.keyword}`);

    // 요청 값 저장
    let keyword = req.body.keyword;
    let foundVerse = [];

    // 선택한 역본에서 키워드 전체 검색 시도
    for(i=1 ; i<=66 ; i++) {
      for(j=1 ; j<=150 ; j++) {
        let bookNumber = fillZeroStart(2, `${i}`);
        let chapterNumber = `${j}`;
        let filename = `${__dirname}/bible/${req.body.version}/${req.body.version}${bookNumber}_${chapterNumber}.lfb`;

        if(!fs.existsSync(filename)) break;

        let wholeText = fs.readFileSync(filename, 'utf8', 'r');
        if(wholeText) {
          let lines = wholeText.split('\n');
          for(k=0 ; k<lines.length ; k++) {
            // lines[k]에서 괄호 문자, 한자를 제거한 후 검색 시도
            if(lines[k].replace(/[\(\)\[\]{}一-龥]*/gim, '').search(keyword) !== -1) {
              foundVerse.push(`${lines[k]}\n`);
            }
          }
        }
      }
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify(`${foundVerse}`));
  }

  // 본문 요청 (버전, 책 번호, 장 번호)
  if(req.get('Request-Type') === 'Body Text') {
    let bookNumber = fillZeroStart(2, `${req.body.book}`);
    let filename = `${__dirname}/bible/${req.body.version}/${req.body.version}${bookNumber}_${req.body.chapter}.lfb`;
    fs.readFile(filename, 'utf8', (err, text) => {
      if(err) {
        console.error(err);
        return;
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(`${text}`));
      }
    });
  }

  // 가입 요청
  // ... 요청 메시지에서 id 정보 중복 체크 --> 기존 DB에서 id 중복된 거 없으면 성공, 중복 있으면 실패 메시지를 보냄

  // 로그인 요청
  // ...
});

// 함수: 자릿수만큼 남은 앞부분을 0으로 채움
function fillZeroStart(width, str) {
  return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;
}

// !!! 패스워드 암호화하기 (완성)
// const salt = await bcrypt.genSalt(10);
// const hashed = await bcrypt.hash('12345678', salt);
// const bValidPassword = await bcrypt.compare('12345678', hashed);
// if(!bValidPassword) {
//   console.log('아이디/비밀번호가 올바르지 않습니다.');
//   //return res.status(400).send('아이디/비밀번호가 올바르지 않습니다.');
// } else {
//   console.log('정상입니다.');
//   //return res.status(200).send('정상입니다.');
// }

// !!! JWT 생성하기
// const SECRET_KEY = 'MY-SECRET-KEY';
// const token = jwt.sign({
//   alg: 'HS256',
//   type: 'JWT',
//   id: 'peacemaker84',
//   nickname: '정순범',
//   email: 'peacemaker84@gmail.com'
// }, SECRET_KEY, {
//   expiresIn: '6 hours',
//   issuer: '토큰발급자',
// });

// const validateJWT = jwt.verify(token, SECRET_KEY);
// console.log(validateJWT);

// return res.status(200).json({
//   code: 200,
//   message: '토큰이 발급되었습니다.',
//   token: token
// });

//res.header('x-auth-token', token).send({/* ... */});    // 서버 -> 클라이언트

//const token = req.header('x-auth-token');   // 클라이언트 -> 서버
//if(!token) return res.status(401).send('토큰이 없습니다.');
// try {
//   const decoded = jwt.verify(token, SECRET_KEY);
//   const id = decoded.id;
//   const nickname = decoded.nickname;
//   const email = decoded.email;
//   return res.status(200).json({
//     code: 200,
//     message: '토큰은 정상입니다.',
//     data: {
//       nickname: nickname,
//       email: email
//     }
//   });
// } catch(error) {
//   if(error.name === 'TokenExpiredError') {
//     return res.status(419).json({
//       code: 419,
//       message: '토큰이 만료되었습니다.'
//     });
//   }
//   if(error.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       code: 401,
//       message: '유효하지 않은 토큰입니다.';
//     });
//   }
// }
