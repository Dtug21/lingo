import type { Ref } from 'react';
import type { Exercise } from '../../types';
import type { ExerciseHandle } from './shared';
import { MultipleChoice } from './MultipleChoice';
import { FillBlank } from './FillBlank';
import { Translate } from './Translate';
import { MatchPairs } from './MatchPairs';
import { WordOrder } from './WordOrder';
import { ListenChoose } from './ListenChoose';

interface ExerciseRendererProps {
  exercise: Exercise;
  disabled: boolean;
  onReadyChange: (ready: boolean) => void;
  handleRef: Ref<ExerciseHandle>;
}

export function ExerciseRenderer({
  exercise,
  disabled,
  onReadyChange,
  handleRef,
}: ExerciseRendererProps) {
  const common = { disabled, onReadyChange, ref: handleRef };
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoice exercise={exercise} {...common} />;
    case 'fill-blank':
      return <FillBlank exercise={exercise} {...common} />;
    case 'translate':
      return <Translate exercise={exercise} {...common} />;
    case 'match-pairs':
      return <MatchPairs exercise={exercise} {...common} />;
    case 'word-order':
      return <WordOrder exercise={exercise} {...common} />;
    case 'listen-choose':
      return <ListenChoose exercise={exercise} {...common} />;
  }
}
