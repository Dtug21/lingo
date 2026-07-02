import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, translate } from '../builders';

export const unit1: Unit = {
  id: 'greetings',
  title: 'Saludos y presentaciones',
  description: 'Aprende a saludar, despedirte y presentarte en inglés.',
  color: 'green',
  icon: '👋',
  lessons: [
    lesson('greet-1', 'Hola y adiós', [
      mc('¿Cómo se dice "hola" en inglés?', ['Hello', 'Goodbye', 'Please', 'Sorry'], 0),
      mc('¿Qué significa "good morning"?', ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hasta luego'], 1),
      fill('___ morning! How are you?', ['Good', 'Bad', 'Hello', 'Bye'], 0),
      match([
        ['hello', 'hola'],
        ['goodbye', 'adiós'],
        ['good morning', 'buenos días'],
        ['good night', 'buenas noches'],
      ]),
      translate('Good afternoon', 'en-es', ['buenas tardes']),
      order('Buenos días, amigo', 'Good morning my friend', ['night', 'bye']),
      listen('Hello, good morning!', ['Hello, good morning!', 'Hello, good night!', 'Goodbye, good morning!'], 0),
      translate('hasta luego', 'es-en', ['see you later', 'see you soon', 'bye']),
      mc('Para despedirte por la noche dices…', ['Good morning', 'Good afternoon', 'Good night', 'Good day'], 2),
    ]),

    lesson('greet-2', '¿Cómo estás?', [
      mc('¿Qué significa "How are you?"', ['¿Quién eres?', '¿Cómo estás?', '¿Dónde estás?', '¿Qué haces?'], 1),
      fill('How are you? — I am ___, thanks!', ['fine', 'table', 'blue', 'name'], 0),
      match([
        ['fine', 'bien'],
        ['tired', 'cansado'],
        ['happy', 'feliz'],
        ['sad', 'triste'],
      ]),
      translate('I am very happy', 'en-es', ['estoy muy feliz', 'soy muy feliz', 'estoy muy contento', 'estoy muy contenta']),
      order('¿Cómo estás hoy?', 'How are you today', ['fine', 'is']),
      listen('I am tired.', ['I am tired.', 'I am fine.', 'I am happy.'], 0),
      mc('"And you?" significa…', ['¿Y tú?', '¿Y él?', '¿Y ella?', '¿Y ellos?'], 0),
      translate('estoy bien, gracias', 'es-en', ['i am fine thank you', 'i am fine thanks', 'im fine thanks', 'im fine thank you', 'i am well thank you', 'i am well thanks']),
    ]),

    lesson('greet-3', 'Me presento', [
      mc('¿Cómo dices "me llamo Ana"?', ['My name is Ana', 'I am name Ana', 'Me name Ana', 'The name is Ana'], 0),
      fill('Hi! My ___ is Diego.', ['name', 'game', 'day', 'dog'], 0),
      translate('What is your name?', 'en-es', ['cual es tu nombre', 'como te llamas']),
      order('Mi nombre es Sara', 'My name is Sara', ['you', 'the']),
      match([
        ['my name is', 'mi nombre es'],
        ['nice to meet you', 'mucho gusto'],
        ['I am', 'yo soy'],
        ['this is', 'este es'],
      ]),
      listen('Nice to meet you!', ['Nice to meet you!', 'Nice to see you!', 'How are you?'], 0),
      mc('"Nice to meet you" se responde con…', ['Nice to meet you too', 'Good night', 'See you later', 'I am sorry'], 0),
      translate('yo soy profesor', 'es-en', ['i am a teacher', 'im a teacher']),
      fill('This ___ my friend John.', ['is', 'are', 'am', 'be'], 0),
    ]),

    lesson('greet-4', '¿De dónde eres?', [
      mc('¿Qué significa "Where are you from?"', ['¿Dónde vives?', '¿De dónde eres?', '¿A dónde vas?', '¿Dónde estás?'], 1),
      fill('I am ___ Chile.', ['from', 'of', 'in', 'at'], 0),
      translate('I am from Mexico', 'en-es', ['soy de mexico', 'yo soy de mexico']),
      match([
        ['country', 'país'],
        ['city', 'ciudad'],
        ['I live in', 'yo vivo en'],
        ['where', 'dónde'],
      ]),
      order('¿De dónde eres tú?', 'Where are you from', ['live', 'city']),
      listen('I live in Santiago.', ['I live in Santiago.', 'I am from Santiago.', 'I love Santiago.'], 0),
      mc('"I live in a big city" significa…', ['Vivo en una ciudad grande', 'Vivo en un país grande', 'Amo la ciudad grande', 'Voy a una ciudad grande'], 0),
      translate('ella es de España', 'es-en', ['she is from spain', 'shes from spain']),
    ]),

    lesson('greet-5', 'Cortesía', [
      mc('¿Cómo se dice "por favor"?', ['Please', 'Thanks', 'Sorry', 'Excuse me'], 0),
      match([
        ['please', 'por favor'],
        ['thank you', 'gracias'],
        ['sorry', 'lo siento'],
        ['excuse me', 'disculpe'],
      ]),
      fill('___ you very much!', ['Thank', 'Please', 'Sorry', 'Excuse'], 0),
      translate('You are welcome', 'en-es', ['de nada', 'eres bienvenido', 'bienvenido']),
      order('Disculpe, ¿puede ayudarme?', 'Excuse me can you help me', ['please', 'sorry']),
      listen('Thank you very much!', ['Thank you very much!', 'See you very soon!', 'Excuse me, please!'], 0),
      mc('Si pisas a alguien sin querer dices…', ['You are welcome', 'I am sorry', 'Good luck', 'Me too'], 1),
      translate('muchas gracias por tu ayuda', 'es-en', ['thank you very much for your help', 'thanks a lot for your help', 'thank you so much for your help']),
      fill('— Thank you! — You are ___.', ['welcome', 'sorry', 'please', 'fine'], 0),
    ]),
  ],
};
