import os

from flask import Flask, render_template, request

from .applogic import create_ad, list_ads

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/')
    def index():
        ctx = {
            'oglasi': list_ads()
        }
        return render_template('list-oglasa.html', **ctx)

    @app.route('/novi-oglas')
    def novi_oglas():
        return render_template('novi-oglas.html')

    @app.route('/o-nama')
    def o_nama():
        return render_template('o-nama.html')

    @app.route('/ajax/oglasi', methods=['POST', ])
    def oglasi():
        data = request.json
        # nema tu ikakve validacije uopste - zato sto ovo je iskljucivo demo
        create_ad(**data)
        return {}

    return app
