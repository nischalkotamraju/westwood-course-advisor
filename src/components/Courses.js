import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  XMarkIcon
} from "@heroicons/react/24/outline";
import SearchBar from "./SearchBar";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);

  const departmentMap = {
    "English Language Arts": "English Language Arts",
    Mathematics: "Mathematics",
    Science: "Science",
    "Social Studies": "Social Studies",
    "Computer Science": "Computer Science",
    Engineering: "Engineering",
    "Health Science": "Health Science",
    LOTE: "LOTE",
    "Fine Arts": "Fine Arts",
    Art: "Art",
    Dance: "Dance",
    "Media & Communications": "Media & Communications",
    Debate: "Debate",
    Business: "Business",
    "Fashion Design": "Fashion Design",
    "Physical Education/Athletics": "Physical Education/Athletics",
    JROTC: "JROTC",
    "Other Electives": "Other Electives",
    Offblock: "Offblock",
  };
  const creditMeanings = {
    0.5: "Half Credit Course",
    2: "Two Credit Course",
    3: "Three Credit Course",
    A: "Fall Semester",
    B: "Spring Semester",
    9: "Open to 9th Grade",
    10: "Open to 10th Grade",
    11: "Open to 11th Grade",
    12: "Open to 12th Grade",
    L: "Local Credit",
    "#": "See Note Below",
    "@": "Teacher Approval Required",
    D: "ACC Dual Credit",
    DR: "UT OnRamps",
    AP: "Advanced Placement",
    IB: "International Baccalaureate",
    "1FA+1PE": "1 Fine Arts and 1 PE Credit",
    "1FA + .5PE": "1 Fine Arts and Half PE Credit",
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/19XGBFiAJC3L4CKwxeMaAs3itA7AFeQNoNQbeJAiXZ8U/values/Sheet1!A4:H500?key=AIzaSyCxATN22mSeipVReXFJDsTleeGGkx8nDTg`
        );

        const htmlResponse = await axios.get(
          "https://docs.google.com/spreadsheets/u/1/d/19XGBFiAJC3L4CKwxeMaAs3itA7AFeQNoNQbeJAiXZ8U/htmlview"
        );
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlResponse.data, "text/html");
        const courseLinks = {};

        doc.querySelectorAll("a").forEach((link) => {
          if (link.textContent) {
            courseLinks[link.textContent.trim()] = link.href;
          }
        });

        const englishKeywords = [
          "english",
          "elda",
          "literature",
          "reading",
          "writing",
          "composition",
          "journalism",
          "creative writing",
          "speech",
          "language arts",
          "theory of knowledge",
          "esol",
          "communication",
          "college prep english",
        ];
        const socialStudiesKeywords = [
          "history",
          "geography",
          "economics",
          "government",
          "politics",
          "social studies",
          "psychology",
          "sociology",
          "world cultures",
          "financial literacy",
          "ethnic studies",
          "civics",
          "anthropology",
          "human geography",
          "mexican american studies",
          "african american studies",
        ];
        const mathKeywords = [
          "math",
          "algebra",
          "geometry",
          "calculus",
          "statistics",
          "precalculus",
          "trigonometry",
          "quantitative",
          "mathematical",
          "aqr",
          "discrete",
          "number theory",
          "multi-variable",
          "college prep math",
        ];
        const scienceKeywords = [
          "science",
          "biology",
          "chemistry",
          "physics",
          "anatomy",
          "physiology",
          "environmental",
          "astronomy",
          "earth systems",
          "geology",
          "forensics",
          "biotechnology",
          "microbiology",
          "zoology",
          "botany",
          "aquatic",
          "integrated physics",
          "geoscience",
        ];
        const danceKeywords = [
          "dance",
          "ballet",
          "choreography",
          "modern dance",
          "jazz",
          "hip hop",
          "contemporary",
          "tap",
          "color guard",
          "warrior pride",
          "dance team",
          "dance wellness",
          "movement for athletes",
        ];
        const artKeywords = [
          "art",
          "drawing",
          "painting",
          "sculpture",
          "ceramics",
          "photography",
          "digital art",
          "design",
          "printmaking",
          "animation",
          "illustration",
          "portfolio",
          "studio art",
          "media communications",
          "visual arts",
        ];
        const jrotcKeywords = [
          "jrotc",
          "military",
          "junior reserve",
          "cadet",
          "aerospace",
          "naval",
          "army",
          "air force",
          "aviation honors",
          "ground school",
        ];
        const csKeywords = [
          "computer science",
          "programming",
          "coding",
          "java",
          "python",
          "data structures",
          "algorithms",
          "web development",
          "cybersecurity",
          "artificial intelligence",
          "machine learning",
          "database",
          "mobile app",
        ];
        const engineeringKeywords = [
          "engineering",
          "robotics",
          "mechanics",
          "electronics",
          "engineering design",
          "cad",
          "drafting",
          "architectural",
          "civil engineering",
          "mechanical engineering",
          "electrical engineering",
          "aerospace engineering",
          "digital electronics",
          "principles of engineering",
        ];
        const debateKeywords = [
          "debate",
          "speech",
          "forensics",
          "public speaking",
          "argumentation",
          "rhetoric",
          "independent study speech",
        ];
        const LOTE = [
          "french",
          "spanish",
          "chinese",
          "german",
          "japanese",
          "arabic",
          "sign lang",
          "hindi",
          "russian",
          "portuguese",
          "italian",
          "korean",
          "turkish",
          "persian",
          "hebrew",
          "swahili",
          "dutch",
          "greek",
          "latin",
          "vietnamese",
          "mandarin",
          "cantonese",
          "asl",
          "american sign language",
        ];
        const fineArtsKeywords = [
          "band",
          "orchestra",
          "choir",
          "music",
          "theater",
          "theatre",
          "drama",
          "musical",
          "performance",
          "stage",
          "acting",
          "instrumental",
          "vocal",
          "symphony",
          "jazz",
          "percussion",
          "woodwind",
          "brass",
          "strings",
          "piano",
          "camerata",
          "philharmonic",
          "treble",
          "tenor",
          "bass",
          "chorale",
          "marching band",
          "concert band",
          "wind ensemble",
          "music theory",
        ];
        const peKeywords = [
          "physical education",
          "athletics",
          "sports",
          "team sports",
          "functional fitness",
          "partners in pe",
          "off campus pe",
          "baseball",
          "softball",
          "basketball",
          "cheerleading",
          "football",
          "volleyball",
          "cross country",
          "track",
          "golf",
          "soccer",
          "swimming",
          "tennis",
          "water polo",
        ];
        const businessKeywords = [
          "business",
          "marketing",
          "finance",
          "accounting",
          "entrepreneurship",
          "management",
          "administration",
          "virtual business",
          "sports marketing",
          "social media marketing",
          "advertising",
          "career prep",
          "business law",
          "money matters",
        ];
        const healthScienceKeywords = [
          "health science",
          "biomedical",
          "medical",
          "anatomy",
          "physiology",
          "sports medicine",
          "nutrition",
          "wellness",
          "health",
          "medical terminology",
          "medical interventions",
          "human body systems",
        ];
        const fashionKeywords = [
          "fashion",
          "fashion design",
          "clothing",
          "textiles",
          "merchandising",
          "entrepreneurial fashion",
        ];
        const mediaKeywords = [
          "media",
          "journalism",
          "newspaper",
          "yearbook",
          "photojournalism",
          "broadcasting",
          "video production",
          "audio production",
          "digital media",
          "graphic design",
          "illustration",
          "animation",
          "av tech",
        ];

        const processCourseData = (
          row,
          nameIndex,
          numberIndex,
          creditsIndex
        ) => {
          if (!row[nameIndex]) return null;

          const courseName = row[nameIndex];
          const courseType = [];

          if (courseName.includes("AP")) courseType.push("AP");
          if (courseName.includes("IB")) courseType.push("IB");
          if (courseName.toLowerCase().includes("dual"))
            courseType.push("Dual Credit");

          let department = "";
          const lowerName = courseName.toLowerCase();

          if (englishKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "English Language Arts";
          }
          if (
            socialStudiesKeywords.some((keyword) => lowerName.includes(keyword))
          ) {
            department = "Social Studies";
          }
          if (mathKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Mathematics";
          }
          if (scienceKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Science";
          }
          if (danceKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Dance";
          }
          if (artKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Art";
          }
          if (jrotcKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "JROTC";
          }
          if (csKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Computer Science";
          }
          if (
            engineeringKeywords.some((keyword) => lowerName.includes(keyword))
          ) {
            department = "Engineering";
          }
          if (debateKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Debate";
          }
          if (LOTE.some((keyword) => lowerName.includes(keyword))) {
            department = "LOTE";
          }
          if (fineArtsKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Fine Arts";
          }
          if (peKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Physical Education/Athletics";
          }
          if (businessKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Business";
          }
          if (
            healthScienceKeywords.some((keyword) => lowerName.includes(keyword))
          ) {
            department = "Health Science";
          }
          if (fashionKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Fashion Design";
          }
          if (mediaKeywords.some((keyword) => lowerName.includes(keyword))) {
            department = "Media & Communications";
          }
          if (lowerName.includes("offblock")) {
            department = "Offblock";
          }
          if (!department) {
            department = "Other Electives";
          }

          return {
            name: courseName,
            department: department,
            number: row[numberIndex] || "Unknown",
            numberBadge: row[numberIndex] || "Unknown",
            information: courseLinks[courseName] || "Unknown",
            credits: row[creditsIndex]
              ? row[creditsIndex]
                  .split(",")
                  .map((key) => creditMeanings[key.trim()] || key.trim())
                  .join(", ")
              : "Single Credit Course",
            courseType: courseType,
            link: department,
          };
        };

        const excludeStrings = [
          "course name",
          "course",
          "half credit course",
          "two credit course",
          "three credit course",
          "austin community college dual credit course",
          "university of texas dual credit course",
          "see note below",
          "teacher approval or tryout required",
          "1 fine arts and1 pe credit",
          "fall semester",
          "spring semester",
          "open to 9th grade",
          "open to 10th grade",
          "open to 11th grade",
          "open to 12th grade",
          "1 Fine arts and½PE credit",
          "Waiting for new course #",
          "local credit",
        ];

        let courses = [];
        response.data.values.forEach((row) => {
          for (let i = 0; i < row.length; i += 4) {
            if (
              row[i] &&
              row[i + 1] &&
              !excludeStrings.some((str) =>
                row[i + 1].toLowerCase().includes(str.toLowerCase())
              )
            ) {
              const course = processCourseData(row, i + 1, i, i + 2);
              if (course) courses.push(course);
            }
          }

          if (
            row[7] &&
            !excludeStrings.some((str) =>
              row[7].toLowerCase().includes(str.toLowerCase())
            )
          ) {
            const course = processCourseData(row, 7, 6, 8);
            if (course) courses.push(course);
          }
        });

        console.log("Total courses found:", courses.length);
        setAllCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  });

  useEffect(() => {
    let filtered = allCourses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterOption !== "all") {
      if (["AP", "IB", "Pre-AP", "Dual Credit"].includes(filterOption)) {
        filtered = filtered.filter((course) =>
          course.courseType.includes(filterOption)
        );
      } else {
        filtered = filtered.filter(
          (course) => course.department === filterOption
        );
      }
    }
    setFilteredCourses(filtered);
  }, [searchTerm, filterOption, allCourses]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    toast("Scroll down to see all course information!", {
      position: "top-center",
      autoClose: 3000,
      theme: "dark",
      style: {
        background: "#262626",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
      },
      progressStyle: { background: "#FF8C00" },
    });
  };

  const badgeColors = {
    "English Language Arts":
      "bg-emerald-100 text-emerald-800 ring-emerald-800/20",
    Mathematics: "bg-violet-100 text-violet-800 ring-violet-800/20",
    Science: "bg-orange-100 text-orange-800 ring-orange-800/20",
    "Social Studies": "bg-pink-100 text-pink-800 ring-pink-800/20",
    LOTE: "bg-blue-100 text-blue-800 ring-blue-800/20",
    "Fine Arts": "bg-red-100 text-red-800 ring-red-700/20",
    "Physical Education/Athletics":
      "bg-cyan-100 text-cyan-800 ring-cyan-800/20",
    "Career and Technical Education":
      "bg-purple-100 text-purple-800 ring-purple-800/20",
    "Other Electives": "bg-yellow-100 text-yellow-900 ring-yellow-700/30",
    AP: "bg-indigo-100 text-indigo-800 ring-indigo-800/20",
    IB: "bg-green-100 text-green-800 ring-green-700/30",
    "Dual Credit": "bg-gray-100 text-gray-800 ring-gray-800/20",
    Offblock: "bg-pink-100 text-pink-800 ring-pink-800/20",
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-neutral-900 px-4">
      <SearchBar
        onSearch={setSearchTerm}
        onFilter={setFilterOption}
        filterOptions={Object.values(departmentMap).concat([
          "AP",
          "IB",
          "Dual Credit",
        ])}
      />
      <div className="w-full max-w-4xl rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course, i) => (
            <div
              key={i}
              className="bg-neutral-800 p-4 rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <h3 className="text-md font-semibold gradient-text">
                {course.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    badgeColors[course.department] ||
                    "bg-gray-100 text-gray-700 ring-gray-600/20"
                  }`}
                >
                  {course.department}
                </span>
                {course.courseType.map((type, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeColors[type]}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-800 p-8 rounded-lg max-w-4xl w-full shadow-2xl transform transition-all duration-300 ease-in-out my-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              {selectedCourse.name}
            </h2>
            <div className="space-y-4 text-neutral-300 max-h-[70vh] overflow-y-auto pr-4">
              <p>
                <span className="font-semibold">Number:</span>{" "}
                {selectedCourse.number || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Key:</span>{" "}
                {selectedCourse.credits || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {selectedCourse.department || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Course Type:</span>{" "}
                {selectedCourse.courseType.join(", ") || "Regular"}
              </p>
              <p>
                <br />
                <span className="font-bold">Information</span> <br />
                <br />
                {selectedCourse.information && (selectedCourse.information.includes('drive.google.com') || selectedCourse.information.includes('docs.google.com')) ? (
                  <iframe
                    src={selectedCourse.information}
                    title="Course Information"
                    className="w-full h-[600px] border-0 rounded"
                  ></iframe>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-white bg-orange-700 p-3 rounded-md hover:rotate-[15deg] hover:bg-orange-600 transition-all duration-300 group inline-flex items-center justify-center relative overflow-hidden"
              >
                <span className="relative z-10 transition-all duration-500 transform">
                  <XMarkIcon className="h-6 w-6" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      <ToastContainer />
    </div>
  );
};

export default Courses;
