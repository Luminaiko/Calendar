using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Models;

[Table("doctor")]
public partial class Doctor
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(30)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [Column("surname")]
    [StringLength(30)]
    [Unicode(false)]
    public string Surname { get; set; } = null!;

    [Column("title")]
    [StringLength(30)]
    [Unicode(false)]
    public string Title { get; set; } = null!;

    [Column("cabinet")]
    public int Cabinet { get; set; }
}
