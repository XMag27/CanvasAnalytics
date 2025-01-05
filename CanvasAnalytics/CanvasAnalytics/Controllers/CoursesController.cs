using Microsoft.AspNetCore.Mvc;
using CanvasAnalytics.Services;
using CanvasAnalytics.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly CanvasApiService _canvasApiService;

    public CoursesController(CanvasApiService canvasApiService)
    {
        _canvasApiService = canvasApiService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        try
        {
            var courses = await _canvasApiService.GetCoursesAsync();
            return Ok(courses);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new
            {
                error = "Error al conectar con la API de Canvas",
                details = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Ocurrió un error inesperado",
                details = ex.Message
            });
        }
    }

    [HttpGet("{courseId}/students")]
    public async Task<IActionResult> GetStudents(int courseId)
    {
        try
        {
            var students = await _canvasApiService.GetStudentsAsync(courseId);
            return Ok(students);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new
            {
                error = "Error al conectar con la API de Canvas",
                details = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Ocurrió un error inesperado",
                details = ex.Message
            });
        }
    }

    [HttpGet("{courseId}/assignments")]
    public async Task<IActionResult> GetAssignments(int courseId)
    {
        try
        {
            var assignments = await _canvasApiService.GetAssignmentsAsync(courseId);
            return Ok(assignments);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new
            {
                error = "Error al conectar con la API de Canvas",
                details = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Ocurrió un error inesperado",
                details = ex.Message
            });
        }
    }

    [HttpGet("{courseId}/tasks/{taskId}/grades")]
    public async Task<IActionResult> GetGrades(int courseId, int taskId)
    {
        try
        {
            var grades = await _canvasApiService.GetGradesAsync(courseId, taskId);

            return Ok(grades);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Error al obtener las calificaciones",
                details = ex.Message
            });
        }
    }

    [HttpGet("{courseId}/tasks/{taskId}/submission-histogram")]
    public async Task<IActionResult> GetSubmissionHistogram(int courseId, int taskId)
    {
        try
        {
            Console.WriteLine($"Solicitud para curso {courseId}, tarea {taskId}");

            // Obtener todas las entregas
            var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, taskId);

            Console.WriteLine($"Total de entregas recibidas: {submissions.Count}");

            // Imprimir cada submission para depuración
            foreach (var submission in submissions)
            {
                Console.WriteLine($"Submission: {JsonConvert.SerializeObject(submission)}");
            }

            // Agrupar solo las entregas que no están en estado "unsubmitted"
            var histogram = submissions
                .Where(s => s.WorkflowState != "unsubmitted" && s.SubmittedAt.HasValue) // Filtrar WorkflowState y verificar fecha
                .GroupBy(s => s.SubmittedAt.Value.Date) // Agrupar por fecha
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"), // Formatear fecha
                    Count = g.Count() // Contar entregas por fecha
                })
                .OrderBy(h => h.Date) // Ordenar por fecha ascendente
                .ToList();

            Console.WriteLine($"Histograma generado: {JsonConvert.SerializeObject(histogram)}");
            return Ok(histogram);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en el histograma: {ex.Message}");
            return StatusCode(500, new
            {
                error = "Error al generar el histograma de entregas",
                details = ex.Message
            });
        }
    }



    [HttpGet("{courseId}/tasks/{taskId}/submission-summary")]
    public async Task<IActionResult> GetSubmissionSummary(int courseId, int taskId)
    {
        try
        {
            Console.WriteLine($"Solicitud para curso {courseId}, tarea {taskId}");

            // Obtener todas las entregas
            var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, taskId);

            // Contar entregados y no entregados
            var submittedCount = submissions.Count(s => s.WorkflowState != "unsubmitted");
            var notSubmittedCount = submissions.Count(s => s.WorkflowState == "unsubmitted");

            // Calcular porcentaje
            double completionPercentage = submissions.Any()
                ? (double)submittedCount / submissions.Count * 100
                : 0.0;

            // Resumen
            var summary = new
            {
                Submitted = submittedCount,
                NotSubmitted = notSubmittedCount,
                CompletionPercentage = completionPercentage // Porcentaje de entregas cumplidas
            };

            Console.WriteLine($"Resumen de entregas generado: {JsonConvert.SerializeObject(summary)}");
            return Ok(summary);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en el resumen: {ex.Message}");
            return StatusCode(500, new
            {
                error = "Error al obtener el resumen de entregas",
                details = ex.Message
            });
        }
    }


    [HttpGet("{courseId}/assignments/{assignmentId}/analytics")]
    public async Task<IActionResult> GetAssignmentAnalytics(int courseId, int assignmentId)
    {
        try
        {
            // Obtener detalles de la asignación
            var assignment = await _canvasApiService.GetAssignmentDetailsAsync(courseId, assignmentId);

            // Obtener entregas
            var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, assignmentId);

            // Diccionario para cachear los nombres de los usuarios
            var userCache = new Dictionary<int, string>();

            // Calcular calificaciones ponderadas
            var analytics = new List<object>();

            foreach (var submission in submissions.Where(s => s.Score.HasValue))
            {
                // Verificar si ya tenemos el nombre del usuario
                if (!userCache.TryGetValue(submission.UserId, out var userName))
                {
                    var user = await _canvasApiService.GetUserAsync(submission.UserId);
                    userName = user.Name;
                    userCache[submission.UserId] = userName; // Cachear el nombre
                }

                // Añadir al resultado
                analytics.Add(new
                {
                    SubmissionId = submission.Id,
                    UserId = submission.UserId,
                    UserName = userName,
                    RawScore = submission.Score,
                    PointsPossible = assignment.PointsPossible,
                    WeightedScore = (submission.Score.Value / assignment.PointsPossible) * 100
                });
            }

            return Ok(analytics);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en la analítica de la tarea: {ex.Message}");
            return StatusCode(500, new
            {
                error = "Error al calcular la analítica de la tarea",
                details = ex.Message
            });
        }
    }
    [HttpPost("send-message")]
    public async Task<IActionResult> SendMessage([FromBody] InstantMessageRequest request)
    {
        try
        {
            var success = await _canvasApiService.SendMessageAsync(request.UserId, request.Subject, request.Body);

            if (success)
            {
                return Ok(new { message = "Mensaje enviado exitosamente." });
            }
            else
            {
                return StatusCode(500, new { error = "No se pudo enviar el mensaje." });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al enviar el mensaje: {ex.Message}");
            return StatusCode(500, new { error = "Error al enviar el mensaje", details = ex.Message });
        }
    }
    [HttpGet("{courseId}/assignments/averages")]
    public async Task<IActionResult> GetAssignmentAverages(int courseId)
    {
        try
        {
            Console.WriteLine($"Iniciando cálculo de promedios para el curso {courseId}");

            // Obtener las actividades del curso
            var assignments = await _canvasApiService.GetCourseAssignmentsAsync(courseId);
            Console.WriteLine($"Número de actividades obtenidas: {assignments.Count}");

            // Obtener los grupos de asignación del curso
            var assignmentGroups = await _canvasApiService.GetAssignmentGroupsAsync(courseId);
            Console.WriteLine($"Número de grupos de asignación obtenidos: {assignmentGroups.Count}");

            var averages = new List<object>();

            foreach (var assignment in assignments)
            {
                Console.WriteLine($"Procesando actividad: {assignment.Name} (ID: {assignment.Id})");

                // Obtener las entregas de la actividad
                var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, assignment.Id);
                Console.WriteLine($"Número de entregas obtenidas para la actividad {assignment.Id}: {submissions.Count}");

                // Obtener el nombre del grupo de asignación
                var assignmentGroup = assignmentGroups.FirstOrDefault(g => g.Id == assignment.AssignmentGroupId);
                var assignmentGroupName = assignmentGroup?.Name ?? "Sin grupo";

                // Filtrar entregas con puntuación válida
                var validSubmissions = submissions.Where(s => s.Score.HasValue).ToList();

                if (validSubmissions.Any())
                {
                    // Calcular el promedio total
                    var totalAverage = validSubmissions.Average(s => s.Score.Value);
                    Console.WriteLine($"Promedio total para la actividad {assignment.Id}: {totalAverage}");

                    // Calcular el promedio ponderado
                    var weightedAverage = totalAverage / assignment.PointsPossible * 100;
                    Console.WriteLine($"Promedio ponderado para la actividad {assignment.Id}: {weightedAverage}");

                    averages.Add(new
                    {
                        AssignmentId = assignment.Id,
                        AssignmentName = assignment.Name,
                        AssignmentGroup = assignmentGroupName, // Añadir el nombre del grupo
                        TotalAverage = totalAverage,
                        WeightedAverage = weightedAverage
                    });
                }
                else
                {
                    Console.WriteLine($"No hay entregas válidas para la actividad {assignment.Id}. Asignando promedios en 0.");

                    averages.Add(new
                    {
                        AssignmentId = assignment.Id,
                        AssignmentName = assignment.Name,
                        AssignmentGroup = assignmentGroupName, // Añadir el nombre del grupo
                        TotalAverage = 0.0,
                        WeightedAverage = 0.0
                    });
                }
            }

            Console.WriteLine($"Promedios calculados exitosamente para el curso {courseId}");
            return Ok(averages);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener los promedios de las actividades: {ex.Message}");
            return StatusCode(500, new { error = "Error al obtener los promedios", details = ex.Message });
        }
    }

    [HttpGet("{courseId}/students/{studentId}/grades")]
    public async Task<IActionResult> GetStudentGrades(int courseId, int studentId)
    {
        try
        {
            Console.WriteLine($"Obteniendo calificaciones para el estudiante {studentId} en el curso {courseId}");

            // Obtener las actividades del curso
            var assignments = await _canvasApiService.GetCourseAssignmentsAsync(courseId);

            // Obtener los grupos de asignación del curso
            var assignmentGroups = await _canvasApiService.GetAssignmentGroupsAsync(courseId);
            Console.WriteLine($"Número de grupos de asignación obtenidos: {assignmentGroups.Count}");

            var grades = new List<object>();

            foreach (var assignment in assignments)
            {
                // Obtener las entregas del estudiante para la actividad
                var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, assignment.Id);
                var studentSubmission = submissions.FirstOrDefault(s => s.UserId == studentId);

                // Si no entregó, asignar 0; si entregó, usar la calificación
                var grade = studentSubmission != null && studentSubmission.Score.HasValue
                    ? studentSubmission.Score.Value
                    : 0.0;

                // Calcular la calificación ponderada
                var weightedGrade = assignment.PointsPossible > 0
                    ? (grade / assignment.PointsPossible) * 100
                    : 0.0;

                // Obtener el nombre del grupo al que pertenece la actividad
                var assignmentGroup = assignmentGroups.FirstOrDefault(g => g.Id == assignment.AssignmentGroupId);
                var assignmentGroupName = assignmentGroup?.Name ?? "Sin grupo";

                grades.Add(new
                {
                    AssignmentId = assignment.Id,
                    AssignmentName = assignment.Name,
                    AssignmentGroup = assignmentGroupName, // Nombre del grupo
                    Grade = grade,
                    MaxPoints = assignment.PointsPossible,
                    WeightedGrade = weightedGrade // Calificación ponderada
                });

                Console.WriteLine($"Calificación para la actividad {assignment.Name} en el grupo {assignmentGroupName}: {grade}, Ponderada: {weightedGrade}");
            }

            return Ok(grades);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener las calificaciones: {ex.Message}");
            return StatusCode(500, new { error = "Error al obtener las calificaciones", details = ex.Message });
        }
    }



}

