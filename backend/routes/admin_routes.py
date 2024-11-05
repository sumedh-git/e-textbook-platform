# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import create_user, create_etextbook_query, add_chapter, add_section, add_content_block, add_activity, add_question, check_etextbook_exists, check_chapter_exists, check_section_exists, check_content_block_exists, modify_content_block, modify_question, create_active_course, create_evaluation_course

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/create-faculty', methods=['POST'])
def create_faculty():
    data = request.json
    success, _, message = create_user(data, 'faculty')
    if success:
        return jsonify({"message": "Faculty account created successfully"}), 201
    else:
        return jsonify({"error": message}), 400

@admin_bp.route('/create-etextbook', methods=['POST'])
def create_etextbook():
    data = request.json
    success, message = create_etextbook_query(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400
    

@admin_bp.route('/add-chapter', methods=['POST'])
def add_chapter_route():
    data = request.json
    success, message  = add_chapter(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

@admin_bp.route('/add-section', methods=['POST'])
def add_section_route():
    data = request.json
    success, message  = add_section(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400
    
@admin_bp.route('/add-content-block', methods=['POST'])
def add_content_block_route():
    data = request.json
    success, message  = add_content_block(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400
    
@admin_bp.route('/add-question', methods=['POST'])
def add_question_route():
    data = request.json
    # Step 1: Insert into ContentBlocks
    success, message = add_content_block(data)
    if not success:
        return jsonify({"error": f"Failed to add content block: {message}"}), 400

    # Step 2: Insert into Activities
    success, message = add_activity(data)
    if not success:
        return jsonify({"error": f"Failed to add activity: {message}"}), 400

    # Step 3: Insert into Questions
    success, message = add_question(data)
    if not success:
        return jsonify({"error": f"Failed to add question: {message}"}), 400

    return jsonify({"message": "Question added successfully!"}), 201

@admin_bp.route('/check-etextbook/<eTextbookID>', methods=['GET'])
def check_etextbook(eTextbookID):
    exists = check_etextbook_exists(eTextbookID)
    return jsonify({"exists": exists})

@admin_bp.route('/check-chapter/<eTextbookID>/<chapterID>', methods=['GET'])
def check_chapter(eTextbookID, chapterID):
    exists = check_chapter_exists(eTextbookID, chapterID)
    return jsonify({"exists": exists})

@admin_bp.route('/check-section/<eTextbookID>/<chapterID>/<sectionID>', methods=['GET'])
def check_section(eTextbookID, chapterID, sectionID):
    exists = check_section_exists(eTextbookID, chapterID, sectionID)
    return jsonify({"exists": exists})

@admin_bp.route('/check-content-block/<eTextbookID>/<chapterID>/<sectionID>/<contentBlockID>', methods=['GET'])
def check_content_block(eTextbookID, chapterID, sectionID, contentBlockID):
    exists = check_content_block_exists(eTextbookID, chapterID, sectionID, contentBlockID)
    return jsonify({"exists": exists})

@admin_bp.route('/modify-content-block', methods=['PUT'])
def modify_content_block_route():
    data = request.json
    success, message = modify_content_block(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400
    
@admin_bp.route('/modify-question', methods=['POST'])
def modify_question_route():
    data = request.json
    success, message = modify_question(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400
    
@admin_bp.route('/create-active-course', methods=['POST'])
def create_active_course_route():
    data = request.json
    success, message = create_active_course(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

@admin_bp.route('/create-evaluation-course', methods=['POST'])
def create_evaluation_course_route():
    data = request.json
    success, message = create_evaluation_course(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400
