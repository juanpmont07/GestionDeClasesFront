export interface Estudiante {
  id:            number;
  nivelDeIngles: NivelDeIngles;
  nombre:        string;
  saldo:         number;
}

export enum NivelDeIngles {
  Avanzado = 'AVANZADO',
  Intermedio = 'INTERMEDIO',
  Principiante = 'PRINCIPIANTE',
}