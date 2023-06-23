using System;
using System.Collections.Generic;
using Calendar.Models;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Data;

public partial class CalendarDbContext : DbContext
{
    public CalendarDbContext()
    {
    }

    public CalendarDbContext(DbContextOptions<CalendarDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Broadcast> Broadcasts { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<Hall> Halls { get; set; }

    public virtual DbSet<Platform> Platforms { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=Vadim\\SQLEXPRESS;Initial Catalog=CalendarDB;Integrated Security=True; TrustServerCertificate=Yes");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Broadcast>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__broadcas__3213E83FD9E7108D");
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__doctor__3213E83FA33AE6A9");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__event__3213E83F4D2B281C");

            entity.HasOne(d => d.Broadcast).WithMany(p => p.Events).HasConstraintName("FK__event__broadcast__33D4B598");

            entity.HasOne(d => d.Hall).WithMany(p => p.Events)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__event__hall_id__31EC6D26");

            entity.HasOne(d => d.Platform).WithMany(p => p.Events).HasConstraintName("FK__event__platform___32E0915F");
        });

        modelBuilder.Entity<Hall>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__hall__3213E83FD53C3A89");
        });

        modelBuilder.Entity<Platform>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__platform__3213E83F14D8AC32");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
