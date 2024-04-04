import Tree, { TreeNode } from "rc-tree";
import "rc-tree/assets/index.css";
import Styles from "styles/Tree.module.scss";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import TreeNodeItem from "./TreeNodeItem";
import StatusIcon from "./StatusIcon";
import { toast } from "react-toastify";
import useTree from "hooks/useTree";
import { getAllVehs } from "helpers/helpers";

const MenuTree = ({
  setSelectedVehicles,
  setclusterToggle,
  setLoading,
  selectedVehicles,
  allTreeData,
  vehicleIcon,
  ToggleConfig,
}) => {
  const { myMap } = useSelector((state) => state.mainMap);
  const darkMode = useSelector((state) => state.config.darkMode);
  const { notConnectedVehicles } = useSelector((state) => state.streamData);
  const { t } = useTranslation();
  const { newTree, defaultExpandedKeys } = useTree(allTreeData);
  const paginateVehicles = async (vehicles) => {
    if (vehicles.length < 2000) {
      setTimeout(
        () => myMap.pinGroup(vehicles, { doRezoom: vehicles.length < 1000 }),
        0
      );
      return;
    }
    setLoading(true);
    // force enable cluster for better performance
    myMap.setCluster(true);
    const limit = 1000;
    const totalPages = Math.ceil(vehicles.length / limit);
    let processedPages = 0;
    for (let i = 0; i < vehicles.length; i += limit) {
      await new Promise((resolve) => {
        setTimeout(async () => {
          const page = vehicles.slice(i, i + limit);
          await myMap.pinGroup(page, { doRezoom: false });
          processedPages++;
          if (processedPages === totalPages) {
            setLoading(false);
          }
          resolve();
        }, 20);
      });
    }
    toast.dismiss();
  };
  const onCheck = (selectedKeys, info) => {
    if (!selectedKeys.length) {
      myMap.deselectAll();
      setSelectedVehicles([]);
      return;
    }
    setclusterToggle(true);
    const tempArr = info.checkedNodes
      .filter((node) => node.data.VehicleID)
      .map((node) => node.data);
    const selectedSerialNumbers = new Set(
      selectedVehicles.map((x) => x?.SerialNumber)
    );
    const filteredTempArr = tempArr.filter(
      (v) => !selectedSerialNumbers.has(v?.SerialNumber)
    );
    if (info.checked && myMap && filteredTempArr.length > 0) {
      const notConnectedVehiclesDisplayNames = filteredTempArr
        .filter((v) => notConnectedVehicles.includes(v.SerialNumber))
        .map((v) => v.DisplayName || v.SerialNumber)
        .toString();
      if (notConnectedVehiclesDisplayNames) {
        toast.info(
          `Not Connected Vehicles: (${notConnectedVehiclesDisplayNames})`
        );
      }
      if (filteredTempArr.length > 2000) {
        handleMultipleVehicles(filteredTempArr);
      } else if (filteredTempArr.length === 1) {
        const vehicle = filteredTempArr[0];
        if (!notConnectedVehiclesDisplayNames) {
          myMap.pin(vehicle);
        }
      } else {
        handleMultipleVehicles(filteredTempArr);
      }
    }
    setSelectedVehicles(
      allTreeData.filter((v) => selectedKeys.includes(`${v.SerialNumber}`))
    );
  };
  const handleMultipleVehicles = (tempArr) => {
    setclusterToggle(true);
    const vehiclesToMap = tempArr.filter(
      (v) => !notConnectedVehicles.includes(v.SerialNumber)
    );

    paginateVehicles(vehiclesToMap);
  };
  const loop = (data) =>
    data?.map((item) => {
      if (item?.children) {
        return (
          <TreeNode
            key={`${item.title === "All" ? "All" : item?.ID}`}
            icon={<i className={Styles.cars__icon} />}
            data={item}
            title={
              <span
                className="d-flex align-items-center"
                style={{ marginTop: "7px", fontSize: "12px" }}
              >
                {item?.title}
                <span className="badge bg-secondary px-1 mx-2">
                  {item?.title === t("All")
                    ? allTreeData?.length
                    : getAllVehs(item?.children).length}
                </span>
              </span>
            }
          >
            {loop(item?.children)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          key={item?.SerialNumber}
          data={item}
          className={`${Styles.treeItem} border-bottom`}
          icon={<StatusIcon item={item} vehicleIcon={vehicleIcon} />}
          isLeaf={true}
          title={<TreeNodeItem item={item} ToggleConfig={ToggleConfig} />}
        />
      );
    });

  return (
    <>
      {newTree?.length > 0 && (
        <div className="position-relative">
          <div
            style={{ minHeight: "100vh", maxWidth: "auto", overflowY: "auto" }}
            id="menu-scrollbar"
          >
            <div
              className={`tree_root ${darkMode && Styles.dark}`}
              style={{
                height: "calc(80vh - 240px)",
                overflow: "hidden  scroll",
              }}
            >
              <Tree
                checkable
                selectable={false}
                showLine={true}
                defaultExpandAll={false}
                autoExpandParent={false}
                defaultExpandedKeys={defaultExpandedKeys}
                checkedKeys={selectedVehicles.map((v) => `${v.SerialNumber}`)}
                onCheck={onCheck}
              >
                {loop(newTree)}
              </Tree>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuTree;
