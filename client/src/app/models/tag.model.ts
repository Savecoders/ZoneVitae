export interface Tag {
  id?: string; // Guid in C#
  nombre: string;

  // Relationships (optional in the interface)
  comunidads?: any[];
  reports?: any[];
}
