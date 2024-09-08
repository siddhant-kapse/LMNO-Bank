from flask import Flask, render_template, request, jsonify
import os


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/data_extraction')
def data_extraction():
    return render_template('data_ext_home.html')

@app.route('/data_extraction/upload_pdf')
def upload_pdf():
    return render_template('upload_pdf.html')

@app.route('/data_extraction/text_entry')
def upload_text():
    return render_template('upload_text.html')

@app.route('/data_extraction/add_link')
def upload_link():
    return render_template('upload_link.html')

if __name__ == '__main__':
    app.run(debug=True,  port=3000)