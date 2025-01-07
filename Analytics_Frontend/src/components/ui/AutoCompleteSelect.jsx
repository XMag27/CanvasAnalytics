import React, { useState } from "react";
import {
  IconArrowOpenDownLine,
  IconSearchLine,
  IconUserSolid,
  Select,
} from "@instructure/ui";

export default function AutoCompleteSelect({
  options,
  label,
  placeholder,
  value,
  onChange,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [highlightedOptionId, setHighlightedOptionId] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const getOptionById = (queryId) => {
    return options.find(({ id }) => id === queryId);
  };

  const filterOptions = (value) => {
    return options.filter((option) =>
      option.label.toLowerCase().startsWith(value.toLowerCase())
    );
  };

  const matchValue = () => {
    if (filteredOptions.length === 1) {
      const onlyOption = filteredOptions[0];
      if (onlyOption.label.toLowerCase() === inputValue.toLowerCase()) {
        setInputValue(onlyOption.label);
        setSelectedOptionId(onlyOption.id);
        setFilteredOptions(filterOptions(""));
      }
    } else if (inputValue.length === 0) {
      setSelectedOptionId(null);
    } else if (selectedOptionId) {
      const selectedOption = getOptionById(selectedOptionId);
      setInputValue(selectedOption.label);
    } else if (highlightedOptionId) {
      if (inputValue === getOptionById(highlightedOptionId).label) {
        setInputValue("");
        setFilteredOptions(filterOptions(""));
      }
    }
  };

  const handleShowOptions = (event) => {
    setIsShowingOptions(true);
  };

  const handleHideOptions = (event) => {
    setIsShowingOptions(false);
    setHighlightedOptionId(false);
    matchValue();
  };

  const handleBlur = (event) => {
    setHighlightedOptionId(null);
  };

  const handleHighlightOption = (event, { id }) => {
    event.persist();
    const option = getOptionById(id);
    if (!option) return;
    setHighlightedOptionId(id);
    setInputValue(event.type === "keydown" ? option.label : inputValue);
  };

  const handleSelectOption = (event, { id }) => {
    const option = getOptionById(id);
    if (!option) return;
    setSelectedOptionId(id);
    setInputValue(option.label);
    setIsShowingOptions(false);
    setFilteredOptions(options);
    onChange(option.label);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    const newOptions = filterOptions(value);
    setInputValue(value);
    setFilteredOptions(newOptions);
    setHighlightedOptionId(newOptions.length > 0 ? newOptions[0].id : null);
    setIsShowingOptions(true);
    setSelectedOptionId(value === "" ? null : selectedOptionId);
  };

  return (
    <div>
      <Select
        renderLabel={label}
        assistiveText="Tipea algunas letras"
        placeholder={placeholder}
        inputValue={inputValue}
        isShowingOptions={isShowingOptions}
        onBlur={handleBlur}
        onInputChange={handleInputChange}
        onRequestShowOptions={handleShowOptions}
        onRequestHideOptions={handleHideOptions}
        onRequestHighlightOption={handleHighlightOption}
        onRequestSelectOption={handleSelectOption}
        renderBeforeInput={<IconSearchLine inline={false} />}
        renderAfterInput={<IconArrowOpenDownLine inline={false} />}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            return (
              <Select.Option
                id={option.id}
                key={option.id}
                isHighlighted={option.id === highlightedOptionId}
                isSelected={option.id === selectedOptionId}
                isDisabled={option.disabled}
                renderBeforeLabel={
                  !option.disabled ? IconUserSolid : IconUserLine
                }
              >
                {!option.disabled
                  ? option.label
                  : `${option.label} (unavailable)`}
              </Select.Option>
            );
          })
        ) : (
          <Select.Option id="empty-option" key="empty-option">
            ---
          </Select.Option>
        )}
      </Select>
    </div>
  );
}
