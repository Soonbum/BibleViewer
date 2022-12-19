const express = require('express');
const cors = require('cors');
const app = express();
const port = 8001 || process.env.PORT;

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sqlite3 = require('sqlite3');
const { response } = require('express');

const SECRET_KEY = 'MY-SECRET-KEY';

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

app.post('/', async (req, res) => {
  let keyword = req.body.keyword;

  // 검색 요청 (버전, 키워드)
  if(req.get('Request-Type') === 'Search Results') {
    console.log(`요청한 검색 키워드: ${req.body.keyword}`);

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
  if(req.get('Request-Type') === 'Join Request') {
    let id = req.body.id;
    let password = req.body.password;
    let nickname = req.body.nickname;
    let email = req.body.email;

    // 개인정보를 저장하기 위한 DB 파일 생성
    const db = new sqlite3.Database(`${__dirname}/personInfo.db`);
    let sql_stmt = '';

    // 패스워드 암호화
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // 개인정보 테이블이 없으면 생성할 것
    db.run('CREATE TABLE IF NOT EXISTS PersonInfo(id TEXT PRIMARY KEY, password TEXT, nickname TEXT, email TEXT, jwt TEXT);');

    // 클라이언트가 요청한 ID가 기존에 입력된 ID인지 체크 (중복 체크)
    let responseMessage = [];
    let bValidPersonInfo = true;
    sql_stmt = `SELECT * FROM PersonInfo WHERE id = '${id}'`;
    db.all(sql_stmt, [], (err, rows) => {
      // ID가 중복되지 않을 경우
      if(rows.length === 0) {
        // ID 문자열 길이는 최소 5글자
        if(id.length < 5) {
          responseMessage.push('ID 길이는 5글자 이상이어야 합니다.');
          bValidPersonInfo = false;
        }

        // 이메일 유효성 검사
        if(!email.match('^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')) {
          responseMessage.push('이메일 주소가 유효하지 않습니다.');
          bValidPersonInfo = false;
        }

        // 개인정보가 유효할 경우 DB에 저장
        if(bValidPersonInfo === true) {
          // JWT 생성하기
          const token = jwt.sign({
            alg: 'HS256',
            type: 'JWT',
            id: id
          }, SECRET_KEY, {
            expiresIn: '6 hours',
            issuer: '토큰발급자',
          });

          sql_stmt = `INSERT INTO PersonInfo(id, password, nickname, email, jwt) VALUES('${id}', '${hashed}', '${nickname}', '${email}', '${token}');`
          db.run(sql_stmt, (err) => {
            if(err) {
              return console.log(`${err.message}`);
            }
            console.log(`회원정보가 저장되었습니다: ${id} / ${nickname} / ${email}`);
          });
          responseMessage.push('회원가입에 성공했습니다.');
        }

        res.header('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(`${responseMessage}`));
      } else {
        // ID가 중복되면 클라이언트에 ID가 중복된다는 사실을 공지
        responseMessage.push('입력하신 ID는 이미 사용 중입니다.');
        res.header('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(`${responseMessage}`));
      }
    });

    db.close();
  }

  // 로그인 요청
  if(req.get('Request-Type') === 'Login Request') {
    let id = req.body.id;
    let password = req.body.password;

    // 개인정보가 저장되어 있는 DB 파일
    const db = new sqlite3.Database(`${__dirname}/personInfo.db`);
    let bValidPassword = false;
    let sql_stmt = '';

    // ID와 비밀번호가 모두 일치할 경우 클라이언트에게 JWT 전송, 실패하면 클라이언트에게 오류 메시지 전송
    sql_stmt = `SELECT * FROM PersonInfo WHERE id = '${id}'`;   // ID에 일치하는 레코드를 불러옴
    db.all(sql_stmt, [], (err, rows) => {
      if(err) {
        return console.log(`${err.message}`);
      }
            
      // 만약 비밀번호가 일치할 경우
      if(rows.length === 1) {
        bValidPassword = bcrypt.compareSync(password, rows[0].password);
      }

      if(bValidPassword === true) {
        // JWT 업데이트
        const token = jwt.sign({
          alg: 'HS256',
          type: 'JWT',
          id: id
        }, SECRET_KEY, {
          expiresIn: '6 hours',
          issuer: '토큰발급자',
        });

        sql_stmt = `UPDATE PersonInfo SET jwt = '${token}' WHERE id = '${rows[0].id}'`;
        db.run(sql_stmt, (err) => {
          if(err) {
            return console.error(err.message);
          }
        });

        // 클라이언트에게 JWT 전송
        return res.status(200).json({
          code: 200,
          message: '토큰이 새로 발급되었습니다.',
          nickname: rows[0].nickname,
          email: rows[0].email,
          token: token
        });
      }

      // ID가 존재하지 않거나 비밀번호가 일치하지 않는 경우
      if((rows.length === 0) || (bValidPassword === false)) {
        // 클라이언트에게 오류 메시지 전송
        return res.status(400).json({
          code: 400,
          message: '아이디/비밀번호가 올바르지 않습니다.'
        });
      }
    });

    db.close();
  }

  // 개인정보 변경 요청
  if(req.get('Request-Type') === 'Change Request') {
    let token = req.body.token;
    let old_password = req.body.old_password;
    let new_password = req.body.new_password;
    let nickname = req.body.nickname;
    let email = req.body.email;

    let bValidPassword = false;
    let sql_stmt = '';

    // 패스워드 암호화
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(new_password, salt);

    // 이메일 유효성 검사
    if(!email.match('^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')) {
      // 이메일이 유효하지 않으면 실패 메시지 보냄
      return res.status(400).json({
        code: 400,
        message: '이메일 주소가 유효하지 않습니다.'
      });
    }

    try {
      const validateJWT = jwt.verify(token, SECRET_KEY);
      if(validateJWT) {
        // 개인정보가 저장되어 있는 DB 파일
        const db = new sqlite3.Database(`${__dirname}/personInfo.db`);
        
        // 토큰이 유효하면 회원정보 변경 요청을 처리하고 성공 메시지 보냄
        sql_stmt = `SELECT * FROM PersonInfo WHERE jwt = '${token}'`;
        db.all(sql_stmt, [], (err, rows) => {
          if(err) {
            return console.log(`${err.message}`);
          }

          if(rows.length === 1) {
            bValidPassword = bcrypt.compareSync(old_password, rows[0].password);
          }

          // 토큰과 동일한 레코드에 접근해서 정보를 업데이트
          if(bValidPassword === true) {
            sql_stmt = `UPDATE PersonInfo SET password = '${hashed}', nickname = '${nickname}', email = '${email}' WHERE jwt = '${token}'`;
            db.run(sql_stmt, (err) => {
              if(err) {
                return console.error(err.message);
              }
            });

            // 개인정보 변경에 성공했음을 알려줌
            return res.status(200).json({
              code: 200,
              message: '개인정보 변경에 성공했습니다.'
            });
          }
        });

        db.close();
      }
    } catch(error) {
      // 토큰이 유효하지 않으면 실패 메시지 보냄
      if(error.name === 'TokenExpiredError') {
        return res.status(419).json({
          code: 419,
          message: '토큰이 만료되었습니다.'
        });
      }
      if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          code: 401,
          message: '토큰이 유효하지 않습니다.'
        });
      }
    }
  }

  // 탈퇴 요청
  if(req.get('Request-Type') === 'Leave Request') {
    let token = req.body.token;
    let old_password = req.body.old_password;

    let bValidPassword = false;
    let sql_stmt = '';

    try {
      const validateJWT = jwt.verify(token, SECRET_KEY);
      if(validateJWT) {
        // 개인정보가 저장되어 있는 DB 파일
        const db = new sqlite3.Database(`${__dirname}/personInfo.db`);
        
        // 토큰이 유효하면 탈퇴 요청을 처리하고 성공 메시지 보냄
        sql_stmt = `SELECT * FROM PersonInfo WHERE jwt = '${token}'`;
        db.all(sql_stmt, [], (err, rows) => {
          if(err) {
            return console.log(`${err.message}`);
          }

          if(rows.length === 1) {
            bValidPassword = bcrypt.compareSync(old_password, rows[0].password);
          }

          // 토큰과 동일한 레코드에 접근해서 정보를 삭제
          if(bValidPassword === true) {
            sql_stmt = `DELETE FROM PersonInfo WHERE jwt = '${token}'`;
            db.run(sql_stmt, (err) => {
              if(err) {
                return console.error(err.message);
              }
            });

            // 탈퇴에 성공했음을 알려줌
            return res.status(200).json({
              code: 200,
              message: '탈퇴에 성공했습니다.'
            });
          }
        });

        db.close();
      }
    } catch(error) {
      // 토큰이 유효하지 않으면 실패 메시지 보냄
      if(error.name === 'TokenExpiredError') {
        return res.status(419).json({
          code: 419,
          message: '토큰이 만료되었습니다.'
        });
      }
      if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          code: 401,
          message: '토큰이 유효하지 않습니다.'
        });
      }
    }
  }

  // 책갈피 추가 요청
  if(req.get('Request-Type') === 'Bookmark Add Request') {
    let token = req.body.token;
    let location_text = fillZeroStart(2, `${req.body.book_index}`) + '_' + `${req.body.chapter_index}`;
    let tag_name = req.body.tag_name;

    let id = '';
    let sql_stmt = '';

    try {
      const validateJWT = wt.verify(token, SECRET_KEY);
      if(validateJWT) {
        // 개인정보가 저장되어 있는 DB 파일
        let db = new sqlite3.Database(`${__dirname}/personInfo.db`);

        // 토큰에 해당하는 ID를 찾음
        sql_stmt = `SELECT * FROM PersonInfo WHERE jwt = '${token}'`;
        db.all(sql_stmt, [], (err, rows) => {
          if(err) {
            return console.log(`${err.message}`);
          }

          if(rows.length === 1) {
            id = rows[0].id;
          }
        });
        db.close();

        // 북마크 정보를 저장하기 위한 DB 파일 생성
        db = new sqlite3.Database(`${__dirname}/bookmarkInfo.db`);

        // 북마크 정보 테이블이 없으면 생성할 것
        db.run('CREATE TABLE IF NOT EXISTS BookmarkInfo(id TEXT PRIMARY KEY, location TEXT, tag_name TEXT);');

        // 북마크 정보 테이블에 책갈피를 추가함
        sql_stmt = `INSERT INTO BookmarkInfo(id, location, tag_name) VALUES('${id}', '${location_text}', '${tag_name}');`
        db.run(sql_stmt, (err) => {
          if(err) {
            return console.log(`${err.message}`);
          }
        });

        db.close();

        // ... 성공 -> 클라이언트에게 보냄 (위치 정보, 태그 이름)
      }
    } catch(error) {
      // 토큰이 유효하지 않으면 실패 메시지 보냄
      if(error.name === 'TokenExpiredError') {
        return res.status(419).json({
          code: 419,
          message: '토큰이 만료되었습니다.'
        });
      }
      if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          code: 401,
          message: '토큰이 유효하지 않습니다.'
        });
      }
    }
  }
});

// 함수: 자릿수만큼 남은 앞부분을 0으로 채움
function fillZeroStart(width, str) {
  return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;
}
