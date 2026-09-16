import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { question, currentUnit, currentCode } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'กรุณากรอกคำถาม' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Prompt Guard instructions
    const systemPrompt = `
คุณคือ "ครูผู้ช่วย AI (AI HTML Tutor)" ประจำนวัตกรรมระบบการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล เรื่อง โครงสร้างภาษา HTML สำหรับนักเรียนระดับชั้นประกาศนียบัตรวิชาชีพ (ปวช.)

กฎและข้อบังคับในการตอบ:
1. ขอบเขตเนื้อหา: เจาะจงเฉพาะ "โครงสร้างภาษา HTML" (8 Sub-domain: H1-H8) เท่านั้น ห้ามสอนหรือเขียนโค้ด CSS หรือ JavaScript เว้นแต่เป็นการจัดวางเพื่อแสดงผล HTML สั้นๆ
2. หากคำถามอยู่นอกขอบเขต HTML: จงปฏิเสธอย่างสุภาพเป็นภาษาไทย เช่น "ขออภัยครับ ครูเป็นครูผู้ช่วยเฉพาะทางเรื่องโครงสร้างภาษา HTML เท่านั้น หากมีข้อสงสัยเกี่ยวกับแท็ก โครงสร้างเอกสาร หรือ Semantic HTML สามารถสอบถามครูได้เลยครับ"
3. Prompt Guard: หากผู้เรียนถามข้อสอบ Adaptive Test หรือขอให้เฉลยตัวเลือกข้อสอบโดยตรง ห้ามเฉลยคำตอบตรงๆ (เช่น ห้ามบอกว่าข้อ A, B, C หรือ D ถูก) เด็ดขาด แต่ให้อธิบายหลักการและแนวคิดที่เกี่ยวข้องเพื่อให้ผู้เรียนนำไปคิดหาคำตอบเอง
4. น้ำเสียงและภาษา: เป็นกันเอง ให้กำลังใจ อธิบายเข้าใจง่าย ชัดเจน เหมาะกับนักเรียน ปวช. และยกตัวอย่างโค้ด HTML สั้นๆ เสมอ
5. บริบทบทเรียนปัจจุบัน: ${currentUnit || 'โครงสร้างภาษา HTML ทั่วไป'}
${currentCode ? `โค้ดที่นักเรียนกำลังเขียนอยู่: \n\`\`\`html\n${currentCode}\n\`\`\`` : ''}
    `;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nคำถามของผู้เรียน: ${question}` }] },
          ],
        });

        const reply = response.text || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้';
        return NextResponse.json({ reply });
      } catch (err: unknown) {
        console.error('Gemini API call failed, falling back to rule-based tutor:', err);
      }
    }

    // Intelligent Fallback (if GEMINI_API_KEY is not set or network unavailable)
    const lower = question.toLowerCase();
    let reply = '';

    if (lower.includes('เฉลย') || lower.includes('ตอบข้อไหน') || lower.includes('ข้อสอบ')) {
      reply = `ครูไม่สามารถเฉลยข้อสอบให้โดยตรงได้ครับน้องๆ 😊 แต่ครูแนะนำให้ดูหลักการของโครงสร้าง HTML ครับ:
- ตรวจสอบว่าคำสั่งนั้นเป็นแท็กเดี่ยว (Void element) หรือแท็กคู่
- ลำดับขั้นของ <head> ต้องมาก่อน <body> เสมอ
- หากเป็นเรื่อง Semantic ให้ดูความหมายของแท็ก เช่น <nav> สำหรับเมนู, <footer> สำหรับส่วนท้าย
ลองวิเคราะห์ตัวเลือกอีกครั้งนะครับ ครูเชื่อว่าหนูทำได้!`;
    } else if (lower.includes('h1') || lower.includes('heading') || lower.includes('หัวเรื่อง')) {
      reply = `หัวเรื่องในภาษา HTML แบ่งออกเป็น 6 ระดับครับ คือ <h1> ถึง <h6> โดย:
- <h1> มีความสำคัญสูงสุด ควรมีเพียง 1 จุดต่อหน้าสำหรับชื่อเรื่องหลัก
- <h2> ถึง <h6> ใช้สำหรับหัวเรื่องย่อยตามลำดับขั้น
ตัวอย่างโค้ด:
\`\`\`html
<h1>วิทยาลัยอาชีวศึกษา</h1>
<h2>แผนกวิชาเทคโนโลยีสารสนเทศ</h2>
<p>ยินดีต้อนรับสู่หลักสูตรพัฒนาเว็บไซต์</p>
\`\`\`
จำไว้ว่าเราใช้ Heading เพื่อลำดับโครงสร้างเนื้อหา ไม่ใช่เพื่อเปลี่ยนขนาดตัวอักษรนะครับ`;
    } else if (lower.includes('img') || lower.includes('รูปภาพ') || lower.includes('alt')) {
      reply = `การแทรกรูปภาพใช้แท็ก <img> ซึ่งเป็นแท็กเดี่ยว (Void Element) ไม่ต้องมีแท็กปิดครับ!
สิ่งสำคัญ 2 อย่างที่ต้องมีเสมอ:
1. \`src\`: ที่อยู่ไฟล์ภาพ
2. \`alt\`: คำบรรยายภาพสำหรับคนพิการทางสายตาและช่วย Search Engine
ตัวอย่าง:
\`\`\`html
<img src="logo.png" alt="ตราสัญลักษณ์วิทยาลัย">
\`\`\`
และถ้าต้องการใส่คำบรรยายใต้ภาพอย่างถูกต้องตามหลัก Semantic ควรใช้คู่กับ <figure> และ <figcaption> ครับ`;
    } else if (lower.includes('form') || lower.includes('ฟอร์ม') || lower.includes('input')) {
      reply = `ฟอร์มใน HTML ใช้แท็ก <form> เป็นตัวครอบครับ โดยมีประเภทอินพุตที่พบบ่อย:
- \`<input type="text">\` รับข้อความทั่วไป
- \`<input type="password">\` รหัสผ่าน (ซ่อนตัวอักษร)
- \`<input type="radio">\` เลือกได้ 1 อย่าง (ต้องตั้ง name เดียวกัน)
- อย่าลืมผูก \`<label for="id_input">\` คู่กับ \`id\` ของ input เสมอเพื่อความสะดวกในการคลิกครับ!`;
    } else if (lower.includes('table') || lower.includes('ตาราง') || lower.includes('colspan') || lower.includes('rowspan')) {
      reply = `ตารางใน HTML ประกอบด้วย:
- \`<table>\` ตัวครอบ
- \`<tr>\` แถว
- \`<th>\` หัวตาราง (ตัวหนา)
- \`<td>\` ข้อมูลในช่อง
เทคนิคผสานเซลล์:
- \`colspan="2"\` ขยาย 2 ช่องแนวนอน (คอลัมน์)
- \`rowspan="2"\` ขยาย 2 ช่องแนวตั้ง (แถว)`;
    } else {
      reply = `สวัสดีครับ! ครูยินดีตอบคำถามเกี่ยวกับโครงสร้างภาษา HTML ครับ
สำหรับคำถาม: "${question}"
ในภาษา HTML การวางโครงสร้างที่ถูกต้องเริ่มต้นจาก <!DOCTYPE html> ตามด้วย <html>, <head> ที่มี meta charset UTF-8 และ <body> ที่เป็นพื้นที่แสดงผลหลัก
หากต้องการให้ครูอธิบายแท็กใดเป็นพิเศษ เช่น การทำตาราง ลิงก์ รูปภาพ หรือฟอร์ม สามารถพิมพ์ถามครูได้เลยครับ!`;
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('Tutor API error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการประมวลผล' }, { status: 500 });
  }
}
