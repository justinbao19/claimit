import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #fffefb 0%, #f5ece0 100%)",
      }}
    >
      <svg width="512" height="512" viewBox="0 0 512 512" fill="none">
        <rect width="512" height="512" rx="144" fill="url(#bg)" />
        <rect x="76" y="76" width="360" height="360" rx="112" fill="white" fillOpacity="0.5" />
        <path d="M163 171C163 153.327 177.327 139 195 139H305" stroke="#705238" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M163 171V341C163 358.673 177.327 373 195 373H305" stroke="#705238" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="258" y="117" width="72" height="236" rx="36" transform="rotate(45 258 117)" fill="#8A6846" />
        <defs>
          <linearGradient id="bg" x1="64" y1="40" x2="446" y2="472" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#F3E8DB" />
          </linearGradient>
        </defs>
      </svg>
    </div>,
    size,
  );
}
