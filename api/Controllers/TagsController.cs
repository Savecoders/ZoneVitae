using api.DTOs.Common;
using api.DTOs.Tag;
using api.Models;
using api.Services.Tags;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController (TagService tagService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
        {
            var tags = await tagService.GetAllAsync();
            var tagDTO = tags.Select(tag => new TagDto
            {
                Id = tag.Id,
                Nombre = tag.Nombre,
            });

            return Ok(new ApiResponse<IEnumerable<TagDto>>
            {
                Success = true,
                Message = "Tags obtenidos exitosamente",
                Data = tagDTO
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(Guid id)
        {
            var tag = await tagService.GetByIdAsync(id);
            var tagDTO = new TagDto
            {
                Id = tag.Id,
                Nombre = tag.Nombre
            };

            if (tag == null)
            {
                return NotFound();
            }

            return Ok(new ApiResponse<TagDto>
            {
                Success = true,
                Message = "Tag obtenido exitosamente",
                Data = tagDTO
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(Guid id, TagDto tag)
        {
            if (id != tag.Id)
            {
                return BadRequest();
            }

            var tag_actual = await tagService.GetByIdAsync(id);
            if (tag_actual == null)
                return NotFound(new ApiResponse<TagDto>
                {
                    Success = false,
                    Message = "Tag no encontrado",
                    Data = default
                });

            tag_actual.Id = tag.Id;
            tag_actual.Nombre = tag.Nombre;

            await tagService.UpdateAsync(tag_actual);

            return Ok(new ApiResponse<Tag>
            {
                Success = true,
                Message = "Tag actualizado exitosamente",
                Data = tag_actual
            });
        }

        [HttpPost]
        public async Task<ActionResult<Tag>> PostTag(Tag tag)
        {
            var tagCreado = await tagService.AddAsync(tag);

            return Created(string.Empty, new ApiResponse<TagDto>
            {
                Success = true,
                Message = "Tag creado exitosamente",
                Data = tagCreado
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteComunidad(Guid id)
        {
            var tag = await tagService.GetByIdAsync(id);
            if (tag == null)
            {
                return NotFound();
            }
            await tagService.DeleteAsync(tag);
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Tag eliminado exitosamente",
                Data = default
            });
        }
    }
}
