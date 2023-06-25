using Calendar.Data;
using Calendar.Models;
using Calendar.Models.Wrappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Diagnostics;

namespace Calendar.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly CalendarDbContext _db = new CalendarDbContext();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            //Doctor doctor = _db.Doctors.First(x => x.Id == 1);
            List<Hall> halls= _db.Halls.OrderBy(x => x.Id).ToList();

            IndexControllerCombinedModel model = new IndexControllerCombinedModel
            {
                Halls = _db.Halls.OrderBy(x => x.Id).ToList(),
                Platforms = _db.Platforms.OrderBy(x => x.Id).ToList()
            };


            return View(model);
        }

        [HttpPost]
        public IActionResult AddEvent([FromBody] EventWrapper addedEvent)
        {
            Event newEvent = new Event
            {
                DateStart = addedEvent.Date,
                TimeStart = TimeSpan.Parse(addedEvent.TimeStart),
                TimeEnd = TimeSpan.Parse(addedEvent.TimeEnd),
            };

            if (addedEvent.TechSupport == 1)
            {
                newEvent.Support = true;
            }
            else
                newEvent.Support = false;

            //if (addedEvent.PlatformId == 0)
            //    newEvent.PlatformId = 0;
            //else
            //    newEvent.Support = false;
            return Json(1);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}