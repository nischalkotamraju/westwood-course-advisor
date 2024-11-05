import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CourseDropdown = ({ index, subject, courses, searchTerm, onSearchChange, onCourseSelect, selectedCourse, isActive, onToggle }) => (
    <div className="relative dropdown-container">
      <div onClick={onToggle} className="w-full p-3 bg-neutral-800 text-white rounded-lg cursor-pointer hover:bg-neutral-700 transition-all duration-300 flex justify-between items-center">
        <span>{selectedCourse ? selectedCourse.name : subject}</span>
        <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
      </div>
      {isActive && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-800 rounded-lg overflow-hidden shadow-2xl">
          <input type="text" value={searchTerm} onChange={(e) => onSearchChange(index, e.target.value)} placeholder={`Search ${subject}`} className="w-full p-3 bg-neutral-700 text-white focus:outline-none shadow-2xl" />
          <div className="max-h-60 overflow-auto">
            {courses.filter(course => course.name.toLowerCase().includes(searchTerm.toLowerCase())).map((course, courseIndex) => (
              <div key={courseIndex} className="p-2 hover:bg-neutral-700 cursor-pointer text-white" onClick={() => onCourseSelect(index, course)}>{course.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
);

export default CourseDropdown;