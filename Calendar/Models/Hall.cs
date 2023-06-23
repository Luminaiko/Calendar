using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Models;

[Table("hall")]
[Index("Name", Name = "UQ__hall__72E12F1BC8D42507", IsUnique = true)]
public partial class Hall
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(20)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [InverseProperty("Hall")]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
