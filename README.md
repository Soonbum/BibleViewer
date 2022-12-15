# BibleViewer

  - 성경을 볼 수 있도록 만든 사이트입니다.

# 개발 환경 구축

  - 파일 구성은 다음과 같습니다.
  
    - index.html = 메인화면
    
    - join.html = 회원가입 화면
    
    - bible.js = 메인화면을 제어하는 스크립트

    - style.css = 메인화면을 꾸미는 스타일 정의 문서
    
    - server/web.js = 서버 구동 스크립트 (서버는 본문, 검색 요청에 대하여 응답함)

    - server/package.json = 서버 패키지 설명
    
    - server/bible = 성경 본문 데이터 (서버에 올릴 때에는 압축을 풀 것)

  - nodemon 설치하기: `npm install nodemon --save-dev`

  - 실행하기: `npm start` (서버 재시작하지 않음) 또는 `npm run dev` (스크립트 수정시 서버 자동 재시작)

# 기능

  - 역본 대조 보기: 한글킹제임스흠정역, 영어킹제임스(KJV), 한글개역성경 (현재 3가지 지원)
  
  - 검색: 가령 "주 하나님"이라고 검색할 시, 한글킹제임스흠정역 본문의 경우 [주], {주} 역시 검색되도록 괄호를 배제한 조건으로 검색이 되도록 하였음
  
  - 책/장 이동: 현재 책/장 버튼을 누르면 여러 개의 버튼이 나타나므로 한 번에 이동이 가능하며, 단축키(q,w,e,r)를 이용해 이전/다음의 책/장으로 이동이 가능함

# 현재 서비스 중
  
![스크린샷](https://user-images.githubusercontent.com/16474083/204410530-ec085be5-bb4d-463e-b50d-50f187d9b020.png)

  - [성경 뷰어](http://peacemaker84.dothome.co.kr/BibleViewer/index.html)
  
  - 카페24 웹호스팅 이용중
