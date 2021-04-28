import React, { useEffect, useState } from 'react';
import { noteData } from "./Note";

type WeightProps = {
  note: noteData;
  isInputActive: boolean;
  onSetNote: ({ data, type }: noteData) => void;
  onSetIsFocused: (value: boolean) => void;
};

export type WeightData = { weight: string }

function Weight(props: WeightProps) {
  const [weight, setWeight] = useState(
    props.note.data.includes(nameof<WeightData>(w => w.weight)) ? (JSON.parse(props.note.data) as WeightData).weight : ""
  );

  useEffect(() => {
    props.onSetNote({
      ...props.note,
      data: JSON.stringify({weight: weight})
    });
  }, [weight]);

  return (
    <div className="weight">
      <div className="has-float-label">
        <input
          type="number"
          name="weight"
          id="weight"
          placeholder=" "
          required
          value={weight}
          prefix="kg"
          onFocus={() => props.onSetIsFocused(true)}
          onChange={e => setWeight(e.target.value)}
        />
        <label htmlFor="weight">Weight (Kg)</label>
      </div>
    </div>
  )
}

export default Weight;
