from flask import Flask, request, jsonify, render_template
import requests
from concurrent.futures import ThreadPoolExecutor
from config import DevelopmentConfig, TestingConfig, ProductionConfig
import os



app = Flask(__name__)
# Determinar el entorno (por defecto, desarrollo)
env = os.getenv("FLASK_ENV", "development")
if env == "development":
    app.config.from_object(DevelopmentConfig)
elif env == "testing":
    app.config.from_object(TestingConfig)
else:
    app.config.from_object(ProductionConfig)

API_BASE_URL = app.config["API_BASE_URL"]
canvas_url = app.config["CANVAS_URL"]
LTI_URL = app.config["LTI_URL"]
# Endpoint de lanzamiento LTI
@app.route('/lti/launch', methods=['POST'])
def lti_launch():
    user_id = request.form.get("custom_canvas_user_id")
    course_id = request.form.get("custom_canvas_course_id")
    roles = request.form.get("roles")
    curso = request.form.get("context_title")
    # Determinar el rol
    role = "Teacher" if "Instructor" in roles or "Teacher" in roles else "Student"

    # Redirigir a la vista correspondiente
    if role == "Student":
        try:
            # Obtener las tareas pendientes del usuario
            pending_tasks_response = requests.get(
                f"{API_BASE_URL}/StudentTasks/{user_id}/pending-tasks", verify=False
            )
            pending_tasks = pending_tasks_response.json() if pending_tasks_response.status_code == 200 else []

            tasks_summary = []

            for task in pending_tasks:
                assignmentId = task['assignmentId']
                task_summary_response = requests.get(
                    f"{API_BASE_URL}/api/Courses/{course_id}/tasks/{assignmentId}/submission-summary-2", verify=False
                )
                task = task_summary_response.json() if task_summary_response.status_code == 200 else {}
                tasks_summary.append(task)
            
            ## Itera sobre pending task y task_summary y añadele el assignmentID a cada elemento de task_summary

            for task, summary in zip(pending_tasks, tasks_summary):
                summary['assignmentId'] = task['assignmentId']
            

            

            return render_template(
                'student_view.html',
                user_id=user_id,
                course_id=course_id,
                pending_tasks=pending_tasks,
                submission_summary=tasks_summary,
                curso=curso
            )
        except Exception as e:
            print(f"Error al obtener datos del backend: {e}")
            return jsonify({"error": "Error al obtener datos para la vista del estudiante"}), 500

    elif role == "Teacher":
        assignments = requests.get(f"{API_BASE_URL}/api/Courses/{course_id}/assignments", verify=False).json()
        students = requests.get(f"{API_BASE_URL}/api/Courses/{course_id}/students", verify=False).json()
        return render_template('teacher_view.html', user_id=user_id, course_id=course_id, students=students, assignments=assignments, curso=curso, canvas_url=canvas_url)

    else:
        return jsonify({"error": "Role not recognized"}), 400



@app.route('/student/tasks/<user_id>/<course_id>', methods=['GET'])
def student_tasks(user_id, course_id):
    # Simulación de llamada a API para obtener datos de tareas
    try:
        api_url = f"https://localhost:7138/StudentTasks/{user_id}/pending-tasks"
        response = requests.get(api_url, verify=False)
        tasks = response.json()

        submitted_tasks = [task for task in tasks if task['isSubmitted']]
        not_submitted_tasks = [task for task in tasks if not task['isSubmitted']]

        return render_template(
            'student_tasks.html',
            submitted_tasks=submitted_tasks,
            not_submitted_tasks=not_submitted_tasks,
            course_id=course_id
        )
    except Exception as e:
        return jsonify({"error": "Failed to fetch tasks", "details": str(e)}), 500

@app.route('/teacher/tasks/<course_id>', methods=['GET'])
def teacher_tasks(course_id):
    try:
        # Obtener actividades
        activities_api = f"https://localhost:7138/api/Courses/{course_id}/assignments"
        activities_response = requests.get(activities_api, verify=False)
        activities = activities_response.json()

        # Obtener estudiantes
        students_api = f"https://localhost:7138/api/Courses/{course_id}/students"
        students_response = requests.get(students_api, verify=False)
        students = students_response.json()

        # Renderizar la plantilla del profesor
        return render_template(
            'teacher_view.html',
            course_id=course_id,
            activities=activities,
            students=students
        )
    except Exception as e:
        return jsonify({"error": "Failed to fetch data for teacher", "details": str(e)}), 500
@app.route('/teacher/student-dashboard')
def student_dashboard():
    course_id = request.args.get('course_id')
    student_id = request.args.get('student_id')

    if not course_id or not student_id:
        return "Course ID or Student ID not provided", 400

    # Inicializa las variables
    student_name_data = None
    grades_data = None

    try:
        # Consulta al API para obtener datos del estudiante (nombre)
        student_name_response = requests.get(f"https://localhost:7138/api/Courses/users/{student_id}/name", verify=False)
        student_name_data = student_name_response.json() if student_name_response.status_code == 200 else None

        # Consulta al API para obtener calificaciones
        grades_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/students/{student_id}/grades", verify=False)
        grades_data = grades_response.json() if grades_response.status_code == 200 else None

    except Exception as e:
        print(f"Error al obtener datos de las APIs: {e}")

    return render_template(
        'student_dashboard.html',
        student_name_data=student_name_data,
        grades_data=grades_data,
        student_id=student_id,
        lti_url=LTI_URL,
        courseID = course_id
    )

@app.route('/teacher/task-dashboard')
def task_dashboard():
    course_id = request.args.get('course_id')
    task_id = request.args.get('task_id')

    if not course_id or not task_id:
        return "Course ID or Task ID not provided", 400

    # Inicializa las variables
    submission_summary = None
    histogram_data = None

    try:
        # Consulta al API para el histograma
        histogram_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/tasks/{task_id}/submission-histogram", verify=False)
        histogram_data = histogram_response.json() if histogram_response.status_code == 200 else None

        #Numero de estudiantes:
        students_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/students", verify=False)
        student_number = len(students_response.json() if students_response.status_code == 200 else [])
        
        # Consulta al API para el resumen
        summary_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/tasks/{task_id}/submission-summary", verify=False)
        submission_summary = summary_response.json() if summary_response.status_code == 200 else None

        # Consulta al API para obtener calificaciones
        grades_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/assignments/{task_id}/analytics", verify=False)
        grades_data = grades_response.json() if grades_response.status_code == 200 else None

        notsubmitted_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/tasks/{task_id}/not-submitted", verify=False)
        not_submitted = notsubmitted_response.json() if notsubmitted_response.status_code == 200 else None

        nombre_curso = requests.get(f"https://localhost:7138/api/Courses/{course_id}", verify=False)
        nombre_curso = nombre_curso.json() if nombre_curso.status_code == 200 else None
        nombre_curso = nombre_curso['name']

        tarea = requests.get(f"https://localhost:7138/api/Courses/{course_id}/assignments/{task_id}/name", verify=False)
        tarea_name = tarea.json() if tarea.status_code == 200 else None
        nombre_tarea = tarea_name['assignmentName']
        



    except Exception as e:
        print(f"Error al obtener datos de las APIs: {e}")

    return render_template(
        'assignment_dashboard.html',
        course_id=course_id,
        task_id=task_id,
        histogram_data=histogram_data,
        submission_summary=submission_summary,
        grades_data=grades_data,
        not_submitted=not_submitted,
        student_number=student_number,
        name = nombre_curso,
        taskName = nombre_tarea
    )

@app.route('/teacher/course-dashboard')
def course_dashboard():
    course_id = request.args.get('course_id')
    if not course_id:
        return "Course ID not provided", 400

    try:
        # Consulta al API para obtener promedios de tareas
        averages_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/assignments/averages", verify=False)
        averages_data = averages_response.json() if averages_response.status_code == 200 else []

        # Función para obtener las calificaciones de una tarea
        calificaciones_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/assignments/full-analytics", verify=False)
        calificaciones = calificaciones_response.json() if calificaciones_response.status_code == 200 else []

        # Obtener el número de estudiantes
        students_response = requests.get(f"https://localhost:7138/api/Courses/{course_id}/students", verify=False)
        student_number = len(students_response.json() if students_response.status_code == 200 else [])
        student_grades_averages = requests.get(f"https://localhost:7138/api/Courses/{course_id}/students/averages", verify=False)
        student_grades_averages = student_grades_averages.json() if student_grades_averages.status_code == 200 else []
        average_by_group = requests.get(f"https://localhost:7138/api/Courses/{course_id}/average-by-group", verify=False)
        average_by_group = average_by_group.json() if average_by_group.status_code == 200 else []
        student_list = requests.get(f"https://localhost:7138/api/Courses/{course_id}/students", verify=False)
        student_list = student_list.json() if student_list.status_code == 200 else None
        task_list = requests.get(f"https://localhost:7138/api/Courses/{course_id}/assignments", verify=False)
        task_list = task_list.json() if task_list.status_code == 200 else None
        nombre_curso = requests.get(f"https://localhost:7138/api/Courses/{course_id}", verify=False)
        nombre_curso = nombre_curso.json() if nombre_curso.status_code == 200 else None
        nombre_curso = nombre_curso['name']

    except Exception as e:
        print(f"Course Dashboard Error al obtener datos de las APIs: {e}")
        return "Error al comunicarse con el backend", 500

    return render_template(
        'course_dashboard.html',
        student_list = student_list,
        course_id=course_id,
        averages_data=averages_data,
        calificaciones=calificaciones,
        student_number=student_number,
        student_averages = student_grades_averages,
        average_by_group = average_by_group,
        task_list = task_list,
        name = nombre_curso
    )

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        # Extraer los datos enviados al intermediario
        data = request.get_json()

        # Verificar que los datos necesarios estén presentes
        if not data or 'userId' not in data or 'subject' not in data or 'body' not in data:
            return jsonify({"error": "Invalid input data"}), 400

        # Enviar la solicitud al endpoint externo
        external_response = requests.post(
            "https://localhost:7138/api/Courses/send-message",
            headers={"Content-Type": "application/json"},
            json=data,
            verify=False  # Si estás usando un certificado autofirmado, puedes desactivarlo
        )

        # Retornar la respuesta del endpoint externo
        return jsonify(external_response.json()), external_response.status_code

    except Exception as e:
        return jsonify({"error": "Failed to send message", "details": str(e)}), 500


# Inicia la aplicación
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
