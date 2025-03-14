from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/mais-sobre")
def maisSobre():
    return render_template("cards.html")

@app.route("/jesus")
def jesus():
    return render_template("jesus.html")

@app.route("/maria")
def maria():
    return render_template("maria.html")

@app.route("/oracoes")
def oracoes():
    return render_template("oracoes.html")

@app.route("/contato")
def contato():
    return render_template("contato.html")

if __name__ == "__main__":
    app.run(debug=True)