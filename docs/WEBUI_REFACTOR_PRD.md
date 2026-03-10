# Claimit Web UI Refactor PRD

> Transform Web UI from API-backed to pure local file visualization.

**Version**: 1.0  
**Date**: 2026-03-10  
**Target**: Drop into Cursor and implement directly

---

## Executive Summary

**Current State**: Web UI has backend API routes that read/write to a vault.

**Target State**: Web UI is a **pure visualization layer** that:
- Reads local `~/.claimit/` vault files directly (via File System Access API or local dev server)
- Has **zero backend** — can be hosted as static files
- All writes happen through CLI or Agent, not through Web UI

**Why**: 
- No hosting costs (no API = no server)
- Privacy (data never leaves user's machine)
- Agent-first architecture (Web UI is optional convenience, not primary interface)

---

## Architecture Change

### Before
```
┌─────────────┐    API    ┌─────────────┐
│   Web UI    │ ───────── │   Backend   │ ──── vault/
│  (Next.js)  │   POST    │  (API Routes│
└─────────────┘           └─────────────┘
```

### After
```
┌─────────────────────────────────────────────┐
│                  Web UI                      │
│  (Static Next.js / Vite / plain HTML)       │
└─────────────────┬───────────────────────────┘
                  │
                  │ File System Access API
                  │ (or local dev server proxy)
                  ▼
            ~/.claimit/
            ├── profile.md
            ├── achievements/
            └── ...
```

---

## Implementation Approaches

### Option A: File System Access API (Recommended for Desktop)

Use the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) to read local files directly in browser.

**Pros**:
- True zero-backend
- Works as static site
- User grants permission once

**Cons**:
- Chrome/Edge only (no Safari/Firefox support)
- Requires user to "open" vault folder first

**Flow**:
```typescript
// User clicks "Open Vault"
const dirHandle = await window.showDirectoryPicker();

// Read profile.md
const fileHandle = await dirHandle.getFileHandle('profile.md');
const file = await fileHandle.getFile();
const content = await file.text();

// Parse markdown content
const profile = parseProfile(content);
```

### Option B: Local Dev Server (Recommended for Development)

Run `pnpm dev` locally, serve files from `~/.claimit/` via a simple file proxy.

**Pros**:
- Works in all browsers
- Better DX for development

**Cons**:
- Requires running local server
- Not deployable as static site

**Implementation**:
```typescript
// apps/web/app/api/vault/[...path]/route.ts
// Simple file proxy (read-only)

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const VAULT_PATH = process.env.CLAIMIT_VAULT || '~/.claimit';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = join(VAULT_PATH.replace('~', process.env.HOME!), ...params.path);
  
  try {
    const content = await readFile(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

// No POST/PUT/DELETE - read only!
```

### Option C: Hybrid (Ship Both)

- Default: File System Access API
- Fallback: Prompt user to run local server
- Detect and switch automatically

---

## Detailed Changes

### 1. Remove Write Operations from Web UI

**Files to modify**:
- `apps/web/app/api/[...route]/route.ts` — Remove or make read-only

**Current API routes to remove/modify**:

| Route | Current | New |
|-------|---------|-----|
| `POST /api/import` | Writes to vault | ❌ Remove (use CLI) |
| `PUT /api/resume` | Writes to vault | ❌ Remove |
| `POST /api/achievements` | Creates achievement | ❌ Remove (use Agent) |
| `PUT /api/achievements/:id` | Updates achievement | ❌ Remove |
| `DELETE /api/achievements/:id` | Deletes achievement | ❌ Remove |
| `POST /api/assistant/apply` | Writes changes | ❌ Remove |
| `POST /api/variants` | Creates variant | ❌ Remove |
| `GET /api/resume` | Reads vault | ✅ Keep (read-only) |
| `GET /api/achievements` | Lists achievements | ✅ Keep (read-only) |
| `GET /api/variants` | Lists variants | ✅ Keep (read-only) |
| `POST /api/render` | Generates HTML | ✅ Keep (pure computation) |
| `POST /api/export/pdf` | Generates PDF | ⚠️ Move to CLI |

### 2. New Data Loading Layer

**File**: `apps/web/lib/vault-reader.ts`

```typescript
import matter from 'gray-matter';

export interface VaultReader {
  readProfile(): Promise<Profile>;
  readExperience(): Promise<Experience[]>;
  readAchievements(): Promise<Achievement[]>;
  readSkills(): Promise<SkillCategory[]>;
  readVariants(): Promise<VariantMeta[]>;
  readReview(): Promise<ReviewResult | null>;
}

// Implementation for File System Access API
export class FSAccessVaultReader implements VaultReader {
  private dirHandle: FileSystemDirectoryHandle;
  
  constructor(dirHandle: FileSystemDirectoryHandle) {
    this.dirHandle = dirHandle;
  }
  
  async readProfile(): Promise<Profile> {
    const content = await this.readFile('profile.md');
    return parseProfileMarkdown(content);
  }
  
  async readAchievements(): Promise<Achievement[]> {
    const achievementsDir = await this.dirHandle.getDirectoryHandle('achievements');
    const achievements: Achievement[] = [];
    
    for await (const entry of achievementsDir.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        const file = await entry.getFile();
        const content = await file.text();
        const { data, content: body } = matter(content);
        achievements.push(parseAchievementMarkdown(data, body));
      }
    }
    
    return achievements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  
  private async readFile(path: string): Promise<string> {
    const parts = path.split('/');
    let handle: FileSystemDirectoryHandle | FileSystemFileHandle = this.dirHandle;
    
    for (let i = 0; i < parts.length - 1; i++) {
      handle = await (handle as FileSystemDirectoryHandle).getDirectoryHandle(parts[i]);
    }
    
    const fileHandle = await (handle as FileSystemDirectoryHandle).getFileHandle(parts[parts.length - 1]);
    const file = await fileHandle.getFile();
    return file.text();
  }
}

// Implementation for local API proxy
export class APIVaultReader implements VaultReader {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api/vault') {
    this.baseUrl = baseUrl;
  }
  
  async readProfile(): Promise<Profile> {
    const res = await fetch(`${this.baseUrl}/profile.md`);
    const { content } = await res.json();
    return parseProfileMarkdown(content);
  }
  
  // ... similar for other methods
}
```

### 3. Markdown Parsers

**File**: `apps/web/lib/markdown-parsers.ts`

```typescript
import matter from 'gray-matter';
import { marked } from 'marked';

export function parseProfileMarkdown(content: string): Profile {
  // Parse markdown structure
  // Extract fields from ## Basic Info, ## Professional Summary, etc.
  const lines = content.split('\n');
  const profile: Partial<Profile> = {};
  
  let currentSection = '';
  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.slice(3).trim();
    } else if (line.startsWith('- **') && line.includes('**:')) {
      const match = line.match(/- \*\*(.+?)\*\*:\s*(.+)/);
      if (match) {
        const [, key, value] = match;
        // Map to profile fields
        if (key === 'Name') profile.name = value;
        if (key === 'Email') profile.email = value;
        // ... etc
      }
    }
  }
  
  return profile as Profile;
}

export function parseAchievementMarkdown(frontmatter: any, body: string): Achievement {
  // frontmatter contains: id, date, role_context, tags, confidence, source
  // body contains: ## Summary, ## Actions, ## Impact, etc.
  
  const sections = extractSections(body);
  
  return {
    id: frontmatter.id,
    title: extractTitle(body), // First # heading
    date_range: { start: frontmatter.date, end: frontmatter.date_end },
    role_context: frontmatter.role_context,
    summary: sections.Summary || '',
    actions: parseListSection(sections.Actions),
    impact: parseImpactSection(sections.Impact),
    scope: parseScopeSection(sections.Scope),
    tools: parseListSection(sections['Tools & Technologies']),
    evidence: parseListSection(sections.Evidence),
    tags: frontmatter.tags || [],
    confidence: frontmatter.confidence || 0.5,
    source: frontmatter.source || 'user',
  };
}

function extractSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const regex = /^## (.+)$/gm;
  let match;
  let lastSection = '';
  let lastIndex = 0;
  
  while ((match = regex.exec(markdown)) !== null) {
    if (lastSection) {
      sections[lastSection] = markdown.slice(lastIndex, match.index).trim();
    }
    lastSection = match[1];
    lastIndex = match.index + match[0].length;
  }
  
  if (lastSection) {
    sections[lastSection] = markdown.slice(lastIndex).trim();
  }
  
  return sections;
}
```

### 4. UI State Management

**File**: `apps/web/lib/store.ts`

```typescript
import { create } from 'zustand';
import { VaultReader, FSAccessVaultReader, APIVaultReader } from './vault-reader';

interface VaultState {
  // Connection
  isConnected: boolean;
  connectionType: 'fs-access' | 'api' | null;
  reader: VaultReader | null;
  
  // Data
  profile: Profile | null;
  achievements: Achievement[];
  experience: Experience[];
  skills: SkillCategory[];
  variants: VariantMeta[];
  review: ReviewResult | null;
  
  // Actions
  connectWithFSAccess: () => Promise<void>;
  connectWithAPI: () => Promise<void>;
  disconnect: () => void;
  refresh: () => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  isConnected: false,
  connectionType: null,
  reader: null,
  profile: null,
  achievements: [],
  experience: [],
  skills: [],
  variants: [],
  review: null,
  
  connectWithFSAccess: async () => {
    try {
      const dirHandle = await window.showDirectoryPicker({
        id: 'claimit-vault',
        mode: 'read',
        startIn: 'documents',
      });
      
      const reader = new FSAccessVaultReader(dirHandle);
      set({ reader, connectionType: 'fs-access' });
      await get().refresh();
      set({ isConnected: true });
    } catch (e) {
      console.error('Failed to connect:', e);
    }
  },
  
  connectWithAPI: async () => {
    const reader = new APIVaultReader();
    set({ reader, connectionType: 'api' });
    await get().refresh();
    set({ isConnected: true });
  },
  
  disconnect: () => {
    set({
      isConnected: false,
      connectionType: null,
      reader: null,
      profile: null,
      achievements: [],
    });
  },
  
  refresh: async () => {
    const { reader } = get();
    if (!reader) return;
    
    const [profile, achievements, experience, skills, variants, review] = await Promise.all([
      reader.readProfile(),
      reader.readAchievements(),
      reader.readExperience(),
      reader.readSkills(),
      reader.readVariants(),
      reader.readReview().catch(() => null),
    ]);
    
    set({ profile, achievements, experience, skills, variants, review });
  },
}));
```

### 5. Connection UI

**File**: `apps/web/components/vault/VaultConnector.tsx`

```tsx
'use client';

import { useVaultStore } from '@/lib/store';
import { FolderOpen, Server, Unplug } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function VaultConnector() {
  const { isConnected, connectionType, connectWithFSAccess, connectWithAPI, disconnect } = useVaultStore();
  
  if (isConnected) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-emerald-600">
          ● Connected via {connectionType === 'fs-access' ? 'File System' : 'Local Server'}
        </span>
        <Button variant="ghost" size="sm" onClick={disconnect}>
          <Unplug className="size-4 mr-1" />
          Disconnect
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Connect to Vault</h2>
      <p className="text-sm text-slate-500 mb-6">
        Claimit reads your resume data from local files. Choose how to connect:
      </p>
      
      <div className="space-y-3">
        <Button 
          onClick={connectWithFSAccess} 
          className="w-full justify-start"
        >
          <FolderOpen className="size-4 mr-2" />
          Open Local Folder
          <span className="ml-auto text-xs text-slate-400">
            Chrome/Edge
          </span>
        </Button>
        
        <Button 
          onClick={connectWithAPI} 
          variant="secondary"
          className="w-full justify-start"
        >
          <Server className="size-4 mr-2" />
          Connect to Local Server
          <span className="ml-auto text-xs text-slate-400">
            pnpm dev
          </span>
        </Button>
      </div>
      
      <p className="text-xs text-slate-400 mt-4">
        Your data stays on your machine. Nothing is uploaded.
      </p>
    </Card>
  );
}
```

### 6. Update Pages to Use Store

**File**: `apps/web/app/page.tsx`

```tsx
'use client';

import { useVaultStore } from '@/lib/store';
import { VaultConnector } from '@/components/vault/VaultConnector';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function HomePage() {
  const { isConnected, profile, achievements, variants } = useVaultStore();
  
  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <VaultConnector />
      </div>
    );
  }
  
  return <Dashboard profile={profile} achievements={achievements} variants={variants} />;
}
```

### 7. Remove/Modify Existing Components

| Component | Change |
|-----------|--------|
| `ImportDropzone.tsx` | Remove or convert to "instructions for CLI" |
| `AchievementForm.tsx` | Remove (use Agent/CLI to add achievements) |
| API route handlers | Keep only read operations |

### 8. Add "How to Edit" Instructions

Since Web UI is read-only, show users how to edit:

```tsx
// components/ui/edit-instructions.tsx
export function EditInstructions({ type }: { type: 'achievement' | 'profile' | 'variant' }) {
  return (
    <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">
      <p className="font-medium text-slate-700 mb-2">To edit {type}:</p>
      <ul className="space-y-1 text-xs">
        <li>• Talk to your AI agent: "更新这条成就" / "edit this achievement"</li>
        <li>• Or use CLI: <code className="bg-slate-200 px-1 rounded">claimit edit {type}</code></li>
        <li>• Or edit the file directly: <code className="bg-slate-200 px-1 rounded">~/.claimit/{type}.md</code></li>
      </ul>
    </div>
  );
}
```

---

## Rendering & Export

### Render (Keep)
Rendering is pure computation (JSON → HTML), keep it:

```typescript
// apps/web/app/api/render/route.ts
export async function POST(request: Request) {
  const { resume, template } = await request.json();
  const html = renderTemplate(resume, template);
  return Response.json({ html });
}
```

### PDF Export (Move to CLI)

PDF generation requires Playwright/Chromium. Options:

**Option A**: Move entirely to CLI
```bash
claimit export pdf --template modern --output resume.pdf
```

**Option B**: Keep client-side with print-to-PDF
```typescript
// Use window.print() with @media print styles
function exportPDF() {
  window.print();
}
```

**Option C**: External service (user provides API key)
```typescript
// Use a service like PDFShift, DocRaptor
// User configures in ~/.claimit/config.md
```

**Recommendation**: Option A (CLI) + Option B (print fallback)

---

## Multi-Language Support

Add language selector for rendering:

```tsx
// components/render/LanguageSelector.tsx
const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '简体中文' },
  { code: 'ja', label: '日本語' },
];

export function LanguageSelector({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  );
}
```

Templates should support i18n:
- `templates/ats_minimal/en.html`
- `templates/ats_minimal/zh.html`
- `templates/ats_minimal/ja.html`

---

## Migration Checklist

### Phase 1: Read-Only API
- [ ] Remove all POST/PUT/DELETE routes except render
- [ ] Add read-only vault proxy route (for local dev)
- [ ] Update components to use read-only data

### Phase 2: File System Access
- [ ] Implement `FSAccessVaultReader`
- [ ] Implement `VaultConnector` UI
- [ ] Add state management with Zustand

### Phase 3: Markdown Parsing
- [ ] Implement all markdown parsers
- [ ] Test with sample vault data
- [ ] Handle edge cases (missing files, malformed markdown)

### Phase 4: UI Updates
- [ ] Convert pages from Server Components to Client Components
- [ ] Remove write-related UI (forms, buttons)
- [ ] Add "How to Edit" instructions
- [ ] Update empty states with CLI/Agent guidance

### Phase 5: Templates & Export
- [ ] Add multi-language template support
- [ ] Implement print-to-PDF fallback
- [ ] Test rendering pipeline

### Phase 6: Testing
- [ ] Test File System Access flow in Chrome
- [ ] Test local API proxy flow
- [ ] Test with empty vault
- [ ] Test with full vault

---

## File Changes Summary

| File | Action |
|------|--------|
| `app/api/[...route]/route.ts` | Modify: read-only routes only |
| `app/api/vault/[...path]/route.ts` | New: file proxy for local dev |
| `lib/vault-reader.ts` | New: data loading abstraction |
| `lib/markdown-parsers.ts` | New: parse vault markdown files |
| `lib/store.ts` | New: Zustand state management |
| `components/vault/VaultConnector.tsx` | New: connection UI |
| `components/ui/edit-instructions.tsx` | New: guidance for editing |
| `components/resume/ImportDropzone.tsx` | Remove or replace with instructions |
| `components/resume/AchievementForm.tsx` | Remove or make read-only |
| `app/page.tsx` | Modify: use client-side store |
| `app/memory/page.tsx` | Modify: use client-side store |
| `app/assistant/page.tsx` | Modify: display-only mode |
| `app/import/page.tsx` | Replace with CLI instructions |

---

## Success Criteria

1. **Zero backend required**: App works as static files (with File System Access)
2. **All data local**: Nothing uploaded, everything from `~/.claimit/`
3. **Read-only UI**: No forms or edit buttons that suggest server writes
4. **Clear guidance**: Users know to use Agent/CLI for edits
5. **Works offline**: Once vault is connected, no network needed (except print service)
