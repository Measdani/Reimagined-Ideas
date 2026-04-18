import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { getInquiryStorageMode, listInquiries } from "../../../../lib/inquiry-storage";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    inquiries: await listInquiries(50),
    storageMode: getInquiryStorageMode(),
  });
}
