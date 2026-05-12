import fs from "fs";
import path from "path";

export function logLatency(data: any) {

  const filePath = path.join(
    process.cwd(),
    "latency_logs.csv"
  );

  const row =
`${new Date().toISOString()},
"${data.message}",
${data.riskLevel},
${data.latency}
\n`;

  if (!fs.existsSync(filePath)) {

    fs.writeFileSync(
      filePath,
      "timestamp,message,risk,latency\n"
    );
  }

  fs.appendFileSync(
    filePath,
    row
  );
}