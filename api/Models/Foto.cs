using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Foto
{
    public long Id { get; set; }

    public string Image { get; set; } = null!;

    public long? ReportsId { get; set; }

    public virtual Report? Reports { get; set; }
}
