# 우리 동네 음쓰 제로 웨이스트!🌿

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---
### 지자체 목록
/cities

### 전국 혹은 근처 아파트 목록(간혹 공공건물 포함)
/apartments?latitude=`<latitude>`&longtitude=`<longtitude>`&neighbors=`<integer>`

### 지자체 내 아파트 목록(간혹 공공건물 포함)
/apartments/`<city>`

### 하나의 아파트(or 공공건물) 정보
/apartments/`<city>`/`<apartment>`

### 종합(일, 월)
/wastes?year=`<year>`&month=`<month>`&total=`<boolean>`

### 지자체별 전체(일, 월)
/wastes/all?year=`<year>`&month=`<month>`&total=`<boolean>`

### 지자체별(일, 월)
/wastes/`<city>`?year=`<year>`&month=`<month>`&total=`<boolean>`

### 지자체 내 아파트전체(일, 월)
/wastes/`<city>`/all?year=`<year>`&month=`<month>`&total=`<boolean>`

### 아파트별(일,월)
/wastes/`<city>`/`<apartment>`?year=`<year>`&month=`<month>`&total=`<boolean>`
