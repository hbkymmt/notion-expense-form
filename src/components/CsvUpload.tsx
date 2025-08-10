import React, { useState } from "react";
import { API_URL } from "../config";
import "../App.css";

export default function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [drySummary, setDrySummary] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const send = async (dryRun: boolean) => {
    if (!file) return alert("CSVファイルを選択");
    const form = new FormData();
    form.append("file", file);
    setRunning(true);
    try {
      const res = await fetch(`${API_URL}/import-csv?dryRun=${dryRun ? "true" : "false"}`, {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (dryRun) setDrySummary(data.summary);
      else alert(`完了: ${data.summary.ok}件 / 重複:${data.summary.skippedDup} / 不正:${data.summary.invalid} / 失敗:${data.summary.failed}`);
    } catch (e) {
      console.error(e);
      alert("アップロードに失敗しました");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="form-container">
      <h2>CSVアップロード</h2>
      <input
        type="file"
        accept=".csv"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button disabled={!file || running} onClick={() => send(true)}>ドライラン</button>
      <button disabled={!file || running} onClick={() => send(false)}>本番インポート</button>

      {drySummary && (
        <pre style={{whiteSpace:"pre-wrap", marginTop: "1rem"}}>
{JSON.stringify(drySummary, null, 2)}
        </pre>
      )}
    </div>
  );
}