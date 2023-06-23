using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Models;

[Table("broadcast")]
[Index("Name", Name = "UQ__broadcas__72E12F1B47E71398", IsUnique = true)]
public partial class Broadcast
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [InverseProperty("Broadcast")]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
