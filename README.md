# BibleViewer

## 성경을 볼 수 있도록 만든 사이트입니다.

# 개발 환경 구축

  - 파일 구성은 다음과 같습니다.
  
    - index.html = 메인화면

    - bible.js = 메인화면을 제어하는 스크립트

    - style.css = 메인화면을 꾸미는 스타일 정의 문서
    
    - server/index.js = 서버 구동 스크립트 (서버는 본문, 검색 요청에 대하여 응답함)

    - server/package.json = 서버 패키지 설명

  - nodemon 설치하기: `npm install nodemon --save-dev`

  - 실행하기: `npm start` (서버 재시작하지 않음) 또는 `npm run dev` (스크립트 수정시 서버 자동 재시작)
  
