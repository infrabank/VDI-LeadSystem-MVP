import Link from "next/link";

export interface ContentListItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  category: string | null;
  published_at: string | null;
  rank?: number;
}

const typeBadge: Record<string, string> = {
  article: "bg-blue-100 text-blue-700",
  case: "bg-emerald-100 text-emerald-700",
  checklist: "bg-purple-100 text-purple-700",
  comparison: "bg-orange-100 text-orange-700",
};

const typeLabel: Record<string, string> = {
  article: "Article",
  case: "Case Study",
  checklist: "Checklist",
  comparison: "Comparison",
};

export function ContentCard({ item }: { item: ContentListItem }) {
  return (
    <Link
      href={`/insights/${item.slug}`}
      className="card-hover group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300"
    >
      {item.cover_image_url && (
        <div className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.cover_image_url}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${typeBadge[item.type] || "bg-gray-100 text-gray-600"}`}>
            {typeLabel[item.type] || item.type}
          </span>
          {item.category && (
            <span className="text-xs text-gray-600">{item.category}</span>
          )}
        </div>
        <h2 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors kr-keep-all">{item.title}</h2>
        {item.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed kr-keep-all">{item.excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          {item.published_at ? (
            <p className="text-xs text-gray-600">
              {new Date(item.published_at).toLocaleDateString("ko-KR")}
            </p>
          ) : <span />}
          <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
