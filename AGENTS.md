<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Auto-Commit Rule
- ทุกครั้งที่โค้ดมีการอัปเดตหรือแก้ไขจนเสร็จสิ้น (ทำงานผ่านแผนงาน หรือแก้บั๊กสำเร็จ) ให้รันคำสั่ง `git add .`, `git commit -m "..."`, และ `git push` ขึ้น GitHub ให้ทันทีโดยไม่ต้องรอให้ผู้ใช้สั่งซ้ำ
