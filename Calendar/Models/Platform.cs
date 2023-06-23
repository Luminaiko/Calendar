using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Models;

[Table("platform")]
[Index("Name", Name = "UQ__platform__72E12F1B2152B495", IsUnique = true)]
public partial class Platform
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [InverseProperty("Platform")]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
