import os
import io
import re
import time
from flask import Flask, request, jsonify, render_template
import easyocr
from PIL import Image
import torch
import numpy as np
import requests
import cv2
from thefuzz import fuzz

app = Flask(__name__)

print("Loading EasyOCR... (this may take 20–30 seconds on first run)")
reader = easyocr.Reader(['en'], gpu=torch.cuda.is_available())
print("EasyOCR ready! Server starting at http://127.0.0.1:5000")


SECTION_PATTERNS = {
    "Patient Information": [
        r"(?i)(name|patient)[:\s]+([A-Za-z\s\.]+)",
        r"(?i)(age|dob|date\s*of\s*birth)[:\s/]+([0-9A-Za-z\s]+)",
        r"(?i)(sex|gender)[:\s/]+([A-Za-z]+)",
        r"(?i)(card\s*no|id|mrn|reg\.?\s*no)[:\s]+([A-Za-z0-9\s\-]+)",
        r"(?i)(designation|occupation)[:\s]+([A-Za-z\s]+)",
        r"(?i)(tel|phone|mobile|contact)[:\s\.]+([\d\s\-\+\(\)]+)",
    ],
    "Hospital / Referral": [
        r"(?i)(hospital|clinic|institute|centre|center)[:\s]*([A-Za-z0-9\s\.,\-]+)",
        r"(?i)(referred?\s*(to|by)|to\s*/?\s*dr|doctor|physician)[:\s]+([A-Za-z\s\.]+)",
        r"(?i)(date)[:\s]+([0-9/\-\.]+)",
        r"(?i)(reason|referral|for\s*admission)[:\s]+([A-Za-z0-9\s,\.]+)",
    ],
    "Clinical Notes / Diagnosis": [
        r"(?i)(diagnosis|diag)[:\s]+([^\n]+)",
        r"(?i)(clinical\s*note|impression|findings?)[:\s]+([^\n]+)",
        r"(?i)\b(fracture|injury|pain|swelling|inflammation|fever|infection|"
        r"displaced|mobility|limited|wound|trauma|sprain|laceration|burn|"
        r"hypertension|diabetes|cough|breathless|allergy)[^\n]*",
    ],
    "Investigations / Tests": [
        r"(?i)(x[-\s]?ray|xray|mri|ct\s*scan|ultrasound|ecg|eeg|blood\s*test|"
        r"urine\s*test|biopsy|culture|cbc|hemoglobin|glucose|creatinine|"
        r"investigation|lab\s*report|pathology)[^\n]*",
    ],
    "Medications / Prescriptions": [
        r"(?i)(tablet|tab|capsule|cap|syrup|injection|inj|mg|ml|dose|"
        r"prescription|medic|drug|paracetamol|antibiotic|ibuprofen|"
        r"amoxicillin|metformin|aspirin|atorvastatin|omeprazole|dolo)[^\n]*",
    ],
    "Doctor's Orders / Recommendations": [
        r"(?i)(advice|recommend|management|follow[-\s]?up|review|"
        r"shifted\s*to|admit|discharge|rest|observation)[^\n]*",
    ],
}

FUZZY_LABELS = {
    "Patient Information": [
        "Patient Name", "Name:", "Patient:", "Age:", "DOB", "Date of Birth", "Sex:", "Gender:", "Card No", "ID", "MRN", "Reg No"
    ],
    "Hospital / Referral": [
        "Hospital", "Clinic", "Institute", "Centre", "Center", "Referred To", "Referred By", "To Dr", "Doctor", "Physician", "Date:"
    ],
    "Clinical Notes / Diagnosis": [
        "Diagnosis", "Clinical Note", "Impression", "Findings", "Fracture", "Injury"
    ],
    "Investigations / Tests": [
        "X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "EEG", "Blood Test", "Urine Test", "Biopsy"
    ],
    "Medications / Prescriptions": [
        "Tablet", "Tab", "Capsule", "Cap", "Syrup", "Injection", "Inj", "mg ", "ml ", "Dose"
    ],
    "Doctor's Orders / Recommendations": [
        "Advice", "Recommend", "Management", "Follow Up", "Review", "Shifted To", "Admit", "Discharge"
    ]
}

def extract_sections(text: str) -> dict:
    """Run all regex patterns over OCR text and group into medical sections."""
    results = {section: set() for section in SECTION_PATTERNS}
    
    # 1. Regex Pass (Strict but precise)
    for section, patterns in SECTION_PATTERNS.items():
        for pattern in patterns:
            for m in re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE):
                snippet = m.group(0).strip()
                if len(snippet) > 3:
                    results[section].add(snippet)
                    
    lines = [l.strip() for l in re.split(r'[\n.;]', text) if l.strip()]
    for line in lines:
        if len(line) < 4: continue
        
        assigned = False
        words = line.split()
        prefix = " ".join(words[:4])

        best_score = 0
        best_section = None
        
        for section, labels in FUZZY_LABELS.items():
            for label in labels:
                score = fuzz.partial_ratio(label.lower(), prefix.lower())
                if score > 85 and score > best_score:
                    best_score = score
                    best_section = section

        if best_section:
            already_exists = any(fuzz.ratio(line.lower(), existing.lower()) > 90 for existing in results[best_section])
            if not already_exists:
                results[best_section].add(line)
        else:
            for section, labels in FUZZY_LABELS.items():
                if assigned: break
                for label in labels:
                    if len(label) < 4: continue
                    if fuzz.token_set_ratio(label.lower(), line.lower()) > 85:
                        already_exists = any(fuzz.ratio(line.lower(), existing.lower()) > 90 for existing in results[section])
                        if not already_exists:
                            results[section].add(line)
                            assigned = True
                            break
    
    return {k: sorted(list(v)) for k, v in results.items() if v}

def build_html(sections: dict, raw_text: str) -> str:
    """Convert extracted sections dict to pretty HTML."""
    html_parts = []
    for section, items in sections.items():
        html_parts.append(f"<h3>{section}</h3><ul>")
        for item in items:

            clean = item.strip().capitalize()
            html_parts.append(f"  <li>{clean}</li>")
        html_parts.append("</ul>")
    
    html_parts.append(
        "<h3>Full Scanned Text (Raw OCR)</h3>"
        f'<pre style="white-space:pre-wrap;font-size:0.85rem;color:#94a3b8;">{raw_text}</pre>'
    )
    return "\n".join(html_parts)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    img_bytes = None
    
    if 'file' in request.files:
        file = request.files['file']
        if file.filename:
            img_bytes = file.read()
    
    if not img_bytes:
        data = request.get_json() if request.is_json else request.form
        image_url = data.get('image_url')
        
        if image_url:
            try:
                print(f"Downloading image from: {image_url}")
                response = requests.get(image_url, timeout=15)
                response.raise_for_status()
                img_bytes = response.content
            except Exception as e:
                return jsonify({'error': f'Failed to download image from URL: {str(e)}'}), 400

    if not img_bytes:
        return jsonify({'error': 'No image provided (upload a file or provide a URL).'}), 400

    try:
        start_time = time.time()

        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img_array = np.array(image)

        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced_img = clahe.apply(gray)


        print("Scanning image with EasyOCR...")
        
        results = reader.readtext(enhanced_img, detail=1, paragraph=True)
        results_sorted = sorted(results, key=lambda r: r[0][0][1])
        scanned_text = "\n".join([r[1] for r in results_sorted])
        print(f"OCR complete | {len(scanned_text)} chars extracted")

        if not scanned_text.strip():
            return jsonify({'error': 'No text detected. Please upload a clearer image.'}), 400

        sections = extract_sections(scanned_text)
        summary_html = build_html(sections, scanned_text)

        elapsed = round(time.time() - start_time, 2)
        print(f"Done in {elapsed}s")

        return jsonify({
            'original_text': scanned_text,
            'summary_html': summary_html,
            'time_taken': elapsed,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=5500)
