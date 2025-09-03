﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eventura.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEventImageColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Events",
                newName: "ImageFileName");

            migrationBuilder.AddColumn<string>(
                name: "ImageContentType",
                table: "Events",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Events",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageContentType",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "ImageFileName",
                table: "Events",
                newName: "ImageUrl");
        }
    }
}
