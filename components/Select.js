import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { allCustodies } from "../lib/slices/custodies";
function ReactSelect({
  className,
  onSelectChange,
  options,
  isSearchable,
  placeholder,
  defaultValue,
  ariaLabel,
  label,
  error,
  errorMsg,
  isMulti,
  isDisabled,
  formatOptionLabel,
  menuPlacement,
  cuStyles,
  isCity,
  clear,
  setClearAll,
}) {
  const dispatsh = useDispatch();
  const [selectedInput, setSelectedInput] = useState(defaultValue);
  const { darkMode } = useSelector((state) => state.config);
  useEffect(() => {
    onSelectChange(isMulti ? selectedInput : selectedInput?.value);

    if (clear) {
      setSelectedInput(null);
      setClearAll(false);
    }

    // if (isCity) {
    //   dispatsh(allCustodies(selectedInput?.value));
    // }
  }, [selectedInput?.value, selectedInput, isMulti, clear]);

  const light = (isSelected, isFocused) => {
    return isSelected ? "#14141" : isFocused ? "#149f9b" : undefined;
  };
  const dark = (isSelected, isFocused) => {
    return isSelected ? "red" : isFocused ? "#149f9b" : "#151824";
  };

  // style
  const colorStyles = {
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        ...cuStyles,
        backgroundColor: "#3668E9",
        padding: "6px 12px",
        borderColor: "#E4EAF1",
        boxShadow: "none",

        "&:hover": {
          ...styles["&:hover"],
          borderColor: "#3668E9",
        },
        ...(isDisabled
          ? {
              pointerEvents: "auto",
              cursor: "not-allowed",
            }
          : {
              pointerEvents: "auto",
              cursor: "pointer",
            }),
      };
    },
    option: (styles, { isDisabled, isSelected, isFocused }) => {
      return {
        ...styles,
        cursor: isDisabled ? "not-allowed" : "pointer",
        backgroundColor: isSelected ? "#D1DFEF" : "#fff",
        ":hover": {
          backgroundColor: "#D1DFEF",
        },
        color: "#131313",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#3668E9"
              : "#3668E9"
            : undefined,
        },
      };
    },
    placeholder: (styles) => {
      return { ...styles, color: darkMode ? "#1C211F" : "#fff" };
    },
    singleValue: (styles) => {
      return { ...styles, color: darkMode ? "#1C211F" : "#fff" };
    },
    menu: (styles) => {
      return { ...styles, backgroundColor: darkMode ? "#1C211F" : "#fff" };
    },
    input: (styles) => {
      return { ...styles, color: darkMode ? "#1C211F" : "#fff" };
    },
  };

  return (
    <Form.Group
      className={`${className}`}
      style={{
        width: "200px",
      }}
      controlId={label}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <Select
        aria-labelledby={ariaLabel}
        defaultValue={selectedInput}
        onChange={setSelectedInput}
        placeholder={placeholder}
        inputId="select-client"
        isSearchable={isSearchable}
        options={options}
        isMulti={isMulti}
        isDisabled={isDisabled}
        styles={colorStyles}
        formatOptionLabel={formatOptionLabel}
        menuPlacement={menuPlacement || "bottom"}
        isClearable={true}
        value={selectedInput}
      />
      {error && (
        <span style={{ fontSize: "12px" }} className="text-danger mt-2">
          {errorMsg}
        </span>
      )}
    </Form.Group>
  );
}

export default ReactSelect;
