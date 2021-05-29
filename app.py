from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecret'

boggle_game = Boggle()

@app.route('/')
def show_game():
    """Show game board"""

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    numOfPlays = session.get("numOfPlays", 0)

    return render_template('index.html', board=board, highscore=highscore, numOfPlays=numOfPlays)

@app.route('/check-word')
def check_word():
    """Check if submitted word is a word"""

    word = request.args["word"]
    board = session["board"]
    res = boggle_game.check_valid_word(board, word)

    return jsonify({'result': res})

@app.route('/game-over', methods=["POST"])
def game_over():
    """When timer runs out, finalizes score, updates highscore and number of times played"""

    score = request.json["score"]
    highscore = session.get('highscore', 0)
    numOfPlays = session.get('numOfPlays', 0)

    session['numOfPlays'] = numOfPlays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(newRecord=score > highscore)