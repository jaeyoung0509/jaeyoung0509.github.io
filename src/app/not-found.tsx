import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found container">
      <span>404</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소가 변경되었거나 더 이상 제공하지 않는 콘텐츠입니다.</p>
      <Link href="/">
        <ArrowLeft size={16} /> 홈으로 돌아가기
      </Link>
    </section>
  );
}
