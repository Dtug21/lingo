import type { Unit } from '../../types';
import { fill, lesson, listen, match, mc, order, translate } from '../builders';

export const unit2: Unit = {
  id: 'food',
  title: 'Comida',
  description: 'Pide en restaurantes y habla de tus platos favoritos.',
  color: 'orange',
  icon: '🍔',
  lessons: [
    lesson('food-1', 'En el café', [
      mc('¿Cómo se dice "café" (bebida)?', ['Coffee', 'Tea', 'Milk', 'Juice'], 0),
      match([
        ['coffee', 'café'],
        ['tea', 'té'],
        ['milk', 'leche'],
        ['sugar', 'azúcar'],
      ]),
      fill('I would like a ___ of coffee, please.', ['cup', 'plate', 'fork', 'book'], 0),
      translate('A tea with milk, please', 'en-es', ['un te con leche por favor', 'te con leche por favor']),
      order('Quiero un café, por favor', 'I want a coffee please', ['tea', 'the']),
      listen('I drink coffee every morning.', ['I drink coffee every morning.', 'I drink tea every morning.', 'I drink milk every night.'], 0),
      mc('"Water" significa…', ['Vino', 'Agua', 'Jugo', 'Pan'], 1),
      translate('quiero agua, por favor', 'es-en', ['i want water please', 'i would like water please', 'i want some water please']),
    ]),

    lesson('food-2', 'Frutas y verduras', [
      match([
        ['apple', 'manzana'],
        ['banana', 'plátano'],
        ['orange', 'naranja'],
        ['grape', 'uva'],
      ]),
      mc('¿Qué es una "carrot"?', ['Una fruta', 'Una zanahoria', 'Una papa', 'Una cebolla'], 1),
      fill('I eat an ___ every day.', ['apple', 'water', 'rice', 'salt'], 0),
      translate('I like bananas', 'en-es', ['me gustan los platanos', 'me gustan las bananas', 'me gusta el platano']),
      order('Las manzanas son rojas', 'The apples are red', ['green', 'is']),
      listen('I want a salad with tomato.', ['I want a salad with tomato.', 'I want a soup with potato.', 'I want a salad with banana.'], 0),
      match([
        ['tomato', 'tomate'],
        ['potato', 'papa'],
        ['onion', 'cebolla'],
        ['lettuce', 'lechuga'],
      ]),
      translate('la ensalada es verde', 'es-en', ['the salad is green']),
      mc('"Vegetables" significa…', ['Frutas', 'Verduras', 'Carnes', 'Postres'], 1),
    ]),

    lesson('food-3', 'En el restaurante', [
      mc('¿Qué dice el mesero al llegar?', ['Can I take your order?', 'Where are you from?', 'How old are you?', 'What time is it?'], 0),
      fill('Can I see the ___, please?', ['menu', 'window', 'door', 'car'], 0),
      match([
        ['menu', 'menú'],
        ['waiter', 'mesero'],
        ['bill', 'cuenta'],
        ['table', 'mesa'],
      ]),
      translate('The bill, please', 'en-es', ['la cuenta por favor']),
      order('Quiero pedir pollo con arroz', 'I want to order chicken with rice', ['fish', 'a']),
      listen('The food is delicious!', ['The food is delicious!', 'The food is terrible!', 'The soup is delicious!'], 0),
      mc('"I am a vegetarian" significa…', ['Soy vegetariano', 'Como carne', 'Tengo hambre', 'Estoy lleno'], 0),
      translate('el pescado está delicioso', 'es-en', ['the fish is delicious']),
      fill('I am hungry. I want to ___ something.', ['eat', 'sleep', 'run', 'read'], 0),
    ]),

    lesson('food-4', 'Cocinar en casa', [
      match([
        ['to cook', 'cocinar'],
        ['to cut', 'cortar'],
        ['to mix', 'mezclar'],
        ['kitchen', 'cocina'],
      ]),
      mc('¿Dónde cocinas?', ['In the kitchen', 'In the bathroom', 'In the garden', 'In the car'], 0),
      fill('My mother ___ dinner every night.', ['cooks', 'sleeps', 'sings', 'drives'], 0),
      translate('I cook rice with chicken', 'en-es', ['cocino arroz con pollo', 'yo cocino arroz con pollo']),
      order('Mi padre cocina muy bien', 'My father cooks very well', ['eats', 'bad']),
      listen('We need eggs and butter.', ['We need eggs and butter.', 'We need eggs and sugar.', 'We need bread and butter.'], 0),
      mc('"Breakfast" es…', ['El desayuno', 'El almuerzo', 'La cena', 'El postre'], 0),
      translate('el desayuno está listo', 'es-en', ['breakfast is ready', 'the breakfast is ready']),
    ]),
  ],
};
