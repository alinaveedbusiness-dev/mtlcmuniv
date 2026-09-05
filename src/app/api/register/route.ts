import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { createDelegate, getSettings } from "@/lib/db";
import { DelegationMember, RegistrationType } from "@/lib/types";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB per file as explicitly requested
const MAX_FILE_COUNT = 5;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const VALID_COMMITTEES = ["UNSC", "UNHRC", "UNW", "DISEC", "PNA", "CRISIS"];

export async function POST(req: NextRequest) {
  try {
    const settings = await getSettings();
    if (!settings.isRegistrationOpen) {
      return NextResponse.json(
        { error: "Registrations are currently closed by the Secretariat." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const registrationType = (formData.get("registrationType")?.toString()?.trim() ||
      "private_delegate") as RegistrationType;

    // Process Payment Proof Files (up to 5 files, <= 1MB each)
    const rawFiles: File[] = [];
    const files1 = formData.getAll("paymentProof");
    const files2 = formData.getAll("paymentProofs");
    const combinedFiles = [...files1, ...files2];

    for (const item of combinedFiles) {
      if (item && typeof item === "object" && "size" in item && (item as File).size > 0) {
        rawFiles.push(item as File);
      }
    }

    if (rawFiles.length === 0) {
      return NextResponse.json(
        { error: "Please attach at least one proof of payment file." },
        { status: 400 }
      );
    }

    if (rawFiles.length > MAX_FILE_COUNT) {
      return NextResponse.json(
        { error: `You can upload at most ${MAX_FILE_COUNT} payment proof files.` },
        { status: 400 }
      );
    }

    // Validate size and format for each file
    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the maximum limit of 1 MB (${(
              file.size /
              (1024 * 1024)
            ).toFixed(2)} MB). Please compress or re-upload.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File "${file.name}" is not supported. Only JPG, PNG, WEBP, and PDF files are allowed.`,
          },
          { status: 400 }
        );
      }
    }

    // Save files to disk (with graceful fallback for read-only serverless environments)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    let isDiskWritable = true;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch {
      isDiskWritable = false;
    }

    const paymentProofUrls: string[] = [];
    const paymentProofFilenames: string[] = [];
    let totalProofSize = 0;

    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      totalProofSize += file.size;

      let extension = path.extname(file.name) || "";
      if (!extension) {
        if (file.type === "application/pdf") extension = ".pdf";
        else if (file.type === "image/png") extension = ".png";
        else extension = ".jpg";
      }

      const safeBase = file.name
        .replace(extension, "")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase()
        .slice(0, 15);
      const uniqueFileName = `receipt_${Date.now()}_${i + 1}_${safeBase}${extension}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      const buffer = Buffer.from(await file.arrayBuffer());

      if (isDiskWritable) {
        try {
          await fs.writeFile(filePath, buffer);
          paymentProofUrls.push(`/uploads/${uniqueFileName}`);
        } catch {
          const mime = file.type || "image/jpeg";
          paymentProofUrls.push(`data:${mime};base64,${buffer.toString("base64")}`);
        }
      } else {
        const mime = file.type || "image/jpeg";
        paymentProofUrls.push(`data:${mime};base64,${buffer.toString("base64")}`);
      }

      paymentProofFilenames.push(file.name || uniqueFileName);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Branch by Registration Type
    if (registrationType === "delegation") {
      const delegatesRaw = (formData.get("delegates") || formData.get("delegatesData"))?.toString();
      if (!delegatesRaw) {
        return NextResponse.json(
          { error: "Delegation roster data is missing." },
          { status: 400 }
        );
      }

      let parsedDelegates: DelegationMember[] = [];
      try {
        parsedDelegates = JSON.parse(delegatesRaw);
      } catch {
        return NextResponse.json(
          { error: "Invalid delegation roster payload." },
          { status: 400 }
        );
      }

      if (!Array.isArray(parsedDelegates) || parsedDelegates.length < 4) {
        return NextResponse.json(
          { error: "Delegation registration requires at least 4 delegates (Delegates 1 to 4)." },
          { status: 400 }
        );
      }

      // Shared institution for the delegation
      const delegationCategory = (formData.get("delegationCategory") || "institutional").toString().trim();
      const isPrivateDelegation = delegationCategory === "private";

      const rawInstitution =
        formData.get("institution")?.toString()?.trim() ||
        formData.get("delegationInstitution")?.toString()?.trim() ||
        parsedDelegates[0]?.institution?.trim() ||
        "";

      const sharedInstitution = isPrivateDelegation
        ? (rawInstitution || "Private Delegation")
        : rawInstitution;

      if (!isPrivateDelegation && !sharedInstitution) {
        return NextResponse.json(
          { error: "Institute of delegation is required." },
          { status: 400 }
        );
      }

      // Validate required delegates 1 through 4 (with Delegate 1 as Head Delegate)
      for (let i = 0; i < 4; i++) {
        const d = parsedDelegates[i];
        const num = i + 1;
        const roleLabel = i === 0 ? "Head Delegate" : `Delegate ${num}`;

        if (!d || !d.fullName?.trim()) {
          return NextResponse.json(
            { error: `${roleLabel}: Name of delegate is required.` },
            { status: 400 }
          );
        }
        if (!d.phone?.trim() || d.phone.trim().length < 7) {
          return NextResponse.json(
            { error: `${roleLabel}: Valid Contact No. is required.` },
            { status: 400 }
          );
        }
        if (!d.email?.trim() || !emailRegex.test(d.email.trim())) {
          return NextResponse.json(
            { error: `${roleLabel}: Valid Email Address is required.` },
            { status: 400 }
          );
        }
        if (!d.committee?.trim() || !VALID_COMMITTEES.includes(d.committee.trim())) {
          return NextResponse.json(
            {
              error: `${roleLabel}: Please select a valid Committee Preference (${VALID_COMMITTEES.join(
                ", "
              )}).`,
            },
            { status: 400 }
          );
        }
      }

      // Validate optional delegates 5 and 6 if partially filled
      const cleanedRoster: DelegationMember[] = [];
      for (let i = 0; i < Math.min(parsedDelegates.length, 6); i++) {
        const d = parsedDelegates[i];
        const num = i + 1;
        const hasAnyValue =
          Boolean(d.fullName?.trim()) ||
          Boolean(d.phone?.trim()) ||
          Boolean(d.email?.trim()) ||
          Boolean(d.institution?.trim()) ||
          Boolean(d.committee?.trim());

        if (i < 4) {
          cleanedRoster.push({
            delegateNumber: num,
            fullName: d.fullName.trim(),
            phone: d.phone.trim(),
            email: d.email.trim(),
            institution: d.institution?.trim() || sharedInstitution,
            committee: d.committee.trim(),
            isOptional: false,
          });
        } else if (hasAnyValue) {
          if (!d.fullName?.trim()) {
            return NextResponse.json(
              { error: `Delegate ${num} (Optional): Name of delegate is required when adding this delegate.` },
              { status: 400 }
            );
          }
          if (!d.phone?.trim()) {
            return NextResponse.json(
              { error: `Delegate ${num} (Optional): Contact No. is required.` },
              { status: 400 }
            );
          }
          if (!d.email?.trim() || !emailRegex.test(d.email.trim())) {
            return NextResponse.json(
              { error: `Delegate ${num} (Optional): Valid Email Address is required.` },
              { status: 400 }
            );
          }
          if (!d.committee?.trim() || !VALID_COMMITTEES.includes(d.committee.trim())) {
            return NextResponse.json(
              {
                error: `Delegate ${num} (Optional): Please select a valid Committee Preference.`,
              },
              { status: 400 }
            );
          }
          cleanedRoster.push({
            delegateNumber: num,
            fullName: d.fullName.trim(),
            phone: d.phone.trim(),
            email: d.email.trim(),
            institution: d.institution?.trim() || sharedInstitution,
            committee: d.committee.trim(),
            isOptional: true,
          });
        }
      }

      const lead = cleanedRoster[0];
      const delegateRecord = await createDelegate({
        fullName: `${lead.fullName} (Head Delegate • ${cleanedRoster.length} Total)`,
        email: lead.email,
        phone: lead.phone,
        institution: lead.institution,
        committee: `Delegation (${cleanedRoster.length} Seats)`,
        registrationType: "delegation",
        delegates: cleanedRoster,
        paymentProofUrl: paymentProofUrls[0],
        paymentProofFilename: paymentProofFilenames[0],
        paymentProofUrls,
        paymentProofFilenames,
        paymentProofSize: totalProofSize,
        notes: `${isPrivateDelegation ? "Private Delegation" : "Institutional Delegation"} of ${cleanedRoster.length} delegates led by Head Delegate ${lead.fullName} (${lead.institution}). Proof files attached: ${paymentProofUrls.length}.`,
      });

      return NextResponse.json({
        success: true,
        message: "Delegation registration submitted successfully.",
        delegate: delegateRecord,
      });
    }

    if (registrationType === "observer") {
      const fullName = formData.get("fullName")?.toString()?.trim();
      const phone = formData.get("phone")?.toString()?.trim();
      const email = formData.get("email")?.toString()?.trim();

      if (!fullName || fullName.length < 2) {
        return NextResponse.json({ error: "Delegate / Observer name is required." }, { status: 400 });
      }
      if (!phone || phone.length < 7) {
        return NextResponse.json({ error: "Contact number is required." }, { status: 400 });
      }
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ error: "Valid email address is required." }, { status: 400 });
      }

      const delegateRecord = await createDelegate({
        fullName,
        email,
        phone,
        institution: "Observer",
        committee: "Observer",
        registrationType: "observer",
        comingAs: "Observer",
        paymentProofUrl: paymentProofUrls[0],
        paymentProofFilename: paymentProofFilenames[0],
        paymentProofUrls,
        paymentProofFilenames,
        paymentProofSize: totalProofSize,
        notes: `Observer registration. Proof files: ${paymentProofUrls.length}.`,
      });

      return NextResponse.json({
        success: true,
        message: "Observer registration submitted successfully.",
        delegate: delegateRecord,
      });
    }

    // Default: Private Delegate Registration Form
    const fullName = formData.get("fullName")?.toString()?.trim();
    const phone = formData.get("phone")?.toString()?.trim();
    const email = formData.get("email")?.toString()?.trim();
    const institution = formData.get("institution")?.toString()?.trim();
    const comingAs = (formData.get("comingAs")?.toString()?.trim() || "Delegate") as
      | "Delegate"
      | "Observer";
    const committee =
      formData.get("committee")?.toString()?.trim() || (comingAs === "Observer" ? "Observer" : "");

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: "Name of delegate is required." }, { status: 400 });
    }
    if (!phone || phone.length < 7) {
      return NextResponse.json({ error: "Contact no. is required." }, { status: 400 });
    }
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid Email Address is required." }, { status: 400 });
    }
    if (!institution) {
      return NextResponse.json({ error: "Institute of delegate is required." }, { status: 400 });
    }
    if (comingAs === "Delegate" && (!committee || !VALID_COMMITTEES.includes(committee))) {
      return NextResponse.json(
        { error: `Please select a valid Committee (${VALID_COMMITTEES.join(", ")}).` },
        { status: 400 }
      );
    }

    const delegateRecord = await createDelegate({
      fullName,
      email,
      phone,
      institution,
      committee: comingAs === "Observer" ? "Observer" : committee,
      registrationType: "private_delegate",
      comingAs,
      paymentProofUrl: paymentProofUrls[0],
      paymentProofFilename: paymentProofFilenames[0],
      paymentProofUrls,
      paymentProofFilenames,
      paymentProofSize: totalProofSize,
      notes: `Private ${comingAs} from ${institution}. Proof files: ${paymentProofUrls.length}.`,
    });

    return NextResponse.json({
      success: true,
      message: "Private delegate registration submitted successfully.",
      delegate: delegateRecord,
    });
  } catch (err) {
    console.error("POST /api/register error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your registration." },
      { status: 500 }
    );
  }
}
