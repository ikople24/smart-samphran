const communities = [
  "ท่ายายโหมด",
  "ทางแยกสามพราน",
  "ศุภมงคล",
  "น้ำจันทร์",
  "สายเจ็ด",
  "สะแกเล็ก",
  "พระยะ",
  "บุญนัน",
  "บางพระ",
  "ตลาด",
  "ริมน้ำ",
  "ประตู1",
  "ศิริมงคล",
  "สรรเพชญ",
  "หลังโรงเรียน",
];

const CommunitySelector = ({ selected, onSelect = () => {}, error }) => (
  <div className="mb-4">
    <div className="flex py-2 gap-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        1.เลือกชุมชน
      </label>
      {error && <div className="text-red-500 text-sm ml-auto">{error}</div>}
    </div>
    <div className="flex flex-wrap gap-2">
      {communities.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onSelect(c)}
          className={`btn btn-sm rounded-full px-4 py-2 text-base font-medium ${
            selected === c
              ? "bg-green-600 text-white border-none"
              : "bg-green-100 text-green-900 hover:bg-blue-200 border-none"
          } transition duration-200 min-w-[120px] max-w-full sm:w-auto`}
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);
export default CommunitySelector;
