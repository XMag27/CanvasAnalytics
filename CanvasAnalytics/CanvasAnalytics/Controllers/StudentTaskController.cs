using Microsoft.AspNetCore.Mvc;
using CanvasAnalytics.Services;
using CanvasAnalytics.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http;

[ApiController]
[Route("[controller]")]
public class StudentTasksController : ControllerBase
{
    private readonly CanvasApiService _canvasApiService;

    public StudentTasksController(CanvasApiService canvasApiService)
    {
        _canvasApiService = canvasApiService;
    }

    [HttpGet("{studentId}/pending-tasks")]
    public async Task<IActionResult> GetPendingTasks(int studentId)
    {
        try
        {
            // Obtener los cursos del estudiante
            var courses = await _canvasApiService.GetStudentCoursesAsync(studentId);

            var pendingTasks = new List<PendingTask>();

            // Obtener las tareas pendientes para cada curso
            foreach (var course in courses)
            {
                var assignments = await _canvasApiService.GetCourseAssignmentsAsync(course.Id);

                foreach (var assignment in assignments)
                {
                    if (assignment.DueDate.HasValue && assignment.DueDate > DateTime.Now)
                    {
                        var completionPercentage = await _canvasApiService.GetAssignmentCompletionPercentageAsync(course.Id, assignment.Id);

                        pendingTasks.Add(new PendingTask
                        {
                            CourseId = course.Id,
                            AssignmentId = assignment.Id,
                            AssignmentName = assignment.Name,
                            DueDate = assignment.DueDate,
                            WorkflowState = assignment.WorkflowState,
                            CompletionPercentage = completionPercentage
                        });
                    }
                }
            }

            return Ok(pendingTasks);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener las tareas pendientes: {ex.Message}");
            return StatusCode(500, new { error = "Error al obtener las tareas pendientes", details = ex.Message });
        }
    }
}
