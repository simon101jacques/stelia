import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# Initialize
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def process_and_save():
    # 1. Load from root using absolute path
    data_path = os.path.join(BASE_DIR, 'data.json')
    
    try:
        with open(data_path, 'r') as f:
            original_data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: Could not find data.json at {data_path}")
        return

    # 2. Setup the Model
    model = genai.GenerativeModel('gemini-3-flash-preview') 
    
    prompt = f"""
    Analyze these logs. Extract 'Postcode' (or "Incomplete Data"), 'Urgency_Level' (1-5), 
    and 'Recommended_Action'. 
    
    Return ONLY a JSON array of objects. Each object MUST include the 'id' 
    so I can map it back to the original data.

    Data: {json.dumps(original_data)}
    """

    response = model.generate_content(prompt)
    
    # Clean and parse the LLM response
    raw_text = response.text.replace('```json', '').replace('```', '').strip()
    try:
        ai_results = json.loads(raw_text)
    except json.JSONDecodeError:
        print("Error: AI returned invalid JSON. Check the response text.")
        return

    # 3. Merge the data
    ai_lookup = {item['id']: item for item in ai_results}
    
    final_output = []
    for record in original_data:
        record_id = record['id']
        if record_id in ai_lookup:
            merged_record = {**record, **ai_lookup[record_id]}
            
            if merged_record.get('Urgency_Level', 0) >= 4:
                merged_record['Status'] = "CRITICAL ALARM"
            else:
                merged_record['Status'] = "Normal"
                
            final_output.append(merged_record)

    # 4. Save to dashboard/src/
    target_dir = os.path.join('dashboard', 'src')
    output_path = os.path.join(BASE_DIR, 'dashboard', 'src', 'processed_data.json')

    with open(output_path, 'w') as f:
        json.dump(final_output, f, indent=4)
    
    print(f"✅ Success! Data synced to: {output_path}")

if __name__ == "__main__":
    process_and_save()