from flask import Flask, render_template, request, jsonify
import os
from pdf_processor import process_pdfs, query_pdf


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/data_extraction')
def data_extraction():
    return render_template('data_ext_home.html')

@app.route('/data_extraction/upload_pdf')
def upload_pdf_page():
    return render_template('upload_pdf.html')

# Route to handle PDF upload and processing
@app.route('/data_extraction/upload_pdf', methods=['POST'])
def upload_pdf():
    files = request.files.getlist('pdf')
    message = process_pdfs(files)  # Call function from pdf_processor
    return jsonify({"message": message})

# Route to handle query processing
@app.route('/data_extraction/ask_pdf', methods=['POST'])
def ask_pdf():
    data = request.get_json()  # Retrieve JSON data
    query = data.get("query")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    result = query_pdf(query)  # Call function from pdf_processor
    return jsonify(result)

@app.route('/data_extraction/text_entry')
def upload_text():
    return render_template('upload_text.html')

@app.route('/data_extraction/add_link')
def upload_link():
    return render_template('upload_link.html')

if __name__ == '__main__':
    app.run(debug=True,  host= "0.0.0.0", port=3000)