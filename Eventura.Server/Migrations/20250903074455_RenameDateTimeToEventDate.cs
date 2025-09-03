using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eventura.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameDateTimeToEventDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateTime",
                table: "Events",
                newName: "EventDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EventDate",
                table: "Events",
                newName: "DateTime");
        }
    }
}
