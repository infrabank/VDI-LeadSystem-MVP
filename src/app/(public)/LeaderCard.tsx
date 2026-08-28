import Image from "next/image";
import { type LeaderProfile } from "@/lib/site-config";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server component — public/team/{photoFile} 존재 시 사진, 없으면 회사 로고(/public/logo.png) 폴백.
 * 두 자산 모두 없으면 작은 회사 이니셜(M) 정돈 표기.
 * name 미입력 시 "정보 업데이트 예정" 표시.
 */
export function LeaderCard({ leader }: { leader: LeaderProfile }) {
  const hasPhoto =
    !!leader.photoFile &&
    existsSync(path.join(process.cwd(), "public", "team", leader.photoFile));

  const hasLogo = existsSync(path.join(process.cwd(), "public", "logo.png"));
  const isPlaceholder = !leader.name;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition hover:border-gray-300 hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border border-gray-200">
          {hasPhoto ? (
            <Image
              src={`/team/${leader.photoFile}`}
              alt={leader.name || leader.role}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : hasLogo ? (
            <Image
              src="/logo.png"
              alt={leader.name ? `${leader.name} 프로필` : "Myloket 로고"}
              width={80}
              height={80}
              className="w-full h-full object-contain p-2.5 bg-white"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base sm:text-lg font-bold text-blue-700/50 select-none tracking-wide">
              M
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">
            {leader.role}
          </p>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 kr-keep-all">
            {leader.name || (
              <span className="text-gray-600 font-medium">정보 업데이트 예정</span>
            )}
          </h3>
          {leader.bio && (
            <p className="text-sm text-gray-600 leading-relaxed mb-3 kr-keep-all">{leader.bio}</p>
          )}
          {leader.expertise && leader.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {leader.expertise.map((tag) => (
                <span
                  key={tag}
                  className="text-2xs sm:text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full kr-keep-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs">
            {leader.email && (
              <a
                href={`mailto:${leader.email}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Email
              </a>
            )}
            {leader.linkedinUrl && (
              <a
                href={leader.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                LinkedIn ↗
              </a>
            )}
            {isPlaceholder && (
              <span className="text-gray-600">슬롯 — 향후 채워질 예정</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
