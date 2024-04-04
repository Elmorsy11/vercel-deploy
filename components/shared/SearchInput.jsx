import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FixedSizeList as List } from 'react-window';

/*___________ Components _____________*/
import AsyncSelect from "react-select/async";
import TraineeLabel from "../../components/TraineeLabel";


const SearchInput = () => {
  const [traineeOptions, setTraineeOptions] = useState([]);
  const router = useRouter();
  const traineeData = useSelector(
    (state) => state.custodies?.allTrainees?.data?.users
  );
  const handelChange = (e) => {
    const id = e?.value;
    router.push({
      pathname: "/departments/trainee-details/[traineeId]",
      query: { traineeId: id },
    });
  };

  const filterTrainee = (inputValue) => {
    return traineeOptions.filter((i) =>
      i?.label?.props?.userName
        ?.toLowerCase()
        .includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterTrainee(inputValue));
    }, 1000);
  };

  useEffect(() => {
    if (traineeData) {
      const traineeOptions = traineeData?.map((item) => {
        return {
          value: item._id,
          label: (
            <TraineeLabel
              userName={item.vid + "-" + item.username}
              image={item.image?.url}
              custodyName={item.custodyName}
            />
          ),
        };
      });
      setTraineeOptions(traineeOptions);
    }
  }, [traineeData]);
  // style
  const colorStyles = {
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor: "#fff",
        borderRaduis: "10px",
        boxShadow: "0px 0px 30px rgba(57, 86, 103, 0.06)",

        "&:hover": {
          ...styles["&:hover"],
          // borderColor: "#3668E9",
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
  };
  // virtualization data at default options of asyncSelect
  const MenuList = (props) => {
    const { options, children, maxHeight } = props;
    return (
      <List
        height={maxHeight}
        itemCount={options.length}
        itemSize={100} // Adjust based on item height
      >
        {({ index, style }) => <div style={style} >
          {children[index]}
        </div>}
      </List>
    );
  };
  return (
    <div className="search" style={{ minWidth: "280px" }}>
      <AsyncSelect
        styles={colorStyles}
        placeholder="Search for trainee"
        loadOptions={loadOptions}
        isClearable
        onChange={handelChange}
        defaultOptions={traineeOptions}
        components={{ MenuList }}

      />
    </div>
  );
};

export default SearchInput;
