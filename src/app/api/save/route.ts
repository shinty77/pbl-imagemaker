import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { image } = await req.json();

  const base64 = image.replace(/^data:image\/png;base64,/, "");
  const filePath = path.join(process.cwd(), "public/output.png");

  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

  return NextResponse.json({ ok: true });
}
