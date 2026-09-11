import { NextRequest, NextResponse } from "next/server";
import { restoreImportedVaultItems } from "@/features/vault/actions/vault-export-import.actions";

/**
 * POST /api/vault/import
 * Batch imports decrypted items into the user's vault.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Invalid payload: expected { items: [] }" },
        { status: 400 }
      );
    }

    const result = await restoreImportedVaultItems(body.items);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      importedCount: result.importedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Import error" }, { status: 500 });
  }
}
