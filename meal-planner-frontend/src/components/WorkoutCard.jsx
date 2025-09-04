import React from 'react';

const WorkoutCard = ({ workout }) => {
  return (
    <div className="border p-4 rounded-md shadow-md my-2">
      <h3 className="font-bold text-xl">{workout.name}</h3>
      <p>{workout.description}</p>
      <p className="text-sm text-gray-600">Thời lượng: {workout.duration} phút</p>
    </div>
  );
};

export default WorkoutCard;
