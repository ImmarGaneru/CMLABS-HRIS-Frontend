'use client';
import React from 'react';
import Button from './Button';
import {
  FaSearch,
  FaPlusCircle,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaHistory
} from 'react-icons/fa';
import { MdTune } from "react-icons/md";

type FilterOption = {label: string; value: string};
type DataTableHeaderProps = {
  title: string;

  // Feature Toggles
  hasSearch?: boolean;
  hasFilter?: boolean;
  hasDateFilter?: boolean;
  hasExport?: boolean;
  hasImport?: boolean;
  hasAdd?: boolean;
  hasSecondFilter?: boolean;
  hasHistoryToggle?: boolean;

  // Handlers (only needed if feature is enabled)
  onSearch?: (value: string) => void;
  onFilterChange?: (value: string) => void;
  onSecondFilterChange?: (value: string) => void;
  onDateFilterChange?: (value: string) => void;
  onExport?: () => void;
  onImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: () => void;
  onHistoryToggle?: () => void;
  
  // State values
  searchValue?: string;
  filterValue?: string;
  secondFilterValue?: string;
  dateFilterValue?: string;
  showHistory?: boolean;

  // Custom filter options
  filterOptions?: FilterOption[];
  secondFilterOptions?: FilterOption[];

  // File input ref
  importInputRef?: React.RefObject<HTMLInputElement | null>;
  emptyContent?: React.ReactNode;

};

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  title,
  hasSearch = true,
  hasFilter = true,
  hasSecondFilter = false,
  hasDateFilter = false,
  hasExport = true,
  hasImport = true,
  hasAdd = true,
  hasHistoryToggle = false,
  onSearch,
  onFilterChange,
  onSecondFilterChange,
  onDateFilterChange,
  onExport,
  onImport,
  onAdd,
  onHistoryToggle,
  searchValue = '',
  filterValue = '',
  secondFilterValue = '',
  dateFilterValue = '',
  showHistory = false,
  filterOptions,
  secondFilterOptions,
  importInputRef,

}) => {
  return (
    <div className="flex flex-row gap-4 w-full">
      {/* Title */}
      <h3 className="text-xl font-bold text-[#1E3A5F]">{title}</h3>

      {/* Search Input */}
      {hasSearch && onSearch && (
        <div className="relative flex-1">
          <FaSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-8 pr-2 py-2 border border-[#1E3A5F] rounded-md text-sm"
          />
        </div>
      )}

      {/* Action Buttons Container */}
      <div className="flex items-center gap-2">
        {/* History Toggle Button */}
        {hasHistoryToggle && onHistoryToggle && (
          <Button variant="tableFeatureButton">
            <FaHistory size={16} />
            <span className="font-medium">{showHistory ? 'Current' : 'History'}</span>
            <input
              type="checkbox"
              checked={showHistory}
              onChange={onHistoryToggle}
              className="hidden"
            />
          </Button>
        )}

        {/* Date Filter */}
        {hasDateFilter && onDateFilterChange && (
          <Button variant="tableFeatureButton">
            <input
              type="date"
              value={dateFilterValue}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="border-none bg-transparent text-[#1E3A5F] outline-none text-sm cursor-pointer"
            />
          </Button>
        )}

        {/* Filter Buttons */}
        {hasFilter && onFilterChange && (
          <Button variant="tableFeatureButton">
            <MdTune size={16} />
            {filterOptions ? (
              <select
                value={filterValue}
                onChange={(e) => onFilterChange?.(e.target.value)}
                className="border-none bg-transparent text-[#1E3A5F] outline-none text-sm cursor-pointer"
              >
                <option value="">Filter</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
                className="border-none bg-transparent text-[#1E3A5F] outline-none text-sm cursor-pointer"
              >
                <option value="">Filter</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            )}
          </Button>
        )}

        {/* Second Filter Button */}
        {hasSecondFilter && onSecondFilterChange && (
          <Button variant="tableFeatureButton">
            <MdTune size={16} />
            {secondFilterOptions ? (
              <select
                value={secondFilterValue}
                onChange={(e) => onSecondFilterChange?.(e.target.value)}
                className="border-none bg-transparent text-[#1E3A5F] outline-none text-sm cursor-pointer"
              >
                <option value="">Status</option>
                {secondFilterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={secondFilterValue}
                onChange={(e) => onSecondFilterChange(e.target.value)}
                className="border-none bg-transparent text-[#1E3A5F] outline-none text-sm cursor-pointer"
              >
                <option value="">Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            )}
          </Button>
        )}

        {/* Export Button */}
        {hasExport && onExport && (
          <Button onClick={onExport} variant="tableFeatureButton">
            <FaCloudUploadAlt size={16} />
            Export
          </Button>
        )}

        {/* Import Button */}
     {hasImport && onImport && (
  <>
    <Button
      variant="tableFeatureButton"
      onClick={() => importInputRef?.current?.click()} // INI YANG PENTING
    >
      <FaCloudDownloadAlt size={16} />
      Import
    </Button>
    <input
      type="file"
      accept=".xlsx,.xls,.csv"
      onChange={onImport}
      className="hidden"
      ref={importInputRef}
    />
  </>
)}

        {/* Add Button */}
        {hasAdd && onAdd && (
          <Button onClick={onAdd} variant="redirectButton">
            <FaPlusCircle className="text-lg" />
            <span className="font-medium">Tambah Data</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataTableHeader;