import HomeView from "@/components/view";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "GitHub 활동분석",
  description: "GitHub 커밋, PR, 이슈 활동들을 시각화합니다.",
  other: {
    "google-site-verification": "cgWvwatnB0H5kzf8j78Kz-FX6MV2NAZ8AtGhqP7DoYg",
  },
  openGraph: {
    title: "GitHub 활동 분석",
    description: "GitHub 커밋, PR, 이슈 활동들을 시각화합니다.",
    url: `${baseUrl}`,
    siteName: "GitHub Activity Analysis",
    type: "website",
  },
};

export default function Home() {
  return <HomeView />;
}
