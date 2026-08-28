import Image from "next/image";
import { type Partnership } from "@/lib/site-config";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server component — public/partners/{logoFile} 파일이 실제 존재할 때만 이미지 사용,
 * 없으면 brand-color 텍스트 칩으로 폴백.
 */
export function PartnerBadge({
  partner,
  variant = "card",
}: {
  partner: Partnership;
  variant?: "card" | "strip";
}) {
  const hasLogo =
    !!partner.logoFile &&
    existsSync(path.join(process.cwd(), "public", "partners", partner.logoFile));

  if (variant === "strip") {
    return (
      <div className="flex items-center justify-center min-w-[100px] sm:min-w-[120px]">
        {hasLogo ? (
          <Image
            src={`/partners/${partner.logoFile}`}
            alt={partner.name}
            width={140}
            height={32}
            sizes="(min-width: 640px) 140px, 120px"
            className="h-6 sm:h-7 w-auto opacity-70 hover:opacity-100 transition-opacity"
          />
        ) : (
          <span className={`text-sm sm:text-base font-bold ${partner.textColor} opacity-60`}>
            {partner.name}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 text-center">
      <div className="flex items-center justify-center h-12 mb-3">
        {hasLogo ? (
          <Image
            src={`/partners/${partner.logoFile}`}
            alt={partner.name}
            width={160}
            height={40}
            sizes="160px"
            className="h-8 sm:h-10 w-auto"
          />
        ) : (
          <span className={`text-lg sm:text-xl font-bold ${partner.textColor}`}>
            {partner.name}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 kr-keep-all">{partner.role}</p>
    </div>
  );
}
