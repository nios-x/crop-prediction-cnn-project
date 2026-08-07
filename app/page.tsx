"use client";

import * as ort from "onnxruntime-web";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import {
  IconUpload,
  IconCamera,
  IconHistory,
  IconSun,
  IconMoon,
  IconHome,
  IconLeaf,
  IconLanguage,
  IconCameraOff,
  IconAlertTriangle,
  IconChevronRight,
  IconX,
  IconPlant,
  IconDroplet,
  IconSunHigh,
  IconBug,
  IconChartBar,
  IconDownload,
  IconPhoto,
  IconSparkles,
  IconLoader2,
} from "@tabler/icons-react";
import { AIReviewPanel } from "@/components/ai-review/AIReviewPanel";

// ── shadcn / Aceternity components ──────────────────────────────
import { FileUpload } from "@/components/ui/file-upload";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { NoiseBackground } from "@/components/ui/noise-background";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// ── Data layer ──────────────────────────────────────────────────
import {
  POTATO_CLASSES,
  TOMATO_CLASSES,
  PEPPER_BELL_CLASSES,
  DISEASE_DB,
  getSeverityBg,
  type CropType,
  type PredictionResult,
  type HistoryEntry,
} from "@/lib/diseaseData";

if (typeof window !== "undefined") {
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.simd = true;
}

const SAMPLE_IMAGES: Record<
  CropType,
  { label: string; url: string; filename: string }[]
> = {
  potato: [
    {
      label: "Early Blight",
      url: "/test-images/potato/00d8f10f-5038-4e0f-bb58-0b885ddc0cc5___RS_Early.B 8722.JPG",
      filename: "potato_early_blight.jpg",
    },
    {
      label: "Healthy Potato",
      url: "/test-images/potato/0b3e5032-8ae8-49ac-8157-a1cac3df01dd___RS_HL 1817.JPG",
      filename: "potato_healthy.jpg",
    },
  ],
  tomato: [
    {
      label: "Bacterial Spot",
      url: "/test-images/tomato/00a7c269-3476-4d25-b744-44d6353cd921___GCREC_Bact.Sp 5807.JPG",
      filename: "tomato_bacterial_spot.jpg",
    },
    {
      label: "Healthy Tomato",
      url: "/test-images/tomato/0cb10f98-491d-4e1f-b8ea-4fb0f1b3675f___GH_HL Leaf 333.JPG",
      filename: "tomato_healthy.jpg",
    },
  ],
  pepper_bell: [
    {
      label: "Bacterial Spot",
      url: "/test-images/pepper/01ebc916-4793-40a3-b5e4-a32687e4fa3d___NREC_B.Spot 9125.JPG",
      filename: "pepper_bacterial_spot.jpg",
    },
    {
      label: "Healthy Pepper",
      url: "/test-images/pepper/1a1a389d-f186-4481-8a5c-b8c6f864ad7f___JR_HL 8649.JPG",
      filename: "pepper_healthy.jpg",
    },
  ],
};


function softmax(scores: Float32Array): Float32Array {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum) as unknown as Float32Array;
}

function getTopN(
  scores: Float32Array,
  classNames: string[],
  n: number = 3
): PredictionResult[] {
  // Only use scores that correspond to valid class indices
  const validLength = Math.min(scores.length, classNames.length);
  const sliced = scores.slice(0, validLength);
  const probs = softmax(sliced as unknown as Float32Array);

  const indexed = Array.from(probs).map((p, i) => ({ i, p }));
  indexed.sort((a, b) => b.p - a.p);

  return indexed.slice(0, Math.min(n, validLength)).map(({ i, p }) => {
    const key = classNames[i];
    const info = DISEASE_DB[key];
    return {
      className: key,
      displayName: info?.displayName ?? key.replace(/_/g, " "),
      confidence: p,
      info: info ?? {
        displayName: key.replace(/_/g, " "),
        severity: "medium" as const,
        description: "Unknown disease.",
        remedies: {
          en: ["Consult a local agronomist."],
          hi: ["स्थानीय कृषि विशेषज्ञ से सलाह लें।"],
        },
      },
    };
  });
}


function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/jpeg", 0.6);
}


export default function Home() {
  const [cropType, setCropType] = useState<CropType>("potato");
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, setTheme } = useTheme();
  const classNames =
    cropType === "potato"
      ? POTATO_CLASSES
      : cropType === "tomato"
        ? TOMATO_CLASSES
        : PEPPER_BELL_CLASSES;

  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      setModelStatus("loading");
      setSession(null);
      setPredictions([]);
      try {
        const modelPath =
          cropType === "potato"
            ? "/Potato.onnx"
            : cropType === "tomato"
              ? "/Tomato.onnx"
              : "/Pepper_Bell.onnx";
        const model = await ort.InferenceSession.create(modelPath, {
          executionProviders: ["wasm"],
        });
        if (cancelled) return;
        setSession(model);
        setModelStatus("ready");
        const cropName =
          cropType === "potato"
            ? "Potato"
            : cropType === "tomato"
              ? "Tomato"
              : "Pepper Bell";
        toast.success(`${cropName} model loaded successfully`, {
          style: {
            background: "black",
            color: "white",
            border: "1px solid #333",
          },
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Model loading error:", err);
        setModelStatus("error");
        toast.error("Failed to load model. Please refresh the page.", {
          style: {
            background: "black",
            color: "white",
            border: "1px solid #333",
          },
        });
      }
    }
    void loadModel();
    return () => {
      cancelled = true;
    };
  }, [cropType]);


  useEffect(() => {
    try {
      const stored = localStorage.getItem("cropguard-history");
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);


  const saveHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory(entries);
    try {
      localStorage.setItem(
        "cropguard-history",
        JSON.stringify(entries.slice(0, 50))
      );
    } catch {
    }
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);


  useEffect(() => {
    if (mode !== "camera" || !isCameraActive || !session) return;
    const id = window.setInterval(() => {
      void runPredictionFromVideo();
    }, 1500);
    return () => window.clearInterval(id);
  }, [mode, isCameraActive, session]);

  async function runPredictionFromCanvas(canvas: HTMLCanvasElement) {
    if (!session) {
      toast.error("Model is still loading. Please wait.", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas context unavailable");

      const imageData = ctx.getImageData(0, 0, 224, 224).data;
      const input = new Float32Array(224 * 224 * 3);
      let index = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        input[index++] = imageData[i] / 255;
        input[index++] = imageData[i + 1] / 255;
        input[index++] = imageData[i + 2] / 255;
      }

      const tensor = new ort.Tensor("float32", input, [1, 224, 224, 3]);
      const feeds: Record<string, ort.Tensor> = {};
      feeds[session.inputNames[0]] = tensor;

      const output = await session.run(feeds);
      const outputTensor = output[session.outputNames[0]];
      const scores = outputTensor.data as Float32Array;

      console.log(
        `[CropGuard] Model output shape: [${outputTensor.dims}], scores length: ${scores.length}, classes: ${classNames.length}`
      );

      const top3 = getTopN(scores, classNames, 3);

      setPredictions(top3);
      const entry: HistoryEntry = {
        id:
          Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        timestamp: Date.now(),
        cropType,
        imageDataUrl: canvasToDataUrl(canvas),
        predictions: top3,
      };
      saveHistory([entry, ...history]);

      toast.success(
        `Detected: ${top3[0].displayName} (${(top3[0].confidence * 100).toFixed(1)}%)`, {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      }
      );
    } catch (err) {
      console.error("[CropGuard] Prediction error:", err);
      toast.error("Analysis failed. Please try again.", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function runPredictionFromVideo() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, 224, 224);
    await runPredictionFromCanvas(canvas);
  }

  function handleFileUpload(files?: File[]) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file || !canvasRef.current) return;

    setIsAnalyzing(true);
    setPredictions([]);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageUrl(objectUrl);

    img.onload = async () => {
      const canvas = canvasRef.current!;
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 224, 224);
      // Smooth UX delay for scanning animation
      await new Promise((r) => setTimeout(r, 600));
      await runPredictionFromCanvas(canvas);
    };

    img.onerror = () => {
      setIsAnalyzing(false);
      URL.revokeObjectURL(objectUrl);
      toast.error("Could not read the selected file.", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
    };

    img.src = objectUrl;
  }

  function handleSampleSelect(sampleUrl: string) {
    if (!canvasRef.current) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    setUploadedImageUrl(sampleUrl);
    setIsAnalyzing(true);
    setPredictions([]);

    img.onload = async () => {
      const canvas = canvasRef.current!;
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 224, 224);
      // Smooth UX delay for scanning animation
      await new Promise((r) => setTimeout(r, 600));
      await runPredictionFromCanvas(canvas);
    };

    img.onerror = () => {
      setIsAnalyzing(false);
      toast.error("Could not load sample image.", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
    };

    img.src = sampleUrl;
  }

  async function toggleCamera() {
    if (isCameraActive) {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
      setMode("upload");
      return;
    }

    setMode("camera");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Camera not supported on this browser.", {
          style: {
            background: "black",
            color: "white",
            border: "1px solid #333",
          },
        });
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          setIsCameraActive(true);
          toast.info("Camera active — detecting in real-time.", {
            style: {
              background: "black",
              color: "white",
              border: "1px solid #333",
            },
          });
        } catch (playErr) {
          console.error(playErr);
          toast.error("Autoplay blocked. Tap the page and try again.", {
            style: {
              background: "black",
              color: "white",
              border: "1px solid #333",
            },
          });
        }
      }
    } catch (err) {
      console.error("[CropGuard] Camera error:", err);
      toast.error("Camera permission denied or unavailable.", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
      });
      setMode("upload");
    }
  }

  function clearHistory() {
    saveHistory([]);
    toast.info("History cleared.", {
      style: {
        background: "black",
        color: "white",
        border: "1px solid #333",
      },
    });
  }

  function handleCropSwitch(val: string) {
    setCropType(val as CropType);
    setPredictions([]);
    setUploadedImageUrl(null);
    if (isCameraActive && videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setMode("upload");
    }
  }


  return (
    <TooltipProvider>
      <main className="relative min-h-screen pb-28">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.17_155_/_0.12),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_oklch(0.65_0.20_155_/_0.08),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_oklch(0.70_0.15_155_/_0.06),_transparent_40%)]" />
        </div>

        <canvas ref={canvasRef} className="hidden" />
        <section id="hero" className="px-4 pt-8 pb-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <NoiseBackground
              className="rounded-2xl p-6 sm:p-10"
              containerClassName="rounded-3xl"
              gradientColors={[
                "rgb(16,185,129)",
                "rgb(5,150,105)",
                "rgb(52,211,153)",
              ]}
              noiseIntensity={0.001}
              speed={0.05}
            >
              <div className="flex flex-col items-center text-center">
                <Badge
                  variant="default"
                  className="mb-4 border-primary/10 bg-gradient-to-r from-lime-500 to-green-500 font-semibold text-white"
                >
                  <IconLeaf className="mr-1 h-3 w-3" />
                  AI-Powered Detection
                </Badge>

                <div className="flex flex-wrap  items-center justify-center gap-x-3 gap-y-2">
                  <LayoutTextFlip
                    text="CropGuard"
                    words={[
                      "Early Blight",
                      "Late Blight",
                      "Leaf Mold",
                      "Bacterial Spot",
                      "Healthy Leaf",
                    ]}
                    duration={2500}
                  />
                </div>

                <p className="mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Upload a photo of leaf and get instant
                  disease diagnosis with{" "}
                  <strong>top-3 predictions</strong>, confidence scores,
                  and <strong>multilingual remedy tips</strong>.
                </p>

                {/* Model status */}
                <div className="mt-6">
                  {modelStatus === "loading" && (
                    <Badge variant="secondary" className="animate-pulse">
                      ⏳ Loading {cropType} model…
                    </Badge>
                  )}
                  {modelStatus === "ready" && (
                    <Badge className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-600">
                      Powered by a Convolutional Neural Network
                    </Badge>
                  )}
                  {modelStatus === "error" && (
                    <Badge variant="destructive">
                      ✕ Model failed to load
                    </Badge>
                  )}
                </div>
              </div>
            </NoiseBackground>
          </div>
        </section>
        <section id="analyze" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* ── Crop Type Selector ──────────────────────────── */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Select Crop Type
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose the crop to load the correct AI model
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
                <button
                  onClick={() => handleCropSwitch("potato")}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${cropType === "potato"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  🥔 Potato
                </button>
                <button
                  onClick={() => handleCropSwitch("tomato")}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${cropType === "tomato"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  🍅 Tomato
                </button>
                <button
                  onClick={() => handleCropSwitch("pepper_bell")}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${cropType === "pepper_bell"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  🫑 Pepper Bell
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={mode === "upload" ? "default" : "outline"}
                    className="flex-1 bg-sky-600 hover:bg-sky-500 ring-offset-2 transition duration-200 px-4 py-[20px] rounded-full  hover:ring-2 hover:ring-sky-500 dark:ring-offset-black"
                    onClick={() => {
                      if (isCameraActive && videoRef.current?.srcObject) {
                        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
                        videoRef.current.srcObject = null;
                        setIsCameraActive(false);
                      }
                      setMode("upload");
                      document.getElementById("file-upload-handle")?.click();
                    }}
                  >
                    <IconUpload className="mr-2 h-4 w-4 text-sm" />
                    Upload Image
                  </Button>
                  <StatefulButton
                    className={`flex-1  flex items-center ${mode === "camera" && isCameraActive ? "!bg-red-500 hover:!ring-red-500 " : ""}`}
                    onClick={async () => {
                      await toggleCamera();
                    }}
                  >
                    {isCameraActive ? (
                      <div className="flex items-center">
                        <IconCameraOff className="mr-2 h-4 w-4 text-sm" /> Stop
                        Camera
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <IconCamera className="mr-2 h-4 w-4 text-[10px]" /> Live
                        Camera
                      </div>
                    )}
                  </StatefulButton>
                </div>

                {/* Input area */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`relative aspect-video w-full overflow-hidden bg-black ${mode === "camera" ? "block" : "hidden"}`}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        preload="auto"
                        className="h-full w-full object-cover"
                      />
                      {/* Camera viewfinder corners */}
                      {isCameraActive && (
                        <>
                          <div className="viewfinder-corner tl" />
                          <div className="viewfinder-corner tr" />
                          <div className="viewfinder-corner bl" />
                          <div className="viewfinder-corner br" />
                        </>
                      )}
                      {/* LIVE badge */}
                      {isCameraActive && (
                        <div className="absolute top-3 left-3">
                          <Badge className="animate-live-pulse border-red-500 bg-red-500 text-white">
                            ● LIVE
                          </Badge>
                        </div>
                      )}
                      {/* Real-time detection overlay */}
                      {isCameraActive &&
                        predictions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-strong absolute bottom-3 left-3 right-3 rounded-xl px-3.5 py-2.5 text-white shadow-xl"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${predictions[0].info.severity ===
                                    "none"
                                    ? "bg-emerald-400"
                                    : predictions[0].info
                                      .severity === "critical"
                                      ? "bg-red-500"
                                      : "bg-amber-400"
                                    } animate-pulse`}
                                />
                                <span className="text-sm font-semibold text-white tracking-wide">
                                  {predictions[0].displayName}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-emerald-400/40 bg-emerald-400/20 text-emerald-300 font-bold text-xs px-2.5 py-0.5"
                              >
                                {(
                                  predictions[0].confidence * 100
                                ).toFixed(1)}
                                %
                              </Badge>
                            </div>
                          </motion.div>
                        )}
                      {/* Scan line animation */}
                      {isCameraActive && isAnalyzing && (
                        <div className="animate-scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
                      )}
                      {/* Analyzing overlay */}
                      {isAnalyzing && !isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}
                    </div>

                    <div className={mode === "upload" ? "block" : "hidden"}>
                      {uploadedImageUrl ? (
                        <div className="relative flex justify-center overflow-hidden rounded-lg">
                          <img
                            src={uploadedImageUrl}
                            alt="Uploaded leaf"
                            className="aspect-video w-[95%] object-cover rounded-lg"
                          />
                          {predictions.length > 0 && !isAnalyzing && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="glass-strong absolute bottom-3 left-6 right-6 rounded-xl px-3.5 py-2.5 text-white shadow-xl"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${predictions[0].info.severity ===
                                      "none"
                                      ? "bg-emerald-400"
                                      : predictions[0].info
                                        .severity === "critical"
                                        ? "bg-red-500"
                                        : "bg-amber-400"
                                      } animate-pulse`}
                                  />
                                  <span className="text-sm font-semibold text-white tracking-wide">
                                    {predictions[0].displayName}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="border-emerald-400/40 bg-emerald-400/20 text-emerald-300 font-bold text-xs px-2.5 py-0.5"
                                >
                                  {(
                                    predictions[0].confidence * 100
                                  ).toFixed(1)}
                                  %
                                </Badge>
                              </div>
                            </motion.div>
                          )}
                          {isAnalyzing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-md transition-all">
                              <div className="animate-scan-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />
                              <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/15 bg-black/70 px-6 py-4 shadow-2xl backdrop-blur-xl">
                                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
                                  <IconLoader2 className="h-5 w-5 animate-spin" />
                                  <IconSparkles className="absolute -top-1 -right-1 h-4 w-4 text-emerald-300 animate-pulse" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-white tracking-wide">
                                    Analyzing Leaf...
                                  </p>
                                  <p className="text-[11px] text-emerald-300/80 font-medium">
                                    Running CNN Model Inference
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <FileUpload onChange={handleFileUpload} />
                      )}

                    </div>
                  </CardContent>
                </Card>

                <Button
                  variant="secondary"
                  size="sm"
                  className="  w-full  bg-red-500/10 hover:bg-red-500/30"
                  onClick={() => {
                    setUploadedImageUrl(null);
                    setPredictions([]);
                  }}
                >
                  <IconX className="mr-1 h-3 w-3" />
                  Upload Another
                </Button>

                {/* Quick Summary Card */}
                {predictions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                  >
                    <Card className="border-border/50 bg-gradient-to-br from-background to-muted/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <IconChartBar className="h-4 w-4 text-primary" />
                          <h4 className="text-sm font-semibold">Quick Summary</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-xs text-muted-foreground">Top Prediction</span>
                            <span className="text-xs font-semibold text-foreground">{predictions[0].displayName}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-xs text-muted-foreground">Confidence</span>
                            <span className={`text-xs font-bold ${predictions[0].confidence >= 0.8 ? "text-emerald-500" : predictions[0].confidence >= 0.5 ? "text-yellow-500" : "text-red-500"}`}>
                              {(predictions[0].confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-xs text-muted-foreground">Severity</span>
                            <Badge variant="outline" className={getSeverityBg(predictions[0].info.severity)}>
                              {predictions[0].info.severity === "none" ? "Healthy" : predictions[0].info.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-xs text-muted-foreground">Crop Model</span>
                            <span className="text-xs font-medium text-foreground">
                              {cropType === "potato" ? "🥔 Potato" : cropType === "tomato" ? "🍅 Tomato" : "🫑 Pepper Bell"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Crop Care & Best Practices Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                >
                  <Card className="border-border/50 bg-gradient-to-br from-background to-emerald-500/5">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <IconPlant className="h-4 w-4 text-emerald-500" />
                        <h4 className="text-sm font-semibold">Crop Care Best Practices</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 p-2.5 transition-colors hover:bg-muted/60">
                          <IconDroplet className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">Soil-Level Watering</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Always irrigate at the roots. Wet foliage accelerates fungal spore germination and blight.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 p-2.5 transition-colors hover:bg-muted/60">
                          <IconSunHigh className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">Optimal Air Flow & Sunlight</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Space crops properly to ensure 6–8 hours of sunlight and reduce canopy humidity.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 p-2.5 transition-colors hover:bg-muted/60">
                          <IconBug className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">Weekly Leaf Inspections</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Inspect lower leaves weekly to catch early-stage spots before they infect the field.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 p-2.5 transition-colors hover:bg-muted/60">
                          <IconLeaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">Seasonal Crop Rotation</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Rotate nightshade crops (potato, tomato, pepper) every 2–3 years to break pathogen cycles.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>



              {/* ── Right: Results panel ───────────────────────── */}
              <div className="space-y-10">
                {/* Header with language toggle */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Diagnosis Results</h3>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setLanguage(
                              language === "en" ? "hi" : "en"
                            )
                          }
                        />
                      }
                    >
                      <IconLanguage className="mr-1 h-4 w-4" />
                      {language === "en" ? "हिंदी" : "English"}
                    </TooltipTrigger>
                    <TooltipContent>
                      Switch remedy language
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* No predictions yet */}
                {predictions.length === 0 && !isAnalyzing && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="animate-float">
                        <IconLeaf className="h-12 w-12 text-primary/30" />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Upload a leaf image or start the camera to
                        begin analysis
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Loading skeleton */}
                {isAnalyzing && predictions.length === 0 && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="mb-2 h-5 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Top-3 predictions */}
                {predictions.length > 0 && (
                  <div className="space-y-3">
                    {predictions.map((pred, index) => (
                      <motion.div
                        key={pred.className}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.3,
                        }}
                      >
                        <div className="relative rounded-xl">
                          {/* Glowing border for top prediction */}
                          {index === 0 && (
                            <GlowingEffect
                              spread={25}
                              glow
                              disabled={false}
                              proximity={80}
                              inactiveZone={0.01}
                              borderWidth={2}
                            />
                          )}
                          <Card
                            className={
                              index === 0
                                ? "ring-1 ring-primary/20"
                                : ""
                            }
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    {index + 1}
                                  </span>
                                  <CardTitle className="text-base">
                                    {pred.displayName}
                                  </CardTitle>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={getSeverityBg(
                                    pred.info.severity
                                  )}
                                >
                                  {pred.info.severity === "none"
                                    ? "Healthy"
                                    : pred.info.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <CardDescription className="mt-1 text-xs">
                                {pred.info.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <Progress
                                value={pred.confidence * 100}
                              >
                                <ProgressLabel className="text-xs">
                                  Confidence
                                </ProgressLabel>
                                <ProgressValue />
                              </Progress>
                            </CardContent>

                            {/* Remedy accordion (top prediction only) */}
                            {index === 0 && (
                              <CardFooter className="flex-col items-start">
                                <Accordion>
                                  <AccordionItem value="remedy">
                                    <AccordionTrigger className="text-sm font-semibold text-primary">
                                      💊 Remedy Tips (
                                      {language === "en"
                                        ? "English"
                                        : "हिंदी"}
                                      )
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="space-y-2 text-sm text-muted-foreground">
                                        {pred.info.remedies[
                                          language
                                        ].map((tip, i) => (
                                          <li
                                            key={i}
                                            className="flex gap-2"
                                          >
                                            <span className="mt-0.5 text-primary">
                                              •
                                            </span>
                                            <span>
                                              {tip}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </CardFooter>
                            )}
                          </Card>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}



                {/* Error state */}
                {modelStatus === "error" && (
                  <Alert variant="destructive">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Model Error</AlertTitle>
                    <AlertDescription>
                      The model could not be loaded. Please check your
                      connection and refresh the page.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Sample Images Card (placed below Diagnosis Results) */}
                <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20 mt-4">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconPhoto className="h-4 w-4 text-purple-500" />
                        <h4 className="text-sm font-semibold">Sample Test Images</h4>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-500 bg-purple-500/10">
                        Hackathon Demo
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Don&apos;t have a leaf image? Click any sample to test immediately or download to your device:
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                      {SAMPLE_IMAGES[cropType]?.slice(0, 2).map((sample, idx) => (
                        <div
                          key={idx}
                          className="group relative flex flex-col justify-between rounded-lg border border-border/50 bg-card p-2 transition-all hover:border-primary/40 hover:shadow-md"
                        >
                          <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-md bg-muted">
                            <img
                              src={sample.url}
                              alt={sample.label}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <p className="truncate text-xs font-semibold text-foreground mb-2">
                            {sample.label}
                          </p>
                          <div className="flex items-center gap-1">

                            <a
                              href={sample.url}
                              download={sample.filename}
                              className="inline-flex h-7 w-7 items-center w-full justify-center rounded-md border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                              title={`Download ${sample.label} image`}
                            >
                              <IconDownload className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* AI-ASSISTED REVIEW (full-width below results)      */}
            {/* ═══════════════════════════════════════════════════ */}
            {predictions.length > 0 && (
              <AIReviewPanel
                prediction={predictions[0].displayName}
                cropType={cropType}
                confidence={predictions[0].confidence}
              />
            )}

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* HISTORY SECTION                                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section id="history" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Scan History
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your past leaf analyses
                </p>
              </div>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                >
                  Clear All
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            {history.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <IconHistory className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No scans yet. Upload a leaf image to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                  {history.map((entry) => (
                    <Dialog key={entry.id}>
                      <DialogTrigger>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group cursor-pointer"
                        >
                          <Card className="w-[200px] shrink-0 transition-all hover:ring-2 hover:ring-primary/40">
                            <div className="relative h-28 w-full overflow-hidden rounded-t-xl">
                              <img
                                src={entry.imageDataUrl}
                                alt={
                                  entry.predictions[0]
                                    ?.displayName
                                }
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                              <Badge
                                className="absolute top-2 right-2 text-[10px]"
                                variant="secondary"
                              >
                                {entry.cropType === "potato"
                                  ? "🥔"
                                  : entry.cropType === "tomato"
                                    ? "🍅"
                                    : "🫑"}
                              </Badge>
                            </div>
                            <CardContent className="p-3">
                              <p className="truncate text-xs font-semibold">
                                {
                                  entry.predictions[0]
                                    ?.displayName
                                }
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {(
                                  entry.predictions[0]
                                    ?.confidence * 100
                                ).toFixed(1)}
                                % •{" "}
                                {new Date(
                                  entry.timestamp
                                ).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {entry.predictions[0]?.displayName}
                          </DialogTitle>
                          <DialogDescription>
                            Scanned on{" "}
                            {new Date(
                              entry.timestamp
                            ).toLocaleString()}{" "}
                            •{" "}
                            {entry.cropType === "potato"
                              ? "Potato"
                              : entry.cropType === "tomato"
                                ? "Tomato"
                                : "Pepper Bell"}{" "}
                            model
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <img
                            src={entry.imageDataUrl}
                            alt="scan"
                            className="w-full rounded-lg"
                          />
                          {entry.predictions.map((pred, i) => (
                            <div
                              key={pred.className}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                  #{i + 1}
                                </span>
                                <span className="font-medium">
                                  {pred.displayName}
                                </span>
                              </span>
                              <Badge
                                variant="outline"
                                className={getSeverityBg(
                                  pred.info.severity
                                )}
                              >
                                {(
                                  pred.confidence * 100
                                ).toFixed(1)}
                                %
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <DialogFooter showCloseButton />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </section>

        {/* ── Floating Dock ────────────────────────────────────── */}
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (
              link?.href?.endsWith("#") ||
              link?.textContent?.includes("Mode")
            ) {
              e.preventDefault();
              setTheme(theme === "dark" ? "light" : "dark");
            }
          }}
        >
        </div>
      </main>
    </TooltipProvider>
  );
}