
# 🐾 MungNyang (멍냥)

> 반려동물과 함께하는 모든 순간을 연결하는 통합 라이프 플랫폼

---

# 1. 프로젝트 소개

## 프로젝트명
MungNyang (멍냥)

## 프로젝트 비전

현재 반려동물 보호자는 카페, 식당, 병원, 미용실, 호텔, 유치원, 여행지 등의 정보를 여러 플랫폼에서 따로 검색해야 합니다.

멍냥은 이러한 문제를 해결하기 위해 반려동물과 관련된 모든 서비스를 하나의 플랫폼으로 통합하는 것을 목표로 합니다.

### 슬로건

"반려동물과 함께하는 모든 순간을 연결하다"

---

# 2. 문제 정의

## Pain Point 1

반려동물 동반 장소 정보가 여러 플랫폼에 분산되어 있음

- 네이버 지도
- 카카오맵
- 블로그
- 인스타그램
- 지역 카페

## Pain Point 2

실제 방문 후기 확인이 어려움

## Pain Point 3

건강기록 관리가 번거로움

## Pain Point 4

장소 탐색 → 예약 → 방문까지 연결되지 않음

---

# 3. 해결 방안

멍냥은 다음 기능을 하나의 플랫폼에서 제공합니다.

- 장소 검색
- 리뷰
- 커뮤니티
- 건강기록
- 실종 신고
- 예약 시스템
- AI 추천

---

# 4. 핵심 기능

## 회원관리

- 회원가입
- 로그인
- 프로필 관리

## 반려동물 관리

- 프로필 등록
- 체중 관리
- 예방접종 기록
- 건강검진 기록

## 장소 검색

- 카페
- 식당
- 공원
- 병원
- 호텔
- 미용실
- 유치원

## 리뷰

- 별점
- 이미지 업로드
- 방문 후기

## 커뮤니티

- 자유게시판
- 질문 게시판
- 산책 친구
- 실종 신고

## AI 추천

- 위치 기반 추천
- 견종 기반 추천
- 취향 기반 추천

---

# 5. 사용자 시나리오

## 시나리오 1

주말에 강아지와 갈 카페 찾기

1. 로그인
2. 반려동물 선택
3. 위치 확인
4. 카페 검색
5. 리뷰 확인
6. 방문
7. 후기 작성

## 시나리오 2

예방접종 기록 확인

1. 마이페이지
2. 반려동물 선택
3. 건강기록 조회
4. 다음 접종 일정 확인

## 시나리오 3

애견호텔 예약

1. 호텔 검색
2. 리뷰 확인
3. 가격 비교
4. 예약 진행

---

# 6. User Flow

회원가입
↓
반려동물 등록
↓
위치 기반 검색
↓
장소 상세 조회
↓
리뷰 확인
↓
방문 또는 예약
↓
후기 작성
↓
커뮤니티 공유

---

# 7. 기술 스택

## Frontend

### React Native

iOS와 Android를 동시에 개발하기 위한 프레임워크

### Expo

빠른 개발 및 테스트를 지원

### TypeScript

안정적인 타입 관리

---

## Backend

### Java 21

객체지향 기반 비즈니스 로직 구현

### Spring Boot

REST API 서버 구축

### Spring Security

인증 및 인가

### Spring Data JPA

DB ORM 처리

---

## Database

### MySQL

사용자, 반려동물, 리뷰, 장소 데이터 저장

---

## Storage

### AWS S3

이미지 저장

- 반려동물 사진
- 리뷰 사진
- 실종 신고 사진

---

## 지도 API

### TMap API

- 현재 위치
- 거리 계산
- 길찾기

### Kakao Map API

- 장소 표시
- 지도 검색

---

## AI

### OpenAI API

자연어 기반 추천

예시

"소형견이 갈 수 있는 조용한 카페 추천해줘"

---

# 8. 시스템 아키텍처

```

React Native App
        ↓
Spring Boot API
        ↓
Spring Security
        ↓
MySQL
        ↓
AWS S3
        ↓
Map API
        ↓
OpenAI API

```

---

## 9.ERD 다이어그램 (Entity Relationship Diagram)


```mermaid
erDiagram
    users ||--o{ pets : "registers"
    users ||--o{ reviews : "writes"
    users ||--o{ community_posts : "authors"
    places ||--o{ reviews : "receives"
    pets ||--o{ health_records : "has"

    users {
        bigint id PK
        varchar email UK
        varchar password
        varchar nickname UK
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    pets {
        bigint id PK
        bigint user_id FK
        varchar name
        varchar species
        varchar breed
        char gender
        boolean is_neutered
        date birth_date
        decimal weight
        timestamp created_at
    }

    places {
        bigint id PK
        varchar name
        varchar category
        varchar address
        varchar tel
        decimal latitude
        decimal longitude
        boolean is_open
    }

    reviews {
        bigint id PK
        bigint user_id FK
        bigint place_id FK
        tinyint rating
        text content
        varchar image_url
        timestamp created_at
        timestamp updated_at
    }

    community_posts {
        bigint id PK
        bigint user_id FK
        varchar title
        longtext content
        int view_count
        boolean is_deleted
        timestamp created_at
        timestamp updated_at
    }

    health_records {
        bigint id PK
        bigint pet_id FK
        varchar type
        varchar title
        text content
        date record_date
        timestamp created_at
    }
---

# 10. API 설계

## 회원

POST /api/users/signup

POST /api/users/login

GET /api/users/me

---

## 반려동물

POST /api/pets

GET /api/pets

GET /api/pets/{id}

PUT /api/pets/{id}

DELETE /api/pets/{id}

---

## 장소

GET /api/places

GET /api/places/{id}

---

## 리뷰

POST /api/reviews

GET /api/reviews/place/{id}

---

## 커뮤니티

POST /api/community/posts

GET /api/community/posts

---

# 11. 프로젝트 구조

src

├─ components

├─ screens

├─ navigation

├─ services

├─ hooks

├─ utils

├─ assets

└─ types

backend

├─ controller

├─ service

├─ repository

├─ entity

├─ dto

├─ config

└─ security

---

# 12. MVP 개발 범위

1차 개발

- 회원가입
- 로그인
- 반려동물 등록
- 장소 검색
- 리뷰 조회
- 커뮤니티

2차 개발

- 건강기록
- 이미지 업로드
- 실종 신고
- 알림 기능

3차 개발

- 예약
- 결제
- AI 추천

---

# 13. 수익 모델

## B2C

프리미엄 구독

## B2B

병원 광고

미용실 광고

호텔 광고

## 플랫폼 수수료

예약 수수료

결제 수수료

---

# 14. Git 브랜치 전략

main

배포 가능 버전

develop

통합 개발 브랜치

feature/*

기능 개발 브랜치

예시

feature/login

feature/pet-register

feature/community

---

# 15. 향후 확장

- 병원 예약
- 호텔 예약
- 미용 예약
- AI 건강관리
- AI 챗봇
- 반려동물 보험 연동
- 쇼핑몰 연동

---

# 16. 최종 목표

멍냥은 단순한 장소 검색 앱이 아닙니다.

반려동물 보호자의 일상을 연결하는 Super App을 목표로 합니다.

검색 + 커뮤니티 + 건강관리 + 예약 + 결제 + AI 추천

을 하나의 서비스에서 제공하는 대한민국 대표 반려동물 플랫폼 구축이 최종 목표입니다.
