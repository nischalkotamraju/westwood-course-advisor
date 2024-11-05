import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const [checkpoint, setCheckpoint] = useState(0);

  const handleNext = () => {
    setCheckpoint((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCheckpoint((prev) => Math.max(prev - 1, 0));
  };

  const checkpoints = [
    {
      title: "Hey there, future Westwood student!",
      content: "Congratulations, you're about to be a high schooler! Before you transition, it is vital to understand what your passion is and how you will move forward with your career. We're going to do something called a <b>four year plan</b>.",
    },
    {
      title: "What is a four year plan?",
      content: "As you progress through high school, you'll need to know which courses seem to be a good fit for you. Additionally, a four year plan can map out what you will do for your freshman, sophomore, junior, and senior year. Take a look at the example below! Don't worry, if you are using a phone, you can scroll through the table.",
    },
    {
      title: "Why is a four year plan important?",
      content: "A four year plan helps you stay organized and focused on your academic and career goals. It ensures you meet graduation requirements and take courses that align with your interests and future aspirations.",
    }
  ];

  const fourYearPlanData = [
    ["TAG Adv English I", "TAG Adv English II", "TAG AP English Literature", "TAG AP English Language"],
    ["TAG Adv Algebra II", "TAG AP Precalculus", "TAG AP Calculus AB", "TAG AP Calculus BC"],
    ["TAG Adv Biology", "TAG Adv Chemistry", "TAG AP Physics 1", "TAG AP Physics C"],
    ["TAG AP Human Geography", "TAG AP World History", "TAG AP U.S. History", "TAG AP Government/Macroeconomics"],
    ["Debate I", "Debate II", "Debate III", "Independent Study Speech"],
    ["AP Computer Science Principles", "AP Computer Science A", "Computer Science III", "Mobile App Development"],
    ["Tennis I", "Tennis II", "Tennis III", "Tennis IV"],
    ["Principles of Business Marketing and Finance", "Business Information Management", "Business Management and Administration", "Business Law"]
  ];

  const FourYearPlanTable = () => (
    <div className="max-h-[70vh] overflow-y-auto">
      <table className="w-full border-collapse bg-neutral-800 shadow-lg rounded-2xl overflow-hidden">
        <thead className="bg-neutral-800 gradient-text text-lg text-white">
          <tr>
            <th className="p-3 text-left">Freshman</th>
            <th className="p-3 text-left">Sophomore</th>
            <th className="p-3 text-left">Junior</th>
            <th className="p-3 text-left">Senior</th>
          </tr>
        </thead>
        <tbody>
          {fourYearPlanData.map((row, index) => (
            <tr key={index} className="bg-neutral-800 text-white">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-3 border-t border-white">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div
        id="welcome"
        className="mx-4 flex flex-col justify-between items-center w-full"
      >
        <div className="w-full md:w-1/2 mb-8">
          <div
            key={checkpoint}
            id={`checkpoint-${checkpoint}`}
            className="transition-opacity duration-500 ease-in-out"
          >
            <h1 className="gradient-text font-bold text-4xl mb-4">
              {checkpoints[checkpoint].title}
            </h1>
            <p
              className="text-white min-w-60 w-full mb-5"
              dangerouslySetInnerHTML={{ __html: checkpoints[checkpoint].content }}
            />
          </div>
          <div className="flex space-x-4">
            {checkpoint > 0 && (
              <button
                onClick={handleBack}
                className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Back
              </button>
            )}
            {checkpoint < checkpoints.length - 1 ? (
              <button
                onClick={handleNext}
                className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            ) : (
              <Link to="/build">
                <button
                  onClick={handleNext}
                  className="text-white bg-orange-700 px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  Build
                </button>
              </Link>
            )}
          </div>
        </div>
        {checkpoint === 1 && (
          <div className="w-full md:w-3/4 lg:w-1/2">
            <FourYearPlanTable />
          </div>
        )}
      </div>
    </div>
  );
}