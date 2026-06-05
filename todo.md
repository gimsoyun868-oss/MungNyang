# 멍냥 앱 TODO

## 설계 및 초기화
- [x] 프로젝트 초기화 (Expo + TypeScript + NativeWind)
- [x] 디자인 설계서 작성 (design.md)
- [x] 앱 로고 생성 및 브랜딩 적용
- [x] 테마 컬러 설정 (베이지/브라운 팔레트)

## DB 스키마
- [x] places 테이블 (장소 정보)
- [x] reviews 테이블 (리뷰)
- [x] pets 테이블 (반려동물 프로필)
- [x] favorites 테이블 (찜한 장소)
- [x] community_posts 테이블 (커뮤니티 게시글)
- [x] community_comments 테이블 (댓글)
- [x] DB 마이그레이션 실행

## API (tRPC 라우터)
- [x] places.list (장소 목록, 필터/정렬)
- [x] places.getById (장소 상세)
- [x] places.nearby (내 주변 장소)
- [x] places.popular (인기 장소)
- [x] reviews.list (장소별 리뷰)
- [x] reviews.create (리뷰 작성)
- [x] reviews.listByUser (내 리뷰 목록)
- [x] pets.list (내 반려동물 목록)
- [x] pets.create (반려동물 등록)
- [x] pets.delete (반려동물 삭제)

- [x] favorites.list (찜한 장소 목록)
- [x] favorites.toggle (찜하기/취소)
- [x] favorites.check (찜 여부 확인)
- [x] community.posts.list (게시글 목록)
- [x] community.posts.getById (게시글 상세)
- [x] community.posts.create (게시글 작성)
- [x] community.comments.create (댓글 작성)
- [x] auth.logout (로그아웃)

## 프론트엔드 화면
- [x] 테마 컬러 적용 (theme.config.js)
- [x] 아이콘 매핑 추가 (icon-symbol.tsx)
- [x] 탭 바 구성 (홈/지도/커뮤니티/마이)
- [x] 홈 화면 (카테고리, 인기 장소, 내 주변)
- [x] 지도 탐색 화면 (지도 + 필터 + 장소 카드)
- [x] 커뮤니티 화면 (게시판 탭 + 목록)
- [x] 마이페이지 화면 (프로필 + 메뉴)
- [x] 장소 상세 화면 (정보 + 리뷰)
- [x] 게시글 상세 화면
- [x] 게시글 작성 화면
- [x] 찜한 장소 화면
- [x] 내가 쓴 리뷰 목록 화면
- [x] 반려동물 등록 화면
- [x] 로그인 화면
- [x] 검색 화면

## 공통 컴포넌트
- [x] PlaceCard 컴포넌트
- [x] ReviewCard 컴포넌트
- [x] StarRating 컴포넌트
- [x] PostCard 컴포넌트
- [x] EmptyState 컴포넌트

## 기술 이슈 해결
- [x] react-native-maps 웹 호환성 처리 (metro.config.js)
- [x] TypeScript 오류 0개 달성
- [x] auth.logout tRPC 라우터 추가

## 추후 확장 (MVP 이후)
- [ ] 리뷰 작성 화면 (사진 업로드 포함)
- [ ] 예약 기능 화면 (미용/병원/유치원)
- [ ] 반려동물 프로필 수정 화면
- [ ] 푸시 알림 연동
- [ ] 실제 장소 데이터 시딩
- [ ] 소셜 로그인 추가 (카카오, 네이버)
