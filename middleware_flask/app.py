from flask import Flask, request, jsonify

app = Flask(__name__)

# Ruta para el endpoint /lti/launch
@app.route('/lti/launch', methods=['POST'])
def lti_launch():
    # Imprimir los datos recibidos para depuración
    print(request.form)

    # Extraer los valores relevantes
    user_id = request.form.get("custom_canvas_user_id")
    course_id = request.form.get("custom_canvas_course_id")
    roles = request.form.get("roles")

    if not user_id or not course_id or not roles:
        return jsonify({
            "error": "Missing required LTI parameters",
            "details": {
                "user_id": user_id,
                "course_id": course_id,
                "roles": roles
            }
        }), 400

    # Determinar si el usuario es maestro o estudiante basado en los roles
    if "Instructor" in roles or "Teacher" in roles:
        role = "Teacher"
    elif "Learner" in roles or "Student" in roles:
        role = "Student"
    else:
        role = "Unknown"

    # Respuesta con los valores relevantes
    return jsonify({
        "message": "LTI launch successful",
        "user_id": user_id,
        "course_id": course_id,
        "role": role
    }), 200


# Ruta raíz para probar que el servidor está activo
@app.route('/')
def home():
    return jsonify({"message": "LTI middleware running"}), 200


# Inicia la aplicación
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
