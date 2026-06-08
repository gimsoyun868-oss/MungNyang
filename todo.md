# 🚀 MungNyang MVP TODO

## 📌 Sprint 0 - 프로젝트 세팅

### Git & 프로젝트 관리

* [x] GitHub Repository 생성
* [x] 프로젝트 구조 재정비
* [ ] GitHub Project(칸반보드) 생성
* [ ] 브랜치 전략 수립 (main / develop / feature)
* [ ] Issue Template 작성
* [ ] Pull Request Template 작성

### 문서화

* [ ] README.md 작성
* [ ] MVP.md 작성
* [ ] ERD.md 작성
* [ ] API.md 작성
* [ ] 프로젝트 일정표 작성

---

# 📌 Sprint 1 - Backend 환경 구축

## Spring Boot

* [ ] Spring Boot 프로젝트 생성
* [ ] Java 17 설정
* [ ] Gradle 설정
* [ ] application.yml 작성

## MySQL

* [ ] MySQL 설치
* [ ] MungNyang Database 생성
* [ ] MySQL 연결 테스트

## 공통 설정

* [ ] Lombok 설정
* [ ] Validation 설정
* [ ] Global Exception Handler 생성
* [ ] ApiResponse 공통 응답 생성

---

# 📌 Sprint 2 - 회원 시스템

## User Entity

* [ ] BaseEntity 생성
* [ ] User Entity 생성
* [ ] User Repository 생성

## 회원가입

* [ ] SignupRequest DTO 생성
* [ ] SignupResponse DTO 생성
* [ ] 이메일 중복 확인 기능
* [ ] BCrypt 비밀번호 암호화
* [ ] 회원가입 Service 구현
* [ ] 회원가입 API 구현

## 로그인

* [ ] LoginRequest DTO 생성
* [ ] LoginResponse DTO 생성
* [ ] 로그인 Service 구현
* [ ] 로그인 API 구현

## JWT 인증

* [ ] JwtProvider 생성
* [ ] Access Token 발급
* [ ] JwtFilter 생성
* [ ] SecurityConfig 생성
* [ ] 인증 테스트

---

# 📌 Sprint 3 - Frontend 환경 구축

## Expo

* [ ] Expo 프로젝트 생성
* [ ] TypeScript 설정
* [ ] React Navigation 설정

## 공통 디자인

* [ ] 컬러 시스템 정의
* [ ] 뭉냥 디자인 시스템 구축
* [ ] 공통 버튼 컴포넌트 생성
* [ ] 공통 Input 컴포넌트 생성
* [ ] 공통 Header 생성

## 브랜딩

* [ ] 뭉냥 로고 적용
* [ ] Splash Screen 제작
* [ ] 앱 아이콘 적용

---

# 📌 Sprint 4 - 인증 화면

## 로그인 화면

* [ ] 로그인 UI 제작
* [ ] 이메일 입력
* [ ] 비밀번호 입력
* [ ] 로그인 API 연동

## 회원가입 화면

* [ ] 회원가입 UI 제작
* [ ] 닉네임 입력
* [ ] 이메일 입력
* [ ] 비밀번호 입력
* [ ] 비밀번호 확인 입력
* [ ] 유효성 검사

## 인증 유지

* [ ] AsyncStorage 저장
* [ ] 자동 로그인 구현
* [ ] 로그아웃 구현

---

# 📌 Sprint 5 - 반려동물 관리

## DB

* [ ] Pet Entity 생성
* [ ] Pet Repository 생성

## API

* [ ] 반려동물 등록 API
* [ ] 반려동물 조회 API
* [ ] 반려동물 수정 API
* [ ] 반려동물 삭제 API

## 화면

* [ ] 반려동물 등록 화면
* [ ] 반려동물 목록 화면
* [ ] 반려동물 상세 화면
* [ ] 반려동물 수정 화면

---

# 📌 Sprint 6 - 건강관리

## DB

* [ ] Vaccination Entity 생성
* [ ] MedicalRecord Entity 생성
* [ ] Medication Entity 생성

## API

* [ ] 예방접종 등록 API
* [ ] 예방접종 조회 API
* [ ] 병원 진료 기록 API
* [ ] 투약 기록 API

## UI

* [ ] 건강관리 메인 화면
* [ ] 예방접종 관리 화면
* [ ] 병원 기록 화면
* [ ] 체중 기록 화면

---

# 📌 Sprint 7 - 시설 검색

## 지도 API

* [ ] TMAP API Key 발급
* [ ] Kakao Map API Key 발급

## DB

* [ ] Place Entity 생성

## API

* [ ] 시설 목록 API
* [ ] 시설 상세 API
* [ ] 위치 기반 검색 API

## UI

* [ ] 지도 화면
* [ ] 검색 화면
* [ ] 시설 상세 화면
* [ ] 즐겨찾기 기능

---

# 📌 Sprint 8 - 실종 반려동물 찾기

## DB

* [ ] MissingPet Entity 생성

## API

* [ ] 실종 등록 API
* [ ] 실종 목록 조회 API
* [ ] 실종 상세 조회 API
* [ ] 제보 등록 API

## UI

* [ ] 실종 신고 화면
* [ ] 실종 목록 화면
* [ ] 실종 상세 화면

## 차별화 기능

* [ ] 실종 포스터 자동 생성
* [ ] 위치 등록 기능
* [ ] 제보 기능
* [ ] 지역 알림 기능 기획

---

# 📌 Sprint 9 - 커뮤니티

## DB

* [ ] Post Entity 생성
* [ ] Comment Entity 생성

## API

* [ ] 게시글 작성 API
* [ ] 게시글 조회 API
* [ ] 게시글 수정 API
* [ ] 게시글 삭제 API
* [ ] 댓글 API

## UI

* [ ] 게시판 화면
* [ ] 게시글 상세 화면
* [ ] 글쓰기 화면
* [ ] 댓글 기능

---

# 📌 Sprint 10 - 배포

## Backend

* [ ] AWS EC2 배포
* [ ] AWS RDS 연결

## Frontend

* [ ] Expo EAS Build
* [ ] Android APK 생성
* [ ] 테스트 배포

## 최종 준비

* [ ] 발표 PPT 제작
* [ ] 시연 영상 제작
* [ ] 사용자 시나리오 작성

---

# 🎯 MVP 완료 조건

* [ ] 회원가입
* [ ] 로그인
* [ ] JWT 인증
* [ ] 반려동물 등록
* [ ] 반려동물 조회
* [ ] 건강기록 등록
* [ ] 시설 검색
* [ ] 실종 신고
* [ ] 커뮤니티 게시글 작성
