import React, { useMemo } from 'react';
import _ from 'lodash';

const EmotionResult = ({
  emotionResult,
  mode,
  style,
}) => {
  const sortedEmotions = useMemo(() => {
    if (!emotionResult) {
      return [];
    }

    if (mode === 'max') {
      return [_.maxBy(Object.entries(emotionResult), (result) => result[1])];
    }

    return Object.entries(emotionResult).sort((a, b) => b[1] - a[1]);
  },
  [emotionResult, mode]);

  return (
    <div
      style={style ?? {
        width: '100%',
        padding: '0px 10px',
      }}
    >
      {
        sortedEmotions.map(
          ([key, value]) => (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontWeight: value >= 0.05 ? 700 : 500 }} key={key}>
              <div>
                {key}
                :
              </div>
              <div>{(Number.isNaN(value) || value === undefined) ? '-' : value.toFixed(3)}</div>
            </div>
          ),
        )
      }
    </div>
  );
};

export default EmotionResult;
