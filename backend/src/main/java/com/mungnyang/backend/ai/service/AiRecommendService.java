package com.mungnyang.backend.ai.service;

import com.mungnyang.backend.naver.dto.NaverPlaceResponse;
import com.mungnyang.backend.naver.service.NaverLocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiRecommendService {

    private final NaverLocalService naverLocalService;

    public String recommend(String question, String context, Double lat, Double lng) {
        String combinedText = (context == null ? "" : context) + " " + question;

        String region = extractRegion(combinedText);
        String foodOrPlace = extractFoodOrPlace(combinedText);
        String petCondition = extractPetCondition(combinedText);

        String query = region + " " + foodOrPlace + " 애견동반";

        if (combinedText.contains("소형견")) {
            query = region + " 소형견 " + foodOrPlace + " 애견동반";
        }

        if (combinedText.contains("대형견")) {
            query = region + " 대형견 " + foodOrPlace + " 애견동반";
        }

        if (combinedText.contains("주차")) {
            query = region + " 주차 가능 " + foodOrPlace + " 애견동반";
        }

        if (combinedText.contains("실내") || combinedText.contains("비")) {
            query = region + " 실내 " + foodOrPlace + " 애견동반";
        }

        List<NaverPlaceResponse> places = naverLocalService.searchLocal(query);

        if (places.isEmpty()) {
            places = naverLocalService.searchLocal(region + " " + foodOrPlace);
        }

        if (places.isEmpty()) {
            return """
                    🐾 추천 결과를 찾지 못했어요.

                    조금 더 구체적으로 물어봐 주세요.

                    예시:
                    강동구 소형견 동반 떡볶이집 추천해줘
                    """;
        }

        StringBuilder answer = new StringBuilder();

        answer.append("🐶 조건에 맞춰 다시 찾아봤어요.\n\n");
        answer.append("📌 분석 조건\n");
        answer.append("• 지역: ").append(region).append("\n");
        answer.append("• 장소/음식: ").append(foodOrPlace).append("\n");
        answer.append("• 조건: ").append(petCondition).append("\n\n");

        answer.append("📍 추천 장소\n\n");

        int limit = Math.min(5, places.size());

        for (int i = 0; i < limit; i++) {
            NaverPlaceResponse place = places.get(i);

            String address = !place.getRoadAddress().isBlank()
                    ? place.getRoadAddress()
                    : place.getAddress();

            answer.append("🥇 ".replace("🥇", getRankEmoji(i)))
                    .append(place.getTitle())
                    .append("\n");

            answer.append("📍 ").append(address).append("\n");

            if (!place.getCategory().isBlank()) {
                answer.append("🏷️ ").append(place.getCategory()).append("\n");
            }

            answer.append("💡 ")
                    .append(makeReason(combinedText, foodOrPlace, petCondition))
                    .append("\n\n");
        }

        answer.append("⚠️ 실제 동반 가능 여부는 방문 전 전화나 네이버 플레이스 확인을 추천해요.");

        return answer.toString();
    }

    private String getRankEmoji(int index) {
        return switch (index) {
            case 0 -> "🥇 ";
            case 1 -> "🥈 ";
            case 2 -> "🥉 ";
            default -> "📌 ";
        };
    }

    private String extractRegion(String text) {
        String[] regions = {
                "강남구", "강동구", "강북구", "강서구", "관악구", "광진구",
                "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구",
                "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
                "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
                "분당", "판교", "일산", "부천", "인천", "수원", "용인", "하남", "남양주"
        };

        for (String region : regions) {
            if (text.contains(region)) {
                return region;
            }
        }

        return "서울";
    }

    private String extractFoodOrPlace(String text) {
        String[] keywords = {
                "떡볶이", "김밥", "라멘", "돈까스", "파스타", "브런치",
                "카페", "식당", "고깃집", "삼겹살", "피자", "치킨",
                "술집", "맥주", "공원", "운동장", "병원", "미용", "호텔"
        };

        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return keyword;
            }
        }

        return "카페";
    }

    private String extractPetCondition(String text) {
        if (text.contains("소형견")) return "소형견 동반";
        if (text.contains("중형견")) return "중형견 동반";
        if (text.contains("대형견")) return "대형견 동반";
        if (text.contains("실내")) return "실내 동반";
        if (text.contains("테라스")) return "테라스 동반";
        if (text.contains("주차")) return "주차 가능";
        return "반려동물 동반";
    }

    private String makeReason(String text, String foodOrPlace, String petCondition) {
        if (text.contains("소형견")) {
            return "소형견과 함께 가기 좋은 장소를 찾는 질문이라 관련 키워드로 검색했어요.";
        }

        if (text.contains("대형견")) {
            return "대형견 동반 가능성을 고려해서 검색했어요.";
        }

        if (text.contains("주차")) {
            return "주차 가능 조건을 반영해서 검색했어요.";
        }

        if (text.contains("실내") || text.contains("비")) {
            return "실내 이용 가능성이 있는 장소를 중심으로 검색했어요.";
        }

        return foodOrPlace + "와 " + petCondition + " 조건을 함께 고려했어요.";
    }
}