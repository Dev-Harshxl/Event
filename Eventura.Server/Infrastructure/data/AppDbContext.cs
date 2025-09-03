using Eventura.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Eventura.Server.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Event> Events => Set<Event>();
        public DbSet<Rsvp> Rsvps => Set<Rsvp>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Rsvp>()
                .HasIndex(r => new { r.UserId, r.EventId })
                .IsUnique();

            modelBuilder.Entity<Rsvp>()
                .HasOne(r => r.User)
                .WithMany(u => u.Rsvps)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rsvp>()
                .HasOne(r => r.Event)
                .WithMany(e => e.Rsvps)
                .HasForeignKey(r => r.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
