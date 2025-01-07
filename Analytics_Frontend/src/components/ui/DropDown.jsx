import { Select } from "@instructure/ui";
import React, { useState } from "react";
// props => { options, label, placeholder, value, onChange }
// console.log(props)
// console.log(props.options)
// const {options, label, ...data} = props //Des
// data = { placeholder , value, onChange }
const DropDown = ({ options, label, placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || options[0].label);

  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [highlightedOptionId, setHighlightedOptionId] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(options[0].id);

  const getOptionById = (queryId) => {
    return options.find(({ id }) => id === queryId);
  };

  const handleShowOptions = (event) => {
    setIsShowingOptions(true);
  };

  const handleHideOptions = (event) => {
    const option = getOptionById(selectedOptionId).label;
    setIsShowingOptions(false);
    setHighlightedOptionId(null);
    setSelectedOptionId(selectedOptionId ? option : "");
  };

  const handleBlur = (event) => {
    setHighlightedOptionId(null);
  };

  const handleHighlightOption = (event, { id }) => {
    event.persist();
    const option = getOptionById(id).label;
    setHighlightedOptionId(id);
    setInputValue(event.type === "keydown" ? option : inputValue);
  };

  const handleSelectOption = (event, { id }) => {
    const option = getOptionById(id).label;
    setSelectedOptionId(id);
    setInputValue(option);
    setIsShowingOptions(false);
    onChange(option);
  };

  return (
    <div>
      <Select
        renderLabel={label}
        assistiveText={placeholder}
        inputValue={inputValue}
        isShowingOptions={isShowingOptions}
        onBlur={handleBlur}
        onRequestShowOptions={handleShowOptions}
        onRequestHideOptions={handleHideOptions}
        onRequestHighlightOption={handleHighlightOption}
        onRequestSelectOption={handleSelectOption}
      >
        {options.map((option) => {
          return (
            <Select.Option
              id={option.id}
              key={option.id}
              isHighlighted={option.id === highlightedOptionId}
              isSelected={option.id === selectedOptionId}
            >
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

export default DropDown;
