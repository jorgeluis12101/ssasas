export interface NotaDTO {
  id?: number;
  titulo: string;
  contenido: string;
  libreta: { id: number };
  imagen?: string; // Corregir aquí
}
