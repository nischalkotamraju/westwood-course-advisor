import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import axios from 'axios';
import { XMarkIcon, AcademicCapIcon, BookOpenIcon, ScaleIcon, BeakerIcon, UserGroupIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function Help () {
  const [userInput, setUserInput] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/19XGBFiAJC3L4CKwxeMaAs3itA7AFeQNoNQbeJAiXZ8U/values/Sheet1!A4:H500?key=AIzaSyCxATN22mSeipVReXFJDsTleeGGkx8nDTg`
        );

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

        let courses = [];
        response.data.values.forEach((row) => {
          for (let i = 0; i < row.length; i += 4) {
            if (row[i] && row[i + 1]) {
              const credits = row[i + 2] ? row[i + 2]
                .split(",")
                .map((key) => creditMeanings[key.trim()] || key.trim())
                .join(", ") : "Single Credit Course";

              courses.push({
                name: row[i + 1],
                number: row[i],
                credits: credits
              });
            }
          }

          if (row[7]) {
            courses.push({
              name: row[7],
              number: row[6],
              credits: row[8] ? row[8]
                .split(",")
                .map((key) => creditMeanings[key.trim()] || key.trim())
                .join(", ") : "Single Credit Course"
            });
          }
        });

        setCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const openai = new OpenAI({
    apiKey: 'sk-la8GDlMXteiPcwykGJT76wSzhAHmxeMJOg94K4Tgl9T3BlbkFJuzdz0x6rC3BFZlwH8EjnnVYQTdTvgn739E5q0bvrIA',
    dangerouslyAllowBrowser: true
  });

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a knowledgeable academic advisor who provides detailed guidance about courses to students. You have access to course information including course numbers, names, and credits. When asked about specific courses, reference the course data provided to give accurate information." },
          { role: "user", content: "Here is the course catalog data to reference when answering questions: " + JSON.stringify(courses, null, 2) },
          { role: "user", content: userInput }
        ],      });
      setChatbotResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setChatbotResponse('Sorry, there was an error processing your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const schoolTips = [
    {
      icon: <AcademicCapIcon className="h-6 w-6" />,
      title: "Advanced Placement (AP) Classes",
      content: "Consider taking AP classes if you're looking for college credit opportunities. AP courses offer college-level curriculum and exams that can potentially earn you college credits while still in high school. They demonstrate academic rigor to college admissions officers and can help you explore subjects in-depth. However, be mindful of your overall course load and ensure you can manage the increased workload without sacrificing your GPA or mental health."
    },
    {
      icon: <BookOpenIcon className="h-6 w-6" />,
      title: "International Baccalaureate (IB) Program",
      content: "IB programs offer a more holistic approach to education compared to AP. The IB curriculum emphasizes critical thinking, intercultural understanding, and exposure to a variety of subjects. It's recognized globally and can be particularly beneficial if you're considering studying abroad. The program culminates in the IB Diploma, which is highly regarded by universities worldwide. However, it requires a significant time commitment and may limit your ability to take other electives."
    },
    {
      icon: <ScaleIcon className="h-6 w-6" />,
      title: "Balancing Your Course Load",
      content: "Balance your course load between challenging classes and maintaining a good GPA. While it's important to push yourself academically, it's equally crucial to maintain strong grades. Colleges look at both the rigor of your curriculum and your GPA. Consider your strengths, interests, and time commitments when selecting courses. Aim for a mix of advanced courses in subjects you excel in, while choosing standard levels for others to ensure you can dedicate enough time to each class and maintain high performance across all subjects."
    },
    {
      icon: <BeakerIcon className="h-6 w-6" />,
      title: "Exploring Electives",
      content: "Explore electives that align with your interests and potential career paths. Electives provide an opportunity to discover new passions, develop diverse skills, and stand out in college applications. They can also help you explore potential majors or career fields before college. Consider taking classes in areas like computer science, art, music, foreign languages, or vocational subjects. These courses can provide a well-rounded education and may even lead to unexpected opportunities or interests that shape your future academic and career choices."
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Extracurricular Activities",
      content: "Don't forget to include extracurricular activities in your schedule. Colleges value well-rounded students who demonstrate leadership, commitment, and diverse interests outside the classroom. Participate in clubs, sports, volunteer work, or part-time jobs that genuinely interest you. Consistent involvement and leadership roles in a few activities are often more impressive than superficial participation in many. Balance your extracurriculars with your academic commitments to ensure you can excel in both areas without becoming overwhelmed."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-neutral-900 px-4">
      <div className="w-full max-w-4xl mt-10 mb-6">
        <h1 className="text-5xl font-bold text-center mb-12 gradient-text">School Tips & Course Selection</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-semibold mb-6 gradient-text">Helpful Tips</h2>
            <div className="grid gap-4">
              {schoolTips.map((tip, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedTip(tip)} 
                  className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-all duration-300 text-white flex items-center"
                >
                  <div className="mr-3">{tip.icon}</div>
                  <div>{tip.title}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-semibold mb-6 gradient-text">Course Selection Assistant</h2>
            <form onSubmit={handleSubmit} className="mb-6 relative">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Ask about course selection"
                className="w-full p-4 ps-5 text-sm text-gray-50 shadow-2xl rounded-lg bg-neutral-800 mb-4 pr-12 resize-y min-h-[40px]"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-700 hover:text-orange-600 transition-all duration-300" disabled={isLoading}>
                <PaperAirplaneIcon className="h-10 w-10 pb-4" />
              </button>
            </form>
            {isLoading ? (
              <div className="bg-neutral-800 p-6 rounded-lg">
                <p className="text-neutral-300">Loading...</p>
              </div>
            ) : chatbotResponse && (
              <div className="bg-neutral-800 p-6 rounded-lg">
                <h3 className="font-semibold mb-2 gradient-text">Assistant</h3>
                <p className="whitespace-pre-wrap text-neutral-300">{chatbotResponse}</p>
              </div>
            )}
          </div>
        </div>      </div>

      {selectedTip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-800 p-8 rounded-lg max-w-2xl w-full shadow-2xl transform transition-all duration-300 ease-in-out my-8 relative">
            <div className="flex items-center mb-6 text-white">
              {selectedTip.icon}
              <h3 className="text-3xl font-bold ml-3 gradient-text">{selectedTip.title}</h3>
            </div>
            <p className="text-neutral-300 text-lg leading-relaxed">{selectedTip.content}</p>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedTip(null)}
                className="text-white bg-orange-700 p-3 rounded-md hover:rotate-[15deg] hover:bg-orange-600 transition-all duration-300 group inline-flex items-center justify-center relative overflow-hidden"
              >
                <span className="relative z-10 transition-all duration-500 transform">
                  <XMarkIcon className="h-6 w-6" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};