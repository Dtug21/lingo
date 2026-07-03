import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, speak, translate } from '../builders';

export const unit7: Unit = {
  id: 'professional',
  title: 'Inglés profesional',
  description: 'Correos, videollamadas y presentaciones para tu trabajo.',
  color: 'indigo',
  icon: '🧑‍💼',
  lessons: [
    lesson('pro-1', 'Correos básicos', [
      mc('¿Cómo empieza un correo formal?', ['Dear Mr. Smith', 'Hey bro', 'What’s up', 'Yo Smith'], 0),
      match([
        ['dear', 'estimado'],
        ['best regards', 'saludos cordiales'],
        ['attached', 'adjunto'],
        ['subject', 'asunto'],
      ]),
      fill('Please find ___ the report you requested.', ['attached', 'kitchen', 'delayed', 'sunny'], 0),
      translate('Thank you for your email', 'en-es', ['gracias por tu correo', 'gracias por su correo', 'gracias por tu email', 'gracias por su email']),
      order('Quedo atento a sus comentarios', 'I look forward to your comments', ['listen', 'the']),
      speak('Best regards, Diego.', 'Saludos cordiales, Diego.'),
      listen('I will send you the file today.', ['I will send you the file today.', 'I will send you the mail today.', 'I will send you the file Monday.'], 0),
      translate('adjunto el documento', 'es-en', ['i attach the document', 'attached is the document', 'i am attaching the document', 'the document is attached']),
    ]),

    lesson('pro-2', 'Videollamadas', [
      mc('"Can you hear me?" significa…', ['¿Me escuchas?', '¿Me ves?', '¿Me esperas?', '¿Me ayudas?'], 0),
      match([
        ['mute', 'silenciar'],
        ['share screen', 'compartir pantalla'],
        ['camera', 'cámara'],
        ['connection', 'conexión'],
      ]),
      fill('You are on ___, we cannot hear you.', ['mute', 'fire', 'time', 'lunch'], 0),
      translate('Can you see my screen?', 'en-es', ['puedes ver mi pantalla', 'pueden ver mi pantalla', 'ves mi pantalla']),
      order('Tu micrófono está apagado', 'Your microphone is off', ['camera', 'the']),
      speak('Can you hear me now?', '¿Me escuchas ahora?'),
      listen('Let me share my screen.', ['Let me share my screen.', 'Let me share my dream.', 'Let me see my screen.'], 0),
      translate('la conexión está mala', 'es-en', ['the connection is bad', 'the connection is poor']),
    ]),

    lesson('pro-3', 'Pedir aclaraciones', [
      mc('Si no entendiste algo dices…', ['Could you repeat that, please?', 'Good morning!', 'See you later!', 'You are welcome!'], 0),
      match([
        ['could you repeat', 'podría repetir'],
        ['what do you mean', 'qué quiere decir'],
        ['more slowly', 'más lento'],
        ['I understand', 'entiendo'],
      ]),
      fill('Sorry, I don’t ___. Can you explain?', ['understand', 'dance', 'travel', 'drink'], 0),
      translate('Could you speak more slowly?', 'en-es', ['podrias hablar mas lento', 'podria hablar mas lento', 'puedes hablar mas lento', 'puede hablar mas despacio', 'podrias hablar mas despacio']),
      order('¿Qué quiere decir esta palabra?', 'What does this word mean', ['says', 'the']),
      speak('Could you repeat that, please?', '¿Podría repetir eso, por favor?'),
      listen('Sure, no problem, I will repeat it.', ['Sure, no problem, I will repeat it.', 'Sure, no problem, I will delete it.', 'Sorry, no problem, I will repeat it.'], 0),
      translate('ahora entiendo, gracias', 'es-en', ['now i understand thank you', 'i understand now thanks', 'now i understand thanks', 'i understand now thank you']),
    ]),

    lesson('pro-4', 'Preséntate en el trabajo', [
      mc('"I work as a designer" significa…', ['Trabajo como diseñador', 'Quiero ser diseñador', 'Estudio diseño', 'Busco un diseñador'], 0),
      match([
        ['I work as', 'trabajo como'],
        ['team', 'equipo'],
        ['I am in charge of', 'estoy a cargo de'],
        ['company', 'empresa'],
      ]),
      fill('I am in ___ of the sales team.', ['charge', 'front', 'love', 'time'], 0),
      translate('I work in a small company', 'en-es', ['trabajo en una empresa pequena', 'trabajo en una pequena empresa', 'trabajo en una compania pequena']),
      order('Nuestro equipo es muy bueno', 'Our team is very good', ['boss', 'the']),
      speak('Nice to meet you, I am the new developer.', 'Mucho gusto, soy el nuevo desarrollador.'),
      listen('Welcome to the team!', ['Welcome to the team!', 'Welcome to the club!', 'Welcome to the room!'], 0),
      translate('estoy a cargo del proyecto', 'es-en', ['i am in charge of the project', 'im in charge of the project']),
    ]),
  ],
};
