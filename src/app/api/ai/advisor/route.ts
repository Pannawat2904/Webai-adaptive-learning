import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { SubDomainCode, SUB_DOMAINS } from '@/types/database';

export async function POST(request: Request) {
  try {
    const { skills, studentName, irtTheta, irtSE } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Filter weak domains
    const weakList: string[] = [];
    const strongList: string[] = [];

    if (skills) {
      Object.entries(skills).forEach(([code, data]: [string, any]) => {
        const domain = SUB_DOMAINS[code as SubDomainCode];
        const score = data.estimated_level ?? 0;
        if (score < 60) {
          weakList.push(`${code} (${domain?.name}): ${score}%`);
        } else if (score >= 80) {
          strongList.push(`${code} (${domain?.name}): ${score}%`);
        }
      });
    }

    const systemPrompt = `
คุณคือ "AI Advisor แนะนำการเรียนรู้เฉพาะบุคคล" สำหรับระบบนวัตกรรมเรียนรู้โครงสร้างภาษา HTML ระดับ ปวช.
ข้อมูลผู้เรียน: ${studentName || 'นักเรียน'}
ความสามารถรวมประเมินจากแบบจำลอง IRT 3PL (Theta): ${irtTheta !== undefined ? irtTheta.toFixed(2) : 'N/A'} (ช่วง -3.0 ถึง 3.0)
ความคลาดเคลื่อนมาตรฐาน (SE): ${irtSE !== undefined ? irtSE.toFixed(3) : 'N/A'}

จุดแข็ง (Strength): ${strongList.join(', ') || 'ไม่มี'}
จุดที่ควรพัฒนา (Needs Improvement): ${weakList.join(', ') || 'ไม่มี'}

จงให้คำแนะนำภาษาไทยที่อบอุ่น เป็นมิตร สั้นกระชับ ให้กำลังใจ วิเคราะห์ระดับความสามารถ (Theta) และระบุขั้นตอนการพัฒนาที่ชัดเจน 3 ข้อ
    `;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        });

        const advice = response.text;
        if (advice) {
          return NextResponse.json({ advice });
        }
      } catch (err) {
        console.error('Gemini Advisor error:', err);
      }
    }

    // Default friendly Thai recommendation
    const advice = `สวัสดีครับน้อง${studentName || 'นักเรียน'}! จากการวิเคราะห์ผลการประเมิน Adaptive Test:
1. 🎉 **จุดเด่นของคุณ:** มีความเข้าใจโครงสร้างหลักของ HTML เป็นอย่างดี (${strongList.join(', ') || 'โครงสร้างพื้นฐาน'})
2. 💡 **จุดที่ครูแนะนำให้เสริม:** ให้เน้นฝึกเรื่อง ${weakList.join(', ') || 'การทำฟอร์มและตาราง'} โดยเฉพาะการเลือกใช้แท็กให้ตรงกับความหมาย Semantic
3. 🚀 **ก้าวถัดไป:** แนะนำให้เปิดพื้นที่ Code Lab เพื่อทดลองพิมพ์โค้ดจริงตาม Requirement Checklist จากนั้นทำแบบทดสอบซ้ำ (Re-test) เพื่อยกระดับความเชี่ยวชาญครับ!`;

    return NextResponse.json({ advice });
  } catch (error: unknown) {
    console.error('Advisor API error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้างคำแนะนำ' }, { status: 500 });
  }
}
