using CanvasAnalytics.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace CanvasAnalytics.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        [HttpGet("{taskId}")]
        public IActionResult GetTaskStatistics(int taskId)
        {
            // Simulación de datos (puedes reemplazar con datos reales más adelante)
            var statistics = new TaskStatistics
            {
                TaskName = "Deber 1 Programación 2",
                StartDate = new DateTime(2024, 10, 2),
                EndDate = new DateTime(2024, 10, 19),
                StudentsSubmitted = 39,
                StudentsNotSubmitted = 1,
                SubmissionHistory = new List<SubmissionHistory>
                {
                    new SubmissionHistory { Date = new DateTime(2024, 10, 2), Submissions = 5 },
                    new SubmissionHistory { Date = new DateTime(2024, 10, 3), Submissions = 10 },
                    new SubmissionHistory { Date = new DateTime(2024, 10, 10), Submissions = 15 },
                    new SubmissionHistory { Date = new DateTime(2024, 10, 18), Submissions = 9 },
                }
            };

            return Ok(statistics);
        }
    }
}





