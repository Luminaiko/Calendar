using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Models;

[Table("event")]
public partial class Event
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("hall_id")]
    public int HallId { get; set; }

    [Column("date_start", TypeName = "date")]
    public DateTime DateStart { get; set; }

    [Column("time_start")]
    public TimeSpan TimeStart { get; set; }

    [Column("time_end")]
    public TimeSpan TimeEnd { get; set; }

    [Column("support")]
    public bool Support { get; set; }

    [Column("platform_id")]
    public int? PlatformId { get; set; }

    [Column("broadcast_id")]
    public int? BroadcastId { get; set; }

    [ForeignKey("BroadcastId")]
    [InverseProperty("Events")]
    public virtual Broadcast? Broadcast { get; set; }

    [ForeignKey("HallId")]
    [InverseProperty("Events")]
    public virtual Hall Hall { get; set; } = null!;

    [ForeignKey("PlatformId")]
    [InverseProperty("Events")]
    public virtual Platform? Platform { get; set; }
}
