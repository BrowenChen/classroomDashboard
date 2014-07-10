from flask import Flask
from todoView import TodoView, TodoAdd, TodoRetrieve

#Start flask App
app = Flask(__name__)

#Adding the REST rules
app.add_url_rule('/', view_func=TodoView.as_view('todo_view'),
    methods=['GET'])
app.add_url_rule('/todoAdd', view_func=TodoAdd.as_view('todo_add'),
    methods=['POST'])
app.add_url_rule('/todoRetrieve/<int:n>',
    view_func=TodoRetrieve.as_view('todo_retrieve'), methods=['GET'])

if __name__ == '__main__':
    app.run(debug=True)
