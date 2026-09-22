# Computerized Adaptive Testing (CAT) Algorithm

## 1. Overview
CAT Engine เป็นสมองกลของระบบประเมินผลที่จะคัดเลือกข้อสอบที่ดีที่สุดให้ผู้เรียนเป็นรายบุคคล แบบเรียลไทม์

## 2. CAT Lifecycle Algorithm

### Step 1: Initialization
*   เมื่อผู้เรียนกดเริ่มสอบ สร้าง CAT Session
*   กำหนด $\theta_{initial}$ = 0.0 (หรือดึงจากโปรไฟล์เดิมถ้ามี)
*   ตั้งค่าเงื่อนไขเบื้องต้น: `MIN_ITEMS`=10, `MAX_ITEMS`=30, `TARGET_SE`=0.30

### Step 2: Item Selection (Maximum Fisher Information - MFI)
ระบบไม่เลือกแค่ข้อที่ Information สูงสุดเท่านั้น แต่ต้องผ่าน Filter ตามลำดับดังนี้:
1.  **Exclude Answered**: ตัดข้อที่ผู้เรียนตอบไปแล้วใน Session นี้ออก
2.  **Domain Blueprint Check**: ตรวจสอบว่าโควตาโครงสร้างข้อสอบ (เช่น HTML ต้องมี 20%) ถูกเติมเต็มหรือยัง ถ้ายังให้จัดลำดับความสำคัญของข้อสอบในกลุ่มนี้ขึ้นมา
3.  **Exposure Control**: ตรวจสอบ `exposure_rate` ของข้อสอบ ถ้าสูงเกินกำหนด ให้ตัดออกชั่วคราว เพื่อป้องกันข้อสอบช้ำ
4.  **Information Calculation**: คำนวณ $I_i(\theta)$ ของข้อสอบที่ผ่านเงื่อนไข ณ $\theta$ ปัจจุบัน
5.  **Selection**: เลือกข้อที่มีค่า $I_i(\theta)$ สูงที่สุด

### Step 3: Response Processing & Theta Estimation
เมื่อผู้เรียนส่งคำตอบ:
*   ตรวจสอบว่าถูก (1) หรือผิด (0)
*   ประมาณค่าความสามารถ ($\theta$) ใหม่ โดยใช้วิธี **Maximum Likelihood Estimation (MLE)** เป็นค่าตั้งต้น (รองรับการปรับเปลี่ยนไปใช้ MAP หรือ EAP ได้หากตั้งค่าไว้)
*   *Fallback*: หากกรณีตอบถูกหมดหรือผิดหมด (Perfect Score / Zero Score) MLE จะไม่สามารถหาค่าได้ (ยิงไป $\pm\infty$) ระบบต้องมี Fallback Mechanism เช่นการบวก/ลบ ค่าคงที่ทีละนิดจนกว่าจะตอบสลับ

### Step 4: Stopping Rule Check
หลังจากการอัปเดต $\theta$ และ $SE$ ให้ตรวจสอบเงื่อนไขดังนี้:
*   `IF items_answered < MIN_ITEMS`: **ทำต่อไป** (กลับไป Step 2)
*   `IF items_answered >= MAX_ITEMS`: **หยุดสอบทันที** (จบ Session)
*   `IF items_answered >= MIN_ITEMS AND SE <= TARGET_SE`: **หยุดสอบ** (บรรลุความแม่นยำที่ต้องการแล้ว)

## 3. CAT Flow Diagram

```mermaid
flowchart TD
    START[Student Starts Adaptive Test] --> INIT[Initialize Session & θ₀=0.0]
    
    INIT --> LOOP_START[Begin Loop]
    LOOP_START --> FILTER_ELIGIBLE[Filter Eligible Items\n(Not answered, Active)]
    FILTER_ELIGIBLE --> CONTENT_BAL[Apply Blueprint &\nExposure Control]
    CONTENT_BAL --> CALC_INFO[Calculate Information I(θ) for candidates]
    
    CALC_INFO --> SELECT[Select Item with Max Information]
    SELECT --> DISPLAY[Display Question to Student]
    
    DISPLAY --> ANSWER[Student Submits Answer]
    ANSWER --> RECORD[Record is_correct]
    
    RECORD --> ESTIMATE[Estimate New θ & Calculate SE]
    ESTIMATE --> CHECK_STOP{Check Stopping Rules}
    
    CHECK_STOP -- SE > Target \n& Count < Max --> LOOP_START
    CHECK_STOP -- Count >= Min & SE <= Target --> FINISH[Finish CAT Session]
    CHECK_STOP -- Count >= Max --> FINISH
    
    FINISH --> DIAGNOSTICS[Diagnostic Analytics &\nUpdate Skill Profile]
```
