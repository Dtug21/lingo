import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, translate } from '../builders';

export const unit3: Unit = {
  id: 'travel',
  title: 'Viajes',
  description: 'Muévete por el mundo: aeropuertos, hoteles y direcciones.',
  color: 'sky',
  icon: '✈️',
  lessons: [
    lesson('travel-1', 'En el aeropuerto', [
      match([
        ['airport', 'aeropuerto'],
        ['flight', 'vuelo'],
        ['passport', 'pasaporte'],
        ['suitcase', 'maleta'],
      ]),
      mc('¿Qué necesitas para viajar a otro país?', ['A passport', 'A bicycle', 'A pencil', 'A dog'], 0),
      fill('My ___ leaves at 10 a.m.', ['flight', 'kitchen', 'salad', 'window'], 0),
      translate('Where is my suitcase?', 'en-es', ['donde esta mi maleta']),
      order('El vuelo está retrasado', 'The flight is delayed', ['early', 'was']),
      listen('Your passport, please.', ['Your passport, please.', 'Your ticket, please.', 'Your suitcase, please.'], 0),
      mc('"Boarding pass" es…', ['La tarjeta de embarque', 'El asiento', 'La aduana', 'La puerta'], 0),
      translate('necesito un boleto a Londres', 'es-en', ['i need a ticket to london']),
    ]),

    lesson('travel-2', 'En el hotel', [
      mc('¿Cómo pides una habitación?', ['I would like a room', 'I would like a table', 'I would like a car', 'I would like a menu'], 0),
      match([
        ['room', 'habitación'],
        ['key', 'llave'],
        ['reservation', 'reserva'],
        ['floor', 'piso'],
      ]),
      fill('I have a ___ for two nights.', ['reservation', 'suitcase', 'salad', 'passport'], 0),
      translate('The room is on the third floor', 'en-es', ['la habitacion esta en el tercer piso']),
      order('¿Tiene una habitación disponible?', 'Do you have a room available', ['key', 'the']),
      listen('Here is your key.', ['Here is your key.', 'Here is your tea.', 'Where is your key?'], 0),
      mc('"Check-out" significa…', ['Salida del hotel', 'Entrada al hotel', 'Desayuno', 'Propina'], 0),
      translate('la llave de mi habitación', 'es-en', ['the key to my room', 'my room key', 'the key of my room']),
      fill('Breakfast is ___ 7 to 10.', ['from', 'on', 'at', 'in'], 0),
    ]),

    lesson('travel-3', 'Direcciones', [
      match([
        ['left', 'izquierda'],
        ['right', 'derecha'],
        ['straight', 'derecho'],
        ['corner', 'esquina'],
      ]),
      mc('"Turn left" significa…', ['Gira a la izquierda', 'Gira a la derecha', 'Sigue derecho', 'Detente'], 0),
      fill('The bank is ___ to the supermarket.', ['next', 'left', 'up', 'far'], 0),
      translate('Where is the train station?', 'en-es', ['donde esta la estacion de tren', 'donde esta la estacion del tren']),
      order('El museo está cerca del parque', 'The museum is near the park', ['far', 'at']),
      listen('Go straight and turn right.', ['Go straight and turn right.', 'Go straight and turn left.', 'Stop and turn right.'], 0),
      mc('"Far" es lo contrario de…', ['Near', 'Left', 'Big', 'Old'], 0),
      translate('la farmacia está a la derecha', 'es-en', ['the pharmacy is on the right', 'the pharmacy is to the right', 'the drugstore is on the right']),
    ]),

    lesson('travel-4', 'Transporte', [
      match([
        ['bus', 'autobús'],
        ['train', 'tren'],
        ['plane', 'avión'],
        ['bicycle', 'bicicleta'],
      ]),
      mc('¿Qué transporte va por rieles?', ['The train', 'The plane', 'The bus', 'The bicycle'], 0),
      fill('I go to work ___ bus.', ['by', 'on foot', 'in', 'at'], 0),
      translate('The bus stop is over there', 'en-es', ['la parada de autobus esta alla', 'la parada del autobus esta alli', 'la parada de bus esta alla']),
      order('Tomo el tren todos los días', 'I take the train every day', ['bus', 'night']),
      listen('The next train arrives in five minutes.', ['The next train arrives in five minutes.', 'The next bus arrives in five minutes.', 'The next train arrives in nine minutes.'], 0),
      mc('"A ticket" es…', ['Un boleto', 'Un asiento', 'Un mapa', 'Un taxi'], 0),
      translate('¿cuánto cuesta el boleto?', 'es-en', ['how much is the ticket', 'how much does the ticket cost']),
      fill('I ride my ___ to school.', ['bicycle', 'plane', 'boat', 'train'], 0),
    ]),
  ],
};
