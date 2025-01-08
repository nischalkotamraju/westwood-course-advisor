import { useState } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

function SearchBar({ onSearch, onFilter, filterOptions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-11/12 sm:w-4/6 mt-10 mb-6 flex items-center">
      <div className="relative flex-grow mr-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        <input type="search" className="block w-full p-4 ps-10 text-sm text-gray-50 shadow-2xl rounded-lg bg-neutral-800 [&::-webkit-search-cancel-button]:hidden"
          placeholder="Search for courses here" value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); onSearch(e.target.value); }} />
      </div>      
      <div className="relative dropdown-container w-48">
        <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-3 bg-neutral-800 text-white rounded-lg cursor-pointer hover:bg-neutral-700 transition-all duration-300 flex justify-between items-center">
          <span className="text-sm">{filterOption === "all" ? "All" : filterOption}</span>
          <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </div>
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-neutral-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="max-h-80 overflow-auto">
              <div className="p-2 hover:bg-neutral-700 cursor-pointer text-white text-sm"
                onClick={() => { onFilter("all"); setFilterOption("all"); setIsDropdownOpen(false); }}>
                All
              </div>
              {filterOptions.map(option => (
                <div key={option} className="p-2 hover:bg-neutral-700 cursor-pointer text-white text-sm"
                  onClick={() => { onFilter(option); setFilterOption(option); setIsDropdownOpen(false); }}>
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;