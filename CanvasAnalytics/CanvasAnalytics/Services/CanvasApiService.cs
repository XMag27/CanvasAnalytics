using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using CanvasAnalytics.Models;
using System.Diagnostics;
using System.Text.Json;
using System.Text;


namespace CanvasAnalytics.Services
{
    public class CanvasApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _token;

        public CanvasApiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;

            // Configura la BaseAddress
            _httpClient.BaseAddress = new Uri(configuration["CanvasApi:BaseUrl"]);

            // Obtén el token desde la configuración
            _token = configuration["CanvasApi:Token"];

            // Configura los encabezados predeterminados
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        public async Task<Course> GetCourseByIdAsync(int courseId)
        {
            // Construye la URL para el curso específico
            var request = new HttpRequestMessage(HttpMethod.Get, $"courses/{courseId}");

            // Configura los encabezados
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.UserAgent.ParseAdd("CanvasApiClient/1.0");

            // Registro de la solicitud
            Console.WriteLine("---- Solicitud ----");
            Console.WriteLine($"URL: {_httpClient.BaseAddress}{request.RequestUri}");
            foreach (var header in request.Headers)
            {
                Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
            }

            // Enviar la solicitud
            var response = await _httpClient.SendAsync(request);

            // Registro de la respuesta
            Console.WriteLine("---- Respuesta ----");
            Console.WriteLine($"Estado HTTP: {response.StatusCode}");
            foreach (var header in response.Headers)
            {
                Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
            }

            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Contenido: {content}");

            // Manejar errores si el estado no es exitoso
            response.EnsureSuccessStatusCode();

            // Deserializa y retorna los datos
            return JsonConvert.DeserializeObject<Course>(content);
        }
        public async Task<List<Course>> GetCoursesAsync()
        {
            // Crea una solicitud personalizada
            var request = new HttpRequestMessage(HttpMethod.Get, "accounts/1/courses");

            // Configura los encabezados
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.UserAgent.ParseAdd("CanvasApiClient/1.0");

            // Registro de la solicitud
            Console.WriteLine("---- Solicitud ----");
            Console.WriteLine($"URL: {_httpClient.BaseAddress}{request.RequestUri}");
            foreach (var header in request.Headers)
            {
                Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
            }

            // Enviar la solicitud
            var response = await _httpClient.SendAsync(request);

            // Registro de la respuesta
            Console.WriteLine("---- Respuesta ----");
            Console.WriteLine($"Estado HTTP: {response.StatusCode}");
            foreach (var header in response.Headers)
            {
                Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
            }

            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Contenido: {content}");

            // Manejar errores si el estado no es exitoso
            response.EnsureSuccessStatusCode();

            // Deserializa y retorna los datos
            return JsonConvert.DeserializeObject<List<Course>>(content);
        }

        public async Task<List<Student>> GetStudentsAsync(int courseId)
        {
            var response = await _httpClient.GetAsync($"courses/{courseId}/users?enrollment_type[]=student");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Student>>(jsonResponse);
        }

        public async Task<List<Student>> GetNotSubmittedStudentsAsync(int courseId, int taskId)
        {
            try
            {
                // Obtener la lista de estudiantes inscritos en el curso
                Console.WriteLine($"Obteniendo estudiantes para el curso {courseId}...");
                var studentsResponse = await _httpClient.GetAsync($"courses/{courseId}/students");
                studentsResponse.EnsureSuccessStatusCode();
                var studentsJson = await studentsResponse.Content.ReadAsStringAsync();
                var students = JsonConvert.DeserializeObject<List<Student>>(studentsJson);
                Console.WriteLine($"Total de estudiantes inscritos: {students.Count}");

                // Obtener la lista de envíos para la tarea
                Console.WriteLine($"Obteniendo envíos para la tarea {taskId}...");
                var submissionsResponse = await _httpClient.GetAsync($"courses/{courseId}/assignments/{taskId}/submissions");
                submissionsResponse.EnsureSuccessStatusCode();
                var submissionsJson = await submissionsResponse.Content.ReadAsStringAsync();
                var submissions = JsonConvert.DeserializeObject<List<Submission>>(submissionsJson);
                Console.WriteLine($"Total de envíos encontrados: {submissions.Count}");

                // Obtener los IDs de los estudiantes que entregaron la tarea
                var submittedStudentIds = submissions
                    .Where(submission =>
                        submission.WorkflowState == "submitted" ||
                        submission.SubmittedAt != null || // Si hay una fecha de envío
                        submission.SubmissionType != null || // Si hay un tipo de envío
                        (submission.Attachments != null && submission.Attachments.Any())) // Si hay archivos adjuntos
                    .Select(submission => submission.UserId)
                    .ToHashSet();

                Console.WriteLine("IDs de estudiantes que entregaron:");
                foreach (var id in submittedStudentIds)
                {
                    Console.WriteLine($" - {id}");
                }

                // Filtrar los estudiantes que no están en la lista de envíos válidos
                var notSubmittedStudents = students
                    .Where(student => !submittedStudentIds.Contains(student.Id))
                    .ToList();

                Console.WriteLine($"Total de estudiantes que no entregaron: {notSubmittedStudents.Count}");
                foreach (var student in notSubmittedStudents)
                {
                    Console.WriteLine($" - {student.Id}: {student.Name}");
                }

                return notSubmittedStudents;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetNotSubmittedStudentsAsync: {ex.Message}");
                throw;
            }
        }


        public async Task<List<Assignment>> GetAssignmentsAsync(int courseId)
        {
            var response = await _httpClient.GetAsync($"courses/{courseId}/assignments");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Assignment>>(jsonResponse);
        }
        public async Task<List<Grade>> GetGradesAsync(int courseId, int taskId)
        {
            // Construir la URL de la solicitud
            var response = await _httpClient.GetAsync($"courses/{courseId}/assignments/{taskId}/submissions");

            // Asegurarse de que la respuesta sea exitosa
            response.EnsureSuccessStatusCode();

            // Leer el contenido de la respuesta en formato JSON
            var jsonResponse = await response.Content.ReadAsStringAsync();

            // Deserializar el contenido JSON en una lista de objetos Grade
            return JsonConvert.DeserializeObject<List<Grade>>(jsonResponse);
        }
        public async Task<List<Submission>> GetSubmissionsAsync(int courseId, int taskId)
        {
            var url = $"courses/{courseId}/assignments/{taskId}/submissions";
            Console.WriteLine($"URL de solicitud: {url}"); // Imprime la URL

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Error en la respuesta: {response.StatusCode}, Contenido: {errorContent}"); // Log del error
                throw new HttpRequestException($"Error al obtener las entregas. Código: {response.StatusCode}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Respuesta JSON: {jsonResponse}"); // Imprime la respuesta JSON

            return JsonConvert.DeserializeObject<List<Submission>>(jsonResponse);
        }

        public async Task<Assignment> GetAssignmentDetailsAsync(int courseId, int assignmentId)
        {
            var response = await _httpClient.GetAsync($"courses/{courseId}/assignments/{assignmentId}");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<Assignment>(jsonResponse);
        }

        public async Task<User> GetUserAsync(int userId)
        {
            var response = await _httpClient.GetAsync($"users/{userId}");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<User>(jsonResponse);
        }
        public async Task<bool> SendMessageAsync(int userId, string subject, string body)
        {
            var payload = new
            {
                recipients = new[] { userId.ToString() }, // Lista de IDs de usuarios destinatarios
                subject = subject,
                body = body
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            // Llamada al endpoint de mensajes en Canvas
            var response = await _httpClient.PostAsync("conversations", content);

            // Retorna si la solicitud fue exitosa
            return response.IsSuccessStatusCode;
        }

        public async Task<List<Course>> GetStudentCoursesAsync(int studentId)
        {
            var response = await _httpClient.GetAsync($"users/{studentId}/courses");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Course>>(jsonResponse);
        }

        public async Task<List<Assignment>> GetCourseAssignmentsAsync(int courseId)
        {
            var response = await _httpClient.GetAsync($"courses/{courseId}/assignments");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Assignment>>(jsonResponse);
        }
        public async Task<double> GetAssignmentCompletionPercentageAsync(int courseId, int assignmentId)
        {
            var submissions = await GetSubmissionsAsync(courseId, assignmentId);

            

            if (!submissions.Any()) return 0.0;

            var completed = submissions.Count(s => s.WorkflowState != "unsubmitted");
            return (double)completed / submissions.Count * 100;
        }

        public async Task<List<AssignmentGroup>> GetAssignmentGroupsAsync(int courseId)
        {
            var response = await _httpClient.GetAsync($"courses/{courseId}/assignment_groups");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<AssignmentGroup>>(jsonResponse);
        }

        public async Task<Assignment> GetAssignmentByIdAsync(int courseId, int taskId)
        {
            var response = await _httpClient.GetAsync($"courses/{courseId}/assignments/{taskId}");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Assignment>(content);
            }
            return null;
        }


    }
}
