/**
 * @module Globe
 * @description Interactive 3D globe component for the portfolio site.
 *
 * Renders a WebGL globe (via react-globe.gl / ThreeJS) displaying project
 * locations as clickable markers. When a marker is clicked the globe pauses
 * rotation, the camera flies to that project, and animated arcs + pulsating
 * rings connect the project to its client regions worldwide.
 *
 * ## Key architecture decisions
 *
 * | Decision | Rationale |
 * |---|---|
 * | `next/dynamic` with `ssr: false` | react-globe.gl requires `window` / WebGL |
 * | Strict polygon filter (`extractSafePolygons`) | Hex polygon rendering can crash on Antarctica, antimeridian crossings, and complex MultiPolygons, so unsafe shapes are filtered/simplified first |
 * | `ringsData` includes a `color` field and `ringColor="color"` | three-globe expects a parseable CSS color string; using per-ring rgba strings avoids `colorAlpha` null crashes |
 * | CSS variables read via `getComputedStyle` | Keeps globe colors in sync with the site's light/dark theme tokens defined in `globals.css` |
 * | `topojson-client` dynamic import | Avoids bundling TopoJSON parsing on the server |
 *
 * ## Dependencies
 *
 * - `react-globe.gl` — React wrapper around three-globe
 * - `three` — peer dependency of react-globe.gl (globe material)
 * - `topojson-client` — converts world-atlas TopoJSON → GeoJSON
 * - `world-atlas@2` — fetched at runtime from jsDelivr CDN (~30 KB)
 *
 * ## Theme integration
 *
 * Uses the app's `useTheme` hook (from `./theme-provider`) and reads
 * `--p-bg`, `--p-accent`, etc. CSS custom properties so the globe
 * automatically adapts when the user toggles dark/light mode.
 *
 * @example
 * ```tsx
 * import { Globe } from "@/components/globe";
 *
 * export default function HeroSection() {
 *   return (
 *     <section className="max-w-3xl mx-auto">
 *       <Globe />
 *     </section>
 *   );
 * }
 * ```
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "./theme-provider";
import type { GlobeMethods } from "react-globe.gl";
import { Color, MeshPhongMaterial } from "three";

/* Types */

/** A single client / user region that a project serves. */
interface ClientRegion {
  name: string;
  lat: number;
  lng: number;
}

/** A portfolio project with its base location and the regions it serves. */
interface ProjectMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  label: string;
  clients: ClientRegion[];
}

/** Shape passed to react-globe.gl's `pointsData` prop. */
interface GlobePointData {
  id: string;
  name: string;
  label: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
}

/** Shape passed to react-globe.gl's `arcsData` prop. */
interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

/** Shape passed to react-globe.gl's `ringsData` prop. */
interface RingData {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
  color: string;
}

/** GeoJSON Polygon coordinates: [ring][point][lng, lat] */
type PolygonCoordinates = number[][][];

/**  GeoJSON MultiPolygon coordinates: [polygon][ring][point][lng, lat] */
type MultiPolygonCoordinates = number[][][][];

/** Minimal GeoJSON feature shape for the hex polygon filter. */
interface GeoJsonFeature {
  id?: string | number;
  geometry:
    | {
        type: "Polygon";
        coordinates: PolygonCoordinates;
      }
    | {
        type: "MultiPolygon";
        coordinates: MultiPolygonCoordinates;
      }
    | null;
  properties?: Record<string, unknown>;
}

/** Resolved CSS variable palette used throughout the component. */
interface ThemeColorPalette {
  background: string;
  backgroundSecondary: string;
  border: string;
  borderSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentSecondary: string;
  selected: string;
}

/* Constants */

/** CDN URL for the 110m-resolution world TopoJSON (Natural Earth). */
const COUNTRIES_TOPOJSON_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Country IDs (ISO 3166-1 numeric, zero-padded) whose polygons are known
 * to crash H3's `polygonToCells` at resolution 3. Antarctica is the main
 * offender; the Pacific island nations have antimeridian-crossing rings.
 */
const EXCLUDED_COUNTRY_IDS: ReadonlySet<string> = new Set([
  "010", // Antarctica
  "016", // American Samoa
  "258", // French Polynesia
  "540", // New Caledonia
  "570", // Niue
  "612", // Pitcairn Islands
  "772", // Tokelau
  "876", // Wallis and Futuna
]);

/** Milliseconds for a single arc dash to traverse the full arc length. */
const ARC_FLIGHT_TIME_MS = 1800;

/** Dash length as a fraction (0–1) of the total arc. */
const ARC_DASH_RELATIVE_LENGTH = 0.7;

/** Maximum ring expansion radius in geographic degrees. */
const RING_MAX_RADIUS_DEGREES = 3.6;

/** Ring expansion speed in degrees per second. */
const RING_PROPAGATION_SPEED_DEG_PER_SEC = 4;

/** Milliseconds between consecutive ring pulse emissions. */
const RING_REPEAT_PERIOD_MS = 850;

/** Upper bound on the globe canvas dimension (prevents oversized globes on ultrawide). */
const MAX_GLOBE_SIZE_PX = 520;

/** Lower bound on the globe canvas dimension (stays usable on small phones). */
const MIN_GLOBE_SIZE_PX = 260;

/**
 * Selected-state green color.
 */
const SELECTED_COLOR = "#4a7c59";

/* Dynamic import

 * react-globe.gl internally creates a WebGL renderer on mount, which
 * requires `window` and `document`. Next.js performs server-side rendering
 * by default, so we must disable SSR for this import.
 */

const GlobeGL = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-2 border-p-border2 border-t-p-accent animate-spin" />
    </div>
  ),
});

/* Utility functions */

/**
 * Reads a CSS custom property from `:root` (or `.dark`) at runtime.
 * Returns `fallbackValue` on the server or if the variable is unset.
 */
function getCssVariableValue(
  variableName: string,
  fallbackValue: string,
): string {
  if (typeof window === "undefined") return fallbackValue;
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  return resolved.length > 0 ? resolved : fallbackValue;
}

/**
 * Converts a hex color (`#rgb` or `#rrggbb`) to an `rgba()` string.
 *
 * three-globe's internal color parser (`colorAlpha`) can choke on 8-digit
 * hex colors (`#RRGGBBAA`). Using `rgba()` strings avoids that entirely.
 */
function hexToRgba(hexColor: string, alpha: number): string {
  const sanitized = hexColor.replace("#", "").trim();
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : sanitized;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return `rgba(0,0,0,${alpha})`;
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}

/**
 * Processes a GeoJSON feature to extract safe, simple Polygons.
 * MultiPolygons (like the US, UK, Australia) are split into individual
 * Polygon features. Any polygons known to break hex rendering are filtered out or simplified.
 */
function extractSafePolygons(feature: GeoJsonFeature): GeoJsonFeature[] {
  if (!feature.geometry) return [];

  const featureId = String(feature.id ?? "").padStart(3, "0");
  if (EXCLUDED_COUNTRY_IDS.has(featureId)) return [];

  const type = feature.geometry.type;
  const coordinates = feature.geometry.coordinates;

  const isFiniteLngLat = (pos: number[]): boolean => {
    if (!Array.isArray(pos) || pos.length < 2) return false;
    const lon = pos[0];
    const lat = pos[1];
    return (
      Number.isFinite(lon) &&
      Number.isFinite(lat) &&
      lon >= -180 &&
      lon <= 180 &&
      lat >= -90 &&
      lat <= 90
    );
  };

  const sanitizeOuterRing = (ring: number[][]): number[][] | null => {
    if (!Array.isArray(ring) || ring.length < 4) return null;

    const cleaned: number[][] = [];
    for (const p of ring) {
      if (!isFiniteLngLat(p)) return null;
      const prev = cleaned[cleaned.length - 1];
      if (!prev || prev[0] !== p[0] || prev[1] !== p[1]) {
        cleaned.push([p[0], p[1]]);
      }
    }

    if (cleaned.length < 3) return null;

    const first = cleaned[0];
    const last = cleaned[cleaned.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      cleaned.push([first[0], first[1]]);
    }

    return cleaned.length >= 4 ? cleaned : null;
  };

  const toSafePolygon = (polyCoords: number[][][]): number[][][] | null => {
    if (!Array.isArray(polyCoords) || polyCoords.length === 0) return null;

    // Keep only outer ring for H3 stability.
    const outer = sanitizeOuterRing(polyCoords[0]);
    if (!outer) return null;

    return [outer];
  };

  if (type === "Polygon") {
    const safe = toSafePolygon(coordinates as number[][][]);
    return safe
      ? [{ ...feature, geometry: { type: "Polygon", coordinates: safe } }]
      : [];
  }

  if (type === "MultiPolygon") {
    const multiCoords = coordinates as number[][][][];
    const safeFeatures: GeoJsonFeature[] = [];

    multiCoords.forEach((polyCoords, index) => {
      const safe = toSafePolygon(polyCoords);
      if (!safe) return;

      safeFeatures.push({
        ...feature,
        id: `${feature.id}_${index}`,
        geometry: { type: "Polygon", coordinates: safe },
      });
    });

    return safeFeatures;
  }

  return [];
}

/* Static project data

 * Each entry maps to a portfolio project. The `clients` array defines
 * the geographic regions served — these become arc endpoints on click.
 */

const PROJECTS: readonly ProjectMarker[] = [
  {
    id: "akasha",
    name: "AKASHA Foundation",
    lat: 47.17,
    lng: 8.52,
    label: "Zug, Switzerland",
    clients: [
      { name: "Urbe Hub (Rome, Italy)", lat: 41.9028, lng: 12.4964 },
      { name: "AKASHA Hub (Barcelona, Spain)", lat: 41.3874, lng: 2.1686 },
      { name: "AKASHA Innovation Hub (Ireland)", lat: 53.3498, lng: -6.2603 }, // Dublin
    ],
  },
  {
    id: "soulful",
    name: "Soulful Platform (Amaly Legacy)",
    lat: 25.2,
    lng: 55.27,
    label: "Dubai, UAE",
    clients: [
      { name: "Bring Hope Foundation (Sweden)", lat: 59.3293, lng: 18.0686 }, // Stockholm
      { name: "Women Of Will (WOW) (Malaysia)", lat: 3.139, lng: 101.6869 }, // Kuala Lumpur
      {
        name: "Greenpeace Foundation (Netherlands)",
        lat: 52.3676,
        lng: 4.9041,
      }, // Amsterdam
      { name: "Al Jalila Foundation (UAE)", lat: 25.2048, lng: 55.2708 }, // Dubai
    ],
  },
  {
    id: "theoremone",
    name: "TheoremOne (now Formula.Monks)",
    lat: 34.1683,
    lng: -118.6059,
    label: "Woodland Hills, California, USA",
    clients: [
      { name: "BSI (UK)", lat: 52.0406, lng: -0.7594 },
      { name: "AT&T (Plano, USA)", lat: 33.0198, lng: -96.6989 },
      { name: "MISO (Carmel, USA)", lat: 39.9784, lng: -86.118 },
      { name: "American Express (New York, USA)", lat: 40.7128, lng: -74.006 },
      { name: "Intel (Santa Clara, USA)", lat: 37.3541, lng: -121.9552 },
      { name: "Starbucks (Seattle, USA)", lat: 47.6062, lng: -122.3321 },
      { name: "Caterpillar (Irving, USA)", lat: 32.814, lng: -96.9489 },
    ],
  },
  {
    id: "bsi",
    name: "BSI Knowledge",
    lat: 51.51,
    lng: -0.13,
    label: "London, UK",
    clients: [
      { name: "USA", lat: 38.9072, lng: -77.0369 }, // Washington, D.C.
      { name: "Canada", lat: 45.4215, lng: -75.6972 }, // Ottawa
      { name: "Brazil", lat: -15.7939, lng: -47.8828 }, // Brasilia

      { name: "UK", lat: 51.5074, lng: -0.1278 }, // London
      { name: "Germany", lat: 52.52, lng: 13.405 }, // Berlin
      { name: "France", lat: 48.8566, lng: 2.3522 }, // Paris
      { name: "Spain", lat: 40.4168, lng: -3.7038 }, // Madrid
      { name: "Greece", lat: 37.9838, lng: 23.7275 }, // Athens
      { name: "Netherlands", lat: 52.3676, lng: 4.9041 }, // Amsterdam

      { name: "UAE", lat: 25.2048, lng: 55.2708 }, // Dubai
      { name: "Qatar", lat: 25.2854, lng: 51.531 }, // Doha
      { name: "Oman", lat: 23.588, lng: 58.3829 }, // Muscat
      { name: "Saudi Arabia", lat: 24.7136, lng: 46.6753 }, // Riyadh
      { name: "Sudan", lat: 15.5007, lng: 32.5599 }, // Khartoum
      { name: "Ghana", lat: 5.6037, lng: -0.187 }, // Accra

      { name: "Singapore", lat: 1.3521, lng: 103.8198 }, // Singapore
      { name: "Thailand", lat: 13.7563, lng: 100.5018 }, // Bangkok
      { name: "Malaysia", lat: 3.139, lng: 101.6869 }, // Kuala Lumpur
      { name: "Brunei", lat: 4.9031, lng: 114.9398 }, // Bandar Seri Begawan
      { name: "India", lat: 28.6139, lng: 77.209 }, // New Delhi
      { name: "Vietnam", lat: 21.0278, lng: 105.8342 }, // Hanoi
    ],
  },
  {
    id: "ethiopian",
    name: "Ethiopian Airlines",
    lat: 8.98,
    lng: 38.8,
    label: "Addis Ababa, Ethiopia",
    clients: [
      { name: "Bole Intl Hub", lat: 8.9779, lng: 38.7993 },
      { name: "Africa Logistics (Lagos)", lat: 6.5244, lng: 3.3792 },
      { name: "Middle East (Doha)", lat: 25.2854, lng: 51.531 },
      { name: "Asia Cargo (Guangzhou)", lat: 23.1291, lng: 113.2644 },
    ],
  },
  {
    id: "namogoo",
    name: "Namogoo",
    lat: 32.08,
    lng: 34.78,
    label: "Tel Aviv, Israel",
    clients: [
      { name: "US Retail (Seattle)", lat: 47.6062, lng: -122.3321 },
      { name: "UK Retail (London)", lat: 51.5074, lng: -0.1278 },
      { name: "DACH E-com (Munich)", lat: 48.1351, lng: 11.582 },
    ],
  },
];

/* Component */

export function Globe() {
  /* Theme */

  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  /* Refs */

  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* State */

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [arcConnections, setArcConnections] = useState<ArcData[]>([]);
  const [ringAnimations, setRingAnimations] = useState<RingData[]>([]);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [globeSize, setGlobeSize] = useState(360);
  const [countryFeatures, setCountryFeatures] = useState<GeoJsonFeature[]>([]);
  const [isHexLayerDisabled, setIsHexLayerDisabled] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [themeColors, setThemeColors] = useState<ThemeColorPalette>({
    background: "#fafaf8",
    backgroundSecondary: "#f0ede8",
    border: "#d6d2cc",
    borderSecondary: "#c8c4be",
    text: "#1a1917",
    textSecondary: "#524e47",
    accent: "#6b5010",
    accentSecondary: "#5c440b",
    selected: SELECTED_COLOR,
  });

  /* Sync CSS custom properties from globals.css */

  useEffect(() => {
    const syncThemeColors = (): void => {
      setThemeColors({
        background: getCssVariableValue(
          "--p-bg",
          isDarkTheme ? "#080808" : "#fafaf8",
        ),
        backgroundSecondary: getCssVariableValue(
          "--p-bg2",
          isDarkTheme ? "#101010" : "#f0ede8",
        ),
        border: getCssVariableValue(
          "--p-border",
          isDarkTheme ? "#1c1c1c" : "#d6d2cc",
        ),
        borderSecondary: getCssVariableValue(
          "--p-border2",
          isDarkTheme ? "#282828" : "#c8c4be",
        ),
        text: getCssVariableValue(
          "--p-text",
          isDarkTheme ? "#ede9e0" : "#1a1917",
        ),
        textSecondary: getCssVariableValue(
          "--p-text2",
          isDarkTheme ? "#9f9b95" : "#524e47",
        ),
        accent: getCssVariableValue(
          "--p-accent",
          isDarkTheme ? "#d4b87a" : "#6b5010",
        ),
        accentSecondary: getCssVariableValue(
          "--p-accent2",
          isDarkTheme ? "#e5cc98" : "#5c440b",
        ),
        selected: SELECTED_COLOR,
      });
    };

    syncThemeColors();

    const themeObserver = new MutationObserver(syncThemeColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => themeObserver.disconnect();
  }, [isDarkTheme]);

  /* Responsive globe sizing */

  useEffect(() => {
    if (!containerRef.current) return;
    const updateGlobeSize = (): void => {
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      if (!containerWidth) return;

      const targetSize = Math.floor(containerWidth * 0.82);
      setGlobeSize(
        Math.max(MIN_GLOBE_SIZE_PX, Math.min(MAX_GLOBE_SIZE_PX, targetSize)),
      );
    };
    updateGlobeSize();
    const observer = new ResizeObserver(() => {
      updateGlobeSize();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* Project color palette (derived from CSS variables) */

  const projectColorById = useMemo<Record<string, string>>(() => {
    const palette = [
      themeColors.accent,
      themeColors.accentSecondary,
      themeColors.accent,
      themeColors.accentSecondary,
      themeColors.accent,
      themeColors.accentSecondary,
    ];
    return PROJECTS.reduce<Record<string, string>>(
      (accumulator, project, index) => {
        accumulator[project.id] = palette[index % palette.length];
        return accumulator;
      },
      {},
    );
  }, [themeColors.accent, themeColors.accentSecondary]);

  /* Idle pulse rings shown only when no project is selected */

  const projectPulseRings = useMemo<RingData[]>(
    () =>
      PROJECTS.map((project) => ({
        lat: project.lat,
        lng: project.lng,
        maxR: 3.6,
        propagationSpeed: 3.2,
        repeatPeriod: 1000,
        color: hexToRgba(
          projectColorById[project.id] ?? themeColors.accent,
          0.58,
        ),
      })),
    [projectColorById, themeColors.accent],
  );

  /* Load and sanitize country polygons */

  useEffect(() => {
    let isCancelled = false;

    const loadCountryPolygons = async (): Promise<void> => {
      try {
        const [topojsonModule, topologyPayload] = await Promise.all([
          import("topojson-client"),
          fetch(COUNTRIES_TOPOJSON_URL).then((response) => response.json()),
        ]);

        const featureCollection = topojsonModule.feature(
          topologyPayload,
          topologyPayload.objects.countries,
        );

        // topojson-client returns either a Feature or a FeatureCollection.
        // world-atlas countries always produce a FeatureCollection.
        const rawFeatures =
          "features" in featureCollection
            ? (featureCollection.features as unknown as GeoJsonFeature[])
            : [];

        const safeCountryFeatures = rawFeatures.flatMap(extractSafePolygons);

        if (!isCancelled) setCountryFeatures(safeCountryFeatures);
      } catch (error) {
        console.error("Failed to load or sanitize country polygons:", error);
        if (!isCancelled) {
          setCountryFeatures([]);
          setIsHexLayerDisabled(true);
        }
      }
    };

    void loadCountryPolygons();
    return () => {
      isCancelled = true;
    };
  }, []);

  /* Detect touch device */

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  /* Globe body material (ThreeJS MeshPhongMaterial) */

  const globeBodyMaterial = useMemo(() => {
    if (typeof window === "undefined") return undefined;

    return new MeshPhongMaterial({
      color: new Color(
        isDarkTheme ? themeColors.backgroundSecondary : "#ffffff",
      ),
      emissive: new Color(isDarkTheme ? themeColors.background : "#f7f7f7"),
      emissiveIntensity: isDarkTheme ? 0.18 : 0.08,
      shininess: isDarkTheme ? 8 : 5,
      transparent: true,
      opacity: 1,
    });
  }, [isDarkTheme, themeColors.background, themeColors.backgroundSecondary]);

  /* Derived visual properties */

  const continentDotColor = useMemo(
    () => hexToRgba(themeColors.accent, isDarkTheme ? 0.55 : 0.65),
    [themeColors.accent, isDarkTheme],
  );

  const atmosphereGlowColor = useMemo(
    () => (isDarkTheme ? themeColors.accent : themeColors.accentSecondary),
    [isDarkTheme, themeColors.accent, themeColors.accentSecondary],
  );

  /**
   * Ring color as a static rgba string.
   *
   * IMPORTANT: three-globe's `colorAlpha()` expects the `ringColor` accessor
   * to return a parseable CSS color string. Returning a curried function
   * (e.g. `(d) => (t) => rgba(...)`) causes `colorAlpha` to return `null`,
   * which crashes with "Cannot read properties of null (reading 'opacity')".
   */
  const ringPulseColor = useMemo(
    () => hexToRgba(themeColors.accent, 0.35),
    [themeColors.accent],
  );

  /** Ring color for selected state (green). */
  const ringSelectedColor = useMemo(
    () => hexToRgba(themeColors.selected, 0.35),
    [themeColors.selected],
  );

  /* Point marker data */

  const projectPoints = useMemo<GlobePointData[]>(
    () =>
      PROJECTS.map((project) => {
        const isSelected = selectedProjectId === project.id;

        return {
          id: project.id,
          name: project.name,
          label: project.label,
          lat: project.lat,
          lng: project.lng,
          size: isSelected
            ? isTouchDevice
              ? 3
              : 2
            : isTouchDevice
              ? 2.5
              : 1.5,
          color: isSelected
            ? themeColors.selected
            : (projectColorById[project.id] ?? themeColors.accent),
        };
      }),
    [
      projectColorById,
      selectedProjectId,
      themeColors.accent,
      themeColors.selected,
      isTouchDevice,
    ],
  );

  /* Selected project (for overlay) */

  const selectedProject = useMemo(
    () => PROJECTS.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId],
  );

  /* Event handlers */

  const handleProjectMarkerClick = useCallback(
    (pointData: object): void => {
      const clickedPoint = pointData as GlobePointData;
      const clickedProject = PROJECTS.find(
        (project) => project.id === clickedPoint.id,
      );
      if (!clickedProject) return;

      // Toggle off if clicking the same project.
      if (selectedProjectId === clickedProject.id) {
        setSelectedProjectId(null);
        setArcConnections([]);
        setRingAnimations([]);
        const controls = globeRef.current?.controls();
        if (controls) controls.autoRotate = true;
        return;
      }

      // Select a new project: pause rotation and move the camera.
      setSelectedProjectId(clickedProject.id);
      const controls = globeRef.current?.controls();
      if (controls) controls.autoRotate = false;
      globeRef.current?.pointOfView(
        { lat: clickedProject.lat, lng: clickedProject.lng, altitude: 2.15 },
        900,
      );

      // Build arc connections to each client region (green).
      const newArcConnections: ArcData[] = clickedProject.clients.map(
        (clientRegion) => ({
          startLat: clickedProject.lat,
          startLng: clickedProject.lng,
          endLat: clientRegion.lat,
          endLng: clientRegion.lng,
          color: [
            hexToRgba(themeColors.selected, 0.9),
            hexToRgba(themeColors.selected, 0.3),
          ],
        }),
      );

      // Build active-state rings for destination client regions (green).
      const newRingAnimations: RingData[] = clickedProject.clients.map(
        (clientRegion) => ({
          lat: clientRegion.lat,
          lng: clientRegion.lng,
          maxR: RING_MAX_RADIUS_DEGREES,
          propagationSpeed: RING_PROPAGATION_SPEED_DEG_PER_SEC,
          repeatPeriod: RING_REPEAT_PERIOD_MS,
          color: hexToRgba(themeColors.selected, 0.35),
        }),
      );

      // Source marker ring (slightly larger, slower).
      newRingAnimations.push({
        lat: clickedProject.lat,
        lng: clickedProject.lng,
        maxR: RING_MAX_RADIUS_DEGREES + 0.8,
        propagationSpeed: RING_PROPAGATION_SPEED_DEG_PER_SEC - 0.6,
        repeatPeriod: RING_REPEAT_PERIOD_MS + 200,
        color: hexToRgba(themeColors.selected, 0.4),
      });

      setArcConnections(newArcConnections);
      setRingAnimations(newRingAnimations);
    },
    [selectedProjectId, themeColors.selected],
  );

  const handleGlobeSurfaceClick = useCallback((): void => {
    if (!selectedProjectId) return;
    setSelectedProjectId(null);
    setArcConnections([]);
    setRingAnimations([]);
    const controls = globeRef.current?.controls();
    if (controls) controls.autoRotate = true;
  }, [selectedProjectId]);

  const handleGlobeReady = useCallback((): void => {
    setIsGlobeReady(true);
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.55;
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.minDistance = 190;
      controls.maxDistance = 460;
    }

    // Allow the browser to own vertical touch scrolling over the globe canvas.
    const renderer = globeRef.current?.renderer();
    if (renderer) {
      renderer.domElement.style.touchAction = "pan-y";
    }
    // Initial camera view centered on Africa, Europe, and the Middle East.
    globeRef.current?.pointOfView({ lat: 20, lng: 30, altitude: 2.5 }, 0);
  }, []);

  /* Tooltip HTML (rendered inside the ThreeJS CSS2D overlay) */

  const getMarkerTooltipHtml = useCallback(
    (pointData: object): string => {
      const point = pointData as GlobePointData;
      return `
        <div style="
        background: ${isDarkTheme ? "rgba(8, 8, 8, 0.88)" : "rgba(255, 255, 255, 0.95)"};          backdrop-filter: blur(6px);
          border: 1px solid ${hexToRgba(themeColors.borderSecondary, 0.85)};
          border-radius: 10px;
          padding: 8px 12px;
          font-family: inherit;
          pointer-events: none;
          box-shadow: 0 8px 28px ${hexToRgba("#000000", 0.18)};
        ">
          <div style="
            color: ${themeColors.accentSecondary};
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.02em;
            line-height: 1.2;
          ">${point.name}</div>
          <div style="
            color: ${themeColors.textSecondary};
            font-size: 11px;
            margin-top: 2px;
            line-height: 1.2;
          ">${point.label}</div>
          <div style="
            color: ${themeColors.accent};
            font-size: 10px;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            line-height: 1.1;
          ">${isTouchDevice ? "Tap" : "Click"} to explore</div>
        </div>
      `;
    },
    [
      isTouchDevice,
      isDarkTheme,
      themeColors.accent,
      themeColors.accentSecondary,
      themeColors.borderSecondary,
      themeColors.textSecondary,
    ],
  );

  const shouldRenderHexPolygons =
    !isHexLayerDisabled && countryFeatures.length > 0;

  return (
    <div ref={containerRef} className="relative w-full overflow-visible py-4">
      {/* Selected project info overlay */}
      {selectedProject && (
        <div
          className="absolute left-3 top-3 z-10 animate-in fade-in slide-in-from-left-2 duration-300"
          style={{
            background: "transparent",
            backdropFilter: "blur(10px)",
            border: `1px solid ${hexToRgba(themeColors.borderSecondary, 0.9)}`,
            borderRadius: "12px",
            padding: "14px 16px",
            maxWidth: "250px",
            boxShadow: `0 12px 32px ${hexToRgba("#000000", isDarkTheme ? 0.25 : 0.12)}`,
          }}
        >
          <div
            style={{
              color: themeColors.selected,
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            {selectedProject.name}
          </div>
          <div
            style={{
              color: themeColors.textSecondary,
              fontSize: "12px",
              marginTop: "3px",
              lineHeight: 1.2,
            }}
          >
            {selectedProject.label}
          </div>
          <div
            style={{
              color: themeColors.selected,
              fontSize: "11px",
              marginTop: "8px",
              borderTop: `1px solid ${hexToRgba(themeColors.border, 0.9)}`,
              paddingTop: "8px",
            }}
          >
            {selectedProject.clients.length} client regions connected
          </div>
          <button
            type="button"
            onClick={handleGlobeSurfaceClick}
            style={{
              color: themeColors.textSecondary,
              fontSize: "10px",
              marginTop: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* Globe canvas (centered, clamped size) */}
      <div
        className="mx-auto overflow-visible"
        style={{
          width: globeSize,
          height: globeSize + 36,
          touchAction: "pan-y",
        }}
      >
        {globeSize > 0 && (
          <GlobeGL
            key={globeSize}
            ref={globeRef}
            width={globeSize}
            height={globeSize}
            backgroundColor="rgba(0,0,0,0)"
            showGlobe={true}
            globeImageUrl=""
            globeMaterial={globeBodyMaterial}
            showAtmosphere={true}
            atmosphereColor={atmosphereGlowColor}
            atmosphereAltitude={0.14}
            hexPolygonsData={shouldRenderHexPolygons ? countryFeatures : []}
            hexPolygonResolution={3}
            hexPolygonMargin={0.35}
            hexPolygonUseDots={true}
            hexPolygonColor={() => continentDotColor}
            hexPolygonAltitude={0.005}
            pointsData={projectPoints}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.015}
            pointRadius="size"
            pointColor="color"
            pointsMerge={false}
            onPointClick={handleProjectMarkerClick}
            pointLabel={getMarkerTooltipHtml}
            arcsData={arcConnections}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcDashLength={ARC_DASH_RELATIVE_LENGTH}
            arcDashGap={0.16}
            arcDashAnimateTime={ARC_FLIGHT_TIME_MS}
            arcStroke={0.95}
            arcAltitudeAutoScale={0.38}
            ringsData={selectedProjectId ? ringAnimations : projectPulseRings}
            ringLat="lat"
            ringLng="lng"
            ringMaxRadius="maxR"
            ringPropagationSpeed="propagationSpeed"
            ringRepeatPeriod="repeatPeriod"
            ringColor={() =>
              selectedProjectId ? ringSelectedColor : ringPulseColor
            }
            onGlobeReady={handleGlobeReady}
            onGlobeClick={handleGlobeSurfaceClick}
            enablePointerInteraction={true}
          />
        )}
      </div>

      {/* Bottom hint (visible when no project is selected) */}
      {isGlobeReady && !selectedProjectId && (
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "40px",
            color: hexToRgba(themeColors.accentSecondary, 0.98),
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            animation: "pulse 2.4s ease-in-out infinite",
            whiteSpace: "nowrap",
            background: hexToRgba(themeColors.backgroundSecondary, 0.82),
            padding: "8px 14px",
          }}
        >
          {isTouchDevice ? "Tap" : "Click"} a marker to explore project reach
        </div>
      )}
    </div>
  );
}

export default Globe;
