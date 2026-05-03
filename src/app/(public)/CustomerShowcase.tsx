import { customers, customerCategoryLabel, customerDisplayName, type CustomerCategory } from "@/lib/site-config";

const order: CustomerCategory[] = ["public", "research", "private"];

const categoryStyle: Record<CustomerCategory, { dot: string; text: string }> = {
  public: { dot: "bg-blue-500", text: "text-blue-700" },
  research: { dot: "bg-indigo-500", text: "text-indigo-700" },
  private: { dot: "bg-emerald-500", text: "text-emerald-700" },
};

interface Props {
  /** "compact" = 홈 hero strip / "grouped" = about 페이지 카테고리 그룹 */
  variant?: "compact" | "grouped";
}

/**
 * 11+ 고객사 텍스트 wordmark 노출. 로고 자산 미보유 시 텍스트 칩으로 시작.
 * 추후 /public/customers/{code}.svg 자산 업로드 시 이미지 폴백 추가 가능.
 */
export function CustomerShowcase({ variant = "compact" }: Props) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-3">
        {customers.map((c) => (
          <div
            key={c.code}
            title={c.disclosed ? c.name : "외부 표기 동의 미확인 — 익명 표기"}
            className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors px-2 py-1"
          >
            {customerDisplayName(c)}
          </div>
        ))}
      </div>
    );
  }

  // grouped variant
  return (
    <div className="space-y-8 md:space-y-10">
      {order.map((cat) => {
        const items = customers.filter((c) => c.category === cat);
        if (!items.length) return null;
        const style = categoryStyle[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
              <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-widest ${style.text}`}>
                {customerCategoryLabel[cat]} ({items.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {items.map((c) => {
                const hasDetail = !!(c.vendor || c.userScale || c.role || c.solvedRisks?.length);
                return (
                  <div
                    key={c.code}
                    className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${
                      hasDetail ? "p-4 sm:p-5" : "px-4 py-3"
                    }`}
                    title={c.disclosed ? c.name : "외부 표기 동의 미확인 — 익명 표기"}
                  >
                    <p className="text-sm font-bold text-gray-900 kr-keep-all mb-1">
                      {customerDisplayName(c)}
                    </p>
                    {c.disclosed && (
                      <p className="text-[10px] text-gray-400 font-mono mb-1">{c.code}</p>
                    )}
                    {hasDetail && (
                      <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-100">
                        {c.vendor && (
                          <p className="text-[11px] text-gray-600 leading-snug kr-keep-all">
                            <span className="text-gray-400">벤더 </span>
                            {c.vendor}
                          </p>
                        )}
                        {c.userScale && (
                          <p className="text-[11px] text-gray-600 leading-snug kr-keep-all">
                            <span className="text-gray-400">규모 </span>
                            {c.userScale}
                          </p>
                        )}
                        {c.role && (
                          <p className="text-[11px] text-gray-600 leading-snug kr-keep-all">
                            <span className="text-gray-400">역할 </span>
                            {c.role}
                          </p>
                        )}
                        {c.solvedRisks && c.solvedRisks.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {c.solvedRisks.map((r) => (
                              <span
                                key={r}
                                className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 ${style.text} kr-keep-all`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
