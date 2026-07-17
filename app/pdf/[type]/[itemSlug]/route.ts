import { NextRequest, NextResponse } from "next/server";
import { buildResultPdf, type ResultType } from "@/lib/pdf";
import { getProfileBySlug } from "@/lib/branding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TYPES: ResultType[] = ["symptoms", "nutrients", "foods", "supplements"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; itemSlug: string }> },
) {
  const { type, itemSlug } = await params;

  if (!VALID_TYPES.includes(type as ResultType)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const brandSlug = request.nextUrl.searchParams.get("brand");
  const profile = brandSlug ? await getProfileBySlug(brandSlug) : null;

  const result = await buildResultPdf(type as ResultType, itemSlug, profile);
  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${result.fileName}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
