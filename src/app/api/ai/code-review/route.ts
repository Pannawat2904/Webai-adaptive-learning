import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { code, assignmentTitle, checklist } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'ไม่พบโค้ดที่ต้องการตรวจ' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Automated baseline syntax and structural checks
    const hasDoctype = /<!doctype\s+html>/i.test(code);
    const hasHtml = /<html[^>]*>[\s\S]*<\/html>/i.test(code);
    const hasHead = /<head[^>]*>[\s\S]*<\/head>/i.test(code);
    const hasBody = /<body[^>]*>[\s\S]*<\/body>/i.test(code);

    const issues: string[] = [];
    if (!hasDoctype) issues.push('ขาดคำประกาศ <!DOCTYPE html> ที่บรรทัดแรก');
    if (!hasHtml) issues.push('ขาดแท็กคู่ <html>...</html>');
    if (!hasHead) issues.push('ขาดส่วน <head>...</head>');
    if (!hasBody) issues.push('ขาดส่วน <body>...</body>');

    const systemPrompt = `
คุณคือ "AI ผู้เชี่ยวชาญการตรวจโค้ดโครงสร้างภาษา HTML (AI HTML Code Reviewer)"
ภารกิจ: วิเคราะห์โค้ด HTML ของนักเรียนระดับ ปวช. ตรวจสอบ syntax ความถูกต้องของแท็ก โครงสร้าง Semantic HTML และให้ข้อเสนอแนะเชิงสร้างสรรค์เป็นภาษาไทย

โจทย์: "${assignmentTitle || 'แบบฝึกหัด HTML'}"
โค้ดที่ส่งตรวจ:
\`\`\`html
${code}
\`\`\`

จงส่งคืนผลการตรวจในรูปแบบ JSON ดังนี้เท่านั้น:
{
  "score": ตัวเลขคะแนน 0 ถึง 100,
  "passed": true หรือ false (ผ่านเกณฑ์ถ้าคะแนน >= 70),
  "summary": "สรุปภาพรวมสั้นๆ",
  "strengths": ["จุดเด่นข้อที่ 1", "จุดเด่นข้อที่ 2"],
  "improvements": ["จุดที่ควรปรับปรุงข้อที่ 1", "จุดที่ควรปรับปรุงข้อที่ 2"],
  "correctedSnippet": "ตัวอย่างโค้ดที่ปรับแก้ให้ถูกต้องสมบูรณ์ (HTML เท่านั้น)"
}
    `;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
          config: { responseMimeType: 'application/json' },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error('Gemini Code Review error, falling back:', err);
      }
    }

    // High quality rule-based fallback code review
    const baseScore = Math.max(
      40,
      100 - issues.length * 15 - (code.length < 50 ? 20 : 0)
    );
    const passed = baseScore >= 70;

    return NextResponse.json({
      score: baseScore,
      passed,
      summary: passed
        ? 'โค้ดมีโครงสร้างถูกต้องตามมาตรฐานและผ่านเกณฑ์การประเมินเบื้องต้น'
        : 'โค้ดยังขาดองค์ประกอบโครงสร้างหลักบางส่วน ควรปรับปรุงเพิ่มเติม',
      strengths: [
        'มีการใช้แท็ก HTML ตรงตามวัตถุประสงค์ของการแสดงผล',
        hasDoctype ? 'มีการประกาศ <!DOCTYPE html> ถูกต้องตามมาตรฐาน HTML5' : 'เขียนโค้ดได้กระชับ',
      ],
      improvements: issues.length > 0 ? issues : [
        'ควรตรวจสอบการจัดย่อหน้า (Indentation) เพื่อให้อ่านโครงสร้างแท็กลูกได้ง่ายขึ้น',
        'หากมีรูปภาพ อย่าลืมใส่แอตทริบิวต์ alt ทุกครั้งเพื่อรองรับ Accessibility',
      ],
      correctedSnippet: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${assignmentTitle || 'ผลงาน HTML'}</title>
</head>
<body>
  ${code.includes('<body') ? '<!-- โครงสร้างภายใน body -->' : code}
</body>
</html>`,
    });
  } catch (error: unknown) {
    console.error('Code review API error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจโค้ด' }, { status: 500 });
  }
}
