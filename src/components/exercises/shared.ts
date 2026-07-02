import type { Ref } from 'react';

/** Handle imperativo que cada ejercicio expone al contenedor de la lección. */
export interface ExerciseHandle {
  /** Evalúa la respuesta actual del usuario. Se llama al presionar "Comprobar". */
  check: () => boolean;
}

export interface ExerciseComponentProps<E> {
  exercise: E;
  /** true durante el feedback: la UI queda congelada. */
  disabled: boolean;
  /** Notifica si hay una respuesta lista para comprobar. */
  onReadyChange: (ready: boolean) => void;
  ref: Ref<ExerciseHandle>;
}
