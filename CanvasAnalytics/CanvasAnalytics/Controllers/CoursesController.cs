﻿using Microsoft.AspNetCore.Mvc;
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
    private readonly HttpClient _httpClient;

    public CoursesController(CanvasApiService canvasApiService, HttpClient httpClient)
    {
        _canvasApiService = canvasApiService;
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("http://canvas.docker/api/v1/");
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
    [HttpGet("{courseId}/assignments/grades")]
    public async Task<IActionResult> ObtenerCalificacionesCurso(int courseId)
    {
        try
        {
            var url = $"courses/{courseId}/assignments";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Error en la respuesta: {response.StatusCode}, Contenido: {errorContent}");
                return StatusCode((int)response.StatusCode, "Error al obtener las tareas.");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var assignments = JsonConvert.DeserializeObject<List<Assignment>>(jsonResponse);

            return Ok(assignments);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al procesar la solicitud: {ex.Message}");
            return StatusCode(500, "Error interno del servidor.");
        }
    }
    [HttpGet("{courseId}")]
    public async Task<IActionResult> GetCourseById(int courseId)
    {
        try
        {
            // Obtiene los datos del curso desde el servicio
            var course = await _canvasApiService.GetCourseByIdAsync(courseId);

            // Retorna la información del curso
            return Ok(course);
        }
        catch (HttpRequestException ex)
        {
            // Maneja errores de red o respuesta HTTP no exitosa
            return StatusCode(500, new
            {
                error = "Error al conectar con la API de Canvas",
                details = ex.Message
            });
        }
        catch (Exception ex)
        {
            // Maneja errores generales
            return StatusCode(500, new
            {
                error = "Ocurrió un error inesperado",
                details = ex.Message
            });
        }
    }

    [HttpGet("{courseId}/tasks/{taskId}/not-submitted")]
    public async Task<IActionResult> GetNotSubmittedStudents(int courseId, int taskId)
    {
        try
        {
            var notSubmittedStudents = await _canvasApiService.GetNotSubmittedStudentsAsync(courseId, taskId);

            return Ok(notSubmittedStudents);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Error al obtener la lista de estudiantes que no entregaron",
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
            // Obtener las actividades del curso
            var assignments = await _canvasApiService.GetAssignmentsAsync(courseId);

            // Obtener los grupos de asignación del curso
            var assignmentGroups = await _canvasApiService.GetAssignmentGroupsAsync(courseId);

            // Mapear cada actividad con el nombre del grupo de asignación
            var assignmentsWithGroups = assignments.Select(assignment =>
            {
                var group = assignmentGroups.FirstOrDefault(g => g.Id == assignment.AssignmentGroupId);
                return new
                {
                    assignment.Id,
                    assignment.Name,
                    assignment.DueDate,
                    assignment.PointsPossible,
                    AssignmentGroup = group?.Name ?? "Sin grupo"
                };
            });

            return Ok(assignmentsWithGroups);
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

    [HttpGet("{courseId}/assignments/grouped")]
    public async Task<IActionResult> GetAssignmentsGroupedByGroup(int courseId)
    {
        try
        {
            // Obtener los grupos de asignación del curso
            var assignmentGroups = await _canvasApiService.GetAssignmentGroupsAsync(courseId);

            // Obtener las tareas del curso
            var assignments = await _canvasApiService.GetAssignmentsAsync(courseId);

            // Crear la estructura agrupada
            var groupedAssignments = assignmentGroups.Select(group => new
            {
                AssignmentGroupId = group.Id,
                AssignmentGroupName = group.Name,
                Assignments = assignments
                    .Where(assignment => assignment.AssignmentGroupId == group.Id)
                    .Select(assignment => new
                    {
                        assignment.Id,
                        assignment.Name,
                        assignment.DueDate,
                        assignment.PointsPossible
                    }).ToList()
            }).ToList();

            // Agregar un grupo "Sin grupo" si hay tareas sin asignar
            var ungroupedAssignments = assignments
                .Where(assignment => assignment.AssignmentGroupId == null || !assignmentGroups.Any(g => g.Id == assignment.AssignmentGroupId))
                .Select(assignment => new
                {
                    assignment.Id,
                    assignment.Name,
                    assignment.DueDate,
                    assignment.PointsPossible
                }).ToList();

            if (ungroupedAssignments.Any())
            {
                groupedAssignments.Add(new
                {
                    AssignmentGroupId = 0,
                    AssignmentGroupName = "Sin grupo",
                    Assignments = ungroupedAssignments
                });
            }

            return Ok(groupedAssignments);
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

    [HttpGet("{courseId}/tasks/{taskId}/submission-summary-2")]
    public async Task<IActionResult> GetSubmissionSummary2(int courseId, int taskId)
    {
        try
        {
            Console.WriteLine($"Solicitud para curso {courseId}, tarea {taskId}");

            // Obtener todas las entregas
            var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, taskId);

            // Filtrar entregas válidas y no entregadas según el estado
            var submittedStudents = submissions.Where(s => s.WorkflowState != "unsubmitted").ToList();
            var notSubmittedStudents = submissions.Where(s => s.WorkflowState == "unsubmitted").ToList();

            // Calcular conteos
            var submittedCount = submittedStudents.Count;
            var notSubmittedCount = notSubmittedStudents.Count;

            // Obtener estudiantes adicionales no entregados de otra fuente
            var additionalNotSubmitted = await _canvasApiService.GetNotSubmittedStudentsAsync(courseId, taskId);

            // Combinar y eliminar duplicados
            var additionalNotSubmittedIds = additionalNotSubmitted.Select(s => s.Id).ToHashSet();
            var submittedIds = submittedStudents.Select(s => s.UserId).ToHashSet();
            var duplicateIds = submittedIds.Intersect(additionalNotSubmittedIds).ToList();

            // Excluir duplicados de la lista de estudiantes adicionales no entregados
            var filteredNotSubmittedStudents = additionalNotSubmitted
                .Where(s => !duplicateIds.Contains(s.Id))
                .Select(s => new
                {
                    s.Id,
                    s.Name
                });

            // Calcular porcentaje
            double completionPercentage = submissions.Any()
                ? (double)submittedCount / submissions.Count * 100
                : 0.0;

            // Resumen
            var summary = new
            {
                Submitted = submittedCount,
                NotSubmitted = filteredNotSubmittedStudents.Count(),
                CompletionPercentage = completionPercentage, // Porcentaje de entregas cumplidas
                SubmittedStudents = submittedStudents, // Lista de estudiantes que sí entregaron
                NotSubmittedStudents = filteredNotSubmittedStudents, // Lista de estudiantes sin duplicados
                DuplicateIds = duplicateIds // IDs duplicados
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







    [HttpGet("{courseId}/assignments/{taskId}/name")]
    public async Task<IActionResult> GetAssignmentName(int courseId, int taskId)
    {
        try
        {
            Console.WriteLine($"Obteniendo nombre de la tarea {taskId} del curso {courseId}");

            // Llamar al servicio para obtener los datos de la tarea
            var assignment = await _canvasApiService.GetAssignmentByIdAsync(courseId, taskId);

            if (assignment == null)
            {
                return NotFound(new { message = $"La tarea con ID {taskId} no fue encontrada en el curso {courseId}" });
            }

            // Retornar el nombre de la tarea
            return Ok(new { assignmentName = assignment.Name });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener el nombre de la tarea: {ex.Message}");
            return StatusCode(500, new { error = "Ocurrió un error al obtener el nombre de la tarea", details = ex.Message });
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

    [HttpGet("{courseId}/assignments/full-analytics")]
    public async Task<IActionResult> GetFullAssignmentAnalytics(int courseId)
    {
        try
        {
            Console.WriteLine($"Obteniendo datos completos de analítica para el curso {courseId}");

            // Obtener las asignaciones
            var assignments = await _canvasApiService.GetCourseAssignmentsAsync(courseId);

            // Diccionario para cachear los nombres de los usuarios
            var userCache = new Dictionary<int, string>();

            // Lista final de resultados
            var result = new List<object>();

            foreach (var assignment in assignments)
            {
                Console.WriteLine($"Procesando asignación: {assignment.Name} (ID: {assignment.Id})");

                // Obtener entregas para la asignación
                var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, assignment.Id);

                // Procesar las calificaciones
                var calificaciones = submissions.Where(s => s.Score.HasValue).Select(async submission =>
                {
                    // Obtener el nombre del usuario desde el caché o el API
                    if (!userCache.TryGetValue(submission.UserId, out var userName))
                    {
                        var user = await _canvasApiService.GetUserAsync(submission.UserId);
                        userName = user.Name;
                        userCache[submission.UserId] = userName;
                    }

                    return new
                    {
                        submissionId = submission.Id,
                        userId = submission.UserId,
                        userName = userName,
                        rawScore = submission.Score,
                        pointsPossible = assignment.PointsPossible,
                        weightedScore = (submission.Score.Value / assignment.PointsPossible) * 100
                    };
                });

                // Añadir los resultados al objeto final
                result.Add(new
                {
                    id_tarea = assignment.Id,
                    nombre_tarea = assignment.Name,
                    calificaciones = await Task.WhenAll(calificaciones) // Resolver tareas paralelas
                });
            }

            Console.WriteLine("Datos completos de analítica generados exitosamente.");
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al generar la analítica completa: {ex.Message}");
            return StatusCode(500, new { error = "Error al generar la analítica completa", details = ex.Message });
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

    [HttpGet("{courseId}/students/averages")]
    public async Task<IActionResult> GetStudentsAveragesByGroup(int courseId)
    {
        try
        {
            Console.WriteLine($"Obteniendo promedios para todos los estudiantes en el curso {courseId}");

            // Obtener las actividades y los grupos de asignación del curso
            var assignments = await _canvasApiService.GetCourseAssignmentsAsync(courseId);
            var assignmentGroups = await _canvasApiService.GetAssignmentGroupsAsync(courseId);
            var students = await _canvasApiService.GetStudentsAsync(courseId);

            // Prepara un diccionario para grupos de tareas
            var assignmentGroupMap = assignmentGroups.ToDictionary(g => g.Id, g => g.Name ?? "Sin grupo");

            // Diccionario para almacenar las entregas de cada tarea
            var allSubmissions = new Dictionary<int, List<Submission>>();

            foreach (var assignment in assignments)
            {
                // Obtener todas las entregas para cada tarea y almacenarlas con su ID
                var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, assignment.Id);
                allSubmissions[assignment.Id] = submissions.ToList();
            }

            // Crear un listado para almacenar los resultados
            var studentAverages = students.Select(student =>
            {
                var groupGrades = assignmentGroups.ToDictionary(
                    group => group.Name,
                    group => new { TotalScore = 0.0, TotalPoints = 0.0 }
                );

                double totalScore = 0.0;
                double totalPoints = 0.0;

                foreach (var assignment in assignments)
                {
                    if (!allSubmissions.TryGetValue(assignment.Id, out var submissions)) continue;

                    // Filtrar las entregas del estudiante
                    var studentSubmission = submissions.FirstOrDefault(s => s.UserId == student.Id);

                    // Calcular la calificación obtenida
                    var grade = studentSubmission?.Score ?? 0.0;

                    // Acumular los puntos posibles y los puntos obtenidos
                    totalScore += grade;
                    totalPoints += assignment.PointsPossible;

                    // Obtener el nombre del grupo de la tarea
                    var groupName = assignmentGroupMap.ContainsKey(assignment.AssignmentGroupId)
                        ? assignmentGroupMap[assignment.AssignmentGroupId]
                        : "Sin grupo";

                    // Actualizar puntajes del grupo
                    if (groupGrades.ContainsKey(groupName))
                    {
                        groupGrades[groupName] = new
                        {
                            TotalScore = groupGrades[groupName].TotalScore + grade,
                            TotalPoints = groupGrades[groupName].TotalPoints + assignment.PointsPossible
                        };
                    }
                }

                // Calcular promedios por grupo
                var averagesByGroup = groupGrades.ToDictionary(
                    g => g.Key,
                    g => g.Value.TotalPoints > 0 ? (g.Value.TotalScore / g.Value.TotalPoints) * 100 : 0.0
                );

                // Calcular el promedio general
                var overallAverage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0.0;

                return new
                {
                    StudentId = student.Id,
                    StudentName = student.Name,
                    AveragesByGroup = averagesByGroup,
                    OverallAverage = overallAverage
                };
            }).ToList();

            return Ok(studentAverages);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener los promedios de los estudiantes: {ex.Message}");
            return StatusCode(500, new { error = "Error al obtener los promedios de los estudiantes", details = ex.Message });
        }
    }



    [HttpGet("{courseId}/average-by-group")]
    public async Task<IActionResult> GetAverageByGroupForCourse(int courseId)
    {
        try
        {
            Console.WriteLine($"Calculando promedio por grupo de actividades para el curso {courseId}");

            // Obtener las actividades del curso
            var assignments = await _canvasApiService.GetCourseAssignmentsAsync(courseId);

            // Obtener los grupos de asignación del curso
            var assignmentGroups = await _canvasApiService.GetAssignmentGroupsAsync(courseId);
            Console.WriteLine($"Número de grupos de asignación obtenidos: {assignmentGroups.Count}");

            // Inicializar acumuladores para los promedios por grupo
            var groupAverages = assignmentGroups.ToDictionary(
                group => group.Name,
                group => new { TotalWeightedScore = 0.0, TotalAssignments = 0 }
            );

            foreach (var assignment in assignments)
            {
                // Obtener el grupo al que pertenece la actividad
                var assignmentGroup = assignmentGroups.FirstOrDefault(g => g.Id == assignment.AssignmentGroupId);
                var groupName = assignmentGroup?.Name ?? "Sin grupo";

                // Obtener todas las entregas de la actividad
                var submissions = await _canvasApiService.GetSubmissionsAsync(courseId, assignment.Id);

                foreach (var submission in submissions)
                {
                    // Calcular la calificación ponderada
                    var grade = submission.Score.HasValue ? submission.Score.Value : 0.0;
                    var weightedGrade = assignment.PointsPossible > 0
                        ? (grade / assignment.PointsPossible) * 100
                        : 0.0;

                    // Acumular los valores en el grupo correspondiente
                    if (groupAverages.ContainsKey(groupName))
                    {
                        groupAverages[groupName] = new
                        {
                            TotalWeightedScore = groupAverages[groupName].TotalWeightedScore + weightedGrade,
                            TotalAssignments = groupAverages[groupName].TotalAssignments + 1
                        };
                    }
                }
            }

            // Calcular los promedios finales por grupo
            var result = groupAverages.ToDictionary(
                g => g.Key,
                g => g.Value.TotalAssignments > 0 ? g.Value.TotalWeightedScore / g.Value.TotalAssignments : 0.0
            );

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al calcular los promedios por grupo de actividades: {ex.Message}");
            return StatusCode(500, new { error = "Error al calcular los promedios por grupo", details = ex.Message });
        }
    }


    [HttpGet("users/{userId}/name")]
    public async Task<IActionResult> GetUserName(int userId)
    {
        try
        {
            // Llamar al servicio que obtiene información del usuario
            var user = await _canvasApiService.GetUserAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = $"Usuario con ID {userId} no encontrado." });
            }

            // Retornar el nombre del usuario
            return Ok(new { userId = user.Id, userName = user.Name });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Error al obtener el nombre del usuario",
                details = ex.Message
            });
        }
    }


}

