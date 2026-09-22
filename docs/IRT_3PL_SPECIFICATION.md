# IRT 3PL Specification

## 1. Item Response Theory 3-Parameter Logistic Model (3PL)
แกนหลักของ Adaptive Assessment คือสมการคณิตศาสตร์ 3PL ที่คำนวณความน่าจะเป็นที่ผู้เรียนที่มีความสามารถ $\theta$ (Theta) จะตอบข้อสอบถูก

### สมการ 3PL
$$ P_i(\theta) = c_i + \frac{1 - c_i}{1 + e^{-D \cdot a_i \cdot (\theta - b_i)}} $$

**คำอธิบายตัวแปร:**
*   $P_i(\theta)$: ความน่าจะเป็นที่ผู้เรียนระดับความสามารถ $\theta$ จะตอบข้อ $i$ ถูก
*   $\theta$ (Theta): ระดับความสามารถของผู้เรียน (Ability Level) โดยทั่วไปอยู่ในช่วง -3.0 ถึง +3.0
*   $a_i$ (Discrimination): อำนาจจำแนกของข้อสอบ (ปกติ 0.5 ถึง 2.0) ยิ่งสูงยิ่งแยกคนเก่งและคนอ่อนได้ดี
*   $b_i$ (Difficulty): ความยากของข้อสอบ มีหน่วยเดียวกับ $\theta$ (-3.0 ถึง +3.0)
*   $c_i$ (Pseudo-guessing): โอกาสเดาถูก (เช่น 0.20 หรือ 0.25 สำหรับข้อสอบ 4 หรือ 5 ตัวเลือก)
*   $D$ (Scaling Constant): ค่าคงที่สำหรับปรับสเกลให้ใกล้เคียงโมเดล Normal Ogive **กำหนดให้ $D = 1.7$ เสมอตามโครงสร้างของระบบ**

## 2. Item Information
ในการเลือกข้อสอบข้อต่อไปในระบบ CAT เราต้องคำนวณว่าข้อสอบข้อใดให้ "ข้อมูล" (Information) เกี่ยวกับผู้เรียนมากที่สุด ณ ระดับความสามารถ $\theta$ ปัจจุบัน

### สมการ Item Information สำหรับ 3PL
$$ I_i(\theta) = \frac{D^2 \cdot a_i^2 \cdot (1 - P_i(\theta)) \cdot (P_i(\theta) - c_i)^2}{(1 - c_i)^2 \cdot P_i(\theta)} $$

*ระบบจะพยายามเลือกข้อสอบที่มีค่า $I_i(\theta)$ สูงสุด (Maximum Fisher Information - MFI)*

## 3. Standard Error (SE)
หลังจากการตอบข้อสอบแต่ละข้อ ระบบจะอัปเดตค่าความคลาดเคลื่อนมาตรฐาน (Standard Error) เพื่อใช้เป็นเกณฑ์พิจารณาการหยุดสอบ (Stopping Rule)

### สมการ Test Information และ Standard Error
$$ I(\theta) = \sum_{i=1}^{n} I_i(\theta) $$
$$ SE(\theta) = \frac{1}{\sqrt{I(\theta)}} $$
เมื่อตอบไปหลายข้อ $I(\theta)$ จะสะสมมากขึ้น ทำให้ $SE(\theta)$ ลดลง (ประมาณค่าแม่นยำขึ้น)

## 4. IRT Flow Diagram

```mermaid
flowchart TD
    A[Start IRT Calculation] --> B{Given parameters:\nθ, a, b, c, D=1.7}
    
    B --> C[Calculate Probability Pi(θ)]
    C --> D[Calculate Item Information Ii(θ)]
    
    D --> E{Is Item Selected?}
    
    E -- Yes --> F[Student Responses (0 or 1)]
    F --> G[Estimate New θ\nusing MLE/MAP/EAP]
    G --> H[Calculate Total Information I(θ)]
    H --> I[Calculate Standard Error SE = 1/√I]
    
    I --> J[End IRT Calculation Cycle]
```

## 5. กฎข้อบังคับที่สำคัญ (Crucial Rules)
*   **ห้ามสุ่มค่า a, b, c แล้วนำไปอ้างว่าเป็นค่าพารามิเตอร์ IRT จริง** (ยกเว้นเปิด `USE_MOCK_IRT=true` สำหรับทดสอบระบบ)
*   **ห้ามแปลง $\theta$ เป็นเปอร์เซ็นต์โดยตรง** $\theta$ เป็นค่า Logit Scale ที่สะท้อนความสามารถเชิงสัมพัทธ์ การแสดงผลให้ผู้เรียนดูควรแปลงเป็นสถานะเชิงคุณภาพ (เช่น Strong, Developing) หรือกราฟแท่งความก้าวหน้า
