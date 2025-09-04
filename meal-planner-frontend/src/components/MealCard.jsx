import React from 'react';

const MealCard = ({ meal }) => {
  return (
    <div className="border p-4 rounded-md shadow-md my-2">
      <h3 className="font-bold text-xl">{meal.name}</h3>
      <p>{meal.description}</p>
      <p className="text-sm text-gray-600">Calo: {meal.calories} kcal</p>
    </div>
  );
};

export default MealCard;
