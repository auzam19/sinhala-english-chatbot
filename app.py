from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Load phrases from JSON files
with open('english_phrases.json', 'r', encoding='utf-8') as f:
    english_phrases = json.load(f)

with open('sinhala_phrases.json', 'r', encoding='utf-8') as f:
    sinhala_phrases = json.load(f)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    language = data.get('language')
    user_input = data.get('message', '').lower().strip()

    if language == 'english':
        reply = english_phrases.get(user_input, "Sorry, I didn't understand that.")
    elif language == 'sinhala':
        reply = sinhala_phrases.get(user_input, "මට ඒක තේරෙන්නේ නැහැ.")
    else:
        reply = "Please select a language first."

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True)
