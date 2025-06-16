import { useState } from "react";

const SatisfactionForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, comment });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl bg-white shadow-md">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">ความพึงพอใจ:</label>
        {[1, 2, 3, 4, 5].map((value) => (
          <input
            key={value}
            type="radio"
            name="rating"
            className="mask mask-star-2 bg-orange-400"
            aria-label={`${value} star`}
            value={value}
            checked={rating === value}
            onChange={() => setRating(value)}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ความคิดเห็นเพิ่มเติม</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="แสดงความคิดเห็น..."
        />
      </div>

      <div className="text-right">
        <button type="submit" className="btn btn-primary btn-sm">
          ส่งความคิดเห็น
        </button>
      </div>
    </form>
  );
};

export default SatisfactionForm;