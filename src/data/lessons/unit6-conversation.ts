import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, speak, translate } from '../builders';

export const unit6: Unit = {
  id: 'conversation',
  title: 'Conversación cotidiana',
  description: 'Small talk, opiniones y planes para hablar con soltura.',
  color: 'teal',
  icon: '💬',
  lessons: [
    lesson('conv-1', 'Small talk', [
      mc('"How is it going?" es una forma informal de decir…', ['¿Cómo va todo?', '¿A dónde vas?', '¿Qué hora es?', '¿Quién eres?'], 0),
      match([
        ['how is it going', 'cómo va todo'],
        ['not bad', 'nada mal'],
        ['long time no see', 'tanto tiempo sin verte'],
        ['take care', 'cuídate'],
      ]),
      fill('Hey Tom! Long time no ___!', ['see', 'eat', 'run', 'buy'], 0),
      speak('How is it going?', '¿Cómo va todo?'),
      translate('Not bad, and you?', 'en-es', ['nada mal y tu', 'no esta mal y tu', 'nada mal tu']),
      order('¿Qué tal tu fin de semana?', 'How was your weekend', ['week', 'is']),
      listen('It was great, thanks for asking.', ['It was great, thanks for asking.', 'It was late, thanks for asking.', 'It was great, thanks for coming.'], 0),
      speak('Take care, see you soon!', '¡Cuídate, nos vemos pronto!'),
    ]),

    lesson('conv-2', 'Opiniones y gustos', [
      mc('"I think so" significa…', ['Creo que sí', 'Creo que no', 'No lo sé', 'Por supuesto'], 0),
      match([
        ['I think', 'yo creo'],
        ['I agree', 'estoy de acuerdo'],
        ['I love it', 'me encanta'],
        ['I prefer', 'yo prefiero'],
      ]),
      fill('I ___ with you, that movie is great.', ['agree', 'swim', 'cook', 'open'], 0),
      translate('I love this song', 'en-es', ['me encanta esta cancion', 'amo esta cancion']),
      order('Prefiero el café al té', 'I prefer coffee to tea', ['like', 'the']),
      speak('I think it is a great idea.', 'Creo que es una gran idea.'),
      listen('What do you think about it?', ['What do you think about it?', 'What do you know about it?', 'What do you think about him?'], 0),
      translate('¿estás de acuerdo?', 'es-en', ['do you agree', 'are you in agreement']),
    ]),

    lesson('conv-3', 'Hacer planes', [
      mc('"Are you free on Saturday?" pregunta si…', ['Estás libre el sábado', 'Eres gratis el sábado', 'Trabajas el sábado', 'Viajas el sábado'], 0),
      fill('___ go to the movies tonight!', ["Let's", 'Lets go', 'We let', 'Going'], 0),
      match([
        ['are you free', 'estás libre'],
        ["let's meet", 'juntémonos'],
        ['sounds good', 'suena bien'],
        ['maybe later', 'quizás después'],
      ]),
      translate('See you at seven', 'en-es', ['nos vemos a las siete', 'te veo a las siete']),
      order('¿Quieres almorzar mañana?', 'Do you want to have lunch tomorrow', ['dinner', 'the']),
      speak('Let us meet at the park.', 'Juntémonos en el parque.'),
      listen('Sounds good, see you there!', ['Sounds good, see you there!', 'Sounds bad, see you there!', 'Sounds good, see you here!'], 0),
      translate('estoy libre el domingo', 'es-en', ['i am free on sunday', 'im free on sunday', 'i am free sunday']),
    ]),

    lesson('conv-4', 'Al teléfono', [
      mc('"Hold on, please" significa…', ['Espere, por favor', 'Cuelgue, por favor', 'Hable, por favor', 'Llame, por favor'], 0),
      match([
        ['hold on', 'espere'],
        ['call back', 'devolver la llamada'],
        ['wrong number', 'número equivocado'],
        ['leave a message', 'dejar un mensaje'],
      ]),
      fill('Can I ___ to Anna, please?', ['speak', 'listen', 'walk', 'cook'], 0),
      translate('Can you call me back?', 'en-es', ['puedes devolverme la llamada', 'me puedes devolver la llamada', 'puedes llamarme de vuelta']),
      order('Te llamo más tarde', 'I will call you later', ['tomorrow', 'the']),
      speak('Hold on a moment, please.', 'Espere un momento, por favor.'),
      listen('Sorry, you have the wrong number.', ['Sorry, you have the wrong number.', 'Sorry, you have the wrong name.', 'Sorry, I have the wrong number.'], 0),
      translate('¿puedo dejar un mensaje?', 'es-en', ['can i leave a message', 'may i leave a message']),
    ]),
  ],
};
