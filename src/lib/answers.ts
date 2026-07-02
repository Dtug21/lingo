import type { Exercise } from '../types';

/** Texto de la respuesta correcta para mostrar en el feedback de error. */
export function correctAnswerText(exercise: Exercise): string {
  switch (exercise.type) {
    case 'multiple-choice':
    case 'listen-choose':
      return exercise.options[exercise.correctIndex];
    case 'fill-blank':
      return exercise.sentence.replace('___', exercise.options[exercise.correctIndex]);
    case 'translate':
      return exercise.accepted[0];
    case 'word-order':
      return exercise.correct;
    case 'match-pairs':
      return exercise.pairs.map((p) => `${p.left} = ${p.right}`).join(', ');
  }
}

/** Instrucción en español que se muestra sobre cada ejercicio. */
export function instructionFor(exercise: Exercise): string {
  switch (exercise.type) {
    case 'multiple-choice':
      return 'Elige la respuesta correcta';
    case 'fill-blank':
      return 'Completa el espacio en blanco';
    case 'translate':
      return exercise.direction === 'en-es' ? 'Traduce al español' : 'Traduce al inglés';
    case 'match-pairs':
      return 'Empareja cada palabra con su traducción';
    case 'word-order':
      return 'Ordena las palabras para formar la oración en inglés';
    case 'listen-choose':
      return 'Escucha y elige lo que oíste';
  }
}
