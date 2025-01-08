import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import courseListData from "../assets/data/course-list.json";
import CourseDropdown from "./CourseDropdown";

CourseDropdown.propTypes = {
  index: PropTypes.number.isRequired,
  subject: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onCourseSelect: PropTypes.func.isRequired,
  selectedCourse: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default function Build({ courses: initialCourses }) {
  const [currentYear, setCurrentYear] = useState(1);
  const [courses, setCourses] = useState(initialCourses);
  const [allSelectedCourses, setAllSelectedCourses] = useState(Object.fromEntries([1, 2, 3, 4].map((year) => [year, Array(16).fill(null)])));
  const [searchTerms, setSearchTerms] = useState(Array(16).fill(""));
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [doubleBlockedCourses, setDoubleBlockedCourses] = useState(Object.fromEntries([1, 2, 3, 4].map((year) => [year, 0])));
  const [isReviewing, setIsReviewing] = useState(false);
  const [disabledElectiveIndices, setDisabledElectiveIndices] = useState([]);
  const [excludedSubjects, setExcludedSubjects] = useState(Object.fromEntries([1, 2, 3, 4].map((year) => [year, []])));
  const [showOnlineCoursesPrompt, setShowOnlineCoursesPrompt] = useState(true);
  const [, setOnlineCourseSubject] = useState(null);
  const [hasOnlineCourses, setHasOnlineCourses] = useState(Object.fromEntries([1, 2, 3, 4].map((year) => [year, false])));  const [onlineCoursesByYear, setOnlineCoursesByYear] = useState(Object.fromEntries([1, 2, 3, 4].map((year) => [year, null])));

  React.useEffect(() => { setCourses(courseListData); }, []);

  const getYearName = year => ["", "Freshman", "Sophomore", "Junior", "Senior"][year];
  const handleSearchChange = useCallback((index, value) => setSearchTerms(prev => ({ ...prev, [index]: value })), []);
  const isHalfSemesterCourse = course => course?.key ? ((course.key.includes(".5") || course.key.includes("0.5")) && !course.key.includes(".5PE") && !course.key.includes("0.5PE")) : false;

  const handleOnlineCourseSelect = (subject) => {
    setOnlineCourseSubject(subject);
    setHasOnlineCourses(prev => ({ ...prev, [currentYear]: true }));
    setOnlineCoursesByYear(prev => ({ ...prev, [currentYear]: subject }));
  };

  const handleCourseSelect = (index, course) => {
    setAllSelectedCourses(prev => {
      const newCourses = [...prev[currentYear]];
      const oldCourse = newCourses[index];
      newCourses[index] = course;
      const dbCount = course?.name?.includes("DB") ? doubleBlockedCourses[currentYear] + 1 : oldCourse?.name?.includes("DB") ? doubleBlockedCourses[currentYear] - 1 : doubleBlockedCourses[currentYear];
      setDoubleBlockedCourses(prev => ({ ...prev, [currentYear]: dbCount }));
      setDisabledElectiveIndices([7, 6, 5, 4].slice(0, dbCount).filter(idx => !newCourses[idx] || idx === index));
      return { ...prev, [currentYear]: newCourses };
    });

    if (course) {
      const subject = course.name.split(" ")[0].toLowerCase();
      if (!["math", "english", "social", "science"].includes(subject)) {
        setExcludedSubjects(prev => ({ ...prev, [currentYear]: [...new Set([...prev[currentYear], subject])] }));
        setAllSelectedCourses(prev => {
          const updatedCourses = { ...prev };
          updatedCourses[currentYear] = updatedCourses[currentYear].map((c, i) => c && i !== index && c.name.toLowerCase().startsWith(subject) && !c.name.includes("Theory of Knowledge") ? null : c);
          return updatedCourses;
        });
      } else {
        setAllSelectedCourses(prev => {
          const updatedCourses = { ...prev };
          updatedCourses[currentYear] = updatedCourses[currentYear].map((c, i) => c && i !== index && c.name === course.name && !course.name.includes("Theory of Knowledge") ? null : c);
          return updatedCourses;
        });
      }
    }
    setSearchTerms(prev => ({ ...prev, [index]: "" }));
    setActiveDropdown(null);
  };

  const handleYearChange = direction => {
    const newYear = direction === "prev" ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1 && newYear <= 4) {
      setCurrentYear(newYear);
      setSearchTerms(Array(16).fill(""));
      setActiveDropdown(null);
      setDisabledElectiveIndices([]);
      setShowOnlineCoursesPrompt(true);
      setOnlineCourseSubject(null);
    }
  };

  const getAllCourses = useMemo(() => courses ? Object.values(courses).flat() : [], [courses]);

  const filteredCourses = useMemo(() => (index, subject, isSemesterTwo = false) => {
    if (!courses) return [];
    if (onlineCoursesByYear[currentYear] === subject.toLowerCase()) {
      return getAllCourses;
    }
    const availableCourses = courses[subject.toLowerCase()] || [];
    return availableCourses.filter(course => {
      const courseSubject = course.name.split(" ")[0].toLowerCase();
      const isSubjectAllowed = !["math", "english", "social studies", "science"].includes(subject.toLowerCase()) 
        ? (!excludedSubjects[currentYear].includes(courseSubject) || allSelectedCourses[currentYear][index]?.name?.toLowerCase().startsWith(courseSubject)) || course.name.includes("Theory of Knowledge")
        : !allSelectedCourses[currentYear].some((c, i) => i !== index && c?.name === course.name && !course.name.includes("Theory of Knowledge"));
      return isSubjectAllowed && (isSemesterTwo ? isHalfSemesterCourse(course) : true);
    });
  }, [courses, excludedSubjects, allSelectedCourses, currentYear, onlineCoursesByYear, getAllCourses]);

  const renderDropdown = (index, subject) => {
    const isDisabled = disabledElectiveIndices.includes(index);
    const selectedCourse = allSelectedCourses[currentYear][index];
    const displaySubject = onlineCoursesByYear[currentYear] === subject.toLowerCase() ? "Select Any Course" : subject;
    return (
      <div className={`flex flex-col ${isDisabled ? "opacity-50 bg-neutral-900" : ""}`}>
        <CourseDropdown
          key={index} index={index} subject={displaySubject}
          courses={onlineCoursesByYear[currentYear] === subject.toLowerCase() ? getAllCourses : (subject === "All Courses" ? getAllCourses : filteredCourses(index, subject))}
          searchTerm={searchTerms[index]}
          onSearchChange={handleSearchChange}
          onCourseSelect={handleCourseSelect}
          selectedCourse={selectedCourse}
          isActive={activeDropdown === index}
          onToggle={() => !isDisabled && setActiveDropdown(activeDropdown === index ? null : index)}
          disabled={isDisabled}
        />
        {isHalfSemesterCourse(selectedCourse) && (
          <div className="mt-2 ml-4 border-l-2 border-orange-500 pl-4">
            <CourseDropdown
              key={index + 8} index={index + 8} subject={displaySubject}
              courses={subject === "All Courses" ? getAllCourses : filteredCourses(index + 8, subject, true)}
              searchTerm={searchTerms[index + 8]}
              onSearchChange={handleSearchChange}
              onCourseSelect={handleCourseSelect}
              selectedCourse={allSelectedCourses[currentYear][index + 8]}
              isActive={activeDropdown === index + 8}
              onToggle={() => !isDisabled && setActiveDropdown(activeDropdown === index + 8 ? null : index + 8)}
              disabled={isDisabled}
            />
          </div>
        )}
      </div>
    );
  };

  if (showOnlineCoursesPrompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-3xl rounded-lg p-8">
          <h2 className="gradient-text font-bold text-3xl mb-6 text-center">{getYearName(currentYear)} Year - Online Courses</h2>
          <p className="text-white text-lg mb-6 text-center">Have you taken any online courses for this year?</p>
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setHasOnlineCourses(prev => ({ ...prev, [currentYear]: true }))} className="text-white bg-orange-700 px-6 py-3 rounded-lg hover:bg-orange-600">Yes</button>
            <button onClick={() => setShowOnlineCoursesPrompt(false)} className="text-white bg-neutral-600 px-6 py-3 rounded-lg hover:bg-neutral-500">No</button>
          </div>
          {hasOnlineCourses[currentYear] && (
            <div className="mt-6">
              <p className="text-white text-lg mb-4 text-center">Select the subject of your online course:</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {["Math", "Science", "English", "Social Studies"].map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      handleOnlineCourseSelect(subject.toLowerCase());
                      setShowOnlineCoursesPrompt(false);
                    }}
                    className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isReviewing) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-900">
      <div className="w-full max-w-7xl rounded-lg shadow-xl p-6 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <h1 className="gradient-text font-bold text-5xl mb-12 text-center">Review Your Four Year Plan</h1>
          <div className="max-h-[70vh] overflow-y-auto pr-4">
            {[1, 2, 3, 4].map(year => (
              <div key={year} className="bg-neutral-800 rounded-lg p-6 hover:shadow-2xl transition-all duration-300 mb-8">
                <h2 className="gradient-text font-bold text-3xl mb-6 text-center">{getYearName(year)} Year</h2>
                <div className="border-t border-neutral-700 pt-4">
                  <ul className="list-none space-y-4">
                    {allSelectedCourses[year].slice(0, 8).map((course, i) => (
                      <li key={i} className="text-lg text-white bg-neutral-700/50 rounded-lg p-3 hover:bg-neutral-700 transition-all duration-200">
                        <span className="font-medium">{course?.name || "Not selected"}</span>
                        {isHalfSemesterCourse(course) && (
                          <div className="mt-2 pl-4 text-orange-400 border-l-2 border-orange-400">
                            Second Semester: {allSelectedCourses[year][i + 8]?.name || "Not selected"}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3 lg:sticky lg:top-0">
          <div className="bg-neutral-800 rounded-lg p-6">
            <h3 className="gradient-text font-bold text-2xl mb-4 text-center">Send Your Four Year Plan</h3>
            <p className="text-white text-center mb-6">Scroll through your four year plan on the left and when you're ready, send it to yourself or your counselor.</p>
            <div className="flex flex-col items-center space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                id="emailInput"
                className="w-full max-w-md px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                id="fullNameInput"
                className="w-full max-w-md px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600"
                required
              />
              <input
                type="text"
                placeholder="Student ID"
                id="studentIdInput"
                className="w-full max-w-md px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600"
                required
              />
              <select
                id="counselorSelect"
                className="w-full max-w-md px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 hidden"
                required
              >
                <option value="">Counselor (Based on Last Name)</option>
                <option value="michele_koteras@roundrockisd.org">Michele Koteras (A-Cheq)</option>
                <option value="mary_hobbs@roundrockisd.org">Mary Hobbs (Cher-Gd)</option>
                <option value="christopher_garcia@roundrockisd.org">Christopher Garcia (Ge-Kar)</option>
                <option value="keri_douglas@roundrockisd.org">Keri Douglas (Kas-Mc)</option>
                <option value="julie_martinez@roundrockisd.org">Julie Martinez (Thompson) (Me-Q)</option>
                <option value="jeanine_edson@roundrockisd.org">Jeanine Edson (R-St)</option>
                <option value="cyndi_fleming@roundrockisd.org">Cyndi Fleming (Su-Z)</option>
                <option value="cyndi_fleming@roundrockisd.org">Ann Castro (IB)</option>
                <option value="cyndi_fleming@roundrockisd.org">Holly Browning (Lead)</option>
              </select>
              <textarea
                placeholder="Additional notes about courses (optional)"
                id="notesInput"
                className="w-full max-w-md px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 h-24"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const counselorSelect = document.getElementById('counselorSelect');
                    counselorSelect.classList.remove('hidden');
                    
                    if (counselorSelect.value) {
                      const email = counselorSelect.value;
                      const fullName = document.getElementById('fullNameInput').value;
                      const studentId = document.getElementById('studentIdInput').value;
                      const notes = document.getElementById('notesInput').value;
                      const subject = `Four Year Course Plan - ${fullName} (ID: ${studentId}) - For Counselor Review`;
                      const body = `Student Information:\nName: ${fullName}\nID: ${studentId}\n\nFour Year Plan:\n\n` + 
                        [1, 2, 3, 4].map(year => `
                        ${getYearName(year)} Year:
                        ${allSelectedCourses[year].slice(0, 8).map((course, i) => `
                        ${course?.name || "Not selected"}${isHalfSemesterCourse(course) ? `
                        Second Semester: ${allSelectedCourses[year][i + 8]?.name || "Not selected"}` : ''}`).join('\n')}
                        `).join('\n\n') + (notes ? `\n\nAdditional Notes:\n${notes}` : '');
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }
                  }}
                  className="text-white bg-orange-700 px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  Send to Counselor
                </button>
                <button 
                  onClick={() => {
                    const email = document.getElementById('emailInput').value;
                    const subject = "My Four Year Course Plan";
                    const body = "Hey there, Westwood student! Here is the four-year-plan that you just constructed. The Westwood counselors wish you the best of luck with your next four years of high school!\n\n" + [1, 2, 3, 4].map(year => `
                      ${getYearName(year)} Year:
                      ${allSelectedCourses[year].slice(0, 8).map((course, i) => `
                      ${course?.name || "Not selected"}${isHalfSemesterCourse(course) ? `
                      Second Semester: ${allSelectedCourses[year][i + 8]?.name || "Not selected"}` : ''}`).join('\n')}
                      `).join('\n\n');
                    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="text-white bg-orange-700 px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  Send to Me
                </button>              
                </div>
              <button 
                onClick={() => setIsReviewing(false)} 
                className="text-white bg-orange-700 px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl mb-8">
        <h1 className="gradient-text font-bold text-5xl mb-6 text-center">Let's build.</h1>
        <p className="text-white text-lg mb-8 text-center">Select your classes for the next four years!</p>
        <div className="mt-8 flex justify-center items-center mb-12">
          <h2 className="gradient-text font-bold text-4xl">{getYearName(currentYear)}</h2>
        </div>
        <h3 className="gradient-text text-xl mb-4 text-center font-semibold">Core Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {["Math", "English", "Social Studies", "Science"].map((subject, i) => renderDropdown(i, subject))}
        </div>
        <h3 className="gradient-text text-xl mb-4 text-center font-semibold">Electives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[4, 5, 6, 7].map(i => renderDropdown(i, "Elective"))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          {currentYear > 1 && <button onClick={() => handleYearChange("prev")} className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300">Back</button>}
          {currentYear < 4 ? <button onClick={() => handleYearChange("next")} className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300">Next</button>
          : <button onClick={() => setIsReviewing(true)} className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300">Review</button>}
        </div>
      </div>
    </div>
  );
}