# <div align="center">Crop Disease Detector</div>

A next-generation, browser-based crop disease detection demo built with Next.js and client/server ML model support. This repository provides a user interface for uploading plant images, running inference with local model files (ONNX / TensorFlow), and an AI review pipeline for quick feedback.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f8f326cb-cff1-406a-a43c-549f5c441c61" />


## Key Features

- Web UI for uploading and previewing plant images.
- On-device or server-side model inference using provided model files in `public/`.
- AI review endpoint for additional automated analysis: [app/api/ai-review/route.ts](app/api/ai-review/route.ts).
- Example datasets and test images under `public/test-images/` for quick experimentation.
- Modular React components in `components/` and `ui/` for easy customization.

## CNN Feature Extraction

| Layer | Features learned/extracted |
|---|---|
| Data Augmentation | Variations in rotation, zoom, flip, etc. |
| Conv2D(32) | Edges, lines, corners, color transitions |
| BatchNormalization | Normalized/stable feature representations |
| MaxPooling2D | Strongest local features, reduced spatial size |
| Conv2D(64) | Textures, curves, leaf veins, small spots, patterns |
| BatchNormalization | Stable intermediate representations |
| MaxPooling2D | Important features with reduced dimensions |
| Conv2D(128) | Complex shapes, lesions, discoloration, disease patterns |
| BatchNormalization | Stable high-level representations |
| MaxPooling2D | Most important high-level features |
| GlobalAveragePooling2D | Converts feature maps into a compact feature vector |
| Dense(128) | Combines features to distinguish disease patterns |
| Dropout(0.5) | Prevents over-reliance on specific features |
| Dense(num_classes) | Produces class probabilities |
| Softmax | Converts outputs into probabilities for each class |

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5a9d40a0-b7e8-4045-a60d-c954fc051b1d" />


## Tech Stack

- Next.js (App Router)
- React + TypeScript
- ONNX / TensorFlow CNN model files (placed in `public/`)
- Small backend routes under the `app/api/` folder for server-side processing


## Repository Structure

- [app/page.tsx](app/page.tsx) — Main entry page and demo UI
- [app/api/ai-review/route.ts](app/api/ai-review/route.ts) — AI review API route
- [components/](components/) — Demo and feature-specific components (e.g., `ai-review/AIReviewPanel.tsx`)
- [ui/](ui/) — Reusable UI primitives and design system components
- [lib/aihelper.ts](lib/aihelper.ts) — Utility helpers for AI/model integration
- [lib/diseaseData.ts](lib/diseaseData.ts) — Disease label and metadata
- [public/](public/) — Static assets and model files (e.g., `Pepper_Bell.h5`, `*.onnx`)
- [public/test-images/](public/test-images/) — Example images for quick testing

## Model files

This project includes example model files in `public/`:

- [public/Pepper_Bell.h5](public/Pepper_Bell.h5)
- [public/Pepper_Bell.onnx](public/Pepper_Bell.onnx)
- [public/Potato.onnx](public/Potato.onnx)
- [public/Tomato.onnx](public/Tomato.onnx)

If you replace or add models, put them in `public/` and update any loader paths in `lib/aihelper.ts` or the components that import them.

## Getting Started

Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

Install dependencies

```bash
npm install
# or
yarn install
```

Run the development server

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 to view the app in the browser.

Build for production

```bash
npm run build
npm start
```

## Usage

- Navigate to the main page: [app/page.tsx](app/page.tsx).
- Upload an image using the provided upload UI (see `components/file-upload-demo.tsx` and `ui/file-upload.tsx`).
- The app will run inference with the available model (ONNX or TensorFlow loader), then show results and a review card (`components/ai-review/AIReviewPanel.tsx`).

Notes on model inference

- This project demonstrates both client-side and server-side inference patterns. Check `lib/aihelper.ts` for the model loading and preprocessing pipeline.
- ONNX models (`*.onnx`) can be run in-browser with ONNX Runtime Web or on the server with a suitable runtime.
- TensorFlow `*.h5` models are usually used server-side or converted to a web-friendly format (TensorFlow.js) for client-side inference.

## API

- The AI review API is implemented at [app/api/ai-review/route.ts](app/api/ai-review/route.ts). It accepts an image payload and returns a structured review. Use this API for centralized or heavier analysis workloads.
## Export 
<img width="653" height="845" alt="image" src="https://github.com/user-attachments/assets/33d98415-79dd-42e1-bdc3-7757d1aed9f5" />


## Editing / Extending

- UI: Add or modify components under [components/](components/) or [ui/](ui/).
- Models: Replace or add model files to [public/](public/) and update `lib/aihelper.ts`.
- Data: Update [lib/diseaseData.ts](lib/diseaseData.ts) to change class labels or metadata.

## Testing & Debugging

- There are no dedicated test scripts included by default. For manual testing, use the `public/test-images/` dataset and the upload UI to verify model behavior.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-change`
3. Commit your changes and open a PR.

Please include clear reproduction steps for any model-related changes (which model file, input shape, preprocessing used, etc.).

## Known Limitations & Notes

- This repository is primarily a demo/prototyping workspace. Model accuracy and production readiness depend on the models you provide and the preprocessing pipeline.
- If you intend to deploy to production, consider converting models to formats optimized for your target runtime and adding input validation, rate limiting, and logging on the server routes.

## Useful Links

- See the main page: [app/page.tsx](app/page.tsx)
- AI helpers: [lib/aihelper.ts](lib/aihelper.ts)
- Example components: [components/ai-review/AIReviewPanel.tsx](components/ai-review/AIReviewPanel.tsx)

## License

This project does not include a license by default. Add a `LICENSE` file if you intend to open-source it.

---

If you'd like, I can also:

- Add a short Quick Start section with step-by-step screenshots.
- Convert the included `*.h5` models to TensorFlow.js format and add client-side inference examples.
- Add automated tests and a CI workflow for linting/building.

Tell me which of these you'd like next.

**Notebook: Untitled.ipynb**

- **File**: [notebooks/Untitled.ipynb](notebooks/Untitled.ipynb)
- **Purpose**: Notebook for exploring the model pipeline, running experiments, and documenting the workflow for the main project described below.
- **Contents**: 18 Python code cells (none executed at time of summary). Cells cover data loading, preprocessing, model training/fine-tuning, evaluation, inference examples, and utility helpers; some cells include stdout/stderr outputs saved in the notebook metadata.
- **How To Run**: Open the notebook in VS Code or Jupyter, ensure the Python environment has required packages (TensorFlow/onnxruntime, numpy, pandas, matplotlib, etc.), then run cells in order from top to bottom.

**PROBLEM STATEMENT 1**

- **Type**: Deep Learning + Web App
- **Title**: Build a crop disease detection web app for farmers
- **Description**: Farmers often notice a diseased leaf too late, after the infection has already spread. Build a simple web app where a user uploads a photo of a leaf, and a trained model predicts which disease it likely has, along with a basic remedy tip.

- **Suggested Scope**:
	- **Image Classification**: Train a small CNN, or fine-tune a ready-made model (MobileNet/ResNet), on a public leaf-disease dataset (PlantVillage) to classify 3–5 common diseases.
	- **Web Upload Page**: A basic web page/form where a user uploads an image and the backend returns the predicted disease with a confidence score.
	- **Remedy Lookup**: Store a simple text tip for each disease class (for example, in a JSON file) and display it alongside the prediction.
	- **History Page**: Show a simple list of a user's past uploads and predictions.

- **Optional Add-ons**:
	- Show top-3 predictions instead of just one, in case the model is unsure.
	- Multilingual remedy text.

**Notebook Notes**

- The notebook documents the end-to-end experiment flow used while developing this project: dataset loading, augmentation, model architecture/transfer-learning, training loops or fit calls, evaluation metrics, and example inference runs using sample images from `public/test-images/`.
- Store remedy tips and label metadata in [lib/diseaseData.ts](lib/diseaseData.ts) or a JSON file for easy lookup by the web UI.

---
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
