export default function DashboardHeaderFallback() {
  return (
    <div className="w-full bg-white p-4 text-xl border-b-2 border-gray-300 text-fontNavy flex flex-row justify-between items-center sticky top-0 z-50">
      {/* 왼쪽: 유저명 자리 */}
      <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />

      {/* 가운데: 날짜와 버튼 */}
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-28 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* 오른쪽: 로그인/로그아웃 버튼 */}
      <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
