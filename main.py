from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/ref_check")
def ref_check():
    return render_template('ref_check.html')

if __name__ == "__main__":
    app.run()
