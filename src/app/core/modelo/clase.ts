export interface Clase {
  capacidadMaxima: number;
  duracion: string;
  fechaInicio: Date;
  id: number;
  nivelIngles: NivelIngles;
  nombreProfesor: string;
  ocupacionActual: number;
  precio: number;
  tipoClase: TipoClase;
  seleccionada?: boolean;
}

export enum NivelIngles {
  Avanzado = 'AVANZADO',
  Intermedio = 'INTERMEDIO',
  Principiante = 'PRINCIPIANTE',
}

export enum TipoClase {
  Grupal = 'GRUPAL',
  Particular = 'PARTICULAR',
}
