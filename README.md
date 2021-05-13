# 우리 동네 제로 음쓰!🌿

## 아이디어(RFID 기반 음식물 쓰레기 배출량 공공데이터)
환경 공단 제공 월별, 지역별 쓰레기 발생량 공공 데이터 활용</br>
공공 데이터 출처: [https://www.data.go.kr/data/3045421/openapi.do](https://www.data.go.kr/data/3045421/openapi.do)(사업 소개 포함)</br>
전국 161개 지자체, 전국 공동주택 1천 세대 기준 RFID 음식물 쓰레기 처리기, 약 50% 보급

## 강점
1. 일반 음식점이 아닌 공동주택에 있는 음식물을 추적하기 때문에 의미있는 데이터 추출 가능
2. 환경을 주제로 하기 때문에 공익성이 있음(사회문제를 해결한다는 해커톤 주제에 적합)
3. RFID 기반 음식물 쓰레기 봉투가 도입된 지 오래되지 않았기 때문에 아직까진 선행 서비스가 존재하지 않아 사업성 있음.
4. 일별, 월별로, 지자체별, 아파트별로 쓰레기양을 보여주어, 경쟁적인 요소로 흥미를 유발할 수 있음.
5. 데이터 사용 승인이 자동으로 처리되어, API 신청과 동시에 Key를 받을 수 있음.

## 제공하는 데이터
1. 서비스를 사용하고 있는 아파트, 지자체 목록
2. 장비의 상태 목록(고장이 나있다거나, 뚜겅이 열려있다거나, 얼마만큼 차 있는지)
3. 지자체별/아파트별 배출내역(시간별,일별, 요일별)
4. 아파트 세대수 및 좌표 목록

## 구현 


---
#### 지자체 목록
/cities

#### 전국 혹은 근처 아파트 목록(간혹 공공건물 포함)
/apartments?latitude=`<latitude>`&longtitude=`<longtitude>`&neighbors=`<integer>`

#### 지자체 내 아파트 목록(간혹 공공건물 포함)
/apartments/`<city>`

#### 하나의 아파트(or 공공건물) 정보
/apartments/`<city>`/`<apartment>`

#### 종합(일, 월)
/wastes?year=`<year>`&month=`<month>`&total=`<boolean>`

#### 지자체별 전체(일, 월)
/wastes/all?year=`<year>`&month=`<month>`&total=`<boolean>`

#### 지자체별(일, 월)
/wastes/`<city>`?year=`<year>`&month=`<month>`&total=`<boolean>`

#### 지자체 내 아파트전체(일, 월)
/wastes/`<city>`/all?year=`<year>`&month=`<month>`&total=`<boolean>`

#### 아파트별(일,월)
/wastes/`<city>`/`<apartment>`?year=`<year>`&month=`<month>`&total=`<boolean>`
