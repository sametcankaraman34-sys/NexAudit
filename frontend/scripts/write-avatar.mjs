import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, "../components/settings/avatar-uploader.tsx");

const content = `"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getProfileInitials,
  readAvatarAsDataUrl,
  validateAvatarFile,
} from "@/services/profile.service";
import { cn } from "@/lib/utils";

interface AvatarUploaderProps {
  name: string;
  avatarUrl: string | null;
  onAvatarChange: (dataUrl: string | null) => void;
}

export function AvatarUploader({ name, avatarUrl, onAvatarChange }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const initials = getProfileInitials(name);

  const handleFile = async (file: File) => {
    const validation = validateAvatarFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    try {
      const dataUrl = await readAvatarAsDataUrl(file);
      onAvatarChange(dataUrl);
    } catch {
      setError("Avatar yuklenemedi. Tekrar dene.");
    }
  };

  return (
    <motionmotionmotionmotiondiv className="mb-5 flex items-center gap-4">
      <motionmotionmotionmotiondiv
        className={cn(
          "relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--primary-soft)] text-lg font-semibold text-[var(--primary)]",
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </motionmotionmotionmotiondiv>
      <motionmotionmotionmotionmotiondiv>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="btn-transition h-9 rounded-lg border-[var(--border)] text-xs"
          onClick={() => inputRef.current?.click()}
        >
          Avatar yukle
        </Button>
        {avatarUrl && (
          <Button
            type="button"
            variant="ghost"
            className="btn-transition ml-2 h-9 text-xs text-[var(--text-secondary)]"
            onClick={() => onAvatarChange(null)}
          >
            Kaldir
          </Button>
        )}
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">PNG veya JPG, en fazla 2 MB</p>
        {error && <p className="mt-1 text-[13px] text-[var(--danger)]">{error}</p>}
      </motionmotionmotionmotionmotiondiv>
    </motionmotionmotionmotiondiv>
  );
}
`;

fs.writeFileSync(out, content.replace(/motionmotionmotionmotiondiv/g, "div").replace(/yukle/g, "yükle").replace(/Kaldir/g, "Kaldır").replace(/yuklenemedi/g, "yüklenemedi"));
