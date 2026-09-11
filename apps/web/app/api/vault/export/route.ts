import { NextResponse } from "next/server";
import { fetchVaultItemsForExport } from "@/features/vault/actions/vault-export-import.actions";

/**
 * GET /api/vault/export
 * Retrieves encrypted items for client-side .msvault packaging.
 */
export async function GET() {
  try {
    const result = await fetchVaultItemsForExport();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      items: result.items,
      count: result.items?.length ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Export error" }, { status: 500 });
  }
}
