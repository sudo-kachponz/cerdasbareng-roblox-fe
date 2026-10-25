import { NextResponse } from "next/server";

export function errJson(code: string, message: string, status = 400) {
  return NextResponse.json({ error: code, message }, { status });
}

export function err401() {
  return errJson("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
}

export function err404(message = "Tidak ditemukan.") {
  return errJson("NOT_FOUND", message, 404);
}
