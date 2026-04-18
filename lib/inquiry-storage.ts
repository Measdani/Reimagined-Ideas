import { get, list, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredInquiry } from "./inquiry";

export type InquiryStorageMode = "blob" | "file" | "unconfigured";

const localStoragePath = path.join(process.cwd(), "data", "inquiries.json");

export class InquiryStorageUnavailableError extends Error {
  constructor() {
    super("Inquiry storage is not configured.");
    this.name = "InquiryStorageUnavailableError";
  }
}

export function getInquiryStorageMode(): InquiryStorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return "blob";
  }

  if (process.env.NODE_ENV !== "production") {
    return "file";
  }

  return "unconfigured";
}

async function saveInquiryToFile(inquiry: StoredInquiry) {
  await mkdir(path.dirname(localStoragePath), { recursive: true });

  let existingInquiries: StoredInquiry[] = [];

  try {
    const currentFile = await readFile(localStoragePath, "utf8");
    existingInquiries = JSON.parse(currentFile) as StoredInquiry[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  existingInquiries.unshift(inquiry);

  await writeFile(localStoragePath, JSON.stringify(existingInquiries, null, 2), "utf8");
}

async function listFileInquiries() {
  try {
    const currentFile = await readFile(localStoragePath, "utf8");
    return JSON.parse(currentFile) as StoredInquiry[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function listBlobInquiries(limit: number) {
  const { blobs } = await list({
    prefix: "inquiries/",
    limit,
  });

  const inquiries = await Promise.all(
    blobs.map(async (blob) => {
      const blobResult = await get(blob.pathname, {
        access: "private",
        useCache: false,
      });

      if (!blobResult || blobResult.statusCode !== 200) {
        return null;
      }

      const blobText = await new Response(blobResult.stream).text();

      return JSON.parse(blobText) as StoredInquiry;
    }),
  );

  return inquiries.filter((inquiry): inquiry is StoredInquiry => inquiry !== null);
}

export async function saveInquiry(inquiry: StoredInquiry) {
  const storageMode = getInquiryStorageMode();

  if (storageMode === "blob") {
    const dayFolder = inquiry.submittedAt.slice(0, 10);

    await put(
      `inquiries/${dayFolder}/${inquiry.id}.json`,
      JSON.stringify(inquiry, null, 2),
      {
        access: "private",
        addRandomSuffix: false,
        contentType: "application/json",
      },
    );

    return storageMode;
  }

  if (storageMode === "file") {
    await saveInquiryToFile(inquiry);
    return storageMode;
  }

  throw new InquiryStorageUnavailableError();
}

export async function listInquiries(limit = 50) {
  const storageMode = getInquiryStorageMode();

  let inquiries: StoredInquiry[] = [];

  if (storageMode === "blob") {
    inquiries = await listBlobInquiries(limit);
  } else if (storageMode === "file") {
    inquiries = await listFileInquiries();
  }

  return inquiries
    .sort(
      (left, right) =>
        new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
    )
    .slice(0, limit);
}
