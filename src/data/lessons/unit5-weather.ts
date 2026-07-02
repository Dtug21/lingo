import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, translate } from '../builders';

export const unit5: Unit = {
  id: 'weather',
  title: 'Tiempo y clima',
  description: 'Habla de la hora, los días, las estaciones y el clima.',
  color: 'pink',
  icon: '⛅',
  lessons: [
    lesson('weather-1', '¿Qué hora es?', [
      mc('"What time is it?" significa…', ['¿Qué hora es?', '¿Qué día es?', '¿Cuántos años tienes?', '¿Dónde estás?'], 0),
      match([
        ['clock', 'reloj'],
        ['hour', 'hora'],
        ['minute', 'minuto'],
        ['noon', 'mediodía'],
      ]),
      fill('It is ten ___ in the morning.', ["o'clock", 'clocks', 'hours', 'times'], 0),
      translate('It is half past two', 'en-es', ['son las dos y media']),
      order('Son las cinco de la tarde', 'It is five in the afternoon', ['morning', 'at']),
      listen('It is seven thirty.', ['It is seven thirty.', 'It is seven fifteen.', 'It is eleven thirty.'], 0),
      mc('"Midnight" es…', ['Medianoche', 'Mediodía', 'Madrugada', 'Atardecer'], 0),
      translate('la clase es a las nueve', 'es-en', ['the class is at nine', 'class is at nine', 'the class is at nine oclock']),
    ]),

    lesson('weather-2', 'Días y meses', [
      match([
        ['Monday', 'lunes'],
        ['Wednesday', 'miércoles'],
        ['Friday', 'viernes'],
        ['Sunday', 'domingo'],
      ]),
      mc('¿Qué día viene después de "Tuesday"?', ['Wednesday', 'Monday', 'Friday', 'Sunday'], 0),
      fill('My birthday is in ___.', ['July', 'Monday', 'noon', 'summer camp'], 0),
      translate('Today is Saturday', 'en-es', ['hoy es sabado']),
      order('El lunes tengo clase de inglés', 'On Monday I have English class', ['Friday', 'the']),
      listen('The party is on Friday night.', ['The party is on Friday night.', 'The party is on Sunday night.', 'The class is on Friday night.'], 0),
      match([
        ['January', 'enero'],
        ['April', 'abril'],
        ['August', 'agosto'],
        ['December', 'diciembre'],
      ]),
      translate('mañana es domingo', 'es-en', ['tomorrow is sunday']),
      mc('"Weekend" significa…', ['Fin de semana', 'Día festivo', 'Semana completa', 'Mes'], 0),
    ]),

    lesson('weather-3', 'El clima hoy', [
      match([
        ['sunny', 'soleado'],
        ['rainy', 'lluvioso'],
        ['cloudy', 'nublado'],
        ['windy', 'ventoso'],
      ]),
      mc('"It is raining" significa…', ['Está lloviendo', 'Está nevando', 'Hace calor', 'Hace viento'], 0),
      fill('Take an umbrella, it is ___.', ['raining', 'sunny', 'dancing', 'sleeping'], 0),
      translate('It is very hot today', 'en-es', ['hace mucho calor hoy', 'hoy hace mucho calor', 'esta muy caluroso hoy']),
      order('Hoy está nublado y frío', 'Today it is cloudy and cold', ['hot', 'the']),
      listen('It is sunny and warm.', ['It is sunny and warm.', 'It is sunny and cold.', 'It is rainy and warm.'], 0),
      mc('"Cold" es lo contrario de…', ['Hot', 'Wet', 'Windy', 'Dark'], 0),
      translate('¿cómo está el clima?', 'es-en', ['how is the weather', 'hows the weather', 'what is the weather like', 'whats the weather like']),
    ]),

    lesson('weather-4', 'Las estaciones', [
      match([
        ['spring', 'primavera'],
        ['summer', 'verano'],
        ['autumn', 'otoño'],
        ['winter', 'invierno'],
      ]),
      mc('¿En qué estación nieva?', ['In winter', 'In summer', 'In spring', 'In autumn'], 0),
      fill('In ___ the flowers bloom.', ['spring', 'winter', 'night', 'coffee'], 0),
      translate('Summer is my favorite season', 'en-es', ['el verano es mi estacion favorita', 'verano es mi estacion favorita']),
      order('En invierno hace mucho frío', 'In winter it is very cold', ['summer', 'hot']),
      listen('It snows a lot in winter.', ['It snows a lot in winter.', 'It rains a lot in winter.', 'It snows a lot in autumn.'], 0),
      mc('"Season" significa…', ['Estación del año', 'Semana', 'Clima', 'Temperatura'], 0),
      translate('me gusta la primavera', 'es-en', ['i like spring', 'i like the spring']),
      fill('The leaves fall in ___.', ['autumn', 'spring', 'summer', 'January'], 0),
    ]),
  ],
};
