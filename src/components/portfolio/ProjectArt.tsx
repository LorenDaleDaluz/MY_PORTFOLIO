import { useId } from "react";
import type { ProjectArtKind } from "../../data/portfolio";

const HEART =
  "M0 9C-14-1-11-13-3.5-11C-1.5-10.5-.5-9 0-7.5C.5-9 1.5-10.5 3.5-11C11-13 14-1 0 9Z";
const DIAMOND = "M0-11L8 0 0 11-8 0Z";
const SPADE =
  "M0-11C3-6 11-2 11 3 11 7 7 9 3.5 7 2.5 6.5 1.5 5.5 1 4.5L2.5 11H-2.5L-1 4.5C-1.5 5.5-2.5 6.5-3.5 7-7 9-11 7-11 3-11-2-3-6 0-11Z";

const QR = Array.from({ length: 36 }, (_, i) => [i % 6, Math.floor(i / 6)]).filter(
  ([x, y]) => (x * 7 + y * 3 + x * y) % 4 !== 0,
);

/** Generative cover art for each project, in the molten red / cobalt palette. */
export default function ProjectArt({
  kind,
  className = "",
}: {
  kind: ProjectArtKind;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  const common = {
    viewBox: "0 0 400 500",
    preserveAspectRatio: "xMidYMid slice",
    className,
    "aria-hidden": true,
  } as const;

  if (kind === "identify") {
    return (
      <svg {...common}>
        <defs>
          <radialGradient id={id("bg")} cx="72%" cy="18%" r="95%">
            <stop offset="0" stopColor="#ff7a4d" />
            <stop offset=".38" stopColor="#c2160f" />
            <stop offset=".78" stopColor="#3a0505" />
            <stop offset="1" stopColor="#120202" />
          </radialGradient>
          <radialGradient id={id("blue")} cx="8%" cy="96%" r="70%">
            <stop offset="0" stopColor="#3358ff" stopOpacity=".6" />
            <stop offset="1" stopColor="#3358ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("card")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff8f3" />
            <stop offset="1" stopColor="#efd5ca" />
          </linearGradient>
          <linearGradient id={id("scan")} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <pattern id={id("dots")} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#fff" fillOpacity=".16" />
          </pattern>
        </defs>
        <rect width="400" height="500" fill={url("bg")} />
        <rect width="400" height="500" fill={url("blue")} />
        <rect width="400" height="500" fill={url("dots")} />
        <g fill="none" stroke="#fff" strokeOpacity=".16">
          <circle cx="300" cy="118" r="56" />
          <circle cx="300" cy="118" r="104" />
          <circle cx="300" cy="118" r="156" />
        </g>
        <path
          d="M300 84c-17 0-30 13-30 30 0 22 30 50 30 50s30-28 30-50c0-17-13-30-30-30z"
          fill="#fff"
          fillOpacity=".92"
        />
        <circle cx="300" cy="114" r="10" fill="#c2160f" />
        <g transform="translate(64 238) rotate(-7)">
          <rect x="10" y="16" width="262" height="166" rx="16" fill="#000" fillOpacity=".35" />
          <rect width="262" height="166" rx="16" fill={url("card")} />
          <path d="M0 16a16 16 0 0 1 16-16h230a16 16 0 0 1 16 16v20H0z" fill="#1d0606" />
          <circle cx="22" cy="18" r="5" fill="#ff3d1f" />
          <rect x="34" y="14" width="70" height="8" rx="4" fill="#fff" fillOpacity=".7" />
          <rect x="18" y="50" width="74" height="94" rx="9" fill="#2a0a07" />
          <circle cx="55" cy="86" r="17" fill="#ff9a78" />
          <path d="M27 140c3-24 53-24 56 0z" fill="#ff9a78" />
          <path
            d="M12 58V44h14M98 58V44H84M12 136v14h14M98 136v14H84"
            stroke="#ff3d1f"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="108" y="56" width="128" height="11" rx="5.5" fill="#1d0606" />
          <rect x="108" y="76" width="96" height="8" rx="4" fill="#1d0606" fillOpacity=".45" />
          <rect x="108" y="92" width="110" height="8" rx="4" fill="#1d0606" fillOpacity=".45" />
          <rect x="108" y="124" width="62" height="18" rx="9" fill="#ff3d1f" />
          <g fill="#1d0606">
            {QR.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={196 + x * 7} y={104 + y * 7} width="5.5" height="5.5" />
            ))}
          </g>
        </g>
        <rect x="30" y="312" width="340" height="14" fill={url("scan")} opacity=".2" />
        <rect x="30" y="318" width="340" height="2" fill={url("scan")} />
      </svg>
    );
  }

  if (kind === "finflow") {
    const bars = [38, 64, 46, 92, 74, 120];
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("bg")} x1="0" y1="0" x2=".3" y2="1">
            <stop offset="0" stopColor="#070d33" />
            <stop offset=".55" stopColor="#1c2bb0" />
            <stop offset="1" stopColor="#ff6a3d" />
          </linearGradient>
          <radialGradient id={id("glow")} cx="80%" cy="28%" r="60%">
            <stop offset="0" stopColor="#ffb59a" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffb59a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("w1")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff3d1f" stopOpacity=".95" />
            <stop offset="1" stopColor="#ff3d1f" stopOpacity=".25" />
          </linearGradient>
          <linearGradient id={id("w2")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb59a" stopOpacity=".9" />
            <stop offset="1" stopColor="#ffb59a" stopOpacity=".15" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={url("bg")} />
        <rect width="400" height="500" fill={url("glow")} />
        <g stroke="#fff" strokeOpacity=".08">
          {[80, 140, 200, 260, 320, 380, 440].map((y) => (
            <line key={y} x1="0" x2="400" y1={y} y2={y} />
          ))}
        </g>
        <path
          d="M0 352C60 322 110 372 170 334S280 272 330 292S400 256 400 256V500H0Z"
          fill={url("w2")}
        />
        <path d="M0 410C70 380 120 420 190 392S300 334 400 352V500H0Z" fill={url("w1")} />
        <path
          d="M24 300L84 268L144 284L204 226L264 242L324 186L380 200"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {[
          [24, 300],
          [84, 268],
          [144, 284],
          [204, 226],
          [264, 242],
          [324, 186],
          [380, 200],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="#070d33" stroke="#fff" strokeWidth="2.5" />
        ))}
        <g transform="translate(98 128)">
          <circle r="50" fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="16" />
          <circle
            r="50"
            fill="none"
            stroke="#ff7a35"
            strokeWidth="16"
            strokeDasharray="190 400"
            strokeLinecap="round"
            transform="rotate(-90)"
          />
          <circle
            r="50"
            fill="none"
            stroke="#fff"
            strokeWidth="16"
            strokeDasharray="64 400"
            strokeDashoffset="-206"
            strokeLinecap="round"
            transform="rotate(-90)"
          />
        </g>
        <g transform="translate(246 52)">
          <rect width="116" height="204" rx="22" fill="#060b2a" fillOpacity=".6" stroke="#fff" strokeOpacity=".55" />
          <rect x="44" y="10" width="28" height="6" rx="3" fill="#fff" fillOpacity=".4" />
          {bars.map((h, i) => (
            <rect
              key={i}
              x={16 + i * 15}
              y={176 - h}
              width="9"
              height={h}
              rx="4.5"
              fill={i === bars.length - 1 ? "#ff7a35" : "#fff"}
              fillOpacity={i === bars.length - 1 ? 1 : 0.55}
            />
          ))}
        </g>
      </svg>
    );
  }

  if (kind === "spendz") {
    const receipt = (rows: number) =>
      `M0 0H150V${rows}${Array.from({ length: 20 }, (_, i) => `l-7.5 ${i % 2 ? -9 : 9}`).join("")}Z`;
    return (
      <svg {...common}>
        <defs>
          <radialGradient id={id("bg")} cx="18%" cy="12%" r="110%">
            <stop offset="0" stopColor="#ffd9c4" />
            <stop offset=".35" stopColor="#ff8a4a" />
            <stop offset=".75" stopColor="#c2260f" />
            <stop offset="1" stopColor="#3a0806" />
          </radialGradient>
          <linearGradient id={id("coin")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe3a3" />
            <stop offset="1" stopColor="#d9822b" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={url("bg")} />
        <g transform="translate(300 110)">
          <circle r="62" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="22" />
          <circle r="62" fill="none" stroke="#3358ff" strokeWidth="22" strokeDasharray="150 400" transform="rotate(-90)" />
          <circle r="62" fill="none" stroke="#fff" strokeWidth="22" strokeDasharray="90 400" strokeDashoffset="-158" transform="rotate(-90)" />
        </g>
        {[
          { x: 52, y: 150, r: -12, rows: 210 },
          { x: 126, y: 178, r: 4, rows: 230 },
        ].map((p) => (
          <g key={p.x} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
            <path d={receipt(p.rows)} transform="translate(6 12)" fill="#000" fillOpacity=".22" />
            <path d={receipt(p.rows)} fill="#fffaf5" />
            <rect x="18" y="20" width="70" height="10" rx="5" fill="#2b0d07" />
            {[48, 70, 92, 114, 136].map((y, i) => (
              <g key={y}>
                <rect x="18" y={y} width={56 + ((i * 17) % 30)} height="7" rx="3.5" fill="#2b0d07" fillOpacity=".35" />
                <rect x="104" y={y} width="28" height="7" rx="3.5" fill="#2b0d07" fillOpacity=".55" />
              </g>
            ))}
            <rect x="18" y="168" width="114" height="2" fill="#2b0d07" fillOpacity=".3" />
            <rect x="18" y="182" width="44" height="11" rx="5.5" fill="#ff3d1f" />
            <rect x="96" y="182" width="36" height="11" rx="5.5" fill="#2b0d07" />
          </g>
        ))}
        {[
          [88, 420, 30],
          [138, 440, 24],
          [62, 456, 20],
        ].map(([x, y, r]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={r} fill={url("coin")} />
            <circle cx={x} cy={y} r={r * 0.68} fill="none" stroke="#a85a1c" strokeOpacity=".55" strokeWidth="2" />
          </g>
        ))}
      </svg>
    );
  }

  const card = (rotate: number, suit: string, color: string) => (
    <g transform={`translate(200 440) rotate(${rotate}) translate(-75 -250)`}>
      <rect x="6" y="10" width="150" height="214" rx="14" fill="#000" fillOpacity=".35" />
      <rect width="150" height="214" rx="14" fill="#fbf7f2" />
      <rect x="8" y="8" width="134" height="198" rx="9" fill="none" stroke={color} strokeOpacity=".2" />
      <g transform="translate(22 26) scale(.9)">
        <rect x="-6" y="-14" width="12" height="4" rx="2" fill={color} />
        <path d={suit} transform="translate(0 6) scale(.7)" fill={color} />
      </g>
      <g transform="translate(128 188) rotate(180) scale(.9)">
        <rect x="-6" y="-14" width="12" height="4" rx="2" fill={color} />
        <path d={suit} transform="translate(0 6) scale(.7)" fill={color} />
      </g>
      <path d={suit} transform="translate(75 107) scale(3.4)" fill={color} />
    </g>
  );

  return (
    <svg {...common}>
      <defs>
        <radialGradient id={id("bg")} cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor="#7a1013" />
          <stop offset=".55" stopColor="#2a0306" />
          <stop offset="1" stopColor="#070102" />
        </radialGradient>
        <pattern id={id("felt")} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="22" stroke="#fff" strokeOpacity=".05" />
        </pattern>
        <radialGradient id={id("spot")} cx="50%" cy="20%" r="60%">
          <stop offset="0" stopColor="#ffb59a" stopOpacity=".35" />
          <stop offset="1" stopColor="#ffb59a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={url("bg")} />
      <rect width="400" height="500" fill={url("felt")} />
      <rect width="400" height="500" fill={url("spot")} />
      {card(-18, SPADE, "#141414")}
      {card(16, DIAMOND, "#d4231a")}
      {card(0, HEART, "#d4231a")}
      {[
        [70, 90, "#3358ff"],
        [328, 404, "#ff3d1f"],
      ].map(([x, y, color]) => (
        <g key={String(x)} transform={`translate(${x} ${y})`}>
          <circle r="28" fill={String(color)} />
          <circle r="28" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="8 8" />
          <circle r="17" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
