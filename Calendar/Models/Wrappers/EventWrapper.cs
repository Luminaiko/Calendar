namespace Calendar.Models.Wrappers
{
    public class EventWrapper
    {
        public DateTime Date { get; set; }
        public string TimeStart { get; set; }
        public string TimeEnd { get; set; }
        public int TechSupport { get; set; }
        public int PlatformId { get; set; }
        public int BroadcastId { get; set; }

        public int HallId { get; set; }
    }
}
