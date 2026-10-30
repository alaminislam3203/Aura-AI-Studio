import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateUploadAuth } from "@/lib/imagekit";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customPubKey = req.headers.get("x-custom-public-key") || undefined;
    const customPrivKey = req.headers.get("x-custom-private-key") || undefined;

    const { token, expire, signature } = generateUploadAuth(customPrivKey, customPubKey);

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: customPubKey || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Upload auth error:", error);
    return NextResponse.json({ error: "Failed to generate upload auth" }, { status: 500 });
  }
}
