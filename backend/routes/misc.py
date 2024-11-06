from flask import Blueprint, request, jsonify
from queries import execute_query

misc_bp = Blueprint('misc', __name__)

@misc_bp.route('/execute', methods=['POST'])
def executeQuery():
    option = request.json
    print(option)
    result = execute_query(option['query'])
    return jsonify(result), 200 