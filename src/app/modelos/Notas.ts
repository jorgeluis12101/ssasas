export class Notas {
  constructor(
    public id?: number,
    public titulo?: string,
    public contenido?: string,
    public imagenUrl?: string,
    public fechaCreacion?: Date,
    public fechaActualizacion?: Date,
    public libretaId?: number,
    public usuarioId?: number,
    public prioridad?: string,
    public categoria?: string
  ) {}
}
