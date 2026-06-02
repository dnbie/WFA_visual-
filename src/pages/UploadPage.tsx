import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropZone } from "../components/upload/DropZone";
import { parseCsvText } from "../utils/csvParser";
import { useDataStore } from "../store/dataStore";

export function UploadPage() {
  const [status, setStatus] = useState("No dataset loaded yet.");
  const [statusType, setStatusType] = useState<"normal" | "success" | "error">("normal");
  const [fileInfo, setFileInfo] = useState("");
  const setDataset = useDataStore((s) => s.setDataset);
  const clearDataset = useDataStore((s) => s.clearDataset);
  const navigate = useNavigate();

  async function handleText(text: string, fileName: string) {
    try {
      setStatus("Parsing file...");
      setStatusType("normal");
      const parsed = await parseCsvText(text, fileName);
      setDataset(parsed);
      setStatus(`Loaded ${parsed.tasks.length} rows from ${fileName}. Redirecting to dashboard...`);
      setStatusType("success");
      setFileInfo(`${fileName} loaded | ${parsed.tasks.length} task rows parsed`);
      navigate("/dashboard");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not parse CSV file.");
      setStatusType("error");
    }
  }

  async function handleFile(file: File) {
    const text = await file.text();
    await handleText(text, file.name);
  }

  async function loadDemoData() {
    try {
      const response = await fetch("/test_dhina_step2_multi_ai_output.csv");
      if (!response.ok) throw new Error("Could not load bundled demo data.");
      const text = await response.text();
      await handleText(text, "test_dhina_step2_multi_ai_output.csv");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load demo data.");
      setStatusType("error");
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <section className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--wfa-green-light] text-2xl font-bold text-[--wfa-green]">
          AI
        </div>
        <h2 className="text-2xl font-bold text-[--wfa-text]">Workforce Analyzer</h2>
        <p className="text-sm text-[--wfa-text-secondary]">
          Upload your WFA output files to explore AI disruption across roles, tasks, and skills.
        </p>
      </section>

      <DropZone onFileSelected={handleFile} />

      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          className="rounded-lg bg-[--wfa-green] px-4 py-2 text-sm font-semibold text-white hover:bg-[--wfa-green-dark]"
          onClick={loadDemoData}
        >
          Load Demo Data
        </button>
        <button
          type="button"
          className="rounded-lg border border-[--wfa-border] bg-white px-4 py-2 text-sm font-semibold text-[--wfa-text-secondary]"
          onClick={() => {
            clearDataset();
            setStatus("Loaded data was cleared.");
            setStatusType("normal");
            setFileInfo("");
          }}
        >
          Clear Loaded Data
        </button>
      </div>

      <div
        className={[
          "mx-auto mt-4 max-w-3xl rounded-lg border p-3 text-sm",
          statusType === "success"
            ? "border-[#cae6a0] bg-[#f5faea] text-[#466314]"
            : statusType === "error"
              ? "border-[#f0c5bf] bg-[#fff4f3] text-[#8d251d]"
              : "border-[--wfa-border] bg-white text-[--wfa-text-secondary]"
        ].join(" ")}
      >
        {status}
      </div>

      {fileInfo ? (
        <div className="mx-auto mt-3 flex max-w-3xl justify-between rounded-lg border border-[--wfa-border] bg-white p-3 text-sm">
          <span>{fileInfo}</span>
        </div>
      ) : null}
    </div>
  );
}
