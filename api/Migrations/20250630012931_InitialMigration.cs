using api.Contexts;
using System;
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    nombre = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__roles__3214EC2707BC9C90", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "roles_comunidades",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    descripcion = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__roles_co__3214EC276083F2C5", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    nombre = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tags__3214EC27E9822C9E", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    nombre_usuario = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    foto_perfil = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    fecha_nacimiento = table.Column<DateOnly>(type: "date", nullable: true),
                    genero = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    estado_cuenta = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Activo"),
                    deleted_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuarios__3214EC2747520E7B", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "comunidades",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    logo = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    cover = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    creador_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ubicacion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Pendiente de Revision"),
                    deleted_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__comunida__3214EC275E116622", x => x.ID);
                    table.ForeignKey(
                        name: "FK_comunidades_creador",
                        column: x => x.creador_id,
                        principalTable: "usuarios",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "usuarios_roles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    id_usuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    id_rol = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    asignado_por = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    fecha_asignacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    fecha_expiracion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuarios__3213E83F4BA7710F", x => x.id);
                    table.ForeignKey(
                        name: "FK_usuarios_roles_rol",
                        column: x => x.id_rol,
                        principalTable: "roles",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_usuarios_roles_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuarios",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "actividades",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    comunidad_id = table.Column<long>(type: "bigint", nullable: true),
                    nombre = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fecha_inicio = table.Column<DateOnly>(type: "date", nullable: false),
                    fecha_fin = table.Column<DateOnly>(type: "date", nullable: false),
                    ubicacion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    @virtual = table.Column<bool>(name: "virtual", type: "bit", nullable: false),
                    frecuencia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    cover = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    fecha = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__activida__3214EC27B858A9C9", x => x.ID);
                    table.ForeignKey(
                        name: "FK_actividades_comunidad",
                        column: x => x.comunidad_id,
                        principalTable: "comunidades",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "comunidad_tags",
                columns: table => new
                {
                    comunidad_id = table.Column<long>(type: "bigint", nullable: false),
                    tag_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__comunida__A2962651151FB263", x => new { x.comunidad_id, x.tag_id });
                    table.ForeignKey(
                        name: "FK_comunidad_tags_comunidad",
                        column: x => x.comunidad_id,
                        principalTable: "comunidades",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_comunidad_tags_tag",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "follows",
                columns: table => new
                {
                    usuario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    comunidad_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__follows__93BC2668D4053F6C", x => new { x.usuario_id, x.comunidad_id });
                    table.ForeignKey(
                        name: "FK_follows_comunidad",
                        column: x => x.comunidad_id,
                        principalTable: "comunidades",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_follows_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "galeria_comunidad",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    comunidad_id = table.Column<long>(type: "bigint", nullable: true),
                    imagen = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__galeria___3214EC27A81157AB", x => x.ID);
                    table.ForeignKey(
                        name: "FK_galeria_comunidad_comunidad",
                        column: x => x.comunidad_id,
                        principalTable: "comunidades",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "reports",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    comunidad_id = table.Column<long>(type: "bigint", nullable: true),
                    autor_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    titulo = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    contenido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    anonimo = table.Column<bool>(type: "bit", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Pendiente_Moderacion"),
                    deleted_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__reports__3214EC273EE1463B", x => x.ID);
                    table.ForeignKey(
                        name: "FK_reports_autor",
                        column: x => x.autor_id,
                        principalTable: "usuarios",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_reports_comunidad",
                        column: x => x.comunidad_id,
                        principalTable: "comunidades",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "usuarios_comunidades_roles",
                columns: table => new
                {
                    usuario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    comunidad_id = table.Column<long>(type: "bigint", nullable: false),
                    rol_id = table.Column<long>(type: "bigint", nullable: false),
                    fecha_asignacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuarios__93BC2668204D9603", x => new { x.usuario_id, x.comunidad_id });
                    table.ForeignKey(
                        name: "FK_usuarios_comunidades_roles_comunidad",
                        column: x => x.comunidad_id,
                        principalTable: "comunidades",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_usuarios_comunidades_roles_rol",
                        column: x => x.rol_id,
                        principalTable: "roles_comunidades",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_usuarios_comunidades_roles_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comentarios",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    actividades_Id = table.Column<long>(type: "bigint", nullable: true),
                    autor_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    contenido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    fecha_comentario = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__comentar__3214EC2706CC10D4", x => x.ID);
                    table.ForeignKey(
                        name: "FK_comentarios_actividad",
                        column: x => x.actividades_Id,
                        principalTable: "actividades",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_comentarios_autor",
                        column: x => x.autor_id,
                        principalTable: "usuarios",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "fotos",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    image = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    reports_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__fotos__3214EC27A2E45509", x => x.ID);
                    table.ForeignKey(
                        name: "FK_fotos_reports",
                        column: x => x.reports_id,
                        principalTable: "reports",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "me_encanta",
                columns: table => new
                {
                    usuario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    reports_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__me_encan__55C3BD85055B436C", x => new { x.usuario_id, x.reports_id });
                    table.ForeignKey(
                        name: "FK_me_encanta_report",
                        column: x => x.reports_id,
                        principalTable: "reports",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_me_encanta_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "reports_tags",
                columns: table => new
                {
                    reports_id = table.Column<long>(type: "bigint", nullable: false),
                    tag_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__reports___C56F988DAEA91C7D", x => new { x.reports_id, x.tag_id });
                    table.ForeignKey(
                        name: "FK_reports_tags_report",
                        column: x => x.reports_id,
                        principalTable: "reports",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reports_tags_tag",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "seguimiento_reportes",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    reporte_id = table.Column<long>(type: "bigint", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    estado_anterior = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    comentario = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    accion_realizada = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    accion_recomendada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    documentos_adjuntos = table.Column<bool>(type: "bit", nullable: false),
                    prioridad = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Media"),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    imagen = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__seguimie__3214EC274713A4BA", x => x.ID);
                    table.ForeignKey(
                        name: "FK_seguimiento_reportes_reporte",
                        column: x => x.reporte_id,
                        principalTable: "reports",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_seguimiento_reportes_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_actividades_comunidad_id",
                table: "actividades",
                column: "comunidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_actividades_fechas",
                table: "actividades",
                columns: new[] { "fecha_inicio", "fecha_fin" });

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_actividades_Id",
                table: "comentarios",
                column: "actividades_Id");

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_autor_id",
                table: "comentarios",
                column: "autor_id");

            migrationBuilder.CreateIndex(
                name: "IX_comunidad_tags_tag_id",
                table: "comunidad_tags",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "IX_comunidades_creador_id",
                table: "comunidades",
                column: "creador_id");

            migrationBuilder.CreateIndex(
                name: "IX_comunidades_estado",
                table: "comunidades",
                column: "estado");

            migrationBuilder.CreateIndex(
                name: "IX_follows_comunidad_id",
                table: "follows",
                column: "comunidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_fotos_reports_id",
                table: "fotos",
                column: "reports_id");

            migrationBuilder.CreateIndex(
                name: "IX_galeria_comunidad_comunidad_id",
                table: "galeria_comunidad",
                column: "comunidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_me_encanta_reports_id",
                table: "me_encanta",
                column: "reports_id");

            migrationBuilder.CreateIndex(
                name: "IX_reports_autor_id",
                table: "reports",
                column: "autor_id");

            migrationBuilder.CreateIndex(
                name: "IX_reports_comunidad_id",
                table: "reports",
                column: "comunidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_reports_estado_comunidad",
                table: "reports",
                columns: new[] { "estado", "comunidad_id" });

            migrationBuilder.CreateIndex(
                name: "IX_reports_estado_fecha",
                table: "reports",
                columns: new[] { "estado", "create_at" });

            migrationBuilder.CreateIndex(
                name: "IX_reports_tags_tag_id",
                table: "reports_tags",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "IX_roles_nombre",
                table: "roles",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_roles_comunidades_nombre",
                table: "roles_comunidades",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_seguimiento_reportes_estado",
                table: "seguimiento_reportes",
                columns: new[] { "estado", "create_at" });

            migrationBuilder.CreateIndex(
                name: "IX_seguimiento_reportes_reporte_id",
                table: "seguimiento_reportes",
                column: "reporte_id");

            migrationBuilder.CreateIndex(
                name: "IX_seguimiento_reportes_usuario_id",
                table: "seguimiento_reportes",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_tags_nombre",
                table: "tags",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_email",
                table: "usuarios",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_estado_cuenta",
                table: "usuarios",
                column: "estado_cuenta");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_nombre_usuario",
                table: "usuarios",
                column: "nombre_usuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_comunidades_roles_comunidad_id",
                table: "usuarios_comunidades_roles",
                column: "comunidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_comunidades_roles_rol_id",
                table: "usuarios_comunidades_roles",
                column: "rol_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_roles_rol",
                table: "usuarios_roles",
                column: "id_rol");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_roles_unique",
                table: "usuarios_roles",
                columns: new[] { "id_usuario", "id_rol" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_roles_usuario",
                table: "usuarios_roles",
                column: "id_usuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "comentarios");

            migrationBuilder.DropTable(
                name: "comunidad_tags");

            migrationBuilder.DropTable(
                name: "follows");

            migrationBuilder.DropTable(
                name: "fotos");

            migrationBuilder.DropTable(
                name: "galeria_comunidad");

            migrationBuilder.DropTable(
                name: "me_encanta");

            migrationBuilder.DropTable(
                name: "reports_tags");

            migrationBuilder.DropTable(
                name: "seguimiento_reportes");

            migrationBuilder.DropTable(
                name: "usuarios_comunidades_roles");

            migrationBuilder.DropTable(
                name: "usuarios_roles");

            migrationBuilder.DropTable(
                name: "actividades");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.DropTable(
                name: "reports");

            migrationBuilder.DropTable(
                name: "roles_comunidades");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "comunidades");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
