// Shared types between client and server

export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "hospital"
  | "grooming"
  | "kindergarten"
  | "hotel"
  | "park"
  | "petshop";

export type PetType = "dog" | "cat" | "other";
export type CommunityCategory = "question" | "walk" | "review" | "free";

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  cafe:         "카페",
  restaurant:   "식당",
  hospital:     "동물병원",
  grooming:     "미용실",
  kindergarten: "유치원",
  hotel:        "호텔/위탁",
  park:         "놀이터/공원",
  petshop:      "펫샵",
};

export const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  cafe:         "cup.and.saucer.fill",
  restaurant:   "fork.knife",
  hospital:     "cross.fill",
  grooming:     "scissors",
  kindergarten: "building.2.fill",
  hotel:        "bed.double.fill",
  park:         "tree.fill",
  petshop:      "storefront.fill",
};

export const COMMUNITY_LABELS: Record<CommunityCategory, string> = {
  question: "질문",
  walk:     "산책친구",
  review:   "후기",
  free:     "자유",
};

export const REVIEW_TAGS = [
  "친절해요",
  "깨끗해요",
  "가격이 좋아요",
  "대형견 가능해요",
  "소형견 환영해요",
  "고양이 환영해요",
  "주차 편해요",
  "재방문 의사 있어요",
  "시설이 좋아요",
  "직원이 전문적이에요",
  "예약이 편해요",
  "반려동물 간식 있어요",
];

export type SortOption = "distance" | "rating" | "reviews";

export const SORT_LABELS: Record<SortOption, string> = {
  distance: "거리순",
  rating:   "평점순",
  reviews:  "리뷰순",
};
