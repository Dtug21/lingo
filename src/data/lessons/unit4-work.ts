import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, translate } from '../builders';

export const unit4: Unit = {
  id: 'work',
  title: 'Trabajo',
  description: 'Vocabulario de oficina, profesiones y reuniones.',
  color: 'violet',
  icon: '💼',
  lessons: [
    lesson('work-1', 'La oficina', [
      match([
        ['office', 'oficina'],
        ['desk', 'escritorio'],
        ['computer', 'computadora'],
        ['meeting', 'reunión'],
      ]),
      mc('¿Dónde trabajas si tienes un "desk job"?', ['In an office', 'In a farm', 'In a kitchen', 'In a gym'], 0),
      fill('I work in an ___ downtown.', ['office', 'orange', 'oven', 'ocean'], 0),
      translate('My computer is new', 'en-es', ['mi computadora es nueva', 'mi computador es nuevo', 'mi ordenador es nuevo']),
      order('Trabajo de lunes a viernes', 'I work from Monday to Friday', ['Sunday', 'at']),
      listen('The meeting starts at nine.', ['The meeting starts at nine.', 'The meeting starts at five.', 'The morning starts at nine.'], 0),
      mc('"Boss" significa…', ['Jefe', 'Colega', 'Cliente', 'Vecino'], 0),
      translate('mi jefe es muy amable', 'es-en', ['my boss is very kind', 'my boss is very nice', 'my boss is very friendly']),
    ]),

    lesson('work-2', 'Profesiones', [
      match([
        ['doctor', 'médico'],
        ['teacher', 'profesor'],
        ['engineer', 'ingeniero'],
        ['lawyer', 'abogado'],
      ]),
      mc('¿Quién trabaja en un hospital?', ['A doctor', 'A pilot', 'A farmer', 'A chef'], 0),
      fill('She is a ___ at a big school.', ['teacher', 'kitchen', 'ticket', 'window'], 0),
      translate('He is an engineer', 'en-es', ['el es ingeniero', 'el es un ingeniero']),
      order('Mi hermana es doctora', 'My sister is a doctor', ['teacher', 'the']),
      listen('I am a software developer.', ['I am a software developer.', 'I am a software designer.', 'I am a hardware developer.'], 0),
      mc('"What do you do?" pregunta por…', ['Tu profesión', 'Tu edad', 'Tu casa', 'Tu comida favorita'], 0),
      translate('¿en qué trabajas?', 'es-en', ['what do you do', 'what is your job', 'what do you work in', 'whats your job']),
      fill('A chef ___ in a restaurant.', ['works', 'sleeps', 'swims', 'flies'], 0),
    ]),

    lesson('work-3', 'Reuniones', [
      mc('"Schedule a meeting" significa…', ['Agendar una reunión', 'Cancelar una reunión', 'Olvidar una reunión', 'Grabar una reunión'], 0),
      match([
        ['schedule', 'agenda'],
        ['email', 'correo'],
        ['call', 'llamada'],
        ['report', 'informe'],
      ]),
      fill('Please send me the ___ by email.', ['report', 'coffee', 'train', 'garden'], 0),
      translate('The meeting is at 3 p.m.', 'en-es', ['la reunion es a las 3', 'la reunion es a las 3 de la tarde', 'la reunion es a las tres', 'la reunion es a las tres de la tarde']),
      order('Tenemos una reunión mañana', 'We have a meeting tomorrow', ['today', 'the']),
      listen('Can you send me the report?', ['Can you send me the report?', 'Can you send me the ticket?', 'Can you read me the report?'], 0),
      mc('"Deadline" es…', ['Fecha límite', 'Hora de almuerzo', 'Día libre', 'Sala de reuniones'], 0),
      translate('te llamo después de la reunión', 'es-en', ['i will call you after the meeting', 'ill call you after the meeting', 'i call you after the meeting']),
    ]),

    lesson('work-4', 'Buscar empleo', [
      match([
        ['job', 'empleo'],
        ['interview', 'entrevista'],
        ['salary', 'sueldo'],
        ['experience', 'experiencia'],
      ]),
      mc('¿Qué haces antes de conseguir un trabajo?', ['An interview', 'A vacation', 'A party', 'A nap'], 0),
      fill('I have an ___ on Friday morning.', ['interview', 'island', 'orange', 'umbrella'], 0),
      translate('I am looking for a job', 'en-es', ['estoy buscando trabajo', 'estoy buscando un trabajo', 'busco trabajo']),
      order('Ella tiene mucha experiencia', 'She has a lot of experience', ['salary', 'is']),
      listen('Tell me about your experience.', ['Tell me about your experience.', 'Tell me about your family.', 'Tell me about your salary.'], 0),
      mc('"Resume / CV" es…', ['Currículum', 'Contrato', 'Oficina', 'Vacaciones'], 0),
      translate('el sueldo es bueno', 'es-en', ['the salary is good', 'the pay is good']),
      fill('Good luck ___ your interview!', ['with', 'of', 'for', 'to'], 0),
    ]),
  ],
};
