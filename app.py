from flask import Flask, render_template, redirect, session
from boggle import Boggle

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecret'

session['boggle_game'] = boggle_game

@app.route('/')
def show_game():
    """Show game board"""

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)

    return render_template('index.html', board=board, highscore=highscore)