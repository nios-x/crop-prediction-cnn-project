"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  IconSparkles,
  IconAlertTriangle,
  IconDroplet,
  IconFlask,
  IconPlant,
  IconCloud,
  IconSeeding,
  IconCalendar,
  IconChartBar,
  IconShield,
  IconPhoto,
  IconStethoscope,
  IconChecklist,
  IconLoader2,
  IconTargetArrow,
  IconBrain,
  IconDownload,
} from "@tabler/icons-react";
import { ReviewCard } from "./ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress, ProgressValue } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// ── Types ───────────────────────────────────────────────────────
interface AIRecommendations {
  confidence?: { description: string; action: string };
  second_opinion?: { message: string; action: string };
  severity?: { level: string; message: string; priority: string };
  watering?: { recommendation: string };
  fungicide?: { recommended: boolean; products: string[]; note: string };
  isolation?: { recommended: boolean; message: string };
  weather?: { risk: string; reason: string };
  fertilizer?: { recommendation: string };
  monitoring?: { next_scan: string; frequency: string };
  history?: { trend: string; previous_detection: string; change: string };
  yield?: { estimated_loss: string; message: string };
  expert?: { consult: boolean; reason: string };
  image_quality?: { score: number; issues: string[]; recommendation: string };
  leaf_detection?: { leaf_present: boolean; confidence: number };
  nutrient_deficiency?: { possible: boolean };
  prevention?: string[];
}

interface AIReviewPanelProps {
  prediction: string;
  cropType: string;
  confidence: number;
}

// ── Helpers ─────────────────────────────────────────────────────
function severityDot(level: string) {
  switch (level?.toLowerCase()) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-emerald-500";
  }
}

function severityCard(level: string) {
  switch (level?.toLowerCase()) {
    case "critical": return "from-red-500/10 to-red-500/5";
    case "high": return "from-orange-500/10 to-orange-500/5";
    case "medium": return "from-yellow-500/10 to-yellow-500/5";
    default: return "from-emerald-500/10 to-emerald-500/5";
  }
}

function riskBadge(risk: string) {
  switch (risk?.toLowerCase()) {
    case "high": return "bg-red-500/15 text-red-600 border-red-500/30";
    case "medium": return "bg-yellow-500/15 text-yellow-600 border-yellow-500/30";
    default: return "bg-green-500/15 text-green-600 border-green-500/30";
  }
}

// ── Skeleton Loader ─────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/40 p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function AIReviewPanel({
  prediction,
  cropType,
  confidence,
}: AIReviewPanelProps) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<AIRecommendations | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchReview() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prediction, cropType, confidence }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "API request failed");
      }

      const data = await res.json();
      const recommendations = data.recommendations || data;
      setReview(recommendations);
      toast.success("AI review generated!", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message, {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  function downloadReport(format: "txt" | "pdf") {
    if (!review) return;

    const date = new Date().toLocaleString();
    const cropLabel =
      cropType === "potato" ? "Potato" : cropType === "tomato" ? "Tomato" : "Pepper Bell";
    const lines: string[] = [];

    lines.push("═══════════════════════════════════════════════════");
    lines.push("        CROPGUARD — AI-ASSISTED CROP REVIEW");
    lines.push("═══════════════════════════════════════════════════");
    lines.push("");
    lines.push(`Date:         ${date}`);
    lines.push(`Crop Type:    ${cropLabel}`);
    lines.push(`Prediction:   ${prediction}`);
    lines.push(`Confidence:   ${(confidence * 100).toFixed(1)}%`);
    lines.push("");
    lines.push("───────────────────────────────────────────────────");

    if (review.severity) {
      lines.push("");
      lines.push("▶ SEVERITY ASSESSMENT");
      lines.push(`  Level:    ${review.severity.level?.toUpperCase()}`);
      lines.push(`  Priority: ${review.severity.priority}`);
      lines.push(`  Message:  ${review.severity.message}`);
    }

    if (review.confidence) {
      lines.push("");
      lines.push("▶ CONFIDENCE ANALYSIS");
      lines.push(`  ${review.confidence.description}`);
      lines.push(`  Action: ${review.confidence.action}`);
    }

    if (review.fungicide) {
      lines.push("");
      lines.push("▶ FUNGICIDE TREATMENT");
      lines.push(`  Required: ${review.fungicide.recommended ? "YES" : "No"}`);
      if (review.fungicide.products?.length > 0) {
        lines.push(`  Products: ${review.fungicide.products.join(", ")}`);
      }
      if (review.fungicide.note) {
        lines.push(`  Note: ${review.fungicide.note}`);
      }
    }

    if (review.watering) {
      lines.push("");
      lines.push("▶ WATERING ADVICE");
      lines.push(`  ${review.watering.recommendation}`);
    }

    if (review.weather) {
      lines.push("");
      lines.push("▶ WEATHER RISK");
      lines.push(`  Risk Level: ${review.weather.risk?.toUpperCase()}`);
      lines.push(`  Reason:     ${review.weather.reason}`);
    }

    if (review.yield) {
      lines.push("");
      lines.push("▶ YIELD IMPACT");
      lines.push(`  Estimated Loss: ${review.yield.estimated_loss}`);
      lines.push(`  ${review.yield.message}`);
    }

    if (review.monitoring) {
      lines.push("");
      lines.push("▶ MONITORING SCHEDULE");
      lines.push(`  Next Scan:  ${review.monitoring.next_scan}`);
      lines.push(`  Frequency:  ${review.monitoring.frequency}`);
    }

    if (review.fertilizer) {
      lines.push("");
      lines.push("▶ FERTILIZER GUIDANCE");
      lines.push(`  ${review.fertilizer.recommendation}`);
    }

    if (review.isolation) {
      lines.push("");
      lines.push("▶ PLANT ISOLATION");
      lines.push(`  Required: ${review.isolation.recommended ? "YES" : "No"}`);
      lines.push(`  ${review.isolation.message}`);
    }

    if (review.expert) {
      lines.push("");
      lines.push("▶ EXPERT ADVICE");
      lines.push(`  Consult Expert: ${review.expert.consult ? "YES" : "No"}`);
      lines.push(`  ${review.expert.reason}`);
    }

    if (review.image_quality) {
      lines.push("");
      lines.push("▶ IMAGE QUALITY");
      lines.push(`  Score: ${review.image_quality.score}/100`);
    }

    if (review.prevention && review.prevention.length > 0) {
      lines.push("");
      lines.push("▶ PREVENTION STEPS");
      review.prevention.forEach((tip, i) => {
        lines.push(`  ${i + 1}. ${tip}`);
      });
    }

    lines.push("");
    lines.push("───────────────────────────────────────────────────");
    lines.push("Generated by CropGuard AI • For agricultural use");
    lines.push("═══════════════════════════════════════════════════");

    const content = lines.join("\n");
    const safePrediction = prediction.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `CropGuard_Report_${safePrediction}_${new Date().toISOString().slice(0, 10)}`;

    if (format === "pdf") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>CropGuard Report — ${prediction}</title>
              <style>
                body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
                h1 { color: #7c3aed; font-size: 22px; margin-bottom: 4px; }
                h2 { color: #6d28d9; font-size: 16px; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
                .meta { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
                .section { margin-bottom: 16px; }
                .label { font-weight: 600; color: #374151; }
                .value { color: #4b5563; }
                .badge { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
                .badge-high { background: #fef2f2; color: #dc2626; }
                .badge-medium { background: #fffbeb; color: #d97706; }
                .badge-low { background: #f0fdf4; color: #16a34a; }
                ol { padding-left: 20px; }
                li { margin-bottom: 4px; color: #4b5563; }
                .footer { margin-top: 32px; padding-top: 16px; border-top: 2px solid #7c3aed; font-size: 12px; color: #9ca3af; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>
              <h1>🌿 CropGuard — AI-Assisted Review</h1>
              <div class="meta">
                <strong>${cropLabel}</strong> • ${prediction} • ${(confidence * 100).toFixed(1)}% confidence<br/>
                Generated: ${date}
              </div>
        `);

        if (review.severity) {
          const badgeClass = review.severity.level?.toLowerCase() === "critical" || review.severity.level?.toLowerCase() === "high" ? "badge-high" : review.severity.level?.toLowerCase() === "medium" ? "badge-medium" : "badge-low";
          printWindow.document.write(`
            <h2>⚠️ Severity Assessment</h2>
            <div class="section">
              <span class="badge ${badgeClass}">${review.severity.level?.toUpperCase()} / ${review.severity.priority} priority</span>
              <p class="value">${review.severity.message}</p>
            </div>
          `);
        }
        if (review.confidence) {
          printWindow.document.write(`<h2>🎯 Confidence Analysis</h2><div class="section"><p class="value">${review.confidence.description}</p><p><span class="label">Action:</span> ${review.confidence.action}</p></div>`);
        }
        if (review.fungicide) {
          printWindow.document.write(`<h2>🧪 Fungicide Treatment</h2><div class="section"><p><span class="label">Required:</span> ${review.fungicide.recommended ? "⚠ Yes" : "✓ Not required"}</p>${review.fungicide.products?.length ? `<p><span class="label">Products:</span> ${review.fungicide.products.join(", ")}</p>` : ""}${review.fungicide.note ? `<p><em>${review.fungicide.note}</em></p>` : ""}</div>`);
        }
        if (review.watering) {
          printWindow.document.write(`<h2>💧 Watering Advice</h2><div class="section"><p class="value">${review.watering.recommendation}</p></div>`);
        }
        if (review.weather) {
          printWindow.document.write(`<h2>☁️ Weather Risk</h2><div class="section"><p><span class="label">Risk:</span> <span class="badge ${review.weather.risk?.toLowerCase() === "high" ? "badge-high" : review.weather.risk?.toLowerCase() === "medium" ? "badge-medium" : "badge-low"}">${review.weather.risk?.toUpperCase()}</span></p><p class="value">${review.weather.reason}</p></div>`);
        }
        if (review.yield) {
          printWindow.document.write(`<h2>📊 Yield Impact</h2><div class="section"><p><span class="label">Estimated Loss:</span> <span class="badge badge-high">${review.yield.estimated_loss}</span></p><p class="value">${review.yield.message}</p></div>`);
        }
        if (review.monitoring) {
          printWindow.document.write(`<h2>📅 Monitoring Schedule</h2><div class="section"><p><span class="label">Next Scan:</span> ${review.monitoring.next_scan}</p><p><span class="label">Frequency:</span> ${review.monitoring.frequency}</p></div>`);
        }
        if (review.fertilizer) {
          printWindow.document.write(`<h2>🌱 Fertilizer Guidance</h2><div class="section"><p class="value">${review.fertilizer.recommendation}</p></div>`);
        }
        if (review.isolation) {
          printWindow.document.write(`<h2>🌿 Plant Isolation</h2><div class="section"><p><span class="label">Required:</span> ${review.isolation.recommended ? "⚠ Yes" : "✓ No"}</p><p class="value">${review.isolation.message}</p></div>`);
        }
        if (review.expert) {
          printWindow.document.write(`<h2>🩺 Expert Advice</h2><div class="section"><p><span class="label">Consult:</span> ${review.expert.consult ? "⚠ Recommended" : "✓ Manageable"}</p><p class="value">${review.expert.reason}</p></div>`);
        }
        if (review.prevention && review.prevention.length > 0) {
          printWindow.document.write(`<h2>✅ Prevention Steps</h2><div class="section"><ol>${review.prevention.map(t => `<li>${t}</li>`).join("")}</ol></div>`);
        }

        printWindow.document.write(`
              <div class="footer">Generated by CropGuard AI • For agricultural guidance only</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
      }
      toast.success("PDF report opened for printing", {
        style: { background: "black", color: "white", border: "1px solid #333" },
      });
    } else {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Report downloaded!", {
        style: { background: "black", color: "white", border: "1px solid #333" },
      });
    }
  }

  function buildCards(r: AIRecommendations | null) {
    if (!r) return null;
    const cards: React.ReactNode[] = [];
    let idx = 0;

    if (r.severity) {
      cards.push(
        <ReviewCard
          key="severity"
          icon={<IconAlertTriangle className="h-4 w-4 text-red-500" />}
          title="Severity Assessment"
          colorClass={severityCard(r.severity.level)}
          index={idx++}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`h-2 w-2 rounded-full ${severityDot(r.severity.level)} animate-pulse`} />
            <Badge variant="outline" className="text-[11px]">
              {r.severity.level?.toUpperCase()} / {r.severity.priority} priority
            </Badge>
          </div>
          <p>{r.severity.message}</p>
        </ReviewCard>
      );
    }

    if (r.confidence) {
      cards.push(
        <ReviewCard
          key="confidence"
          icon={<IconTargetArrow className="h-4 w-4 text-blue-500" />}
          title="Confidence Analysis"
          colorClass="from-blue-500/10 to-blue-500/5"
          index={idx++}
        >
          <p className="mb-1.5">{r.confidence.description}</p>
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-600">
            <IconSparkles className="h-3 w-3" /> {r.confidence.action}
          </span>
        </ReviewCard>
      );
    }

    if (r.fungicide) {
      cards.push(
        <ReviewCard
          key="fungicide"
          icon={<IconFlask className="h-4 w-4 text-purple-500" />}
          title="Fungicide Treatment"
          colorClass="from-purple-500/10 to-purple-500/5"
          index={idx++}
        >
          <span className={`text-[12px] font-medium ${r.fungicide.recommended ? "text-red-500" : "text-green-500"}`}>
            {r.fungicide.recommended ? "⚠ Treatment needed" : "✓ Not required"}
          </span>
          {r.fungicide.products?.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {r.fungicide.products.map((p) => (
                <Badge key={p} variant="outline" className="border-purple-500/30 bg-purple-500/10 text-[10px] text-purple-600">
                  {p}
                </Badge>
              ))}
            </div>
          )}
          {r.fungicide.note && <p className="mt-1 text-[11px] italic opacity-70">{r.fungicide.note}</p>}
        </ReviewCard>
      );
    }

    if (r.watering) {
      cards.push(
        <ReviewCard
          key="watering"
          icon={<IconDroplet className="h-4 w-4 text-cyan-500" />}
          title="Watering Advice"
          colorClass="from-cyan-500/10 to-cyan-500/5"
          index={idx++}
        >
          <p>{r.watering.recommendation}</p>
        </ReviewCard>
      );
    }

    if (r.weather) {
      cards.push(
        <ReviewCard
          key="weather"
          icon={<IconCloud className="h-4 w-4 text-sky-500" />}
          title="Weather Risk"
          colorClass="from-sky-500/10 to-sky-500/5"
          index={idx++}
        >
          <Badge variant="outline" className={`mb-1.5 text-[11px] ${riskBadge(r.weather.risk)}`}>
            Risk: {r.weather.risk?.toUpperCase()}
          </Badge>
          <p>{r.weather.reason}</p>
        </ReviewCard>
      );
    }

    if (r.yield) {
      cards.push(
        <ReviewCard
          key="yield"
          icon={<IconChartBar className="h-4 w-4 text-rose-500" />}
          title="Yield Impact"
          colorClass="from-rose-500/10 to-rose-500/5"
          index={idx++}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-medium text-foreground">Est. Loss:</span>
            <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-[11px] font-bold text-rose-600">
              {r.yield.estimated_loss}
            </Badge>
          </div>
          <p>{r.yield.message}</p>
        </ReviewCard>
      );
    }

    if (r.monitoring) {
      cards.push(
        <ReviewCard
          key="monitoring"
          icon={<IconCalendar className="h-4 w-4 text-indigo-500" />}
          title="Monitoring Schedule"
          colorClass="from-indigo-500/10 to-indigo-500/5"
          index={idx++}
        >
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Next scan</span>
              <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-[10px] text-indigo-600">{r.monitoring.next_scan}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Frequency</span>
              <span>{r.monitoring.frequency}</span>
            </div>
          </div>
        </ReviewCard>
      );
    }

    if (r.fertilizer) {
      cards.push(
        <ReviewCard
          key="fertilizer"
          icon={<IconSeeding className="h-4 w-4 text-lime-500" />}
          title="Fertilizer Guidance"
          colorClass="from-lime-500/10 to-lime-500/5"
          index={idx++}
        >
          <p>{r.fertilizer.recommendation}</p>
        </ReviewCard>
      );
    }

    if (r.isolation) {
      cards.push(
        <ReviewCard
          key="isolation"
          icon={<IconPlant className="h-4 w-4 text-amber-500" />}
          title="Plant Isolation"
          colorClass="from-amber-500/10 to-amber-500/5"
          index={idx++}
        >
          <span className={`text-[12px] font-medium ${r.isolation.recommended ? "text-amber-600" : "text-green-500"}`}>
            {r.isolation.recommended ? "⚠ Isolate plants" : "✓ No isolation needed"}
          </span>
          <p className="mt-1">{r.isolation.message}</p>
        </ReviewCard>
      );
    }

    if (r.expert) {
      cards.push(
        <ReviewCard
          key="expert"
          icon={<IconStethoscope className="h-4 w-4 text-pink-500" />}
          title="Expert Advice"
          colorClass="from-pink-500/10 to-pink-500/5"
          index={idx++}
        >
          <span className={`text-[12px] font-medium ${r.expert.consult ? "text-red-500" : "text-green-500"}`}>
            {r.expert.consult ? "⚠ Consult an expert" : "✓ Manageable"}
          </span>
          <p className="mt-1">{r.expert.reason}</p>
        </ReviewCard>
      );
    }

    if (r.image_quality) {
      cards.push(
        <ReviewCard
          key="image_quality"
          icon={<IconPhoto className="h-4 w-4 text-teal-500" />}
          title="Image Quality"
          colorClass="from-teal-500/10 to-teal-500/5"
          index={idx++}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-medium text-foreground">Score</span>
            <span className={`text-base font-bold ${r.image_quality.score >= 80 ? "text-emerald-500" : r.image_quality.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
              {r.image_quality.score}/100
            </span>
          </div>
          <Progress value={r.image_quality.score}><ProgressValue /></Progress>
        </ReviewCard>
      );
    }

    if (r.prevention && r.prevention.length > 0) {
      cards.push(
        <ReviewCard
          key="prevention"
          icon={<IconChecklist className="h-4 w-4 text-emerald-500" />}
          title="Prevention Steps"
          colorClass="from-emerald-500/10 to-emerald-500/5"
          index={idx++}
        >
          <ul className="space-y-1">
            {r.prevention.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <IconShield className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </ReviewCard>
      );
    }

    return cards;
  }

  return (
    <Card className="overflow-hidden border-purple-500/20 bg-gradient-to-br from-background via-background to-purple-500/5">
      <CardContent className="p-5 space-y-4">
        {/* Card Banner Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20">
              <IconBrain className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-foreground">
                AI-Assisted Review
              </h4>
              <p className="text-xs text-muted-foreground">
                Comprehensive expert crop diagnostics
              </p>
            </div>
          </div>
          {review && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all"
                onClick={fetchReview}
              >
                ↻ Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
                onClick={() => downloadReport("txt")}
              >
                <IconDownload className="h-3.5 w-3.5" />
                Save .TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium text-blue-600 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all"
                onClick={() => downloadReport("pdf")}
              >
                <IconDownload className="h-3.5 w-3.5" />
                Save PDF
              </Button>
            </div>
          )}
        </div>

        {/* Initial CTA Card State */}
        {!review && !loading && (
          <div className="space-y-3 pt-1">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Click below to generate detailed insights on fungicide treatments, watering rules, weather risk, and yield loss projections.
            </p>
            <Button
              onClick={fetchReview}
              disabled={loading}
              className="ai-review-btn group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:brightness-110"
            >
              <span className="ai-review-shimmer absolute inset-0" />
              <span className="relative flex items-center justify-center gap-2">
                <IconSparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                Get AI-Assisted Review
              </span>
            </Button>
          </div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-1"
            >
              <div className="flex items-center gap-2.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2.5 text-sm text-purple-600 dark:text-purple-300">
                <IconLoader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Analyzing crop with Gemini AI model…</span>
              </div>
              <ReviewSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-sm"
            >
              <div className="flex items-center gap-2 text-red-600">
                <IconAlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2.5 h-8 text-xs border-red-500/30 text-red-600 hover:bg-red-500/10"
                onClick={fetchReview}
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Cards Grid */}
        <AnimatePresence>
          {review && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-1"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {buildCards(review)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
